import { HealthResource, HealthArticle, QuizQuestion, ConsultationPackage, Testimonial } from '@/types/health';

export const DOCTOR_INFO = {
  name: "Dr. Arif Chowdhury",
  title: "PH.D, M.S. Clinical Nutrition, Lifestyle Medicine",
  role: "Health Tutor, Cardiometabolic Physician & Holistic Longevity Coach",
  tagline: "Empowering you to reverse chronic disease, optimize cellular metabolism, and live a vibrant life through science-backed functional medicine.",
  yearsExperience: "15+",
  patientsTransformed: "50,000+",
  booksPublished: "8",
  rating: "4.95",
  ratingCount: "12,480",
  bio: `Dr. Arif Chowdhury is a globally recognized physician, educator, and lifestyle medicine pioneer. After over 15 years in clinical practice witnessing the escalating epidemic of preventable metabolic disorders, Dr. Chowdhury transitioned from conventional symptom-masking approaches to root-cause functional medicine. 
  
  He combines cutting-edge biomarker analysis, clinical nutritional therapeutics, and evidence-based lifestyle biohacking to help people achieve effortless energy, optimal cardiovascular health, and extended biological youth. Through his digital masterclasses, books, and consultation programs, Dr. Chowdhury mentors individuals across 42 countries.`,
  certifications: [
    "MBBS - Distinguished Clinical Honors",
    "Master of Science (M.S.) in Clinical Human Nutrition",
    "Board Certified Lifestyle Medicine Physician (IBLM)",
    "Fellow, American College of Nutrition (FACN)",
    "Certified Functional Medicine Practitioner (IFMCP)"
  ],
  clinicLocation: "Zelovita Medical & Longevity Institute",
  hours: "Monday – Saturday: 9:00 AM – 7:00 PM (EST)",
  email: "dr.arif@zelovita.health",
  phone: "+1 (800) 555-ARIF",
  socials: {
    youtube: "https://youtube.com/@fitnessguruji-v2h?si=gCC3cyIDcEbgxTcE",
    instagram: "https://www.instagram.com/drarif25/",
    facebook: "https://www.facebook.com/arif.chowdhury.587",
    linkedin: "https://www.linkedin.com/in/dr-arif-chowdhury-3b7a05aa/",
    podcast: "The Vitality Blueprint with Dr. Arif"
  }
};

