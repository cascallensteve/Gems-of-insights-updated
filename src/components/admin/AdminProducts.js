import React, { useState, useEffect } from 'react';
import { FaBox, FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaDownload, FaTags, FaDollarSign, FaImage } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import './AdminProducts.css';

const AdminProducts = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const categories = ['Extracts', 'Herbs and Spices', 'Supplements'];

  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    photo: '',
    category: 'Extracts'
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found. Please login as admin first.');
      }

      console.log('📦 Fetching products...');
      
      // Set token in correct Django REST Framework format
      api.defaults.headers.common['Authorization'] = `Token ${token}`;

      const response = await api.get('/store/all-items');
      const data = response.data;
      
      console.log('✅ Products API Response:', data);
      console.log('📊 Number of products received:', data.items?.length || 0);

      // Process products data
      const processedProducts = (data.items || []).map(item => ({
        ...item,
        price_formatted: `KSH ${item.price?.toLocaleString() || 0}`,
        owner_name: item.owner ? `${item.owner.first_name} ${item.owner.last_name}` : 'Unknown',
        category_color: getCategoryColor(item.category)
      }));

      setProducts(processedProducts);
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError(error.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Extracts': '#28a745',
      'Herbs and Spices': '#17a2b8',
      'Supplements': '#ffc107'
    };
    return colors[category] || '#6c757d';
  };

  const filteredProducts = products.filter(product => {
    const matchesFilter = filter === 'all' || product.category === filter;
    const matchesSearch = (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesFilter && matchesSearch;
  });

  const validateProductData = (data) => {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
      errors.push('Product name must be at least 2 characters');
    }
    if (!data.description || data.description.trim().length < 5) {
      errors.push('Description must be at least 5 characters');
    }
    if (!data.price || isNaN(parseFloat(data.price)) || parseFloat(data.price) <= 0) {
      errors.push('Price must be a valid positive number');
    }
    if (parseFloat(data.price) > 1000000) {
      errors.push('Price seems too high (max: 1,000,000)');
    }
    if (!categories.includes(data.category)) {
      errors.push('Invalid category selected');
    }
    
    return errors;
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Token ${token}`;

      // Clean and validate the form data
      const cleanedData = {
        name: productForm.name.trim(),
        description: productForm.description.trim(),
        price: parseFloat(productForm.price),
        photo: productForm.photo.trim(),
        category: productForm.category
      };

      console.log('🧹 Cleaned product data:', cleanedData);

      // Validate the data
      const validationErrors = validateProductData(cleanedData);
      if (validationErrors.length > 0) {
        alert('❌ Validation errors:\n' + validationErrors.join('\n'));
        return;
      }

      console.log('➕ Adding new product with exact data:');
      console.log('Raw form data:', productForm);
      console.log('Cleaned data being sent:', JSON.stringify(cleanedData, null, 2));
      
      const response = await api.post('/store/add-item', cleanedData);
      
      console.log('✅ Product added successfully:', response.data);
      alert('✅ Product added successfully!');
      
      // Reset form and close modal
      setProductForm({
        name: '',
        description: '',
        price: '',
        photo: '',
        category: 'Extracts'
      });
      setShowAddModal(false);
      
      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error('❌ Error adding product:', error);
      
      let errorMessage = 'Failed to add product';
      if (error.response?.data) {
        console.log('Server error details:', error.response.data);
        if (typeof error.response.data === 'string') {
          errorMessage = 'Server error: Please check your input data';
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          errorMessage = Object.values(error.response.data.errors).flat().join(', ');
        }
      }
      
      alert(`❌ Error adding product: ${errorMessage}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditProduct = async (productId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Token ${token}`;

      console.log('✏️ Editing product:', productId, updatedData);
      const response = await api.post(`/store/edit-item/${productId}/`, updatedData);
      
      console.log('✅ Product updated:', response.data);
      alert('✅ Product updated successfully!');
      
      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error('❌ Error updating product:', error);
      alert(`❌ Error updating product: ${error.message}`);
    }
  };

  const handleViewDetails = async (product) => {
    try {
      const token = localStorage.getItem('token');
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      
      console.log('👁️ Viewing product details for ID:', product.id);
      
      // Fetch detailed product data
      const response = await api.get(`/store/item-detail/${product.id}`);
      const detailedProduct = response.data.item;
      
      setSelectedProduct(detailedProduct);
      setShowModal(true);
    } catch (error) {
      console.error('Error viewing product details:', error);
      setSelectedProduct(product);
      setShowModal(true);
    }
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Price', 'Description', 'Owner'];
    const csvContent = [
      headers.join(','),
      ...filteredProducts.map(product => [
        product.id,
        `"${product.name}"`,
        product.category,
        product.price,
        `"${product.description}"`,
        `"${product.owner_name}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getCategoryBadge = (category) => {
    const badges = {
      'Extracts': { class: 'badge-success', text: 'Extracts' },
      'Herbs and Spices': { class: 'badge-info', text: 'Herbs & Spices' },
      'Supplements': { class: 'badge-warning', text: 'Supplements' }
    };
    const badge = badges[category] || { class: 'badge-secondary', text: category };
    return <span className={`status-badge ${badge.class}`}>{badge.text}</span>;
  };

  if (loading) {
    return (
      <div className="admin-products loading">
        <div className="loading-spinner">
          <div className="dots-loader">...</div>
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="admin-products error">
        <div className="error-message">
          <h3>❌ Error Loading Products</h3>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => fetchProducts()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-products">
      {/* Header Section */}
      <div className="products-header">
        <div className="products-header__left">
          <h2>Products Management</h2>
          <p>Manage store inventory and product catalog</p>
        </div>
        <div className="products-header__right">
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <FaPlus /> Add Product
          </button>
          <button className="btn btn-secondary" onClick={() => fetchProducts()}>
            🔄 Refresh
          </button>
          <button className="btn btn-secondary" onClick={exportToCSV}>
            <FaDownload /> Export CSV
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="products-stats">
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
          <div className="stat-card__icon total">
            <FaBox />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{products.filter(p => p.category === 'Extracts').length}</h3>
            <p>Extracts</p>
          </div>
          <div className="stat-card__icon extracts">
            <FaTags />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{products.filter(p => p.category === 'Herbs and Spices').length}</h3>
            <p>Herbs & Spices</p>
          </div>
          <div className="stat-card__icon herbs">
            <FaTags />
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__content">
            <h3>{products.filter(p => p.category === 'Supplements').length}</h3>
            <p>Supplements</p>
          </div>
          <div className="stat-card__icon supplements">
            <FaTags />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="products-controls">
        <div className="products-controls__left">
          <div className="filter-group">
            <FaFilter />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="products-controls__right">
          <input
            type="text"
            placeholder="Search by name, description, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Products Grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">
              {product.photo ? (
                <img src={`https://res.cloudinary.com/dklglujfn/${product.photo}`} alt={product.name} />
              ) : (
                <div className="no-image"><FaImage size={40} /></div>
              )}
              {getCategoryBadge(product.category)}
            </div>
            <div className="product-info">
              <h4>{product.name}</h4>
              <p className="product-description">{product.description}</p>
              <div className="product-price">{product.price_formatted}</div>
              <div className="product-owner">By: {product.owner_name}</div>
            </div>
            <div className="product-actions">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => handleViewDetails(product)}
                title="View Details"
              >
                <FaEye />
              </button>
              <button
                className="btn btn-sm btn-info"
                onClick={() => {
                  setProductForm({
                    name: product.name,
                    description: product.description,
                    price: product.price.toString(),
                    photo: product.photo,
                    category: product.category
                  });
                  setSelectedProduct(product);
                  setShowAddModal(true);
                }}
                title="Edit Product"
              >
                <FaEdit />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && !loading && (
        <div className="no-products">
          <FaBox size={48} />
          <h3>No products found</h3>
          <p>{error ? 'Unable to load products. Please check your connection and try again.' : 'No products match your current filters.'}</p>
          {error && (
            <button 
              className="btn btn-primary"
              onClick={() => fetchProducts()}
              style={{ marginTop: '15px' }}
            >
              Retry Loading
            </button>
          )}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={() => {
                setShowAddModal(false);
                setSelectedProduct(null);
                setProductForm({
                  name: '',
                  description: '',
                  price: '',
                  photo: '',
                  category: 'Extracts'
                });
              }}>×</button>
            </div>
            <form onSubmit={selectedProduct ? 
              (e) => {
                e.preventDefault();
                handleEditProduct(selectedProduct.id, {
                  ...productForm,
                  price: parseFloat(productForm.price)
                });
                setShowAddModal(false);
                setSelectedProduct(null);
              } : handleAddProduct
            }>
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Product Name * <span className="char-count">({productForm.name.length}/100)</span></label>
                    <input
                      type="text"
                      value={productForm.name}
                      onChange={(e) => setProductForm(prev => ({ ...prev, name: e.target.value.slice(0, 100) }))}
                      placeholder="Enter product name (2-100 characters)"
                      minLength="2"
                      maxLength="100"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm(prev => ({ ...prev, category: e.target.value }))}
                      required
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Price (KSH) * <span className="price-display">KSH {parseFloat(productForm.price || 0).toLocaleString()}</span></label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        if (value <= 1000000 || e.target.value === '') {
                          setProductForm(prev => ({ ...prev, price: e.target.value }));
                        }
                      }}
                      placeholder="Enter price"
                      min="0.01"
                      max="1000000"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Photo URL <span className="help-text">(Cloudinary path)</span></label>
                    <input
                      type="text"
                      value={productForm.photo}
                      onChange={(e) => setProductForm(prev => ({ ...prev, photo: e.target.value }))}
                      placeholder="image/upload/luxelife_uploads/your_image_id"
                    />
                    {productForm.photo && (
                      <div className="photo-preview">
                        <img 
                          src={`https://res.cloudinary.com/dklglujfn/${productForm.photo}`} 
                          alt="Preview" 
                          onError={(e) => e.target.style.display = 'none'}
                          style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px', borderRadius: '4px' }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label>Description * <span className="char-count">({productForm.description.length}/500)</span></label>
                    <textarea
                      value={productForm.description}
                      onChange={(e) => setProductForm(prev => ({ ...prev, description: e.target.value.slice(0, 500) }))}
                      placeholder="Enter detailed product description (5-500 characters)"
                      rows="4"
                      minLength="5"
                      maxLength="500"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setShowAddModal(false);
                  setSelectedProduct(null);
                  setProductForm({
                    name: '',
                    description: '',
                    price: '',
                    photo: '',
                    category: 'Extracts'
                  });
                }}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? '...' : (selectedProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {showModal && selectedProduct && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="product-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Product Details - {selectedProduct.name}</h3>
              <button onClick={() => setShowModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="product-details">
                <div className="detail-section">
                  <div className="product-image-large">
                    {selectedProduct.photo ? (
                      <img src={`https://res.cloudinary.com/dklglujfn/${selectedProduct.photo}`} alt={selectedProduct.name} />
                    ) : (
                      <div className="no-image-large"><FaImage size={60} /></div>
                    )}
                  </div>
                </div>
                
                <div className="detail-section">
                  <div className="detail-row">
                    <label>Product ID:</label>
                    <span>#{selectedProduct.id}</span>
                  </div>
                  <div className="detail-row">
                    <label>Name:</label>
                    <span><strong>{selectedProduct.name}</strong></span>
                  </div>
                  <div className="detail-row">
                    <label>Category:</label>
                    <span>{getCategoryBadge(selectedProduct.category)}</span>
                  </div>
                  <div className="detail-row">
                    <label>Price:</label>
                    <span className="price-large">KSH {selectedProduct.price?.toLocaleString()}</span>
                  </div>
                  <div className="detail-row">
                    <label>Owner:</label>
                    <span>{selectedProduct.owner_name}</span>
                  </div>
                  {selectedProduct.average_rating && (
                    <div className="detail-row">
                      <label>Rating:</label>
                      <span>⭐ {selectedProduct.average_rating}/5</span>
                    </div>
                  )}
                  <div className="detail-row full-width">
                    <label>Description:</label>
                    <div className="description-content">
                      {selectedProduct.description}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn btn-info"
                onClick={() => {
                  setProductForm({
                    name: selectedProduct.name,
                    description: selectedProduct.description,
                    price: selectedProduct.price.toString(),
                    photo: selectedProduct.photo,
                    category: selectedProduct.category
                  });
                  setShowModal(false);
                  setShowAddModal(true);
                }}
              >
                <FaEdit /> Edit Product
              </button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
