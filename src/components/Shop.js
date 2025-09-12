import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import LazyLoad from 'react-lazyload';
import { HiPlus, HiEye } from 'react-icons/hi2';
import QuickViewModal from './QuickViewModal';

const Shop = ({ bestSellers, onQuickView, onProductView, onSearch }) => {
  const { addToCart } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const [cartNotification, setCartNotification] = useState({ show: false, productName: '' });
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  // Complete product catalog with 12 items
  const allProducts = [
    {
      id: 1,
      name: "Premium Organic Green Tea Collection",
      price: "2,499",
      originalPrice: "3,499",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea Blends",
      subCategory: "Green Tea",
      description: "Hand-picked organic green tea leaves from high-altitude gardens. Rich in antioxidants.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 2,
      name: "Himalayan Herbal Wellness Mix",
      price: "1,850",
      originalPrice: "2,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Herbs & Spices",
      subCategory: "Medicinal Herbs",
      description: "Ancient Himalayan blend of 12 powerful herbs. Boosts immunity and reduces stress.",
      benefits: ["Immune Boosting", "Stress and Anxiety"],
      sale: true,
      rating: 4.9,
      inStock: true
    },
    {
      id: 3,
      name: "Pure Turmeric Capsules",
      price: "1,299",
      originalPrice: "1,799",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Extracts",
      subCategory: "Capsules",
      description: "High-potency turmeric capsules with curcumin for anti-inflammatory support.",
      benefits: ["Blood cleansers", "Immune Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    {
      id: 4,
      name: "Organic Ashwagandha Powder",
      price: "1,650",
      originalPrice: "2,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Supplements",
      subCategory: "Herbal",
      description: "Premium ashwagandha root powder for stress relief and energy enhancement.",
      benefits: ["Stress and Anxiety", "Energy Boosting"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 5,
      name: "Digestive Enzyme Complex",
      price: "2,100",
      originalPrice: "2,800",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753871838/capsules_twqx2t.webp",
      category: "Supplements",
      subCategory: "Enzymes",
      description: "Complete digestive enzyme formula for optimal gut health and nutrient absorption.",
      benefits: ["Digestive Disorder"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 6,
      name: "Lavender Essential Oil",
      price: "1,200",
      originalPrice: "1,600",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Extracts",
      subCategory: "Essential Oils",
      description: "Pure lavender essential oil for relaxation and aromatherapy.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.9,
      inStock: true
    },
    {
      id: 7,
      name: "Organic Chia Seeds",
      price: "890",
      originalPrice: "1,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Nuts & Seeds",
      subCategory: "Seeds",
      description: "Premium organic chia seeds packed with omega-3 fatty acids and fiber.",
      benefits: ["Energy Boosting", "Digestive Disorder"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    {
      id: 8,
      name: "Vitamin D3 + K2 Complex",
      price: "1,750",
      originalPrice: "2,300",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753871838/capsules_twqx2t.webp",
      category: "Supplements",
      subCategory: "Vitamins",
      description: "High-potency vitamin D3 with K2 for bone health and immune support.",
      benefits: ["Immune Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    {
      id: 9,
      name: "Organic Coconut Oil",
      price: "950",
      originalPrice: "1,300",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Fats & Oils",
      subCategory: "Coconut Oil",
      description: "Cold-pressed virgin coconut oil for cooking and skincare.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 10,
      name: "Echinacea Tincture",
      price: "1,400",
      originalPrice: "1,900",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Extracts",
      subCategory: "Tinctures",
      description: "Potent echinacea tincture for immune system support and cold prevention.",
      benefits: ["Immune Boosting"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 11,
      name: "Probiotics 50 Billion CFU",
      price: "2,200",
      originalPrice: "2,900",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753871838/capsules_twqx2t.webp",
      category: "Supplements",
      subCategory: "Probiotics",
      description: "Advanced probiotic formula with 50 billion CFU for gut health.",
      benefits: ["Digestive Disorder", "Immune Boosting"],
      sale: true,
      rating: 4.9,
      inStock: true
    },
    {
      id: 12,
      name: "Wellness Starter Kit",
      price: "4,500",
      originalPrice: "6,000",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Kits & Bundles",
      subCategory: "Starter kits",
      description: "Complete wellness kit with essential supplements and herbal products.",
      benefits: ["Immune Boosting", "Energy Boosting", "Digestive Disorder"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    // Additional Tea Blends
    {
      id: 13,
      name: "Chamomile Herbal Tea",
      price: "1,200",
      originalPrice: "1,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea Blends",
      subCategory: "Herbal Tea",
      description: "Calming chamomile tea for relaxation and better sleep.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 14,
      name: "Ginger Lemon Tea Blend",
      price: "1,350",
      originalPrice: "1,800",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea Blends",
      subCategory: "Herbal Tea",
      description: "Warming ginger and lemon tea for digestion and immunity.",
      benefits: ["Digestive Disorder", "Immune Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    // Additional Herbs & Spices
    {
      id: 15,
      name: "Organic Ginger Root Powder",
      price: "850",
      originalPrice: "1,100",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Herbs & Spices",
      subCategory: "Spices",
      description: "Pure ginger root powder for cooking and medicinal use.",
      benefits: ["Digestive Disorder", "Immune Boosting"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    {
      id: 16,
      name: "Cinnamon Bark Powder",
      price: "950",
      originalPrice: "1,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Herbs & Spices",
      subCategory: "Spices",
      description: "Ceylon cinnamon bark powder for blood sugar support.",
      benefits: ["Blood cleansers", "Energy Boosting"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    // Additional Nuts & Seeds
    {
      id: 17,
      name: "Organic Flax Seeds",
      price: "750",
      originalPrice: "950",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Nuts & Seeds",
      subCategory: "Seeds",
      description: "Golden flax seeds rich in omega-3 and fiber.",
      benefits: ["Digestive Disorder", "Energy Boosting"],
      sale: true,
      rating: 4.4,
      inStock: true
    },
    {
      id: 18,
      name: "Organic Pumpkin Seeds",
      price: "1,100",
      originalPrice: "1,400",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Nuts & Seeds",
      subCategory: "Seeds",
      description: "Raw pumpkin seeds packed with zinc and magnesium.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    // Additional Fats & Oils
    {
      id: 19,
      name: "Cold-Pressed Olive Oil",
      price: "1,800",
      originalPrice: "2,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Fats & Oils",
      subCategory: "Olive Oil",
      description: "Extra virgin cold-pressed olive oil for cooking and health.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    {
      id: 20,
      name: "MCT Oil Blend",
      price: "2,200",
      originalPrice: "2,800",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Fats & Oils",
      subCategory: "Coconut Oil",
      description: "Medium-chain triglyceride oil for ketogenic diet and energy.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    // Additional Kits & Bundles
    {
      id: 21,
      name: "Immune Support Bundle",
      price: "3,800",
      originalPrice: "5,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Kits & Bundles",
      subCategory: "Wellness Bundles",
      description: "Complete immune support package with vitamin C, zinc, and echinacea.",
      benefits: ["Immune Boosting"],
      sale: true,
      rating: 4.9,
      inStock: true
    },
    {
      id: 22,
      name: "Digestive Health Kit",
      price: "3,200",
      originalPrice: "4,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Kits & Bundles",
      subCategory: "Wellness Bundles",
      description: "Comprehensive digestive health support with probiotics and enzymes.",
      benefits: ["Digestive Disorder"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    // Bath and Body products
    {
      id: 23,
      name: "Organic Body Lotion",
      price: "1,500",
      originalPrice: "2,000",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Bath and Body",
      subCategory: "Body Care",
      description: "Natural body lotion with shea butter and essential oils.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    {
      id: 24,
      name: "Herbal Bath Salts",
      price: "950",
      originalPrice: "1,300",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Bath and Body",
      subCategory: "Bath Products",
      description: "Relaxing bath salts with lavender and eucalyptus.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 25,
      name: "Natural Soap Collection",
      price: "1,200",
      originalPrice: "1,600",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Bath and Body",
      subCategory: "Body Care",
      description: "Set of 3 natural soaps with different essential oils.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.4,
      inStock: true
    },
    // Books and Education
    {
      id: 26,
      name: "Herbal Medicine Guide",
      price: "2,500",
      originalPrice: "3,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Books and Education",
      subCategory: "Health Books",
      description: "Comprehensive guide to herbal medicine and natural remedies.",
      benefits: ["Immune Boosting", "Stress and Anxiety"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 27,
      name: "Natural Wellness Course",
      price: "4,800",
      originalPrice: "6,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Books and Education",
      subCategory: "Online Courses",
      description: "Online course covering natural health and wellness practices.",
      benefits: ["Immune Boosting", "Energy Boosting", "Stress and Anxiety"],
      sale: true,
      rating: 4.9,
      inStock: true
    },
    {
      id: 28,
      name: "Essential Oils Handbook",
      price: "1,800",
      originalPrice: "2,400",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Books and Education",
      subCategory: "Health Books",
      description: "Complete guide to using essential oils for health and wellness.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    // Additional Herbs & Spices
    {
      id: 29,
      name: "Holy Basil (Tulsi) Leaves",
      price: "1,150",
      originalPrice: "1,450",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Herbs & Spices",
      subCategory: "Medicinal Herbs",
      description: "Sacred tulsi leaves for stress relief and respiratory health.",
      benefits: ["Stress and Anxiety", "Immune Boosting"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    {
      id: 30,
      name: "Organic Oregano",
      price: "750",
      originalPrice: "1,000",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Herbs & Spices",
      subCategory: "Culinary Herbs",
      description: "Premium oregano for culinary use and natural antibiotic properties.",
      benefits: ["Immune Boosting"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    // Additional Extracts
    {
      id: 31,
      name: "Milk Thistle Extract",
      price: "1,850",
      originalPrice: "2,400",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753871838/capsules_twqx2t.webp",
      category: "Extracts",
      subCategory: "Capsules",
      description: "Standardized milk thistle extract for liver detoxification support.",
      benefits: ["Blood cleansers"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 32,
      name: "Ginkgo Biloba Extract Powder",
      price: "2,200",
      originalPrice: "2,800",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Extracts",
      subCategory: "Powder",
      description: "High-quality ginkgo biloba powder for cognitive support and circulation.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.4,
      inStock: true
    },
    // Additional Supplements
    {
      id: 33,
      name: "Magnesium Glycinate Complex",
      price: "1,950",
      originalPrice: "2,500",
      image: "https://res.cloudinary.com/dqvsjtkqw/image/upload/v1753871838/capsules_twqx2t.webp",
      category: "Supplements",
      subCategory: "Minerals",
      description: "Highly bioavailable magnesium for muscle and nerve function.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 34,
      name: "L-Glutamine Powder",
      price: "2,400",
      originalPrice: "3,000",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Supplements",
      subCategory: "Amino Acids",
      description: "Pure L-glutamine for gut health and muscle recovery.",
      benefits: ["Digestive Disorder", "Energy Boosting"],
      sale: true,
      rating: 4.3,
      inStock: true
    },
    // Additional Tea Blends
    {
      id: 35,
      name: "Earl Grey Black Tea",
      price: "1,450",
      originalPrice: "1,850",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea Blends",
      subCategory: "Black Tea",
      description: "Premium Earl Grey with bergamot oil for a classic tea experience.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    {
      id: 36,
      name: "White Peony Tea",
      price: "2,800",
      originalPrice: "3,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Tea Blends",
      subCategory: "White Tea",
      description: "Delicate white tea with subtle sweetness and high antioxidants.",
      benefits: ["Immune Boosting"],
      sale: true,
      rating: 4.9,
      inStock: true
    },
    // Additional Nuts & Seeds
    {
      id: 37,
      name: "Raw Almonds",
      price: "1,350",
      originalPrice: "1,650",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Nuts & Seeds",
      subCategory: "Nuts",
      description: "Premium raw almonds rich in healthy fats and protein.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.4,
      inStock: true
    },
    {
      id: 38,
      name: "Organic Goji Berries",
      price: "1,850",
      originalPrice: "2,300",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Nuts & Seeds",
      subCategory: "Dried Fruits",
      description: "Nutrient-dense goji berries packed with vitamins and antioxidants.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    // Additional Fats & Oils
    {
      id: 39,
      name: "Avocado Oil",
      price: "2,100",
      originalPrice: "2,700",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Fats & Oils",
      subCategory: "Olive Oil",
      description: "Cold-pressed avocado oil with high smoke point for cooking.",
      benefits: ["Energy Boosting"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    {
      id: 40,
      name: "Rosemary Essential Oil",
      price: "1,450",
      originalPrice: "1,900",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Fats & Oils",
      subCategory: "Essential Oils",
      description: "Pure rosemary essential oil for mental clarity and hair care.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    // Additional Kits & Bundles
    {
      id: 41,
      name: "Detox Recipe Pack",
      price: "2,800",
      originalPrice: "3,600",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Kits & Bundles",
      subCategory: "Recipe packs",
      description: "Complete detox recipe collection with herbs and instructions.",
      benefits: ["Blood cleansers", "Digestive Disorder"],
      sale: true,
      rating: 4.6,
      inStock: true
    },
    {
      id: 42,
      name: "Holiday Wellness Gift Set",
      price: "5,200",
      originalPrice: "6,800",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Kits & Bundles",
      subCategory: "Seasonal/Holiday Gift Sets",
      description: "Festive wellness package with teas, herbs, and bath products.",
      benefits: ["Immune Boosting", "Stress and Anxiety"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    // Additional Bath and Body
    {
      id: 43,
      name: "Anti-Aging Face Serum",
      price: "2,400",
      originalPrice: "3,100",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753302948/high-angle-lemon-ginger-slices-cutting-board_sox2gh.jpg",
      category: "Bath and Body",
      subCategory: "Skincare",
      description: "Natural face serum with botanical extracts for youthful skin.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.7,
      inStock: true
    },
    {
      id: 44,
      name: "Eucalyptus Shower Steamers",
      price: "1,100",
      originalPrice: "1,500",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753303006/turmeric-powder_kpfh3p.jpg",
      category: "Bath and Body",
      subCategory: "Bath Products",
      description: "Aromatherapy shower steamers for a spa-like experience.",
      benefits: ["Stress and Anxiety"],
      sale: true,
      rating: 4.5,
      inStock: true
    },
    // Additional Books and Education
    {
      id: 45,
      name: "Ayurveda Complete Guide",
      price: "3,200",
      originalPrice: "4,200",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Books and Education",
      subCategory: "Guides & Manuals",
      description: "Comprehensive Ayurvedic medicine and lifestyle guide.",
      benefits: ["Immune Boosting", "Digestive Disorder", "Stress and Anxiety"],
      sale: true,
      rating: 4.8,
      inStock: true
    },
    {
      id: 46,
      name: "Nutrition Certification Course",
      price: "8,500",
      originalPrice: "12,000",
      image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
      category: "Books and Education",
      subCategory: "Online Courses",
      description: "Professional nutrition certification with herbal medicine focus.",
      benefits: ["Immune Boosting", "Energy Boosting"],
      sale: true,
      rating: 4.9,
      inStock: true
    }
  ];

  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [selectedBenefit, setSelectedBenefit] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [showSubCategories, setShowSubCategories] = useState(false);

  // Handle URL search parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const urlSearchTerm = searchParams.get('search');
    const urlCategory = searchParams.get('category');
    const urlSubCategory = searchParams.get('subcategory');
    
    if (urlSearchTerm) {
      setSearchTerm(urlSearchTerm);
    }
    
    if (urlCategory) {
      setSelectedCategory(urlCategory);
      setShowSubCategories(true);
    }
    
    if (urlSubCategory) {
      const formattedSubCategory = urlSubCategory.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
      setSelectedSubCategory(formattedSubCategory);
    }
  }, [location.search]);

  const categories = [
    { name: 'All Categories', value: 'all' },
    { name: 'Herbs & Spices', value: 'herbs-spices' },
    { name: 'Extracts', value: 'extracts' },
    { name: 'Supplements', value: 'supplements' },
    { name: 'Tea Blends', value: 'tea-blends' },
    { name: 'Nuts & Seeds', value: 'nuts-seeds' },
    { name: 'Fats & Oils', value: 'fats-oils' },
    { name: 'Kits & Bundles', value: 'kits-bundles' },
    { name: 'Bath and Body', value: 'bath-body' },
    { name: 'Books and Education', value: 'books-education' }
  ];

  const subCategories = {
    'herbs-spices': [
      'All Herbs & Spices',
      'Medicinal Herbs',
      'Culinary Herbs',
      'Spices'
    ],
    'extracts': [
      'All Extracts',
      'Tinctures',
      'Essential Oils',
      'Capsules',
      'Powder'
    ],
    'supplements': [
      'All Supplements',
      'Vitamins',
      'Minerals',
      'Herbal',
      'Probiotics',
      'Amino Acids',
      'Enzymes'
    ],
    'tea-blends': [
      'All Tea Blends',
      'Green Tea',
      'Herbal Tea',
      'Black Tea',
      'White Tea'
    ],
    'nuts-seeds': [
      'All Nuts & Seeds',
      'Seeds',
      'Nuts',
      'Dried Fruits'
    ],
    'fats-oils': [
      'All Fats & Oils',
      'Coconut Oil',
      'Olive Oil',
      'Essential Oils'
    ],
    'kits-bundles': [
      'All Kits & Bundles',
      'Wellness Bundles',
      'Recipe packs',
      'Seasonal/Holiday Gift Sets',
      'Starter kits'
    ],
    'bath-body': [
      'All Bath and Body',
      'Body Care',
      'Bath Products',
      'Skincare'
    ],
    'books-education': [
      'All Books and Education',
      'Health Books',
      'Online Courses',
      'Guides & Manuals'
    ]
  };

  const benefits = [
    { name: 'All Benefits', value: 'all' },
    { name: 'Immune Boosting', value: 'immune-boosting' },
    { name: 'Digestive Disorder', value: 'digestive-disorder' },
    { name: 'Blood cleansers', value: 'blood-cleansers' },
    { name: 'Stress and Anxiety', value: 'stress-anxiety' },
    { name: 'Energy Boosting', value: 'energy-boosting' }
  ];

  const priceRanges = [
    { label: 'All Prices', value: 'all', min: 0, max: Infinity },
    { label: 'Under KSH 1,500', value: 'under-1500', min: 0, max: 1500 },
    { label: 'KSH 1,500 - 2,000', value: '1500-2000', min: 1500, max: 2000 },
    { label: 'KSH 2,000 - 2,500', value: '2000-2500', min: 2000, max: 2500 },
    { label: 'Over KSH 2,500', value: 'over-2500', min: 2500, max: Infinity }
  ];

 useEffect(() => {
  let filtered = allProducts;

  // Filter by category
  if (selectedCategory !== 'all') {
    filtered = filtered.filter(product => 
      product.category.toLowerCase().replace('&', '').replace(/\s+/g, '-') === selectedCategory.toLowerCase() ||
      product.category.toLowerCase().includes(selectedCategory.toLowerCase().replace('-', ' '))
    );
  }

  // Filter by subcategory
  if (selectedSubCategory !== 'all' && !selectedSubCategory.startsWith('All ')) {
    filtered = filtered.filter(product => 
      product.subCategory && product.subCategory.toLowerCase() === selectedSubCategory.toLowerCase()
    );
  }

  // Filter by benefits
  if (selectedBenefit !== 'all') {
    const benefitSearch = selectedBenefit.toLowerCase().replace('-', ' ');
    filtered = filtered.filter(product => 
      product.benefits && product.benefits.some(benefit => 
        benefit.toLowerCase().includes(benefitSearch)
      )
    );
  }

  // Filter by search term
  if (searchTerm) {
    filtered = filtered.filter(product => {
      const searchLower = searchTerm.toLowerCase();
      return (
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower)) ||
        (product.subCategory && product.subCategory.toLowerCase().includes(searchLower)) ||
        (product.benefits && product.benefits.some(benefit => 
          benefit.toLowerCase().includes(searchLower)
        ))
      );
    });
  }

  // Filter by price range
  if (priceRange !== 'all') {
    const range = priceRanges.find(r => r.value === priceRange);
    if (range) {
      filtered = filtered.filter(product => {
        const price = parseFloat(product.price.replace(',', ''));
        return price >= range.min && price <= range.max;
      });
    }
  }

  // Sort products
  filtered.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price.replace(',', '')) - parseFloat(b.price.replace(',', ''));
      case 'price-high':
        return parseFloat(b.price.replace(',', '')) - parseFloat(a.price.replace(',', ''));
      case 'rating':
        return (b.rating || 4.0) - (a.rating || 4.0);
      case 'popularity':
        return (b.sold || Math.floor(Math.random() * 100)) - (a.sold || Math.floor(Math.random() * 100));
      case 'newest':
        return new Date(b.dateAdded || new Date()) - new Date(a.dateAdded || new Date());
      case 'name':
        return a.name.localeCompare(b.name);
      case 'default':
      default:
        return (b.featured || Math.random()) - (a.featured || Math.random());
    }
  });

  setFilteredProducts(filtered);
  setCurrentPage(1);
}, [selectedCategory, selectedSubCategory, selectedBenefit, priceRange, sortBy, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const goToPage = (page) => {
    const next = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setSelectedCategory(value);
    setSelectedSubCategory('all');
    setSelectedBenefit('all');
    setShowSubCategories(value !== 'all');
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubCategory('all');
    setSelectedBenefit('all');
    setPriceRange('all');
    setSearchTerm('');
    setSortBy('default');
    setShowSubCategories(false);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    setCartNotification({ show: true, productName: product.name });
    setTimeout(() => {
      setCartNotification({ show: false, productName: '' });
    }, 3000);
  };

  const handleQuickView = (product) => {
    console.log('Opening quick view for:', product.name);
    setQuickViewProduct(product);
    setShowQuickView(true);
    console.log('Modal state:', { product: product.name, show: true });
  };

  const handleProductView = (product) => {
    navigate(`/product/${product.id}`);
  };

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gems of Insight Shop</h1>
          <p className="text-gray-600 mt-1">Premium Herbs, Extracts & Supplements for Holistic Wellness</p>
        </div>

        {/* Best Sellers Section */}
        {bestSellers && bestSellers.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Best Selling Products</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {bestSellers.slice(0, 4).map((product) => (
                <div key={product.id} className="group rounded-md border border-gray-100 shadow-sm overflow-hidden bg-white">
                  <div className="relative">
                    <img src={product.image} alt={product.name} className="h-40 w-full object-cover" />
                    <div className="absolute left-2 top-2 inline-flex items-center rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">⭐ Best Seller</div>
                    <div className="absolute bottom-2 right-2 flex gap-2">
                      <button 
                        className="inline-flex items-center justify-center rounded-full bg-white/90 text-gray-800 w-8 h-8 shadow hover:bg-white"
                        onClick={() => handleQuickView(product)}
                        title="Quick View"
                      >
                        👁️
                      </button>
                      <button 
                        className="inline-flex items-center justify-center rounded-full bg-white/90 text-gray-800 w-8 h-8 shadow hover:bg-white"
                        onClick={() => handleProductView(product)}
                        title="View Details"
                      >
                        📋
                      </button>
                      <button 
                        className="inline-flex items-center justify-center rounded-full bg-emerald-600 text-white w-9 h-9 shadow hover:bg-emerald-700"
                        onClick={() => handleAddToCart(product)}
                        title="Add to Cart"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 font-semibold text-sm text-gray-900">{product.name}</h3>
                    <p className="text-base font-semibold text-gray-900 mt-1">KSH {product.price}</p>
                    <p className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 mt-1">{product.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Desktop layout: sidebar + content */}
        <div className="grid gap-6 md:grid-cols-12">
          <aside className="md:col-span-3">
            <div className="mt-4 rounded-md border border-gray-100 bg-white p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
              <ul className="mt-2 space-y-1">
                {categories.map((category) => (
                  <li key={category.value}>
                    <button
                      className={`w-full text-left rounded-md px-2 py-1 text-sm ${selectedCategory === category.value ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'}`}
                      onClick={() => {
                        setSelectedCategory(category.value);
                        setSelectedSubCategory('all');
                        setShowSubCategories(category.value !== 'all');
                      }}
                    >
                      {category.name}
                    </button>
                  </li>
                ))}
              </ul>

              {showSubCategories && (
                <ul className="mt-2 space-y-1">
                  {subCategories[selectedCategory]?.map((subCat) => (
                    <li key={subCat}>
                      <button
                        className={`w-full text-left rounded-md px-2 py-1 text-sm ${selectedSubCategory === subCat ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-gray-50'}`}
                        onClick={() => setSelectedSubCategory(subCat)}
                      >
                        {subCat}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="mt-4">
              <button onClick={resetFilters} className="w-full inline-flex items-center justify-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">Clear Filters</button>
            </div>
          </aside>

          <div className="md:col-span-9">
        <div className="rounded-md border border-gray-100 bg-white p-4 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search herbs, supplements, or health benefits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button 
                className={`inline-flex items-center justify-center rounded-md border px-2 py-1 ${viewMode === 'grid' ? 'border-emerald-600 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setViewMode('grid')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </button>
              <button 
                className={`inline-flex items-center justify-center rounded-md border px-2 py-1 ${viewMode === 'list' ? 'border-emerald-600 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'}`}
                onClick={() => setViewMode('list')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="3" y="6" width="18" height="2"/>
                  <rect x="3" y="10" width="18" height="2"/>
                  <rect x="3" y="14" width="18" height="2"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <select 
                value={selectedCategory} 
                onChange={handleCategoryChange}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.name}
                  </option>
                ))}
              </select>

              {showSubCategories && (
                <select
                  value={selectedSubCategory}
                  onChange={(e) => setSelectedSubCategory(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
                >
                  <option value="all">All {categories.find(c => c.value === selectedCategory)?.name}</option>
                  {subCategories[selectedCategory]?.map((subCat) => (
                    <option key={subCat} value={subCat}>
                      {subCat}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <select 
              value={priceRange} 
              onChange={(e) => setPriceRange(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
            >
              {priceRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            <select 
              value={selectedBenefit} 
              onChange={(e) => setSelectedBenefit(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
            >
              {benefits.map((benefit) => (
                <option key={benefit.value} value={benefit.value}>
                  {benefit.name}
                </option>
              ))}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-200 outline-none"
            >
              <option value="default">Default (Featured)</option>
              <option value="popularity">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Alphabetical</option>
            </select>

            <div className="ml-auto text-sm text-gray-700">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
            
            <button onClick={resetFilters} className="inline-flex items-center rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50">Clear Filters</button>
          </div>
        </div>
        <div className={`mt-4 ${viewMode === 'grid' ? 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-3'}`}>
          {paginatedProducts.map(product => (
            <div key={product.id} className={`${viewMode === 'grid' ? 'group rounded-md border border-gray-100 shadow-sm overflow-hidden bg-white' : 'flex items-center gap-3 rounded-md border border-gray-100 bg-white p-3 shadow-sm'}`}>
              {product.sale && <span className="absolute m-2 inline-flex items-center justify-center rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-semibold text-white">Sale!</span>}
              
              <div className={`${viewMode === 'grid' ? 'relative' : 'relative w-32 flex-shrink-0'}`}>
                <LazyLoad height={150} offset={100} placeholder={<div className="h-32 bg-gray-100"/>}>
                  <img src={product.image} alt={product.name} className={`${viewMode === 'grid' ? 'h-40 w-full' : 'h-24 w-32'} object-cover`} />
                </LazyLoad>
                <button 
                  className="absolute right-2 top-2 inline-flex items-center justify-center rounded-full bg-white/90 text-gray-800 w-8 h-8 shadow hover:bg-white"
                  title="Quick view"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickView(product); }}
                >
                  <HiEye />
                </button>
                {/* Removed floating add-to-cart icon to avoid duplication; keep main Add to Cart button below */}
              </div>

              <div className={`${viewMode === 'grid' ? 'p-3' : 'flex-1'}`}>
                <div className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">{product.category}</div>
                <h3 className={`${viewMode === 'grid' ? 'mt-2' : ''} line-clamp-2 font-semibold text-sm text-gray-900`}>{product.name}</h3>

                <div className="mt-1 flex items-center gap-2">
                  {product.originalPrice && (
                    <span className="text-xs text-gray-400 line-through">KES {product.originalPrice}</span>
                  )}
                  <span className="text-base font-semibold text-gray-900">KES {product.price}</span>
                </div>
                <button className="mt-2 inline-flex items-center justify-center rounded-md bg-emerald-700 text-white px-3 py-1.5 text-sm font-medium shadow hover:bg-emerald-600" onClick={() => handleAddToCart(product)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === 1} onClick={() => goToPage(1)}>First</button>
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === 1} onClick={() => goToPage(currentPage - 1)}>Prev</button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }).slice(Math.max(0, currentPage - 2), Math.min(totalPages, currentPage + 1)).map((_, idx) => {
                const pageNumber = Math.max(1, currentPage - 1) + idx;
                if (pageNumber > totalPages) return null;
                return (
                  <button
                    key={pageNumber}
                    className={`rounded-md border px-3 py-1.5 text-sm ${currentPage === pageNumber ? 'border-emerald-600 text-emerald-700' : 'border-gray-300 hover:bg-gray-50'}`}
                    onClick={() => goToPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => goToPage(currentPage + 1)}>Next</button>
            <button className="rounded-md border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50 disabled:opacity-50" disabled={currentPage === totalPages} onClick={() => goToPage(totalPages)}>Last</button>
          </div>
        )}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="my-10 text-center">
            <div className="mb-2 text-3xl">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
            <p className="text-gray-600">Try adjusting your filters or search terms</p>
            <button className="mt-3 inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50" onClick={resetFilters}>Reset All Filters</button>
          </div>
        )}

        {/* Cart Notification */}
        {cartNotification.show && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <div className="rounded-md bg-emerald-600 text-white px-4 py-2 shadow">
              <span>✅ {cartNotification.productName} added to cart!</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={showQuickView}
        onClose={() => {
          setShowQuickView(false);
          setQuickViewProduct(null);
        }}
        onViewFullDetails={(product) => {
          setShowQuickView(false);
          setQuickViewProduct(null);
          handleProductView(product);
        }}
      />
    </section>
  );
};

export default Shop;