export const HEALTH_RESOURCES: HealthResource[] = [
  {
    id: "clinical-nutrition-gut",
    title: "Clinical Nutrition & Gut Mastery",
    subtitle: "The Complete Science-Based Protocol to Repair the Microbiome, Eliminate Bloating, and Fuel Cellular Energy",
    category: "nutrition",
    isFree: false,
    price: 29.99,
    originalPrice: 59.99,
    rating: 4.96,
    reviewCount: 1840,
    pages: 184,
    readingTime: "4.5 hours",
    coverImage: "/images/book_nutrition.jpg",
    badge: "Bestseller ★★★★★",
    badgeColor: "emerald",
    description: "An exhaustive clinical guide translating over 400 clinical trials into an actionable step-by-step nutritional framework. Learn which precise prebiotic fibers, polyphenols, and macronutrient timing heal leaky gut, re-balance digestive enzymes, and maximize nutrient bioavailability.",
    highlights: [
      "The 4R Gut Healing Protocol (Remove, Replace, Reinoculate, Repair)",
      "Food Matrix: Top 50 Anti-Inflammatory & Microbiome-Supercharging Foods",
      "Comprehensive 30-Day Anti-Bloat & Leaky Gut Meal Plan",
      "Supplement Guide: Dosages, Active Forms, and Hidden Fillers to Avoid",
      "Printable Grocery Checklist & Dining Out Survival Guide"
    ],
    tableOfContents: [
      "Chapter 1: The Enteric Nervous System & The Gut-Brain Axis",
      "Chapter 2: Microbiome Diversity: The True Engine of Human Immunity",
      "Chapter 3: Leaky Gut, Zonulin, and Systemic Low-Grade Inflammation",
      "Chapter 4: The 4R Elimination & Reintroduction Clinical Protocol",
      "Chapter 5: Macronutrient Synergy: Fats, Proteins & Fiber Ratios",
      "Chapter 6: Micronutrient Deficiencies & Targeted Supplementation",
      "Chapter 7: 30-Day Meal Blueprints with 45 Quick Healing Recipes",
      "Appendix: Laboratory Blood & Stool Biomarker Reference Chart"
    ],
    fullContent: {
      introduction: "Welcome to Clinical Nutrition & Gut Mastery. 70% of your immune system resides along the lining of your gastrointestinal tract. When this mucosal barrier breaks down, systemic inflammation accelerates, draining your energy, clouding cognitive focus, and driving metabolic resistance. In this comprehensive guide, we repair that foundational engine.",
      chapters: [
        {
          title: "Chapter 1: The Enteric Nervous System & The Gut-Brain Axis",
          content: "Your gut contains over 500 million neurons and produces more than 90% of your body's serotonin. The bidirectional communication between the central nervous system and the enteric nervous system via the vagus nerve means chronic mental stress directly halts digestive enzyme secretion, slows peristalsis, and alters microbial composition. To heal digestion, we must first modulate parasympathetic nervous system tone before meals.",
          keyTakeaways: [
            "Practice 5 minutes of box breathing (4s in, 4s hold, 4s out, 4s hold) before the first bite.",
            "Chew each mouthful 20-30 times to release salivary amylase and lingual lipase.",
            "Avoid eating on the go or while responding to stressful work emails."
          ],
          doctorTip: "Dr. Arif's Rule: Never consume a heavy meal in a state of fight-or-flight. If hurried, opt for bone broth or easily digestible blended smoothies."
        },
        {
          title: "Chapter 2: Microbiome Diversity: The True Engine of Human Immunity",
          content: "A healthy human gut hosts between 300 to 1,000 distinct bacterial species. High microbial alpha-diversity is the single strongest correlate with longevity, insulin sensitivity, and lean muscle mass. By feeding these organisms distinct prebiotic fibers (resistant starch, fructooligosaccharides, inulin, and polyphenols), they ferment these into short-chain fatty acids (SCFAs) like butyrate, acetate, and propionate.",
          keyTakeaways: [
            "Aim for 30+ distinct plant species per week (herbs, seeds, legumes, roots, berries).",
            "Butyrate serves as the primary metabolic fuel source for colonocytes (gut wall cells).",
            "Incorporate wild blueberries, pomegranate, and green tea for polyphenol diversity."
          ],
          doctorTip: "Try counting 'plant points': 1 point for every unique leafy green, seed, spice, or vegetable consumed during the week. Aim for 30+ points."
        },
        {
          title: "Chapter 3: The 4R Elimination & Reintroduction Clinical Protocol",
          content: "Phase 1: REMOVE refined sugars, oxidized seed oils (canola, corn, soybean), alcohol, and individual intolerances. Phase 2: REPLACE hydrochloric acid and digestive enzymes with organic apple cider vinegar or betaine HCl. Phase 3: REINOCULATE with spore-based probiotics and fermented foods (kimchi, kefir, sauerkraut). Phase 4: REPAIR the endothelial tight junctions with L-Glutamine, Zinc Carnosine, and hydrolyzed collagen peptides.",
          keyTakeaways: [
            "L-Glutamine at 5g twice daily rapidly rebuilds intestinal mucosal integrity.",
            "Zinc Carnosine (75mg/day) stimulates enterocyte migration and healing.",
            "Slowly reintroduce fermented foods starting with 1 teaspoon per day."
          ],
          doctorTip: "If you experience immediate bloating from fermented foods, pause probiotics and evaluate for SIBO (Small Intestinal Bacterial Overgrowth) first."
        }
      ],
      conclusion: "Sustained gut health is not an overnight cure, but a biological cultivation. By following the 4R protocol and maintaining dietary diversity, your microbiome will regenerate, powering vibrant health for decades to come.",
      protocolSummary: [
        "Drink 500ml warm water with lemon upon waking",
        "Take 5g L-Glutamine in warm water 30 mins before breakfast",
        "Hit 35g+ fiber from whole real food sources daily",
        "Fast for 12-14 hours overnight to allow the Migrating Motor Complex (MMC) to clean the small intestine",
        "Avoid NSAIDs and unnecessary antibiotic usage"
      ]
    }
  },
  {
    id: "longevity-blueprint",
    title: "The Longevity Blueprint",
    subtitle: "A Revolutionary Clinical Guide to Optimizing Cellular Health, Mitochondria & Extending Healthspan",
    category: "longevity",
    isFree: false,
    price: 34.99,
    originalPrice: 69.99,
    rating: 4.98,
    reviewCount: 2150,
    pages: 210,
    readingTime: "5.2 hours",
    coverImage: "/images/book_longevity.jpg",
    badge: "Masterclass Edition",
    badgeColor: "indigo",
    description: "The definitive scientific manual on biohacking your biological age. Dr. Arif breaks down the 12 Hallmarks of Aging, NAD+ restoration, mitochondrial biogenesis, mTOR vs AMPK cycling, and epigenetic clock reversal.",
    highlights: [
      "The 12 Hallmarks of Aging and How to Target Each One",
      "Mitochondrial Optimization: PGC-1α Activation & Cold/Heat Stress",
      "NAD+ Precursor Therapeutics (NMN, NR) & Sirtuin Activation",
      "Zone 2 Cardiovascular Protocols & VO2 Max Longevity Targets",
      "Comprehensive Biomarker Blood Panel Checklist (ApoB, hs-CRP, IGF-1, HbA1c)"
    ],
    tableOfContents: [
      "Chapter 1: Lifespan vs Healthspan: The Shift from Sick Care to Longevity",
      "Chapter 2: The Energy Powerhouse: Mitochondrial Biogenesis",
      "Chapter 3: The AMPK / mTOR Biological Switch",
      "Chapter 4: NAD+, Sirtuins, and Cellular DNA Repair Mechanisms",
      "Chapter 5: Hormesis: Thermal Stress (Sauna & Cryotherapy) Protocols",
      "Chapter 6: Exercise as Medicine: Zone 2 Training & Grip Strength",
      "Chapter 7: Epigenetic Reversal: Sleep Architecture & Melatonin Rhythms",
      "Chapter 8: The Clinical Longevity Supplement Stack"
    ],
    fullContent: {
      introduction: "Longevity is no longer science fiction. By understanding cellular senolysis, telomeric attrition, and metabolic flexibility, we can actively prevent chronic degenerative illnesses. Your chronological age is fixed on your birth certificate; your biological age is negotiable.",
      chapters: [
        {
          title: "Chapter 1: The Energy Powerhouse: Mitochondrial Biogenesis",
          content: "Every cell in your body depends on adenosine triphosphate (ATP) generated by mitochondria. As we age, mitochondrial DNA accumulates oxidative damage, leading to cellular fatigue, metabolic inflexibility, and chronic fatigue syndrome. By triggering PGC-1alpha through specific exercise and dietary interventions, we stimulate the creation of brand-new, resilient mitochondria.",
          keyTakeaways: [
            "Engage in 150-180 minutes of Zone 2 aerobic training per week to multiply mitochondrial density.",
            "Consume Urolithin A precursors (pomegranate ellagitannins) to trigger mitophagy (clearing broken mitochondria).",
            "Maintain optimal CoQ10 (Ubiquinol) levels, especially if taking statins."
          ],
          doctorTip: "Zone 2 training is a pace where you can still speak full sentences without gasping, but cannot sing. It forces your muscle fibers to burn fat as fuel."
        },
        {
          title: "Chapter 2: Thermal Hormesis: The 80°C Finnish Sauna Protocol",
          content: "Heat shock proteins (HSPs) are molecular chaperones that refold denatured proteins and clear toxic amyloid plaques. Regular Finnish sauna bathing (19-20 minutes at 80-90°C, 4-7 times per week) reduces all-cause mortality by 40% and lowers cardiovascular event risk by over 50%.",
          keyTakeaways: [
            "Sauna: 20 minutes at 80°C followed by a 2-minute cool rinse, 3 to 4 times weekly.",
            "Cold immersion (10-15°C for 2-3 minutes) boosts norepinephrine by 300% and converts white adipose tissue into metabolically active brown fat.",
            "Stay thoroughly hydrated with electrolyte minerals (sodium, potassium, magnesium)."
          ],
          doctorTip: "Always complete heat exposure at least 2 hours before bed so your core body temperature has sufficient time to drop for deep stage 4 sleep."
        }
      ],
      conclusion: "True longevity is about vitality, sharp cognition, physical autonomy, and joy into your 80s, 90s, and beyond.",
      protocolSummary: [
        "180 minutes Zone 2 cardio weekly + 2 heavy resistance sessions",
        "Heat exposure 3-4x weekly (Sauna at 80°C)",
        "Optimize sleep timing: 10 PM to 6 AM consistent window",
        "Biomarker testing every 6 months: ApoB, Homocysteine, Fasting Insulin, hs-CRP"
      ]
    }
  },
  {
    id: "7-day-metabolic-reset",
    title: "7-Day Metabolic Reset & Anti-Inflammatory Guide",
    subtitle: "Activate Your Metabolism, Flush Retained Water, Boost Natural Energy, and Stabilize Blood Sugar",
    category: "detox",
    isFree: true,
    price: 0,
    originalPrice: 24.99,
    rating: 4.94,
    reviewCount: 4320,
    pages: 64,
    readingTime: "1.5 hours",
    coverImage: "/images/book_detox.jpg",
    badge: "100% FREE GUIDE 🎁",
    badgeColor: "emerald",
    description: "A completely free, doctor-designed 7-day nutritional kickstart. Designed to eliminate systemic puffiness, calm digestive inflammation, reset your palate away from refined sugar cravings, and ignite metabolic flexibility.",
    highlights: [
      "Day-by-Day Meal Plans with Simple 15-Minute Home Recipes",
      "Morning Elixir Recipes for Liver & Gallbladder Support",
      "Anti-Inflammatory Spice Matrix (Turmeric, Ginger, Ceylon Cinnamon)",
      "Daily Hydration & Electrolyte Balancing Routine",
      "Immediate Digital PDF Download + In-App Interactive Reader"
    ],
    tableOfContents: [
      "Introduction: Why Detoxification is a Daily Cellular Process",
      "Phase 1 (Days 1-2): The Inflammation Flush & Hydration Foundation",
      "Phase 2 (Days 3-5): Deep Cellular Nourishment & Insulin Sensitivity",
      "Phase 3 (Days 6-7): Metabolic Stabilization & Re-Integration",
      "Bonus: 10 Dr. Arif Signature Smoothies & Restorative Teas",
      "Printable Shopping List & Food Prep Timetable"
    ],
    fullContent: {
      introduction: "Welcome to your 7-Day Metabolic Reset! You don't need dangerous crash fasts or expensive synthetic cleanses. Your liver, kidneys, lymphatic system, and colon are extraordinarily efficient detoxification organs — they simply require the right biochemical cofactors, minerals, and a brief reprieve from inflammatory ultra-processed foods.",
      chapters: [
        {
          title: "Day 1-2: The Inflammation Flush & Liver Phase I & II Support",
          content: "Your liver processes toxins in two distinct phases: Phase I (Cytochrome P450 oxidation) converts lipid-soluble toxins into intermediate metabolites, which are often more reactive than the original compound. Phase II (Glutathione, sulfation, and glucuronidation) neutralizes them for safe excretion. To support this pathway, we flood the system with cruciferous sulforaphane, glycine, and sulfur-rich alliums.",
          keyTakeaways: [
            "Start your morning with 400ml warm water, half fresh squeezed lemon, and a pinch of unrefined Himalayan sea salt.",
            "Eat 2 cups of steamed broccoli, Brussels sprouts, or arugula daily for sulforaphane.",
            "Cut out all artificial sweeteners, seed oils, and processed flours entirely."
          ],
          doctorTip: "Chew broccoli sprouts thoroughly to maximize myrosinase enzyme activity, which yields 50x more potent sulforaphane than mature broccoli."
        },
        {
          title: "Day 3-5: Insulin Sensitivity & Blood Sugar Flattening",
          content: "Erratic blood sugar spikes and crashes cause lethargy, brain fog, and chronic cravings. During Days 3 through 5, we prioritize the 'PFF Formula': Protein, Fiber, and Healthy Fats at every single meal. By preventing glucose excursions above 140 mg/dL, your pancreas rests and insulin levels drop, unlocking stubborn visceral fat stores for energy.",
          keyTakeaways: [
            "Consume 30-40g of clean protein per main meal.",
            "Eat your veggies and salad FIRST before complex carbs to slow glucose absorption by 35%.",
            "Take a 10-minute leisurely walk immediately after your largest meal of the day."
          ],
          doctorTip: "A simple 10-minute post-meal stroll recruits GLUT-4 glucose transporters into muscle cells independently of insulin!"
        }
      ],
      conclusion: "Congratulations on taking control of your health! By completing this 7-day reset, you have laid the groundwork for lifelong metabolic resilience.",
      protocolSummary: [
        "Morning lemon & electrolyte elixir",
        "PFF (Protein, Fiber, Fat) meal structure",
        "10-minute post-meal walks",
        "No snacking between meals — let digestive enzymes work",
        "Cease eating 3 hours before sleep"
      ]
    }
  },
  {
    id: "intermittent-fasting-autophagy",
    title: "Intermittent Fasting & Autophagy",
    subtitle: "A Scientific Guide to Harnessing Fasting for Longevity, Cellular Regeneration & Effortless Weight Balance",
    category: "fasting",
    isFree: true,
    price: 0,
    originalPrice: 29.99,
    rating: 4.97,
    reviewCount: 3890,
    pages: 78,
    readingTime: "2 hours",
    coverImage: "/images/book_fasting.jpg",
    badge: "100% FREE GUIDE 🎁",
    badgeColor: "amber",
    description: "Discover the Nobel Prize-winning science of autophagy. Dr. Arif guides you through custom fasting schedules (16:8, 14:10, 20:4, and OMAD), how to break a fast properly without GI distress, and fasting protocols tailored for men vs. women.",
    highlights: [
      "The Autophagy Timeline: What Happens at Hour 12, 16, 24, and 36",
      "Circadian-Aligned Fasting (Early Time-Restricted Feeding)",
      "Fasting for Women: Hormone Balancing & Luteal Phase Modifications",
      "What Breaks a Fast? Coffee, Tea, Sweeteners & Supplements Analyzed",
      "Step-by-Step Fast-Breaking Recipes for Maximum Nutrient Absorption"
    ],
    tableOfContents: [
      "Chapter 1: The Evolutionary Science of Food Scarcity & Human Physiology",
      "Chapter 2: Autophagy & Cellular Housekeeping: The 2016 Nobel Discovery",
      "Chapter 3: Choosing Your Fasting Protocol: 16:8 vs 14:10 vs 24-Hour Reset",
      "Chapter 4: Electrolytes, Hunger Waves & The Ghrelin Adaptation",
      "Chapter 5: Fasting for Female Biology: Protecting Progesterone & Thyroid",
      "Chapter 6: The Golden Rule: How to Break a Fast Cleanly",
      "Action Protocol: The 14-Day Fasting Adaptation Blueprint"
    ],
    fullContent: {
      introduction: "Our ancestors never had access to 24-hour convenience stores or constant grazing. Human genes evolved to thrive in cycles of feast and famine. When you give your digestive tract a purposeful rest, your cells initiate profound self-cleansing mechanisms that reduce systemic inflammation and sharpen mental clarity.",
      chapters: [
        {
          title: "Chapter 1: The Autophagy Timeline & Cellular Recycling",
          content: "Autophagy (literally 'self-eating') is your cells' built-in quality control system. Damaged mitochondria, misfolded proteins, and intracellular pathogens are encapsulated in autophagosomes and fused with lysosomes for recycling into fresh amino acids. This process ramps up significantly after 14 to 16 hours of continuous fasting as intracellular mTOR is down-regulated and AMPK is activated.",
          keyTakeaways: [
            "12 Hours: Glycogen stores deplete; ketogenesis begins.",
            "14-16 Hours: Autophagy increases by 50-80%; insulin levels reach baseline.",
            "18-24 Hours: Peak cellular rejuvenation and BDNF (Brain-Derived Neurotrophic Factor) release.",
            "Hydration with sodium and potassium prevents 'keto flu' and fasting headaches."
          ],
          doctorTip: "If you feel hungry at hour 14, remember that ghrelin (hunger hormone) pulses in waves and usually subsides within 20 minutes. Drink 300ml of warm green tea or black coffee."
        },
        {
          title: "Chapter 2: Female Fasting Protocol & Hormone Synchronization",
          content: "Women are biologically more sensitive to nutrient deprivation. In the luteal phase (the 7 to 10 days leading up to menstruation), progesterone production requires adequate carbohydrate availability and reduced stress signaling. Prolonged fasting during this week can elevate cortisol and disrupt menstrual regularity.",
          keyTakeaways: [
            "Follicular Phase (Days 1-14): Great tolerance for 16:8 fasting and high-intensity exercise.",
            "Luteal Phase (Days 15-28): Shift to a gentler 12:12 or 14:10 fasting window.",
            "Incorporate complex starchy tubers (sweet potatoes, squash) during the pre-menstrual week."
          ],
          doctorTip: "Listen to your body. Fasting is a hormetic tool, not a punishment. Never fast through intense dizziness or heart palpitations."
        }
      ],
      conclusion: "Intermittent fasting is one of the most cost-effective, clinically validated tools to reclaim metabolic freedom and promote longevity.",
      protocolSummary: [
        "Start with 14:10 for 5 days, then progress to 16:8",
        "Hydrate with 2.5L water + electrolytes during fasting window",
        "Break fast with bone broth, eggs, avocado — avoid heavy carbs first",
        "Fast 3 hours before bed to maximize growth hormone release during sleep"
      ]
    }
  },
  {
    id: "cardiovascular-vitality",
    title: "Cardiovascular Vitality & Blood Pressure Reset",
    subtitle: "A Complete Clinical Guide to Endothelial Health, Lipid Optimization, Plaque Reversal & Natural Arterial Elasticity",
    category: "heart",
    isFree: false,
    price: 32.50,
    originalPrice: 65.00,
    rating: 4.99,
    reviewCount: 1620,
    pages: 195,
    readingTime: "4.8 hours",
    coverImage: "/images/book_heart.jpg",
    badge: "Doctor's Choice",
    badgeColor: "rose",
    description: "Cardiovascular disease remains the world's leading killer — yet 90% of it is preventable through lifestyle and targeted nutritional medicine. Dr. Arif demystifies cholesterol, advanced lipid testing (ApoB, Lp(a), CAC score), nitric oxide synthesis, and blood pressure regulation.",
    highlights: [
      "The Truth About Cholesterol: Why Total LDL is an Incomplete Metric",
      "ApoB vs ApoA-1: The Golden Standard in Atherosclerosis Risk Assessment",
      "Nitric Oxide Boosting Protocols: Beetroot, Citrulline & Sunlight Exposure",
      "Natural Blood Pressure Reduction: The Potassium-to-Sodium Balance",
      "Arterial De-Calcification Matrix (Vitamin K2 MK-7 + D3 + Magnesium)"
    ],
    tableOfContents: [
      "Chapter 1: The Endothelium: The Single Cell Layer That Protects Your Life",
      "Chapter 2: Rethinking Heart Disease: Glycation, Oxidation & Endothelial Injury",
      "Chapter 3: The Complete Cardiac Lab Blueprint: What to Ask Your Physician",
      "Chapter 4: Nitric Oxide: The Master Vasodilator & How to Supercharge It",
      "Chapter 5: Dietary Cardiology: Mediterranean vs Ketogenic vs Plant-Rich",
      "Chapter 6: Reversing Arterial Stiffness: K2, Magnesium Glycinate & Omega-3",
      "Chapter 7: The Heart Rate Variability (HRV) & Vagal Tone Masterclass",
      "Action Protocol: 60-Day Cardiovascular Rejuvenation Roadmap"
    ],
    fullContent: {
      introduction: "Your cardiovascular system comprises over 60,000 miles of blood vessels. When the endothelium (the delicate inner lining) is healthy, it continuously produces nitric oxide, keeping blood pressure low, inhibiting clotting, and preventing plaque deposition. In this master guide, we rebuild your cardiovascular vitality from the inside out.",
      chapters: [
        {
          title: "Chapter 1: The Endothelium & Nitric Oxide Production",
          content: "Nitric oxide (NO) is a gas that signals smooth muscle cells around arteries to relax, allowing unobstructed blood flow. After age 40, your body's natural eNOS (endothelial nitric oxide synthase) production declines by up to 50%. We restore this pathway through dietary nitrate-rich leafy greens, fermented beets, and oral microbiome preservation.",
          keyTakeaways: [
            "Never use antiseptic antibacterial mouthwashes — they destroy the oral bacteria that convert nitrate into nitrite!",
            "Eat 1 cup of arugula or cooked beetroots daily for dietary nitrates.",
            "L-Citrulline (3-6g daily) increases plasma L-Arginine and NO more effectively than direct L-Arginine."
          ],
          doctorTip: "Getting 15 minutes of natural morning sunlight on your skin triggers systemic nitric oxide mobilization from subcutaneous stores, naturally lowering systolic BP by 5-8 mmHg."
        },
        {
          title: "Chapter 2: Potassium-Sodium Balance for Blood Pressure",
          content: "The typical modern diet has a 4:1 ratio of sodium to potassium. Ancestrally, humans consumed a 1:4 ratio — quadruple the potassium! Potassium is the direct physiological antagonist to sodium inside vascular smooth muscle cells, triggering sodium excretion via kidneys and lowering arterial tension.",
          keyTakeaways: [
            "Target 4,000mg to 4,700mg of dietary potassium daily (avocados, coconut water, spinach, salmon).",
            "Switch to unrefined sea salt rich in trace trace minerals.",
            "Supplement with Magnesium Glycinate or Taurate (300-400mg) before bed for vascular relaxation."
          ],
          doctorTip: "One medium avocado contains nearly 1,000mg of bioavailable potassium, making it a true cardiac superfood."
        }
      ],
      conclusion: "Heart disease does not happen overnight, and neither does cardiovascular regeneration. Consistent daily nutritional actions yield resilient, elastic arteries for life.",
      protocolSummary: [
        "Aim for 4,500mg dietary potassium daily",
        "Take high-potency Omega-3 (2g combined EPA/DHA with high EPA)",
        "Combine Vitamin D3 (5000 IU) with Vitamin K2 MK-7 (100-200 mcg)",
        "Walk 8,000 to 10,000 steps daily to stimulate laminar shear stress in arteries"
      ]
    }
  }
];

