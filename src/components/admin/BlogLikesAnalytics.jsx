import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';
import './BlogLikesAnalytics.css';

const BlogLikesAnalytics = () => {
  const [likesData, setLikesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [blogDetails, setBlogDetails] = useState({});

  useEffect(() => {
    fetchAllBlogsLikes();
  }, []);

  const fetchAllBlogsLikes = async () => {
    setLoading(true);
    setError(null);

    try {
      // First get all blogs
      const blogs = await blogService.getAllBlogs();
      const likesPromises = blogs.map(async (blog) => {
        try {
          const likesInfo = await blogService.getBlogLikesDetails(blog.id);
          return {
            blogId: blog.id,
            blogTitle: blog.title,
            blogAuthor: blogService.getAuthorName(blog.author),
            ...likesInfo
          };
        } catch (error) {
          // If individual blog likes fail, return basic info
          return {
            blogId: blog.id,
            blogTitle: blog.title,
            blogAuthor: blogService.getAuthorName(blog.author),
            total_likes: 0,
            likes: [],
            error: error.message
          };
        }
      });

      const allLikesData = await Promise.all(likesPromises);
      setLikesData(allLikesData);
    } catch (error) {
      console.error('Error fetching blogs likes:', error);
      setError('Failed to load blog likes data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getTotalLikes = () => {
    return likesData.reduce((total, blog) => total + (blog.total_likes || 0), 0);
  };

  const getMostLikedBlog = () => {
    if (likesData.length === 0) return null;
    return likesData.reduce((max, blog) => 
      (blog.total_likes || 0) > (max.total_likes || 0) ? blog : max
    );
  };

  const getRecentLikes = () => {
    const allLikes = likesData.flatMap(blog => 
      (blog.likes || []).map(like => ({
        ...like,
        blogTitle: blog.blogTitle,
        blogId: blog.blogId
      }))
    );
    
    return allLikes
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);
  };

  const formatDate = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Unknown date';
    }
  };

  const handleBlogSelect = (blog) => {
    setSelectedBlog(selectedBlog?.blogId === blog.blogId ? null : blog);
  };

  if (loading) {
    return (
      <div className="blog-likes-analytics">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading blog likes analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="blog-likes-analytics">
        <div className="error-state">
          <h3>❌ Error Loading Analytics</h3>
          <p>{error}</p>
          <button onClick={fetchAllBlogsLikes} className="retry-btn">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const mostLikedBlog = getMostLikedBlog();
  const recentLikes = getRecentLikes();

  return (
    <div className="blog-likes-analytics">
      <div className="analytics-header">
        <h2>📊 Blog Likes Analytics</h2>
        <p>Comprehensive overview of blog engagement and user interactions</p>
        <button onClick={fetchAllBlogsLikes} className="refresh-btn">
          🔄 Refresh Data
        </button>
      </div>

      {/* Summary Statistics */}
      <div className="likes-summary">
        <div className="summary-card">
          <h3>Total Likes</h3>
          <p className="summary-number">{getTotalLikes()}</p>
          <span>Across all blogs</span>
        </div>
        
        <div className="summary-card">
          <h3>Active Blogs</h3>
          <p className="summary-number">{likesData.length}</p>
          <span>Blogs tracked</span>
        </div>
        
        <div className="summary-card">
          <h3>Most Liked</h3>
          <p className="summary-number">{mostLikedBlog?.total_likes || 0}</p>
          <span>{mostLikedBlog?.blogTitle?.substring(0, 30) || 'No data'}...</span>
        </div>

        <div className="summary-card">
          <h3>Recent Activity</h3>
          <p className="summary-number">{recentLikes.length}</p>
          <span>Recent likes</span>
        </div>
      </div>

      {/* Blogs List with Likes */}
      <div className="blogs-likes-section">
        <h3>📝 Blogs and Their Likes</h3>
        <div className="blogs-likes-grid">
          {likesData.map((blog) => (
            <div 
              key={blog.blogId} 
              className={`blog-likes-card ${selectedBlog?.blogId === blog.blogId ? 'selected' : ''}`}
              onClick={() => handleBlogSelect(blog)}
            >
              <div className="blog-info">
                <h4>{blog.blogTitle}</h4>
                <p>By {blog.blogAuthor}</p>
                <div className="likes-count">
                  <span className="likes-number">{blog.total_likes || 0}</span>
                  <span className="likes-label">likes</span>
                </div>
              </div>
              
              {blog.error && (
                <div className="error-badge">❌ {blog.error}</div>
              )}
              
              {selectedBlog?.blogId === blog.blogId && blog.likes && blog.likes.length > 0 && (
                <div className="likes-details">
                  <h5>👥 Individual Likes:</h5>
                  <div className="likes-list">
                    {blog.likes.slice(0, 5).map((like, index) => (
                      <div key={like.id || index} className="like-item">
                        <span>User ID: {like.owner || 'Unknown'}</span>
                        <span>{formatDate(like.timestamp)}</span>
                      </div>
                    ))}
                    {blog.likes.length > 5 && (
                      <div className="more-likes">
                        +{blog.likes.length - 5} more likes
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Likes Activity */}
      {recentLikes.length > 0 && (
        <div className="recent-likes-section">
          <h3>⏰ Recent Likes Activity</h3>
          <div className="recent-likes-list">
            {recentLikes.map((like, index) => (
              <div key={like.id || index} className="recent-like-item">
                <div className="like-info">
                  <span className="blog-title">"{like.blogTitle}"</span>
                  <span className="like-user">User ID: {like.owner || 'Unknown'}</span>
                </div>
                <div className="like-time">
                  {formatDate(like.timestamp)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogLikesAnalytics;
