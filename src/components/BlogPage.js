import React, { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import LoadingDots from './LoadingDots';
import LikeButton from './LikeButton';
import './BlogPage.css';

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [submittingComments, setSubmittingComments] = useState({});

  // Fetch blogs on component mount
  useEffect(() => {
    const loadBlogPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('BlogPage: Starting to fetch blogs...');
        const blogs = await blogService.getAllBlogs();
        console.log('BlogPage: Received blogs:', blogs?.length);
        
        // Ensure blogs is an array
        if (!Array.isArray(blogs)) {
          console.error('BlogPage: Invalid blogs data received:', blogs);
          throw new Error('Invalid blogs data received from API');
        }
        
        // Transform API data to match component expectations
        const transformedBlogs = blogs.map((blog, index) => {
          console.log(`BlogPage: Transforming blog ${index + 1}:`, blog.id, blog.title);
          return {
            id: blog.id,
            title: blog.title,
            excerpt: blog.description,
            image: blog.photo || getRandomImage(),
            category: getCategoryFromTags(blog.tags),
            date: blog.timestamp,
            author: blogService.getAuthorName(blog.author),
            readTime: blog.read_time,
            tags: blog.tags || [],
            body: blog.body,
            likes: blog.likes || 0,
            isLiked: blog.isLiked || false
          };
        });
        
        console.log('BlogPage: Transformed blogs:', transformedBlogs?.length);
        setBlogPosts(transformedBlogs);
        
        // Load comments for each blog post
        transformedBlogs.forEach(blog => {
          loadCommentsForBlog(blog.id);
        });
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError(error.message);
        
        // Set fallback data to prevent infinite loading
        setBlogPosts([
          {
            id: 'fallback-1',
            title: "Welcome to Gems of Insight Blog",
            excerpt: "Discover health and wellness tips from our experts.",
            image: getRandomImage(),
            category: 'health',
            date: new Date().toISOString(),
            author: 'Gems of Insight Team',
            readTime: '3 minutes',
            tags: ['Health', 'Wellness'],
            body: 'Welcome to our blog! We share insights on health, wellness, and natural living.'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    loadBlogPosts();
  }, []);

  // Load comments for a specific blog post
  const loadCommentsForBlog = async (blogId) => {
    try {
      const storedComments = localStorage.getItem(`comments_${blogId}`);
      if (storedComments) {
        setComments(prev => ({
          ...prev,
          [blogId]: JSON.parse(storedComments)
        }));
      } else {
        setComments(prev => ({
          ...prev,
          [blogId]: []
        }));
      }
    } catch (error) {
      console.error('Error loading comments for blog:', blogId, error);
      setComments(prev => ({
        ...prev,
        [blogId]: []
      }));
    }
  };

  // Handle comment submission
  const handleSubmitComment = async (blogId, e) => {
    e.preventDefault();
    
    const commentText = newComments[blogId];
    if (!commentText || !commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setSubmittingComments(prev => ({ ...prev, [blogId]: true }));
      
      // Create new comment object
      const comment = {
        id: Date.now(),
        postId: blogId,
        author: 'Anonymous User', // In a real app, get from user context
        content: commentText.trim(),
        timestamp: new Date().toISOString(),
        likes: 0,
        replies: []
      };

      // Add comment to state
      const updatedComments = [comment, ...(comments[blogId] || [])];
      setComments(prev => ({
        ...prev,
        [blogId]: updatedComments
      }));

      // Clear the input
      setNewComments(prev => ({ ...prev, [blogId]: '' }));

      // Save to localStorage (in real app, save to API)
      localStorage.setItem(`comments_${blogId}`, JSON.stringify(updatedComments));
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComments(prev => ({ ...prev, [blogId]: false }));
    }
  };

  // Handle comment input change
  const handleCommentChange = (blogId, value) => {
    setNewComments(prev => ({ ...prev, [blogId]: value }));
  };

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('BlogPage: Refresh - Starting to fetch blogs...');
      const blogs = await blogService.getAllBlogs();
      console.log('BlogPage: Refresh - Received blogs:', blogs?.length);
      
      // Ensure blogs is an array
      if (!Array.isArray(blogs)) {
        console.error('BlogPage: Refresh - Invalid blogs data received:', blogs);
        throw new Error('Invalid blogs data received from API');
      }
      
      // Transform API data to match component expectations
      const transformedBlogs = blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        excerpt: blog.description,
        image: blog.photo || getRandomImage(),
        category: getCategoryFromTags(blog.tags),
        date: blog.timestamp,
        author: blogService.getAuthorName(blog.author),
        readTime: blog.read_time,
        tags: blog.tags || [],
        body: blog.body,
        likes: blog.likes || 0,
        isLiked: blog.isLiked || false
      }));
      
      console.log('BlogPage: Refresh - Transformed blogs:', transformedBlogs?.length);
      setBlogPosts(transformedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError(error.message);
      
      // Set fallback data to prevent infinite loading
      setBlogPosts([
        {
          id: 'fallback-1',
          title: "Welcome to Gems of Insight Blog",
          excerpt: "Discover health and wellness tips from our experts.",
          image: getRandomImage(),
          category: 'health',
          date: new Date().toISOString(),
          author: 'Gems of Insight Team',
          readTime: '3 minutes',
          tags: ['Health', 'Wellness'],
          body: 'Welcome to our blog! We share insights on health, wellness, and natural living.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get random image
  const getRandomImage = () => {
    const images = [
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  // Helper function to determine category from tags
  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return 'health';
    
    const healthTags = ['health', 'nutrition', 'wellness', 'exercise', 'god', 'relationships'];
    const hasHealthTag = tags.some(tag => 
      healthTags.includes(tag.toLowerCase())
    );
    
    return hasHealthTag ? 'health' : 'products';
  };

  const categories = [
    { id: 'all', name: 'All Posts', count: blogPosts.length },
    { id: 'health', name: 'Health Updates', count: blogPosts.filter(post => post.category === 'health').length },
    { id: 'products', name: 'Product News', count: blogPosts.filter(post => post.category === 'products').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Unknown date';
    }
  };

  const handleReadFullPost = (post) => {
    // Navigate to the blog post view
    window.location.href = `/blog/${post.id}`;
  };

  // Enhanced loading component
  const LoadingSpinner = () => (
    <div className="blog-loading">
      <LoadingDots text="Loading blog posts..." size="large" />
    </div>
  );

  // Enhanced error component
  const ErrorMessage = () => (
    <div className="error-message">
      <p>Error loading blogs: {error}</p>
      <button onClick={() => window.location.reload()} className="retry-btn">Try Again</button>
    </div>
  );

  return (
    <div className="blog-page">
      <div className="container">
        {/* Header */}
        <div className="blog-header">
          <h1 className="blog-title">Health & Wellness Blog</h1>
          <p className="blog-subtitle">Latest updates on health, wellness, and new product arrivals</p>
          
          {/* Show loading spinner */}
          {loading && <LoadingSpinner />}
          
          {/* Show error message */}
          {error && <ErrorMessage />}
        </div>

        {/* Search and Filter - Only show when not loading and no error */}
        {!loading && !error && (
          <div className="blog-filters">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name} ({category.count})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Featured Post - Only show when not loading and no error */}
        {!loading && !error && filteredPosts.length > 0 && (
          <div className="featured-post">
            <div className="featured-image">
              <img src={filteredPosts[0].image} alt={filteredPosts[0].title} />
              <div className="category-tag featured-tag">
                {getCategoryFromTags(filteredPosts[0].tags)}
              </div>
            </div>
            <div className="featured-content">
              <h2 className="featured-title">{filteredPosts[0].title}</h2>
              <p className="featured-excerpt">{filteredPosts[0].excerpt}</p>
              <div className="post-meta">
                <span className="author">By {filteredPosts[0].author}</span>
                <span className="date">{formatDate(filteredPosts[0].date)}</span>
                <span className="read-time">{filteredPosts[0].readTime}</span>
              </div>
              <div className="post-tags">
                {filteredPosts[0].tags.slice(0, 5).map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <div className="post-content-preview">
                <h4>Preview:</h4>
                <p>{filteredPosts[0].body ? filteredPosts[0].body.substring(0, 200) + '...' : 'Content preview not available'}</p>
              </div>
              <div className="featured-actions">
                <button 
                  className="read-more-btn"
                  onClick={() => handleReadFullPost(filteredPosts[0])}
                >
                  Read Full Article
                </button>
                <LikeButton 
                  blogId={filteredPosts[0].id}
                  initialLikes={filteredPosts[0].likes}
                  initialIsLiked={filteredPosts[0].isLiked}
                  size="large"
                />
              </div>
            </div>

            {/* Featured Post Comments Section */}
            <div className="featured-comments-section">
              <h4 className="comments-title">Comments ({comments[filteredPosts[0].id]?.length || 0})</h4>
              
              {/* Add Comment Form */}
              <form className="comment-form" onSubmit={(e) => handleSubmitComment(filteredPosts[0].id, e)}>
                <div className="form-group">
                  <textarea
                    value={newComments[filteredPosts[0].id] || ''}
                    onChange={(e) => handleCommentChange(filteredPosts[0].id, e.target.value)}
                    placeholder="Share your thoughts on this article..."
                    rows="3"
                    required
                  />
                </div>
                <button 
                  type="submit" 
                  className="submit-comment-btn"
                  disabled={submittingComments[filteredPosts[0].id]}
                >
                  {submittingComments[filteredPosts[0].id] ? 'Posting...' : 'Post Comment'}
                </button>
              </form>

              {/* Comments List */}
              <div className="comments-list">
                {comments[filteredPosts[0].id] && comments[filteredPosts[0].id].length > 0 ? (
                  comments[filteredPosts[0].id].slice(0, 3).map(comment => (
                    <div key={comment.id} className="comment">
                      <div className="comment-header">
                        <span className="comment-author">{comment.author}</span>
                        <span className="comment-date">{formatDate(comment.timestamp)}</span>
                      </div>
                      <div className="comment-content">
                        {comment.content}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-comments">
                    <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                )}
                
                {comments[filteredPosts[0].id] && comments[filteredPosts[0].id].length > 3 && (
                  <div className="view-more-comments">
                    <button className="view-more-btn">
                      View all {comments[filteredPosts[0].id].length} comments
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Blog Grid - Only show when not loading and no error */}
        {!loading && !error && (
          <div className="blog-grid">
            {filteredPosts.slice(1).map(post => (
            <article key={post.id} className="blog-card">
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <div className="category-tag">
                  {getCategoryFromTags(post.tags)}
                </div>
              </div>
              <div className="blog-content">
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span className="author">By {post.author}</span>
                  <span className="date">{formatDate(post.date)}</span>
                </div>
                <div className="blog-footer">
                  <div className="post-tags">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="tag">{tag}</span>
                    ))}
                  </div>
                  <span className="read-time">{post.readTime}</span>
                </div>
                <div className="content-preview">
                  <p>{post.body ? post.body.substring(0, 150) + '...' : 'Preview not available'}</p>
                </div>
                <div className="blog-actions">
                  <button 
                    className="read-more-btn"
                    onClick={() => handleReadFullPost(post)}
                  >
                    Read More
                  </button>
                  <LikeButton 
                    blogId={post.id}
                    initialLikes={post.likes}
                    initialIsLiked={post.isLiked}
                    size="medium"
                  />
                </div>
              </div>

              {/* Comments Section */}
              <div className="blog-comments-section">
                <h4 className="comments-title">Comments ({comments[post.id]?.length || 0})</h4>
                
                {/* Add Comment Form */}
                <form className="comment-form" onSubmit={(e) => handleSubmitComment(post.id, e)}>
                  <div className="form-group">
                    <textarea
                      value={newComments[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      placeholder="Share your thoughts on this article..."
                      rows="3"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="submit-comment-btn"
                    disabled={submittingComments[post.id]}
                  >
                    {submittingComments[post.id] ? 'Posting...' : 'Post Comment'}
                  </button>
                </form>

                {/* Comments List */}
                <div className="comments-list">
                  {comments[post.id] && comments[post.id].length > 0 ? (
                    comments[post.id].slice(0, 3).map(comment => (
                      <div key={comment.id} className="comment">
                        <div className="comment-header">
                          <span className="comment-author">{comment.author}</span>
                          <span className="comment-date">{formatDate(comment.timestamp)}</span>
                        </div>
                        <div className="comment-content">
                          {comment.content}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-comments">
                      <p>No comments yet. Be the first to share your thoughts!</p>
                    </div>
                  )}
                  
                  {comments[post.id] && comments[post.id].length > 3 && (
                    <div className="view-more-comments">
                      <button className="view-more-btn">
                        View all {comments[post.id].length} comments
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </article>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="newsletter-section">
          <div className="newsletter-content">
            <h3>Stay Updated</h3>
            <p>Get the latest health tips and product updates delivered to your inbox</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email address" />
              <button type="submit">Subscribe</button>
            </div>
          </div>
        </div>

        {/* No Results - Only show when not loading and no error */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="no-results">
            <h3>No articles found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
