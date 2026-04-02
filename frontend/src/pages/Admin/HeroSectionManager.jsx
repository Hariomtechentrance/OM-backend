import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './HeroSectionManager.css';

const HeroSectionManager = () => {
  const [heroContent, setHeroContent] = useState({
    title: '',
    subtitle: '',
    images: [],
    buttons: [
      { text: '', link: '', style: 'primary' },
      { text: '', link: '', style: 'secondary' }
    ],
    backgroundColor: '#000000',
    textColor: '#ffffff'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      const response = await fetch('/api/content/hero');
      const data = await response.json();
      
      if (data.success) {
        setHeroContent(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch hero content:', error);
      toast.error('Failed to load hero content');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setHeroContent(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleButtonChange = (index, field, value) => {
    setHeroContent(prev => ({
      ...prev,
      buttons: prev.buttons.map((btn, i) => 
        i === index ? { ...btn, [field]: value } : btn
      )
    }));
  };

  const addImageButton = () => {
    setHeroContent(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImageButton = (index) => {
    setHeroContent(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file, index) => {
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append('image', file);

    try {
      setImageUploading(true);
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadFormData
      });

      const data = await response.json();
      
      if (data.success) {
        setHeroContent(prev => ({
          ...prev,
          images: prev.images.map((img, i) => 
            i === index ? data.url : img
          )
        }));
        toast.success('Image uploaded successfully');
      } else {
        toast.error(data.message || 'Image upload failed');
      }
    } catch (error) {
      toast.error('Image upload failed');
    } finally {
      setImageUploading(false);
    }
  };

  const addButton = () => {
    setHeroContent(prev => ({
      ...prev,
      buttons: [...prev.buttons, { text: '', link: '', style: 'primary' }]
    }));
  };

  const removeButton = (index) => {
    setHeroContent(prev => ({
      ...prev,
      buttons: prev.buttons.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    // Validation
    if (!heroContent.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!heroContent.subtitle.trim()) {
      toast.error('Subtitle is required');
      return;
    }

    try {
      setSaving(true);
      
      const response = await fetch('/api/content/hero', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(heroContent)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Hero section saved successfully');
      } else {
        toast.error(data.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save hero section');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    fetchHeroContent();
  };

  if (loading) {
    return <div className="loading">Loading hero content...</div>;
  }

  return (
    <div className="hero-section-manager">
      <div className="header">
        <h1>Hero Section Manager</h1>
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={handleReset}>
            🔄 Reset
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? '💾 Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>

      <div className="editor-container">
        <div className="editor-section">
          <h3>Content</h3>
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={heroContent.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter hero title"
            />
          </div>
          <div className="form-group">
            <label>Subtitle *</label>
            <textarea
              value={heroContent.subtitle}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              placeholder="Enter hero subtitle"
              rows={3}
            />
          </div>
        </div>

        <div className="editor-section">
          <h3>Hero Images</h3>
          <div className="images-container">
            {heroContent.images.map((image, index) => (
              <div key={index} className="image-upload-group">
                <div className="image-preview">
                  {image ? (
                    <img src={image} alt={`Hero ${index + 1}`} />
                  ) : (
                    <div className="upload-placeholder">
                      <span>📁</span>
                      <span>No image</span>
                    </div>
                  )}
                </div>
                <div className="image-controls">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0], index)}
                    style={{ display: 'none' }}
                    id={`hero-image-${index}`}
                  />
                  <label htmlFor={`hero-image-${index}`} className="upload-btn">
                    📁 Upload
                  </label>
                  <button 
                    className="remove-btn"
                    onClick={() => removeImageButton(index)}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ))}
            <button className="add-image-btn" onClick={addImageButton}>
              ➕ Add Image
            </button>
          </div>
        </div>

        <div className="editor-section">
          <h3>Call-to-Action Buttons</h3>
          <div className="buttons-container">
            {heroContent.buttons.map((button, index) => (
              <div key={index} className="button-group">
                <div className="button-controls">
                  <input
                    type="text"
                    value={button.text}
                    onChange={(e) => handleButtonChange(index, 'text', e.target.value)}
                    placeholder="Button text"
                  />
                  <input
                    type="text"
                    value={button.link}
                    onChange={(e) => handleButtonChange(index, 'link', e.target.value)}
                    placeholder="Button link (e.g., /products)"
                  />
                  <select
                    value={button.style}
                    onChange={(e) => handleButtonChange(index, 'style', e.target.value)}
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                  </select>
                  <button 
                    className="remove-btn"
                    onClick={() => removeButton(index)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
            <button className="add-button-btn" onClick={addButton}>
              ➕ Add Button
            </button>
          </div>
        </div>

        <div className="editor-section">
          <h3>Styling</h3>
          <div className="style-controls">
            <div className="form-group">
              <label>Background Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={heroContent.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                />
                <input
                  type="text"
                  value={heroContent.backgroundColor}
                  onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                  placeholder="#000000"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Text Color</label>
              <div className="color-input-group">
                <input
                  type="color"
                  value={heroContent.textColor}
                  onChange={(e) => handleInputChange('textColor', e.target.value)}
                />
                <input
                  type="text"
                  value={heroContent.textColor}
                  onChange={(e) => handleInputChange('textColor', e.target.value)}
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionManager;
