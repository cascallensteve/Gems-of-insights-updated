import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { blogService } from '../services/blogService';
import LikeButton from './LikeButton';
import LoadingDots from './LoadingDots';
import './BlogPostView.css';

const BlogPostView = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (postId) {
      loadBlogPost();
      loadComments();
    }
  }, [postId]);

  const loadBlogPost = async () => {
    try {
      setLoading(true);
      // Fetch exact blog by id so we can use the same image and content
      const detailed = await blogService.getBlogById(postId);
      if (!detailed) {
        setError('Blog post not found');
        return;
      }
      const transformedPost = {
        id: detailed.id,
        title: detailed.title,
        excerpt: detailed.description,
        image: detailed.photo || detailed.image || getRandomImage(),
        category: getCategoryFromTags(blogService.parseTags?.(detailed.tag_list) || detailed.tags || []),
        date: detailed.timestamp,
        author: blogService.getAuthorName(detailed.author),
        readTime: detailed.read_time,
        tags: (blogService.parseTags?.(detailed.tag_list) || detailed.tags || []),
        body: detailed.body,
        likes: Array.isArray(detailed.likes) ? detailed.likes.length : (detailed.likes || 0),
        isLiked: detailed.isLiked || false
      };
      setPost(transformedPost);
    } catch (error) {
      console.error('Error loading blog post:', error);
      setError('Failed to load blog post');
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const apiComments = await blogService.getComments(postId);
      if (Array.isArray(apiComments)) {
        // Normalize to local shape
        const normalized = apiComments.map(c => ({
          id: c.id,
          author: c.owner_username || 'User',
          authorId: c.owner,
          content: c.body || c.content || '',
          timestamp: c.timestamp,
          likes: 0,
          replies: []
        }));
        setComments(normalized);
        return;
      }
      setComments([]);
    } catch (error) {
      console.error('Error loading comments:', error);
      setComments([]);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setSubmittingComment(true);
      // Try posting to server first (auth required)
      try {
        const res = await blogService.addComment(postId, newComment.trim());
        const c = res?.comment || {};
        const normalized = {
          id: c.id || Date.now(),
          author: c.owner_username || 'You',
          authorId: c.owner,
          content: c.body || newComment.trim(),
          timestamp: c.timestamp || new Date().toISOString(),
          likes: 0,
          replies: []
        };
        setComments(prev => [normalized, ...prev]);
        setNewComment('');
      } catch (serverErr) {
        // If server fails (no auth), require login
        if (!currentUser) {
          alert('Please login to comment on this blog post');
          navigate('/login');
          return;
        }
        throw serverErr;
      }
    } catch (error) {
      console.error('Error posting comment:', error);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleLikeComment = (commentId) => {
    setComments(prevComments => 
      prevComments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      )
    );
  };

  const handleReplyToComment = (commentId) => {
    // Check if user is logged in
    if (!currentUser) {
      alert('Please login to reply to comments');
      navigate('/login');
      return;
    }
    
    const replyContent = prompt('Enter your reply:');
    if (replyContent && replyContent.trim()) {
      const reply = {
        id: Date.now(),
        author: currentUser.full_name || currentUser.username || currentUser.email || 'Unknown User',
        authorId: currentUser.id,
        content: replyContent.trim(),
        timestamp: new Date().toISOString(),
        likes: 0
      };

      setComments(prevComments => 
        prevComments.map(comment => 
          comment.id === commentId 
            ? { ...comment, replies: [...comment.replies, reply] }
            : comment
        )
      );
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return 'Unknown date';
    }
  };

  const getRandomImage = () => {
    const images = [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return 'general';
    const tag = tags[0].toLowerCase();
    if (tag.includes('health') || tag.includes('wellness')) return 'health';
    if (tag.includes('product') || tag.includes('new')) return 'products';
    return 'general';
  };

  if (loading) {
    return (
      <div className="blog-post-view">
        <div className="container">
          <LoadingDots text="Loading blog post..." size="large" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-view">
        <div className="container">
          <div className="error-state">
            <h2>Error</h2>
            <p>{error || 'Blog post not found'}</p>
            <button onClick={() => navigate('/blog')} className="back-btn">
              ← Back to Blog
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-post-view">
      <div className="container">
        {/* Back Button */}
        <button onClick={() => navigate('/blog')} className="back-btn">
          ← Back to Blog
        </button>

        {/* Blog Post Content */}
        <article className="blog-post">
          <header className="post-header">
            <div className="post-meta">
              <span className="category-tag">{post.category}</span>
              <span className="date">{formatDate(post.date)}</span>
              <span className="read-time">{post.readTime}</span>
            </div>
            <h1 className="post-title">{post.title}</h1>
            <p className="post-excerpt">{post.excerpt}</p>
            <div className="author-info">
              <span className="author">By {post.author}</span>
            </div>
            <div className="post-tags">
              {post.tags.map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
            </div>
          </header>

          <div className="post-image">
            <img src={post.image} alt={post.title} />
          </div>

          <div className="post-content">
            <div className="content-body">
              {post.body ? (
                post.body.split('\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <p>Content not available</p>
              )}
            </div>
          </div>

          <footer className="post-footer">
            <LikeButton 
              blogId={post.id}
              initialLikes={post.likes}
              initialIsLiked={post.isLiked}
              size="large"
            />
            <div className="share-buttons">
              <button className="share-btn" onClick={() => navigator.share({ title: post.title, url: window.location.href })}>
                📤 Share
              </button>
            </div>
          </footer>
        </article>

        {/* Comments Section */}
        <section className="comments-section">
          <h2 className="comments-title">
            Comments ({comments.length})
          </h2>

          {/* Add Comment Form */}
          {currentUser ? (
            <form className="comment-form" onSubmit={handleSubmitComment}>
              <div className="form-group">
                <label htmlFor="comment">Add a comment:</label>
                <textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts on this article..."
                  rows="4"
                  required
                />
              </div>
              <button 
                type="submit" 
                className="submit-comment-btn"
                disabled={submittingComment}
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>
          ) : (
            <div className="login-to-comment">
              <p>Please <button 
                className="login-link-btn" 
                onClick={() => navigate('/login')}
              >
                login
              </button> to comment on this blog post.</p>
            </div>
          )}

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <div className="no-comments">
                <p>No comments yet. Be the first to share your thoughts!</p>
              </div>
            ) : (
              comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <div className="comment-author-section">
                      <div className="comment-avatar">
                        {comment.author.charAt(0).toUpperCase()}
                      </div>
                      <span className="comment-author">{comment.author}</span>
                    </div>
                    <span className="comment-date">{formatDate(comment.timestamp)}</span>
                  </div>
                  <div className="comment-content">
                    {comment.content}
                  </div>
                  <div className="comment-actions">
                    <button 
                      onClick={() => handleLikeComment(comment.id)}
                      className="like-btn"
                    >
                      👍 {comment.likes}
                    </button>
                    <button 
                      onClick={() => handleReplyToComment(comment.id)}
                      className="reply-btn"
                    >
                      💬 Reply
                    </button>
                  </div>
                  
                  {/* Replies */}
                  {comment.replies && comment.replies.length > 0 && (
                    <div className="replies">
                      {comment.replies.map(reply => (
                        <div key={reply.id} className="reply">
                          <div className="reply-header">
                            <div className="reply-author-section">
                              <div className="reply-avatar">
                                {reply.author.charAt(0).toUpperCase()}
                              </div>
                              <span className="reply-author">{reply.author}</span>
                            </div>
                            <span className="reply-date">{formatDate(reply.timestamp)}</span>
                          </div>
                          <div className="reply-content">
                            {reply.content}
                          </div>
                          <div className="reply-actions">
                            <button 
                              onClick={() => handleLikeComment(reply.id)}
                              className="like-btn"
                            >
                              👍 {reply.likes}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>

        {/* Related Posts */}
        <section className="related-posts">
          <h2>Related Articles</h2>
          <div className="related-grid">
            {/* In a real app, you'd fetch related posts based on tags/category */}
            <div className="related-post">
              <h3>More Health Tips</h3>
              <p>Discover more ways to improve your health and wellness...</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPostView;
