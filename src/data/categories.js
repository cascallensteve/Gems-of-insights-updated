export const naturalRemedyCategories = [
  {
    id: 1,
    name: "Herbal Remedies",
    icon: "🌿",
    description: "Use of plant parts for healing properties",
    examples: ["Ginger", "Turmeric", "Echinacea", "Ginseng", "Aloe Vera"],
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
    benefits: ["Natural healing", "Minimal side effects", "Traditional wisdom", "Holistic approach"]
  },
  {
    id: 2,
    name: "Nutritional & Dietary Remedies",
    icon: "🍎",
    description: "Healing through food and nutrients",
    examples: ["Omega-3 fatty acids", "Vitamin C", "Apple cider vinegar", "Garlic", "Probiotics"],
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
    benefits: ["Nutritional support", "Immune boosting", "Natural vitamins", "Digestive health"]
  },
  {
    id: 3,
    name: "Essential Oils & Aromatherapy",
    icon: "🌼",
    description: "Use of plant-derived oils for inhalation or topical use",
    examples: ["Lavender oil", "Peppermint oil", "Tea tree oil", "Eucalyptus oil"],
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
    benefits: ["Stress relief", "Mental clarity", "Skin care", "Mood enhancement"]
  },
  {
    id: 4,
    name: "Home Remedies",
    icon: "🌞",
    description: "Traditional household ingredients used for healing",
    examples: ["Honey", "Lemon", "Baking soda", "Saltwater", "Coconut oil"],
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
    benefits: ["Accessible", "Cost-effective", "Time-tested", "Safe for families"]
  },
  {
    id: 5,
    name: "Traditional Medicine Systems",
    icon: "🌱",
    description: "Holistic and cultural healing systems",
    examples: [
      "Ayurveda (India) – Ashwagandha, Triphala",
      "Traditional Chinese Medicine (TCM) – Ginseng, Ginkgo biloba",
      "African Traditional Medicine – Moringa, Neem",
      "Native American Herbalism – Yarrow, Sage"
    ],
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
    benefits: ["Ancient wisdom", "Holistic healing", "Cultural heritage", "Proven traditions"]
  },
  {
    id: 6,
    name: "Mind-Body Remedies",
    icon: "🧘",
    description: "Focus on healing through mental and emotional balance",
    examples: ["Meditation", "Yoga", "Deep breathing", "Guided imagery", "Music therapy"],
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753346939/young-woman-with-curly-hair-sitting-cafe_pbym6j.jpg",
    benefits: ["Mental wellness", "Stress reduction", "Emotional balance", "Mind-body connection"]
  },
  {
    id: 7,
    name: "Mineral and Clay Therapies",
    icon: "🧂",
    description: "Use of earth-based minerals for detox and skin care",
    examples: ["Bentonite clay", "Epsom salts", "Dead Sea salt", "Charcoal"],
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1748982986/basket-full-vegetables_mp02db.jpg",
    benefits: ["Detoxification", "Skin purification", "Mineral supplementation", "Natural cleansing"]
  },
  {
    id: 8,
    name: "Physical Therapies (Natural)",
    icon: "🔥",
    description: "Non-invasive techniques to aid the body",
    examples: ["Hydrotherapy", "Acupressure", "Massage therapy", "Cupping", "Reflexology"],
    image: "https://res.cloudinary.com/djksfayfu/image/upload/v1753347468/colorful-fruits-tasty-fresh-ripe-juicy-white-desk_jalaan.jpg",
    benefits: ["Pain relief", "Improved circulation", "Natural healing", "Non-invasive treatment"]
  }
];

export const getCategoryById = (id) => {
  return naturalRemedyCategories.find(category => category.id === id);
};

export const getCategoriesByIds = (ids) => {
  return naturalRemedyCategories.filter(category => ids.includes(category.id));
};
