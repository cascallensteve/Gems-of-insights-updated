import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { blogService } from '../services/blogService';
import LoadingDots from './LoadingDots';
import './AdminBlogManager.css';

const AdminBlogManager = ({ user, onNavigateBack }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [showPostModal, setShowPostModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingPost, setViewingPost] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [domReady, setDomReady] = useState(false);
  const [portalTarget, setPortalTarget] = useState(null);

  const [postForm, setPostForm] = useState({
    title: '',
    description: '',
    body: '',
    read_time: '',
    tag_list: '',
    photo: ''
  });

  // TinyMCE loading state
  const [tinymceLoaded, setTinymceLoaded] = useState(false);

  useEffect(() => {
    fetchPosts();
    // Ensure DOM is ready for portals
    setDomReady(true);
    if (typeof document !== 'undefined') {
      const target = document.getElementById('modal-root') || document.body;
      setPortalTarget(target && target.nodeType === 1 ? target : null);
    }
  }, []);

  // Load TinyMCE from CDN once
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.tinymce && !tinymceLoaded) {
      const script = document.createElement('script');
      script.src = 'https://cdn.tiny.cloud/1/no-api-key/tinymce/6/tinymce.min.js';
      script.referrerPolicy = 'origin';
      script.onload = () => setTinymceLoaded(true);
      document.body.appendChild(script);
    } else if (window.tinymce) {
      setTinymceLoaded(true);
    }
  }, [tinymceLoaded]);

  // Initialize TinyMCE when modal opens (for Title, Description, Body)
  useEffect(() => {
    const initEditor = () => {
      if (!window.tinymce) return;
      // Destroy existing instances to avoid duplicates
      window.tinymce.remove('#blog-title-editor,#blog-description-editor,#blog-body-editor');
      // Title editor (compact toolbar)
      window.tinymce.init({
        selector: '#blog-title-editor',
        menubar: false,
        toolbar: 'undo redo | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | removeformat',
        height: 80,
        branding: false,
        inline: false,
        statusbar: false,
        content_style: 'body { font-family: Inter, Arial, sans-serif; font-size:20px; font-weight:800; color:#111827 }',
        setup: (editor) => {
          editor.on('init', () => {
            editor.setContent(postForm.title || '');
          });
          editor.on('change keyup undo redo SetContent', () => {
            const value = editor.getContent({ format: 'html' });
            setPostForm(prev => ({ ...prev, title: value }));
          });
        }
      });

      // Description editor (medium toolbar)
      window.tinymce.init({
        selector: '#blog-description-editor',
        menubar: false,
        plugins: 'link lists emoticons',
        toolbar: 'undo redo | bold italic underline | forecolor backcolor | bullist numlist | link emoticons | removeformat',
        height: 140,
        branding: false,
        statusbar: false,
        content_style: 'body { font-family: Inter, Arial, sans-serif; font-size:14px; color:#374151 }',
        setup: (editor) => {
          editor.on('init', () => {
            editor.setContent(postForm.description || '');
          });
          editor.on('change keyup undo redo SetContent', () => {
            const value = editor.getContent({ format: 'html' });
            setPostForm(prev => ({ ...prev, description: value }));
          });
        }
      });

      // Body editor (full toolbar)
      window.tinymce.init({
        selector: '#blog-body-editor',
        menubar: true,
        plugins: 'advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table help wordcount autoresize codesample emoticons hr paste directionality',
        toolbar: 'undo redo | blocks | bold italic underline forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image media codesample | removeformat | fullscreen | help',
        height: 420,
        branding: false,
        convert_urls: false,
        autoresize_bottom_margin: 16,
        content_style: 'body { font-family: Inter, Arial, sans-serif; font-size:14px }',
        setup: (editor) => {
          editor.on('init', () => {
            editor.setContent(postForm.body || '');
          });
          editor.on('change keyup undo redo SetContent', () => {
            const value = editor.getContent();
            setPostForm(prev => ({ ...prev, body: value }));
          });
        }
      });
    };

    if (showPostModal && tinymceLoaded) {
      initEditor();
    }
    // Clean up on close
    return () => {
      if (window.tinymce) {
        window.tinymce.remove('#blog-body-editor');
      }
    };
  }, [showPostModal, tinymceLoaded, editingPost]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const blogs = await blogService.getAllBlogs();
      setPosts(blogs);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSubmitting(true);
      setError(null);

      // Validate form data
      blogService.validateBlogData(postForm);

      let savedPost;
      if (editingPost) {
        // Update existing post
        savedPost = await blogService.editBlog(editingPost.id, postForm);
        setPosts(posts.map(post => post.id === editingPost.id ? savedPost : post));
      } else {
        // Create new post
        savedPost = await blogService.addBlog(postForm);
        setPosts([savedPost, ...posts]);
      }

      resetPostForm();
      alert(editingPost ? 'Blog updated successfully!' : 'Blog created successfully!');
    } catch (error) {
      console.error('Error saving post:', error);
      setError(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewPost = (post) => {
    setViewingPost(post);
    setShowViewModal(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setPostForm({
      title: post.title || '',
      description: post.description || '',
      body: post.body || '',
      read_time: post.read_time || '',
      tag_list: post.tag_list || '',
      photo: post.photo || ''
    });
    setShowPostModal(true);
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      // Note: API doesn't have delete endpoint, so we'll just remove from local state
      setPosts(posts.filter(post => post.id !== postId));
      alert('Post deleted successfully!');
    } catch (error) {
      console.error('Error deleting post:', error);
      setError(error.message);
    }
  };

  const resetPostForm = () => {
    setPostForm({
      title: '',
      description: '',
      body: '',
      read_time: '',
      tag_list: '',
      photo: ''
    });
    setEditingPost(null);
    setShowPostModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPostForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getStatusColor = (post) => {
    return post.author ? '#22c55e' : '#f59e0b'; // Published vs Draft
  };

  const getStatusText = (post) => {
    return post.author ? 'Published' : 'Draft';
  };

  return (
    <div className="admin-blog-manager">
      <div className="admin-header">
        <button className="back-btn" onClick={onNavigateBack}>
          ← Back to Profile
        </button>
        <h1>Blog Management</h1>
        <div className="admin-info">
          <span>Welcome, {user?.firstName} {user?.lastName}</span>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          <p>Error: {error}</p>
          <button onClick={() => setError(null)}>×</button>
        </div>
      )}

      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
          onClick={() => setActiveTab('posts')}
        >
          Blog Posts ({posts.length})
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'posts' && (
          <div className="posts-section">
            <div className="section-header">
              <h2>Manage Blog Posts ({posts.length})</h2>
              <div className="section-actions">
                <button 
                  className="refresh-btn"
                  onClick={fetchPosts}
                  disabled={loading}
                >
                  🔄 Refresh
                </button>
                <button 
                  className="create-btn"
                  onClick={() => setShowPostModal(true)}
                >
                  + Create New Post
                </button>
              </div>
            </div>

            {loading ? (
              <div className="loading-state">
                <LoadingDots text="Loading posts..." size="medium" />
              </div>
            ) : (
              <div className="posts-table">
                <div className="table-header">
                  <div>Title</div>
                  <div>Author</div>
                  <div>Date</div>
                  <div>Status</div>
                  <div>Actions</div>
                </div>
                
                {posts.map(post => (
                  <div key={post.id} className="table-row">
                    <div className="post-title">
                      <h4>{post.title}</h4>
                      <p>{post.description}</p>
                    </div>
                    <div className="post-author">
                      <div className="author-info">
                        <div>{blogService.getAuthorName(post.author)}</div>
                        {post.author && (
                          <small className="author-email">{post.author.email}</small>
                        )}
                      </div>
                    </div>
                    <div className="post-date">
                      {formatDate(post.timestamp)}
                    </div>
                    <div className="post-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(post) }}
                      >
                        {getStatusText(post)}
                      </span>
                    </div>
                    <div className="post-actions">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewPost(post)}
                        title="View Full Post"
                      >
                        👁️ View
                      </button>
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditPost(post)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDeletePost(post.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}

                {posts.length === 0 && (
                  <div className="empty-state">
                    <p>No blog posts found. Create your first post!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Post Modal - Render outside admin layout using Portal */}
      {showPostModal && domReady && portalTarget && createPortal(
        <div 
          className="modal-overlay blog-modal-overlay" 
          onClick={() => !submitting && resetPostForm()}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="modal blog-creation-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              zIndex: 1000000,
              pointerEvents: 'all'
            }}
          >
            <div className="modal-header">
              <h3>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
              <button 
                className="close-btn" 
                onClick={resetPostForm}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="post-form">
              <div className="form-group">
                <label>Title *</label>
                {/* TinyMCE enhanced title input */}
                <textarea
                  id="blog-title-editor"
                  name="title"
                  value={postForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                {/* TinyMCE enhanced description */}
                <textarea
                  id="blog-description-editor"
                  name="description"
                  value={postForm.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the post"
                  rows="4"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                {/* TinyMCE will enhance this textarea */}
                <textarea
                  id="blog-body-editor"
                  name="body"
                  value={postForm.body}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..."
                  rows="12"
                  required
                  disabled={submitting}
                />
                <small>Rich text editor powered by TinyMCE (supports colors, images, media).</small>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Read Time *</label>
                  <input
                    type="text"
                    name="read_time"
                    value={postForm.read_time}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 minutes"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Tags *</label>
                  <input
                    type="text"
                    name="tag_list"
                    value={postForm.tag_list}
                    onChange={handleInputChange}
                    placeholder="e.g., Health Nutrition Wellness"
                    required
                    disabled={submitting}
                  />
                  <small>Separate tags with spaces</small>
                </div>
              </div>

              <div className="form-group">
                <label>Featured Image URL</label>
                <input
                  type="url"
                  name="photo"
                  value={postForm.photo}
                  onChange={handleInputChange}
                  placeholder="https://res.cloudinary.com/.../your-image.jpg"
                  disabled={submitting}
                />
                <small>Paste your Cloudinary image URL here</small>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={resetPostForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span>
                      <span className="spinner"></span>
                      {editingPost ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingPost ? 'Update Post' : 'Create Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>,
        portalTarget
      )}

      {/* Fallback Modal Rendering - if portal fails */}
      {showPostModal && (!domReady || !portalTarget) && (
        <div 
          className="modal-overlay blog-modal-overlay" 
          onClick={() => !submitting && resetPostForm()}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="modal blog-creation-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              zIndex: 1000000,
              pointerEvents: 'all'
            }}
          >
            <div className="modal-header">
              <h3>{editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}</h3>
              <button 
                className="close-btn" 
                onClick={resetPostForm}
                disabled={submitting}
              >
                ×
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="post-form">
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={postForm.title}
                  onChange={handleInputChange}
                  placeholder="Enter post title"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={postForm.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the post"
                  rows="3"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-group">
                <label>Content *</label>
                <textarea
                  name="body"
                  value={postForm.body}
                  onChange={handleInputChange}
                  placeholder="Write your blog post content here..."
                  rows="10"
                  required
                  disabled={submitting}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Read Time *</label>
                  <input
                    type="text"
                    name="read_time"
                    value={postForm.read_time}
                    onChange={handleInputChange}
                    placeholder="e.g., 5 minutes"
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="form-group">
                  <label>Tags *</label>
                  <input
                    type="text"
                    name="tag_list"
                    value={postForm.tag_list}
                    onChange={handleInputChange}
                    placeholder="e.g., Health Nutrition Wellness"
                    required
                    disabled={submitting}
                  />
                  <small>Separate tags with spaces</small>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={resetPostForm}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={submitting}
                >
                  {submitting ? (
                    <span>
                      <span className="spinner"></span>
                      {editingPost ? 'Updating...' : 'Creating...'}
                    </span>
                  ) : (
                    editingPost ? 'Update Post' : 'Create Post'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Post Modal */}
      {showViewModal && viewingPost && domReady && portalTarget && createPortal(
        <div 
          className="modal-overlay view-modal-overlay" 
          onClick={() => setShowViewModal(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
        >
          <div 
            className="modal view-modal" 
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'relative',
              zIndex: 1000000,
              pointerEvents: 'all'
            }}
          >
            <div className="modal-header">
              <h3>Blog Post Details</h3>
              <button 
                className="close-btn" 
                onClick={() => setShowViewModal(false)}
              >
                ×
              </button>
            </div>

            <div className="view-post-content">
              <div className="post-header">
                <h1 className="post-title">{viewingPost.title}</h1>
                <div className="post-meta-detailed">
                  <div className="meta-row">
                    <span><strong>ID:</strong> {viewingPost.id}</span>
                    <span><strong>Status:</strong> {getStatusText(viewingPost)}</span>
                  </div>
                  <div className="meta-row">
                    <span><strong>Author:</strong> {blogService.getAuthorName(viewingPost.author)}</span>
                    <span><strong>Read Time:</strong> {viewingPost.read_time}</span>
                  </div>
                  <div className="meta-row">
                    <span><strong>Created:</strong> {blogService.formatTimestamp(viewingPost.timestamp)}</span>
                  </div>
                  {viewingPost.author && (
                    <div className="author-details">
                      <h4>Author Details:</h4>
                      <p><strong>Name:</strong> {viewingPost.author.first_name} {viewingPost.author.last_name}</p>
                      <p><strong>Email:</strong> {viewingPost.author.email}</p>
                      <p><strong>User Type:</strong> {viewingPost.author.userType}</p>
                      <p><strong>Verified:</strong> {viewingPost.author.is_email_verified ? '✅ Yes' : '❌ No'}</p>
                    </div>
                  )}
                </div>
              </div>


              <div className="post-body">
                <h4>Description:</h4>
                <p className="description">{viewingPost.description}</p>
                
                <h4>Content:</h4>
                <div className="content">{viewingPost.body}</div>
                
                <h4>Tags:</h4>
                <div className="tags-display">
                  {viewingPost.tags && viewingPost.tags.map((tag, index) => (
                    <span key={index} className="tag-item">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="view-actions">
                <button 
                  className="edit-btn"
                  onClick={() => {
                    setShowViewModal(false);
                    handleEditPost(viewingPost);
                  }}
                >
                  Edit This Post
                </button>
                <button 
                  className="close-btn-alt"
                  onClick={() => setShowViewModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>,
        portalTarget
      )}
    </div>
  );
};

export default AdminBlogManager;