export const DISCOUNT_COUPONS = [
  {
    code: "HEALTH20",
    discountPercent: 20,
    description: "20% off all premium health guides & masterclasses"
  },
  {
    code: "ARIF50",
    discountPercent: 50,
    description: "50% Special New Student Welcome Discount"
  },
  {
    code: "WELLNESS10",
    discountAmount: 10,
    description: "$10 Instant Cart Discount"
  },
  {
    code: "DRARIF",
    discountPercent: 25,
    description: "25% VIP Patient Referral Discount"
  }
];

export const HEALTH_ARTICLES: HealthArticle[] = [
  {
    id: "gut-microbiome-immunity",
    title: "The Gut Microbiome: The True Commander of Your Immune System",
    summary: "Discover why 70% of your immune defenses live in your digestive lining and how dysbiosis drives autoimmune triggers and chronic fatigue.",
    category: "Nutrition & Gut",
    readTime: "7 min read",
    author: "Dr. Arif Chowdhury",
    publishedDate: "October 2026",
    image: "/images/book_nutrition.jpg",
    keyPoints: [
      "Secretory IgA (sIgA) acts as the first line of defense against pathogens.",
      "Short Chain Fatty Acids (SCFAs) signal regulatory T-cells to prevent autoimmune flareups.",
      "Consuming 30+ plant varieties weekly reduces inflammatory cytokine markers by 42%."
    ],
    content: `The gastrointestinal tract is your largest interface with the external world. Every single bite of food you consume contains billions of molecules that your immune system must either tolerate or neutralize. 

When your intestinal epithelial wall becomes hyper-permeable ('leaky gut'), un-digested food macromolecules and bacterial endotoxins (Lipopolysaccharides or LPS) leak into the portal bloodstream. This triggers a perpetual systemic alarm state known as metabolic endotoxemia.

To reverse this, we prioritize:
1. Eliminating high-heat oxidized seed oils and ultra-processed emulsifiers (carboxymethylcellulose, polysorbate 80).
2. Supplying the fuel colonocytes crave: Butyrate through resistant starch (cooled boiled potatoes, green bananas) and fermented prebiotic fibers.
3. Taking targeted mucilaginous herbs: Slippery Elm, Marshmallow Root, and DGL Licorice.`
  },
  {
    id: "circadian-sleep-optimization",
    title: "Circadian Medicine: How to Reset Your Sleep Architecture in 7 Days",
    summary: "Why melatonin is much more than a sleep hormone — it's the master antioxidant inside your mitochondria. How to optimize light timing for deep Stage 4 recovery.",
    category: "Longevity & Biohacking",
    readTime: "6 min read",
    author: "Dr. Arif Chowdhury",
    publishedDate: "September 2026",
    image: "/images/book_longevity.jpg",
    keyPoints: [
      "View 10-15 minutes of natural sunlight within 30 minutes of waking.",
      "Block 450nm blue spectrum light after sunset to prevent melatonin suppression.",
      "Keep bedroom temperature between 18°C - 19°C (64°F - 67°F) to facilitate core cooling."
    ],
    content: `Your body runs on a master molecular clock located in the suprachiasmatic nucleus (SCN) of the hypothalamus, synchronized by photon exposure hitting melanopsin-containing retinal ganglion cells.

When you view bright blue-spectrum light from smartphones and LED screens at 10 PM, your brain interprets this as midday noon sunlight, delaying melatonin release by up to 3 hours. 

Follow this 3-step circadian routine:
1. **Morning Lux Surge**: Step outside without sunglasses for 10 minutes upon waking.
2. **Evening Sunset Anchor**: Watch the late afternoon sun to signal the transition to night.
3. **Darkness Protocol**: Keep lighting warm (amber/red) and eliminate all ambient standby LEDs in your bedroom.`
  },
  {
    id: "insulin-resistance-root-cause",
    title: "The Silent Epidemic: Reversing Insulin Resistance Before It Becomes Diabetes",
    summary: "Insulin resistance begins in the liver and muscles up to 15 years before blood sugar tests show elevated numbers. Learn the exact tests you need.",
    category: "Metabolic Health",
    readTime: "9 min read",
    author: "Dr. Arif Chowdhury",
    publishedDate: "August 2026",
    image: "/images/book_detox.jpg",
    keyPoints: [
      "Fasting insulin should ideally be below 6.0 uIU/mL (not the standard range cutoff of 25).",
      "The Triglyceride to HDL ratio is an exceptional proxy for insulin sensitivity (aim for < 1.5).",
      "Post-meal skeletal muscle contractions act as an insulin-independent glucose sink."
    ],
    content: `Most people are told their blood sugar is 'fine' because their fasting glucose is 95 mg/dL. However, your pancreas might be pumping out four times the normal amount of insulin just to keep that glucose number normal.

Over time, hyperinsulinemia promotes visceral fat storage around organs, increases systemic blood pressure via renal sodium retention, and impairs nitric oxide synthesis.

Dr. Arif's 3-Pillar Reversal Blueprint:
- **Pillar 1: Time-Restricted Eating**: Give your pancreas an overnight 14-16 hour rest.
- **Pillar 2: Resistance Training**: Building lean skeletal muscle increases your body's glucose storage capacity (glycogen reservoir).
- **Pillar 3: Chromium & Berberine**: Natural AMPK activators that enhance cellular insulin receptor sensitivity.`
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "What is your primary health and wellness objective right now?",
    subtitle: "Select the most urgent goal you want to achieve over the next 90 days.",
    options: [
      {
        text: "Heal digestion, eliminate bloating & repair my gut",
        icon: "Leaf",
        points: { category: "nutrition", score: 25 }
      },
      {
        text: "Boost daily energy, reverse biological age & optimize longevity",
        icon: "Zap",
        points: { category: "longevity", score: 25 }
      },
      {
        text: "Lower blood pressure, balance cholesterol & protect heart health",
        icon: "HeartPulse",
        points: { category: "heart", score: 25 }
      },
      {
        text: "Lose stubborn fat, reset metabolism & practice scientific fasting",
        icon: "Flame",
        points: { category: "fasting", score: 25 }
      }
    ]
  },
  {
    id: 2,
    question: "How would you describe your daily energy levels throughout the afternoon?",
    subtitle: "Energy stability is a direct reflection of mitochondrial efficiency and blood sugar control.",
    options: [
      {
        text: "Severe 2-4 PM energy crash, brain fog, need coffee or sugary snacks",
        icon: "BatteryLow",
        points: { category: "detox", score: 20 }
      },
      {
        text: "Frequent digestive discomfort, gas, or sluggish feeling after meals",
        icon: "Activity",
        points: { category: "nutrition", score: 20 }
      },
      {
        text: "Moderate energy but wake up tired even after 7-8 hours in bed",
        icon: "Moon",
        points: { category: "longevity", score: 20 }
      },
      {
        text: "Stable, sustained energy without mood or cognitive fluctuations",
        icon: "CheckCircle2",
        points: { category: "fasting", score: 10 }
      }
    ]
  },
  {
    id: 3,
    question: "How often do you consume home-cooked, whole unprocessed meals?",
    subtitle: "Dietary matrix and food quality form the raw building blocks for every single cellular membrane.",
    options: [
      {
        text: "Rarely (frequently eat takeout, packaged meals, or restaurant foods)",
        icon: "ShoppingBag",
        points: { category: "detox", score: 25 }
      },
      {
        text: "About 50/50 balance between cooking at home and eating out",
        icon: "Scale",
        points: { category: "nutrition", score: 15 }
      },
      {
        text: "Mostly home-cooked whole foods with fresh vegetables and clean protein",
        icon: "Salad",
        points: { category: "longevity", score: 10 }
      },
      {
        text: "Strict organic, anti-inflammatory or ketogenic/paleo style diet",
        icon: "ShieldCheck",
        points: { category: "fasting", score: 5 }
      }
    ]
  },
  {
    id: 4,
    question: "Have you or your family ever had concerns with blood pressure or lipids?",
    subtitle: "Early cardiovascular prevention creates decades of healthy active life.",
    options: [
      {
        text: "Yes, currently managing elevated blood pressure or high cholesterol",
        icon: "HeartPulse",
        points: { category: "heart", score: 30 }
      },
      {
        text: "Borderline numbers, want to reverse it naturally without medication",
        icon: "TrendingUp",
        points: { category: "heart", score: 25 }
      },
      {
        text: "No known issues, but want comprehensive prevention for peace of mind",
        icon: "Shield",
        points: { category: "longevity", score: 15 }
      },
      {
        text: "Not sure, haven't completed comprehensive blood work recently",
        icon: "FileQuestion",
        points: { category: "detox", score: 15 }
      }
    ]
  },
  {
    id: 5,
    question: "How much time can you dedicate daily to your customized health routine?",
    subtitle: "We prioritize realistic, sustainable Micro-Habits over extreme unsustainable regimes.",
    options: [
      {
        text: "15-20 minutes (Need quick high-yield routines & meal plans)",
        icon: "Clock",
        points: { category: "fasting", score: 15 }
      },
      {
        text: "30-45 minutes (Ready to meal prep and do daily movement)",
        icon: "Calendar",
        points: { category: "nutrition", score: 20 }
      },
      {
        text: "60+ minutes (Fully committed to comprehensive lifestyle & biohacking overhaul)",
        icon: "Award",
        points: { category: "longevity", score: 25 }
      }
    ]
  }
];

