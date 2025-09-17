import React, { useState, useEffect } from 'react';
import { blogService } from '../services/blogService';
import { newsletterService } from '../services/newsletterService';
import LoadingDots from './LoadingDots';
import LikeButton from './LikeButton';
// Tailwind conversion: removed external CSS import

const BlogPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState({});
  const [newComments, setNewComments] = useState({});
  const [submittingComments, setSubmittingComments] = useState({});
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState(null);

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
        
        // Filter out invalid blog objects and transform API data
        const validBlogs = blogs.filter(blog => {
          if (!blog || typeof blog !== 'object') {
            console.warn('BlogPage: Invalid blog object:', blog);
            return false;
          }
          return true;
        });
        
        const transformedBlogs = validBlogs.map((blog, index) => {
          try {
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
              likes: Array.isArray(blog.likes) ? blog.likes.length : (Number(blog.likes) || 0),
              isLiked: blog.isLiked || false
            };
          } catch (transformError) {
            console.error('BlogPage: Error transforming blog:', blog, transformError);
            return null;
          }
        }).filter(blog => blog !== null); // Remove any failed transformations
        
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

  // Load comments for a specific blog post (from backend so all users see them)
  const loadCommentsForBlog = async (blogId) => {
    try {
      const apiComments = await blogService.getComments(blogId);
      const normalized = Array.isArray(apiComments)
        ? apiComments.map(c => ({
            id: c.id,
            postId: blogId,
            author: c.owner_username || 'User',
            content: c.body || c.content || '',
            timestamp: c.timestamp,
            likes: 0,
            replies: []
          }))
        : [];
      setComments(prev => ({
        ...prev,
        [blogId]: normalized
      }));
    } catch (error) {
      console.error('Error loading comments for blog:', blogId, error);
      setComments(prev => ({
        ...prev,
        [blogId]: []
      }));
    }
  };

  // Handle comment submission (post to backend so comments are shared)
  const handleSubmitComment = async (blogId, e) => {
    e.preventDefault();
    
    const commentText = newComments[blogId];
    if (!commentText || !commentText.trim()) {
      alert('Please enter a comment');
      return;
    }

    try {
      setSubmittingComments(prev => ({ ...prev, [blogId]: true }));
      
      // Post to backend
      const res = await blogService.addComment(blogId, commentText.trim());
      const c = res?.comment || {};
      const created = {
        id: c.id || Date.now(),
        postId: blogId,
        author: c.owner_username || 'You',
        content: c.body || commentText.trim(),
        timestamp: c.timestamp || new Date().toISOString(),
        likes: 0,
        replies: []
      };

      // Update local state optimistically
      setComments(prev => ({
        ...prev,
        [blogId]: [created, ...(prev[blogId] || [])]
      }));

      // Clear the input
      setNewComments(prev => ({ ...prev, [blogId]: '' }));
      
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to post comment. Please ensure you are logged in, then try again.');
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
        likes: Array.isArray(blog.likes) ? blog.likes.length : (Number(blog.likes) || 0),
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
    const q = (searchTerm || '').trim().toLowerCase();
    if (!q) return matchesCategory;
    const title = (post.title || '').toLowerCase();
    const excerpt = (post.excerpt || '').toLowerCase();
    const body = (post.body || '').toLowerCase();
    const tagHit = Array.isArray(post.tags) && post.tags.some(tag => (tag || '').toLowerCase().includes(q));
    const matchesSearch = title.includes(q) || excerpt.includes(q) || body.includes(q) || tagHit;
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

  // Newsletter subscribe handler
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setSubscribeLoading(true);
    setSubscribeMessage(null);
    try {
      const res = await newsletterService.subscribe(subscribeEmail.trim());
      setSubscribeMessage({ type: 'success', text: res?.message || 'Subscribed successfully!' });
      setSubscribeEmail('');
    } catch (err) {
      const msg = typeof err === 'string' ? err : err?.message || 'Subscription failed. Please try again later.';
      setSubscribeMessage({ type: 'error', text: msg });
    } finally {
      setSubscribeLoading(false);
      setTimeout(() => setSubscribeMessage(null), 6000);
    }
  };

  // Enhanced loading component
  const LoadingSpinner = () => (
    <div className="py-6 text-center">
      <LoadingDots text="Loading blog posts..." size="large" />
    </div>
  );

  // Enhanced error component
  const ErrorMessage = () => (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
      <p>Error loading blogs: {error}</p>
      <button onClick={() => window.location.reload()} className="mt-2 inline-flex items-center justify-center rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-50">Try Again</button>
    </div>
  );

  return (
    <div className="mt-[64px] md:mt-[72px]">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Health & Wellness Blog</h1>
          <p className="mt-1 text-gray-700">Latest updates on health, wellness, and new product arrivals</p>
          
          {/* Show loading spinner */}
          {loading && <LoadingSpinner />}
          
          {/* Show error message */}
          {error && <ErrorMessage />}
        </div>

        {/* Search and Filter - Only show when not loading and no error */}
        {!loading && !error && (
          <div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative w-full md:max-w-sm">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 pl-10 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200"
              />
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
                  <line x1="16.65" y1="16.65" x2="21" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`rounded-full border px-3 py-1.5 text-sm ${selectedCategory === category.id ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'}`}
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
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <div className="relative overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
              <img className="h-56 w-full object-cover" src={filteredPosts[0].image} alt={filteredPosts[0].title} />
              <div className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                {getCategoryFromTags(filteredPosts[0].tags)}
              </div>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900">{filteredPosts[0].title}</h2>
              <p className="mt-2 text-gray-700">{filteredPosts[0].excerpt}</p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                <span>By {filteredPosts[0].author}</span>
                <span>•</span>
                <span>{formatDate(filteredPosts[0].date)}</span>
                <span>•</span>
                <span>{filteredPosts[0].readTime}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {filteredPosts[0].tags.slice(0, 5).map((tag, index) => (
                  <span key={index} className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">{tag}</span>
                ))}
              </div>
              <div className="mt-3">
                <h4 className="text-sm font-semibold text-gray-900">Preview:</h4>
                <p className="text-gray-700">{filteredPosts[0].body ? filteredPosts[0].body.substring(0, 200) + '...' : 'Content preview not available'}</p>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button 
                  className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
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
          </div>
        )}

        {/* Comments on list are hidden on Blog list view to show only after Read More */}

        {/* Blog Grid - Only show when not loading and no error */}
        {!loading && !error && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.slice(1).map(post => (
            <article key={post.id} className="overflow-hidden rounded-xl border border-emerald-100 bg-white shadow-sm">
              <div className="relative">
                <img className="h-44 w-full object-cover" src={post.image} alt={post.title} />
                <div className="absolute left-3 top-3 rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                  {getCategoryFromTags(post.tags)}
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
                <p className="mt-1 text-gray-700">{post.excerpt}</p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                  <span>By {post.author}</span>
                  <span>•</span>
                  <span>{formatDate(post.date)}</span>
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs text-emerald-800">{tag}</span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{post.readTime}</span>
                </div>
                <div className="mt-2 text-gray-700">
                  <p>{post.body ? post.body.substring(0, 150) + '...' : 'Preview not available'}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <button 
                    className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-600"
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

              {/* Comments hidden on list cards; available on full post page */}
            </article>
            ))}
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-12 rounded-xl border border-emerald-100 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubscribe} className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Stay Updated</h3>
              <p className="text-gray-700">Get the latest health tips and product updates delivered to your inbox</p>
            </div>
            <div className="flex w-full gap-2 sm:w-auto">
              <input 
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-200" 
                type="email" 
                placeholder="Enter your email address" 
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                required
              />
              <button 
                className="inline-flex items-center justify-center rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600 disabled:opacity-60" 
                type="submit"
                disabled={subscribeLoading}
              >
                {subscribeLoading ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
          </form>
          {subscribeMessage && (
            <div className={`mt-3 rounded-md px-3 py-2 text-sm ${subscribeMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' : 'bg-red-50 text-red-800 border border-red-100'}`}>
              {subscribeMessage.text}
          </div>
          )}
        </div>

        {/* No Results - Only show when not loading and no error */}
        {!loading && !error && filteredPosts.length === 0 && (
          <div className="mt-10 rounded-lg border border-emerald-100 bg-white p-6 text-center text-gray-700">
            <h3 className="text-lg font-semibold text-gray-900">No articles found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
