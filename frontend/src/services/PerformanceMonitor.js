// Performance Monitoring Service for Production
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      pageLoad: {},
      userInteractions: [],
      apiCalls: [],
      errors: []
    };
    this.isProduction = process.env.NODE_ENV === 'production';
    this.isEnabled = process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING === 'true';
  }

  // Initialize performance monitoring
  init() {
    if (!this.isProduction || !this.isEnabled) return;

    // Monitor page load performance
    this.measurePageLoad();
    
    // Monitor API calls
    this.interceptFetch();
    
    // Monitor user interactions
    this.monitorUserInteractions();
    
    // Monitor errors
    this.monitorErrors();
  }

  // Measure page load performance
  measurePageLoad() {
    if ('performance' in window && 'getEntriesByType' in performance) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          const navigation = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          
          this.metrics.pageLoad = {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
            firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
            totalLoadTime: navigation.loadEventEnd - navigation.fetchStart
          };

          this.sendMetrics('pageLoad', this.metrics.pageLoad);
        }, 0);
      });
    }
  }

  // Intercept fetch calls to monitor API performance
  interceptFetch() {
    const originalFetch = window.fetch;
    
    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0];
      
      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();
        
        this.metrics.apiCalls.push({
          url: typeof url === 'string' ? url : url.url,
          method: args[1]?.method || 'GET',
          duration: endTime - startTime,
          status: response.status,
          timestamp: new Date().toISOString()
        });
        
        this.sendMetrics('apiCall', {
          url: typeof url === 'string' ? url : url.url,
          duration: endTime - startTime,
          status: response.status
        });
        
        return response;
      } catch (error) {
        const endTime = performance.now();
        
        this.metrics.errors.push({
          type: 'api',
          url: typeof url === 'string' ? url : url.url,
          error: error.message,
          duration: endTime - startTime,
          timestamp: new Date().toISOString()
        });
        
        throw error;
      }
    };
  }

  // Monitor user interactions
  monitorUserInteractions() {
    const events = ['click', 'submit', 'change'];
    
    events.forEach(eventType => {
      document.addEventListener(eventType, (event) => {
        const target = event.target;
        const element = target.tagName.toLowerCase();
        const className = target.className;
        
        this.metrics.userInteractions.push({
          type: eventType,
          element,
          className,
          timestamp: new Date().toISOString()
        });
        
        // Send metrics for important interactions
        if (element === 'button' || element === 'a' || eventType === 'submit') {
          this.sendMetrics('userInteraction', {
            type: eventType,
            element,
            className
          });
        }
      });
    });
  }

  // Monitor errors
  monitorErrors() {
    window.addEventListener('error', (event) => {
      this.metrics.errors.push({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: new Date().toISOString()
      });
      
      this.sendMetrics('error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.metrics.errors.push({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        timestamp: new Date().toISOString()
      });
      
      this.sendMetrics('error', {
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection'
      });
    });
  }

  // Send metrics to monitoring service
  sendMetrics(type, data) {
    if (!this.isProduction) return;
    
    // Send to your monitoring service (e.g., Google Analytics, Sentry, custom endpoint)
    if (type === 'pageLoad' && window.gtag) {
      window.gtag('event', 'page_load_complete', {
        custom_parameter: {
          load_time: data.totalLoadTime,
          dom_content_loaded: data.domContentLoaded,
          first_contentful_paint: data.firstContentfulPaint
        }
      });
    }
    
    if (type === 'apiCall' && window.gtag) {
      window.gtag('event', 'api_call', {
        custom_parameter: {
          url: data.url,
          duration: data.duration,
          status: data.status
        }
      });
    }
    
    if (type === 'error' && window.gtag) {
      window.gtag('event', 'error', {
        custom_parameter: {
          error_message: data.message || data.error,
          error_type: data.type
        }
      });
    }
    
    // You can also send to a custom endpoint
    // this.sendToCustomEndpoint(type, data);
  }

  // Send metrics to custom endpoint
  async sendToCustomEndpoint(type, data) {
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      });
    } catch (error) {
      console.error('Failed to send metrics:', error);
    }
  }

  // Get current metrics
  getMetrics() {
    return this.metrics;
  }

  // Clear metrics
  clearMetrics() {
    this.metrics = {
      pageLoad: {},
      userInteractions: [],
      apiCalls: [],
      errors: []
    };
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor();

export default performanceMonitor;