export const CONSULTATION_PACKAGES: ConsultationPackage[] = [
  {
    id: "rapid-strategy",
    title: "30-Min Clinical Rapid Strategy",
    duration: "30 Minutes",
    price: 99,
    description: "Targeted 1-on-1 virtual consultation with Dr. Arif Chowdhury to address a single acute health concern, review basic blood work, or fine-tune an existing nutrition plan.",
    features: [
      "Direct 1-on-1 Zoom video call with Dr. Arif Chowdhury",
      "Analysis of your top 2 health symptoms or questions",
      "Targeted supplement dosage & brand recommendation",
      "Personalized 2-page Action Summary PDF emailed within 24h",
      "Full recording of the video session"
    ]
  },
  {
    id: "comprehensive-audit",
    title: "60-Min Comprehensive Health & Longevity Audit",
    duration: "60 Minutes",
    price: 189,
    popular: true,
    description: "Our most popular comprehensive consultation. An in-depth functional medicine investigation examining your full medical history, full blood lab panel, and custom lifestyle roadmap.",
    features: [
      "In-depth 60-Minute Video Consultation with Dr. Arif",
      "Complete 360° Review of all previous Blood/Lab Tests & Biomarkers",
      "Custom 30-Day Nutrition, Supplement & Circadian Protocol",
      "Direct guidance on ordering advanced functional tests (ApoB, Gut Stool, Hormone panels)",
      "Free access to 2 Premium eBooks of your choice ($65 Value)",
      "14-Day direct priority email follow-up support"
    ]
  },
  {
    id: "vip-mentorship",
    title: "3-Month VIP Health & Metabolic Mentorship",
    duration: "3 Months (6 Sessions)",
    price: 499,
    description: "A complete hands-on partnership to reverse chronic conditions, shed visceral weight, optimize cardiometabolic biomarkers, and maintain peak physical vitality.",
    features: [
      "Six (6) Bi-weekly 45-Minute Private Sessions with Dr. Arif",
      "Continuous CGM (Continuous Glucose Monitor) Data Review & Analysis",
      "Complete access to ALL Current & Future eBooks & Health Masterclasses",
      "Private WhatsApp / Telegram VIP Direct Messaging with Dr. Arif's Team",
      "Personalized Monthly Recipe & Grocery Delivery Blueprints",
      "Personalized Certificate of Completion & Medical Re-Assessment"
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "Tariqul Hasan",
    age: 44,
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    condition: "Type 2 Pre-Diabetes & Fatty Liver",
    result: "HbA1c from 6.4% down to 5.2%, lost 14 kg in 4 months",
    quote: "Dr. Arif Chowdhury's Clinical Nutrition guide and consultations completely transformed my life. In 4 months, my doctor took me off metformin because all my liver enzymes and fasting glucose returned to pristine levels. Best investment in myself ever.",
    rating: 5,
    verified: true
  },
  {
    id: "2",
    name: "Dr. Farzana Yasmin",
    age: 38,
    location: "Toronto, Canada",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    condition: "Chronic SIBO, Severe Bloating & Brain Fog",
    result: "Complete Gut Relief in 6 weeks, 100% resolved bloating",
    quote: "As a physician myself, I was frustrated with mainstream gastrointestinal advice that just gave me antacids. Dr. Arif's 4R Gut Mastery protocol is gold-standard evidence-based medicine. My bloating vanished within 3 weeks.",
    rating: 5,
    verified: true
  },
  {
    id: "3",
    name: "Mahmudur Rahman",
    age: 52,
    location: "New York, USA",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    condition: "Stage 1 Hypertension (152/95 mmHg)",
    result: "Blood pressure normalized to 118/76 mmHg without pharmaceuticals",
    quote: "The Cardiovascular Vitality book explained the potassium-to-sodium ratio and nitric oxide pathways in a way no cardiologist had ever taught me. My blood pressure is now consistently 118/76. I feel 15 years younger.",
    rating: 5,
    verified: true
  },
  {
    id: "4",
    name: "Nusrat Jahan",
    age: 29,
    location: "Sydney, Australia",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    condition: "Hormonal Imbalance & Fatigue",
    result: "Energy score 9/10, regulated cycle through circadian fasting",
    quote: "The Intermittent Fasting guide's section specifically for female hormones was an eye-opener. I stopped doing extreme fasts during my luteal phase and my energy levels surged. Dr. Arif's teaching is phenomenal!",
    rating: 5,
    verified: true
  }
];

export const FAQS = [
  {
    question: "How do I access my Free or Purchased PDF Health Guides?",
    answer: "Free guides can be previewed directly in our interactive In-App Reader with one click and downloaded immediately as a PDF document. Purchased premium books are instantly unlocked on screen upon checkout, emailed directly to your inbox with a secure download link, and saved to your 'My Library' browser tab for lifetime access."
  },
  {
    question: "Are Dr. Arif Chowdhury's guides suitable for beginners?",
    answer: "Yes! Every single guide is written in clear, engaging, and practical language. Dr. Arif breaks down complex medical research into bite-sized summaries, weekly meal plans, grocery checklists, and step-by-step daily routines that anyone can start today."
  },
  {
    question: "How does the checkout and payment process work?",
    answer: "You can add any paid guide or consultation package to your cart. We accept all major Credit/Debit cards, PayPal, and digital wallets with bank-grade 256-bit SSL encryption. We also support discount promo codes (like HEALTH20 or ARIF50) for immediate cart savings."
  },
  {
    question: "Can I book a 1-on-1 consultation if I live outside the US?",
    answer: "Absolutely. Dr. Arif's clinic conducts virtual consultations via high-definition secure Zoom for patients across the USA, UK, Canada, Australia, UAE, Bangladesh, and worldwide. Our booking system automatically adapts to your local time zone."
  },
  {
    question: "What is your refund policy?",
    answer: "We offer a 100% No-Risk 30-Day Money-Back Guarantee on all eBook purchases. If you implement Dr. Arif's protocols and do not experience a noticeable improvement in your health and vitality, simply send us an email for a prompt refund."
  }
];
