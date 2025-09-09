import React, { useState } from 'react';
import './AdminBlog.css';

const AdminBlog = ({ user, onNavigateBack }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "10 Natural Remedies for Better Sleep",
      excerpt: "Discover time-tested natural solutions to improve your sleep quality without medication.",
      category: "health",
      status: "published",
      date: "2024-01-20",
      author: "Dr. Sarah Mitchell"
    },
    {
      id: 2,
      title: "New Organic Superfood Supplements",
      excerpt: "Introducing our latest collection of certified organic superfood supplements.",
      category: "products",
      status: "draft",
      date: "2024-01-18",
      author: "Product Team"
    }
  ]);

  const [consultationPosters, setConsultationPosters] = useState([
    {
      id: 1,
      title: "Free Health Consultation Week",
      description: "Join our certified specialists for free consultations",
      startDate: "2024-02-01",
      endDate: "2024-02-07",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      active: true
    }
  ]);

  const [showPostModal, setShowPostModal] = useState(false);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editingPoster, setEditingPoster] = useState(null);

  const [postForm, setPostForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'health',
    tags: '',
    image: ''
  });

  const [posterForm, setPosterForm] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    image: '',
    active: true
  });

  const handlePostSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: editingPost ? editingPost.id : Date.now(),
      ...postForm,
      date: new Date().toISOString().split('T')[0],
      author: user.firstName + ' ' + user.lastName,
      status: 'published'
    };

    if (editingPost) {
      setPosts(posts.map(post => post.id === editingPost.id ? newPost : post));
    } else {
      setPosts([newPost, ...posts]);
    }

    resetPostForm();
  };

  const handlePosterSubmit = (e) => {
    e.preventDefault();
    const newPoster = {
      id: editingPoster ? editingPoster.id : Date.now(),
      ...posterForm
    };

    if (editingPoster) {
      setConsultationPosters(consultationPosters.map(poster => 
        poster.id === editingPoster.id ? newPoster : poster
      ));
    } else {
      setConsultationPosters([newPoster, ...consultationPosters]);
    }

    resetPosterForm();
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      excerpt: '',
      content: '',
      category: 'health',
      tags: '',
      image: ''
    });
    setShowPostModal(false);
    setEditingPost(null);
  };

  const resetPosterForm = () => {
    setPosterForm({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      image: '',
      active: true
    });
    setShowPosterModal(false);
    setEditingPoster(null);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || '',
      category: post.category,
      tags: post.tags || '',
      image: post.image || ''
    });
    setShowPostModal(true);
  };

  const handleEditPoster = (poster) => {
    setEditingPoster(poster);
    setPosterForm(poster);
    setShowPosterModal(true);
  };

  const handleDeletePost = (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  const handleDeletePoster = (id) => {
    if (window.confirm('Are you sure you want to delete this poster?')) {
      setConsultationPosters(consultationPosters.filter(poster => poster.id !== id));
    }
  };

  const togglePosterStatus = (id) => {
    setConsultationPosters(consultationPosters.map(poster =>
      poster.id === id ? { ...poster, active: !poster.active } : poster
    ));
  };

  return (
    <div className="admin-blog">
      <div className="admin-header">
        <div className="header-left">
          <button className="back-btn" onClick={onNavigateBack}>
            ← Back to Blog
          </button>
          <h1>Blog Administration</h1>
          <p>Welcome, {user.firstName}!</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{posts.length}</span>
            <span className="stat-label">Total Posts</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{consultationPosters.length}</span>
            <span className="stat-label">Active Posters</span>
          </div>
        </div>
      </div>

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          📝 Blog Posts
        </button>
        <button 
          className={`tab-btn ${activeTab === 'posters' ? 'active' : ''}`}
          onClick={() => setActiveTab('posters')}
        >
          📋 Consultation Posters
        </button>
        <button 
          className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'posts' && (
          <div className="posts-section">
            <div className="section-header">
              <h2>Manage Blog Posts</h2>
              <button 
                className="add-btn"
                onClick={() => setShowPostModal(true)}
              >
                + Add New Post
              </button>
            </div>

            <div className="posts-table">
              <div className="table-header">
                <span>Title</span>
                <span>Category</span>
                <span>Status</span>
                <span>Date</span>
                <span>Actions</span>
              </div>
              {posts.map(post => (
                <div key={post.id} className="table-row">
                  <div className="post-title">
                    <strong>{post.title}</strong>
                    <p>{post.excerpt}</p>
                  </div>
                  <span className={`category-badge ${post.category}`}>
                    {post.category === 'health' ? 'Health Update' : 'Product News'}
                  </span>
                  <span className={`status-badge ${post.status}`}>
                    {post.status}
                  </span>
                  <span>{post.date}</span>
                  <div className="actions">
                    <button onClick={() => handleEditPost(post)}>✏️</button>
                    <button onClick={() => handleDeletePost(post.id)}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posters' && (
          <div className="posters-section">
            <div className="section-header">
              <h2>Consultation Posters</h2>
              <button 
                className="add-btn"
                onClick={() => setShowPosterModal(true)}
              >
                + Create Poster
              </button>
            </div>

            <div className="posters-grid">
              {consultationPosters.map(poster => (
                <div key={poster.id} className="poster-card">
                  <div className="poster-image">
                    <img src={poster.image} alt={poster.title} />
                    <div className={`status-indicator ${poster.active ? 'active' : 'inactive'}`}>
                      {poster.active ? 'Active' : 'Inactive'}
                    </div>
                  </div>
                  <div className="poster-content">
                    <h3>{poster.title}</h3>
                    <p>{poster.description}</p>
                    <div className="poster-dates">
                      <span>📅 {poster.startDate} - {poster.endDate}</span>
                    </div>
                    <div className="poster-actions">
                      <button onClick={() => handleEditPoster(poster)}>Edit</button>
                      <button 
                        onClick={() => togglePosterStatus(poster.id)}
                        className={poster.active ? 'deactivate' : 'activate'}
                      >
                        {poster.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => handleDeletePoster(poster.id)}
                        className="delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h2>Blog Analytics</h2>
            <div className="analytics-grid">
              <div className="analytics-card">
                <h3>Page Views</h3>
                <div className="big-number">12,453</div>
                <span className="trend positive">+15% this month</span>
              </div>
              <div className="analytics-card">
                <h3>Most Popular Category</h3>
                <div className="big-number">Health Updates</div>
                <span className="trend">67% of total views</span>
              </div>
              <div className="analytics-card">
                <h3>Avg. Read Time</h3>
                <div className="big-number">3.5 min</div>
                <span className="trend positive">+0.3 min</span>
              </div>
              <div className="analytics-card">
                <h3>Consultation Bookings</h3>
                <div className="big-number">89</div>
                <span className="trend positive">+22% this month</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={resetPostForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPost ? 'Edit Post' : 'Add New Post'}</h3>
              <button onClick={resetPostForm}>×</button>
            </div>
            <form onSubmit={handlePostSubmit} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={postForm.title}
                  onChange={(e) => setPostForm({...postForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Excerpt</label>
                <textarea
                  value={postForm.excerpt}
                  onChange={(e) => setPostForm({...postForm, excerpt: e.target.value})}
                  rows="3"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={postForm.category}
                    onChange={(e) => setPostForm({...postForm, category: e.target.value})}
                  >
                    <option value="health">Health Update</option>
                    <option value="products">Product News</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input
                    type="text"
                    value={postForm.tags}
                    onChange={(e) => setPostForm({...postForm, tags: e.target.value})}
                    placeholder="health, natural, wellness"
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Featured Image URL</label>
                <input
                  type="url"
                  value={postForm.image}
                  onChange={(e) => setPostForm({...postForm, image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-group">
                <label>Content</label>
                <textarea
                  value={postForm.content}
                  onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                  rows="8"
                  placeholder="Write your blog post content here..."
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={resetPostForm}>Cancel</button>
                <button type="submit">{editingPost ? 'Update' : 'Publish'} Post</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Poster Modal */}
      {showPosterModal && (
        <div className="modal-overlay" onClick={resetPosterForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingPoster ? 'Edit Poster' : 'Create Consultation Poster'}</h3>
              <button onClick={resetPosterForm}>×</button>
            </div>
            <form onSubmit={handlePosterSubmit} className="modal-form">
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  value={posterForm.title}
                  onChange={(e) => setPosterForm({...posterForm, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={posterForm.description}
                  onChange={(e) => setPosterForm({...posterForm, description: e.target.value})}
                  rows="3"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={posterForm.startDate}
                    onChange={(e) => setPosterForm({...posterForm, startDate: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={posterForm.endDate}
                    onChange={(e) => setPosterForm({...posterForm, endDate: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Poster Image URL</label>
                <input
                  type="url"
                  value={posterForm.image}
                  onChange={(e) => setPosterForm({...posterForm, image: e.target.value})}
                  placeholder="https://example.com/poster.jpg"
                  required
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={posterForm.active}
                    onChange={(e) => setPosterForm({...posterForm, active: e.target.checked})}
                  />
                  Make this poster active immediately
                </label>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={resetPosterForm}>Cancel</button>
                <button type="submit">{editingPoster ? 'Update' : 'Create'} Poster</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlog;
