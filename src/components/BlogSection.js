import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../services/blogService';
import LoadingDots from './LoadingDots';
import LikeButton from './LikeButton';
import './BlogSection.css';

const BlogSection = () => {
  const navigate = useNavigate();
  const [blogPosts, setBlogPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    fetchLatestBlogs();
  }, []);

  const fetchLatestBlogs = async () => {
    try {
      setLoading(true);
      
      const blogs = await blogService.getAllBlogs();
      
      // Ensure blogs is an array
      if (!Array.isArray(blogs)) {
        throw new Error('Invalid blogs data received');
      }
      
      // Transform and get latest 3 blogs
      const transformedBlogs = blogs
        .slice(0, 3)
        .map(blog => ({
          id: blog.id || Math.random().toString(36),
          title: blog.title || 'Untitled Post',
          excerpt: blog.description || 'No description available',
          image: blog.photo || getRandomImage(),
          date: blogService.formatTimestamp(blog.timestamp),
          author: blogService.getAuthorName(blog.author),
          category: getCategoryFromTags(blog.tags || []),
          readTime: blog.read_time || '5 min read',
          likes: blog.likes || 0,
          isLiked: blog.isLiked || false
        }));
      
      setBlogPosts(transformedBlogs);
    } catch (error) {
      console.error('Error fetching latest blogs:', error);
      // Fallback to default posts if API fails
      setBlogPosts([
        {
          id: 1,
          title: "10 Benefits of Organic Turmeric for Daily Wellness",
          excerpt: "Discover how incorporating organic turmeric into your daily routine can boost immunity, reduce inflammation, and improve overall health.",
          image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
          date: "January 15, 2025",
          author: "Dr. Sarah Williams",
          category: "Natural Remedies",
          readTime: "5 min read"
        },
        {
          id: 2,
          title: "The Power of Mindful Eating",
          excerpt: "Learn how mindful eating practices can transform your relationship with food and improve digestion.",
          image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
          date: "January 20, 2025",
          author: "Nutritionist Jane Doe",
          category: "Nutrition",
          readTime: "7 min read"
        },
        {
          id: 3,
          title: "Natural Stress Relief Techniques",
          excerpt: "Explore natural methods to manage stress and promote mental wellness in your daily life.",
          image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
          date: "January 25, 2025",
          author: "Dr. Michael Chen",
          category: "Mental Health",
          readTime: "6 min read"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getRandomImage = () => {
    const images = [
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
      "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg"
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  const getCategoryFromTags = (tags) => {
    if (!tags || tags.length === 0) return 'Health & Wellness';
    
    const categoryMap = {
      'nutrition': 'Nutrition',
      'health': 'Health & Wellness',
      'god': 'Spiritual Health',
      'exercise': 'Fitness',
      'water': 'Hydration',
      'sunshine': 'Natural Living'
    };
    
    for (let tag of tags) {
      const category = categoryMap[tag.toLowerCase()];
      if (category) return category;
    }
    
    return 'Health & Wellness';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const handleReadMore = (postId) => {
    navigate(`/blog`);
  };

  return (
    <motion.section 
      ref={ref}
      className="blog-section"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="container">
        <motion.div className="section-header" variants={itemVariants}>
          <h2>Latest Updates</h2>
          <p>Fresh insights on natural health, wellness tips, and product news</p>
        </motion.div>

        {loading ? (
          <div className="blog-loading">
            <LoadingDots text="Loading latest posts..." size="medium" />
          </div>
        ) : (
          <motion.div className="blog-grid" variants={containerVariants}>
            {blogPosts.map((post) => (
            <motion.article 
              key={post.id} 
              className="blog-card"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="blog-image">
                <img src={post.image} alt={post.title} />
                <div className="blog-category">{post.category}</div>
              </div>

              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-separator">•</span>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>

                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>

                <div className="blog-footer">
                  <div className="blog-author">
                    <span>By {post.author}</span>
                  </div>
                  <div className="blog-actions">
                    <button 
                      className="read-more-btn"
                      onClick={() => handleReadMore(post.id)}
                    >
                      Read More
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <LikeButton 
                      blogId={post.id}
                      initialLikes={post.likes}
                      initialIsLiked={post.isLiked}
                      size="small"
                    />
                  </div>
                </div>
              </div>
            </motion.article>
            ))}
          </motion.div>
        )}

        <motion.div className="blog-cta" variants={itemVariants}>
          <button 
            className="view-all-blog-btn"
            onClick={() => navigate('/blog')}
          >
            View All Blog Posts
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BlogSection;
