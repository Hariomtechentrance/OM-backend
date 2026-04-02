import React, { useState } from 'react';
import { FaTimes, FaRuler } from 'react-icons/fa';
import './SizeChart.css';

const SizeChart = ({ isOpen, onClose, productCategory, productName }) => {
  const [activeTab, setActiveTab] = useState('measurements');

  // Size charts for different product categories
  const sizeCharts = {
    'Shirts': {
      measurements: {
        headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Shoulder (inches)', 'Sleeve (inches)'],
        sizes: [
          ['S', '38-40', '28', '16.5', '33.5'],
          ['M', '40-42', '29', '17.5', '34.5'],
          ['L', '42-44', '30', '18.5', '35.5'],
          ['XL', '44-46', '31', '19.5', '36.5'],
          ['XXL', '46-48', '32', '20.5', '37.5']
        ]
      },
      fit: {
        headers: ['Size', 'Fit Type', 'Body Type', 'Recommendation'],
        sizes: [
          ['S', 'Slim Fit', 'Slim/Athletic', 'For lean body types'],
          ['M', 'Regular Fit', 'Average', 'Most common fit'],
          ['L', 'Regular Fit', 'Average/Broad', 'Comfortable fit'],
          ['XL', 'Relaxed Fit', 'Broad/Large', 'Extra room'],
          ['XXL', 'Relaxed Fit', 'Large', 'Maximum comfort']
        ]
      },
      care: {
        headers: ['Aspect', 'Instructions'],
        instructions: [
          ['Washing', 'Machine wash cold, gentle cycle'],
          ['Bleaching', 'Do not bleach'],
          ['Drying', 'Tumble dry low, remove promptly'],
          ['Ironing', 'Medium heat if needed'],
          ['Dry Cleaning', 'Dry clean for best results']
        ]
      }
    },
    'T-Shirts': {
      measurements: {
        headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Shoulder (inches)', 'Sleeve (inches)'],
        sizes: [
          ['S', '36-38', '26', '16', '32'],
          ['M', '38-40', '27', '17', '33'],
          ['L', '40-42', '28', '18', '34'],
          ['XL', '42-44', '29', '19', '35'],
          ['XXL', '44-46', '30', '20', '36']
        ]
      },
      fit: {
        headers: ['Size', 'Fit Type', 'Body Type', 'Recommendation'],
        sizes: [
          ['S', 'Slim Fit', 'Slim/Athletic', 'Fitted look'],
          ['M', 'Regular Fit', 'Average', 'Standard fit'],
          ['L', 'Regular Fit', 'Average/Broad', 'Comfortable fit'],
          ['XL', 'Relaxed Fit', 'Broad/Large', 'Loose fit'],
          ['XXL', 'Relaxed Fit', 'Large', 'Extra roomy']
        ]
      },
      care: {
        headers: ['Aspect', 'Instructions'],
        instructions: [
          ['Washing', 'Machine wash cold'],
          ['Bleaching', 'Do not bleach'],
          ['Drying', 'Tumble dry low'],
          ['Ironing', 'Low heat'],
          ['Dry Cleaning', 'Optional']
        ]
      }
    },
    'Pants': {
      measurements: {
        headers: ['Waist Size', 'Length (inches)', 'Hip (inches)', 'Thigh (inches)', 'Inseam (inches)'],
        sizes: [
          ['30', '40', '38', '24', '32'],
          ['32', '41', '40', '25', '32'],
          ['34', '42', '42', '26', '32'],
          ['36', '43', '44', '27', '32'],
          ['38', '44', '46', '28', '32']
        ]
      },
      fit: {
        headers: ['Size', 'Fit Type', 'Body Type', 'Recommendation'],
        sizes: [
          ['30', 'Slim Fit', 'Slim waist', 'Modern slim look'],
          ['32', 'Regular Fit', 'Average', 'Standard fit'],
          ['34', 'Regular Fit', 'Average', 'Most popular'],
          ['36', 'Relaxed Fit', 'Broader build', 'Extra comfort'],
          ['38', 'Relaxed Fit', 'Large build', 'Maximum room']
        ]
      },
      care: {
        headers: ['Aspect', 'Instructions'],
        instructions: [
          ['Washing', 'Machine wash cold inside out'],
          ['Bleaching', 'Do not bleach'],
          ['Drying', 'Tumble dry low'],
          ['Ironing', 'Medium heat'],
          ['Dry Cleaning', 'Recommended']
        ]
      }
    },
    'Jeans': {
      measurements: {
        headers: ['Waist Size', 'Length (inches)', 'Hip (inches)', 'Thigh (inches)', 'Inseam (inches)'],
        sizes: [
          ['30', '40', '36', '23', '32'],
          ['32', '41', '38', '24', '32'],
          ['34', '42', '40', '25', '32'],
          ['36', '43', '42', '26', '32'],
          ['38', '44', '44', '27', '32']
        ]
      },
      fit: {
        headers: ['Size', 'Fit Type', 'Body Type', 'Recommendation'],
        sizes: [
          ['30', 'Slim Fit', 'Slim/Athletic', 'Modern skinny look'],
          ['32', 'Regular Fit', 'Average', 'Classic straight fit'],
          ['34', 'Regular Fit', 'Average', 'Traditional fit'],
          ['36', 'Relaxed Fit', 'Broader build', 'Comfort fit'],
          ['38', 'Relaxed Fit', 'Large build', 'Loose fit']
        ]
      },
      care: {
        headers: ['Aspect', 'Instructions'],
        instructions: [
          ['Washing', 'Machine wash cold inside out'],
          ['Bleaching', 'Do not bleach'],
          ['Drying', 'Air dry recommended'],
          ['Ironing', 'Low heat if needed'],
          ['Dry Cleaning', 'Optional']
        ]
      }
    },
    'Jackets': {
      measurements: {
        headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Shoulder (inches)', 'Sleeve (inches)'],
        sizes: [
          ['S', '38-40', '27', '17', '34'],
          ['M', '40-42', '28', '18', '35'],
          ['L', '42-44', '29', '19', '36'],
          ['XL', '44-46', '30', '20', '37'],
          ['XXL', '46-48', '31', '21', '38']
        ]
      },
      fit: {
        headers: ['Size', 'Fit Type', 'Body Type', 'Recommendation'],
        sizes: [
          ['S', 'Slim Fit', 'Slim/Athletic', 'Layer-friendly'],
          ['M', 'Regular Fit', 'Average', 'Standard layering'],
          ['L', 'Regular Fit', 'Average/Broad', 'Comfortable layers'],
          ['XL', 'Relaxed Fit', 'Broad/Large', 'Extra room for layers'],
          ['XXL', 'Relaxed Fit', 'Large', 'Maximum layer space']
        ]
      },
      care: {
        headers: ['Aspect', 'Instructions'],
        instructions: [
          ['Washing', 'Machine wash cold gentle'],
          ['Bleaching', 'Do not bleach'],
          ['Drying', 'Tumble dry low'],
          ['Ironing', 'Low heat'],
          ['Dry Cleaning', 'Recommended for best results']
        ]
      }
    }
  };

  // Default chart for unknown categories
  const defaultChart = {
    measurements: {
      headers: ['Size', 'Chest (inches)', 'Length (inches)', 'Waist (inches)'],
      sizes: [
        ['S', '36-38', '26-28', '28-30'],
        ['M', '38-40', '28-30', '30-32'],
        ['L', '40-42', '30-32', '32-34'],
        ['XL', '42-44', '32-34', '34-36'],
        ['XXL', '44-46', '34-36', '36-38']
      ]
    },
    fit: {
      headers: ['Size', 'Fit Type', 'Body Type', 'Recommendation'],
      sizes: [
        ['S', 'Slim Fit', 'Slim/Athletic', 'Fitted look'],
        ['M', 'Regular Fit', 'Average', 'Standard fit'],
        ['L', 'Regular Fit', 'Average/Broad', 'Comfortable fit'],
        ['XL', 'Relaxed Fit', 'Broad/Large', 'Loose fit'],
        ['XXL', 'Relaxed Fit', 'Large', 'Extra roomy']
      ]
    },
    care: {
      headers: ['Aspect', 'Instructions'],
      instructions: [
        ['Washing', 'Machine wash cold'],
        ['Bleaching', 'Do not bleach'],
        ['Drying', 'Tumble dry low'],
        ['Ironing', 'Low to medium heat'],
        ['Dry Cleaning', 'Recommended for delicate items']
      ]
    }
  };

  const currentChart = sizeCharts[productCategory] || defaultChart;

  const renderTable = (data, type) => {
    return (
      <div className="size-table-container">
        <table className="size-table">
          <thead>
            <tr>
              {data.headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.sizes.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <div className={`size-chart-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}></div>
      <div className={`size-chart-modal ${isOpen ? 'active' : ''}`}>
        <div className="size-chart-header">
          <h3>
            <FaRuler /> Size Chart - {productName}
          </h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="size-chart-tabs">
          <button 
            className={`tab-btn ${activeTab === 'measurements' ? 'active' : ''}`}
            onClick={() => setActiveTab('measurements')}
          >
            Measurements
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fit' ? 'active' : ''}`}
            onClick={() => setActiveTab('fit')}
          >
            Fit Guide
          </button>
          <button 
            className={`tab-btn ${activeTab === 'care' ? 'active' : ''}`}
            onClick={() => setActiveTab('care')}
          >
            Care Instructions
          </button>
        </div>

        <div className="size-chart-content">
          {activeTab === 'measurements' && renderTable(currentChart.measurements, 'measurements')}
          {activeTab === 'fit' && renderTable(currentChart.fit, 'fit')}
          {activeTab === 'care' && renderTable(currentChart.care, 'care')}
        </div>

        <div className="size-chart-footer">
          <div className="size-tips">
            <h4>💡 Sizing Tips:</h4>
            <ul>
              <li>Measure yourself with a flexible measuring tape</li>
              <li>Compare your measurements with our size chart</li>
              <li>If you're between sizes, size up for comfort</li>
              <li>Consider the fit type (Slim, Regular, Relaxed)</li>
              <li>Check care instructions for proper maintenance</li>
            </ul>
          </div>
          <div className="size-actions">
            <button className="how-to-measure-btn">
              <FaRuler /> How to Measure
            </button>
            <button className="find-my-size-btn">
              Find My Size
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SizeChart;
