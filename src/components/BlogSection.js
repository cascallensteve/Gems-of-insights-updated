import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { blogService } from '../services/blogService';
import LoadingDots from './LoadingDots';
import LikeButton from './LikeButton';

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
      console.log('BlogSection: Received blogs:', blogs);
      
      // Ensure blogs is an array
      if (!Array.isArray(blogs)) {
        console.error('BlogSection: Invalid blogs data received:', blogs);
        throw new Error('Invalid blogs data received');
      }
      
      // Filter out any invalid blog objects and transform
      const validBlogs = blogs.filter(blog => {
        if (!blog || typeof blog !== 'object') {
          console.warn('BlogSection: Invalid blog object:', blog);
          return false;
        }
        return true;
      });
      
      // Transform and get latest 3 blogs
      const transformedBlogs = validBlogs
        .slice(0, 3)
        .map(blog => {
          try {
            return {
              id: blog.id || Math.random().toString(36),
              title: blog.title || 'Untitled Post',
              excerpt: blog.description || 'No description available',
              image: blog.photo || getRandomImage(),
              date: blogService.formatTimestamp(blog.timestamp),
              author: blogService.getAuthorName(blog.author),
              category: getCategoryFromTags(blog.tags || []),
              readTime: blog.read_time || '5 min read',
              likes: Array.isArray(blog.likes) ? blog.likes.length : (Number(blog.likes) || 0),
              isLiked: blog.isLiked || false
            };
          } catch (transformError) {
            console.error('BlogSection: Error transforming blog:', blog, transformError);
            return null;
          }
        })
        .filter(blog => blog !== null); // Remove any failed transformations
      
      console.log('BlogSection: Transformed blogs:', transformedBlogs);
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
      className="py-12 bg-white"
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="max-w-7xl mx-auto px-4">
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <h2 className="text-2xl font-bold text-gray-900">Latest Updates</h2>
          <p className="text-gray-600 mt-1">Fresh insights on natural health, wellness tips, and product news</p>
        </motion.div>

        {loading ? (
          <div className="text-center">
            <LoadingDots text="Loading latest posts..." size="medium" />
          </div>
        ) : (
          <motion.div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" variants={containerVariants}>
            {blogPosts.map((post) => (
            <motion.article 
              key={post.id} 
              className="group rounded-md border border-gray-100 shadow-sm overflow-hidden bg-white"
              variants={itemVariants}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img src={post.image} alt={post.title} className="h-44 w-full object-cover" />
                <div className="absolute left-2 top-2 inline-flex items-center rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-800">{post.category}</div>
              </div>

              <div className="p-3">
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>

                <h3 className="mt-1 font-semibold text-gray-900 line-clamp-2">{post.title}</h3>
                <p className="mt-1 text-sm text-gray-700 line-clamp-3">{post.excerpt}</p>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-xs text-gray-600">By {post.author}</div>
                  <div className="flex items-center gap-2">
                    <button 
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
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

        <motion.div className="mt-8 text-center" variants={itemVariants}>
          <button 
            className="inline-flex items-center rounded-md bg-emerald-700 text-white px-6 py-3 text-sm font-semibold shadow hover:bg-emerald-600"
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
