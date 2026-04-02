import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = ({ sidebarOpen }) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState([]);

  const toggleSubmenu = (path) => {
    setExpandedItems(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
  };

  const menuItems = [
    {
      path: '/admin',
      icon: 'fas fa-th-large',
      label: 'Dashboard',
      exact: true
    },
    {
      path: '/admin/categories',
      icon: 'fas fa-layer-group',
      label: 'Categories'
    },
    {
      path: '/admin/products',
      icon: 'fas fa-cube',
      label: 'Products'
    },
    {
      path: '/admin/users',
      icon: 'fas fa-user-friends',
      label: 'Users'
    },
    {
      path: '/admin/orders',
      icon: 'fas fa-shopping-bag',
      label: 'Orders'
    },
    {
      path: '/admin/promotions',
      icon: 'fas fa-tags',
      label: 'Promotions'
    },
    {
      path: '/admin/analytics',
      icon: 'fas fa-chart-line',
      label: 'Analytics'
    },
    {
      path: '/admin/settings',
      icon: 'fas fa-cogs',
      label: 'Settings'
    }
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const isSubItemActive = (subItems) => {
    return subItems?.some(subItem => location.pathname === subItem.path);
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <i className="fas fa-gem"></i>
          <span className={sidebarOpen ? 'show' : 'hide'}>Black Locust</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-menu">
          {menuItems.map((item, index) => (
            <li key={index} className="nav-item">
              {item.subItems ? (
                // Menu with submenu
                <div>
                  <button 
                    className={`nav-link submenu-toggle ${isActive(item.path) || isSubItemActive(item.subItems) ? 'active' : ''}`}
                    onClick={() => toggleSubmenu(item.path)}
                  >
                    <i className={item.icon}></i>
                    <span className={sidebarOpen ? 'show' : 'hide'}>{item.label}</span>
                    <i className={`fas fa-chevron-${expandedItems.includes(item.path) ? 'down' : 'right'} submenu-arrow ${sidebarOpen ? 'show' : 'hide'}`}></i>
                  </button>
                  {expandedItems.includes(item.path) && (
                    <ul className="submenu">
                      {item.subItems.map((subItem, subIndex) => (
                        <li key={subIndex} className="nav-item">
                          <Link 
                            to={subItem.path} 
                            className={`nav-link ${location.pathname === subItem.path ? 'active' : ''}`}
                          >
                            <i className={subItem.icon}></i>
                            <span className={sidebarOpen ? 'show' : 'hide'}>{subItem.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                // Regular menu item
                <Link 
                  to={item.path} 
                  className={`nav-link ${isActive(item.path, item.exact) ? 'active' : ''}`}
                >
                  <i className={item.icon}></i>
                  <span className={sidebarOpen ? 'show' : 'hide'}>{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <Link to="/admin/help" className="nav-link">
          <i className="fas fa-question-circle"></i>
          <span className={sidebarOpen ? 'show' : 'hide'}>Help & Support</span>
        </Link>
        <Link to="/admin/logout" className="nav-link logout-link">
          <i className="fas fa-sign-out-alt"></i>
          <span className={sidebarOpen ? 'show' : 'hide'}>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default AdminSidebar;
