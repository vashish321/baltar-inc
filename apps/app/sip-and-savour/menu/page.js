'use client';
import styles from './MenuPage.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SharedHeader from '../../components/SavourAndSip/SharedHeaderComponent/SharedHeader';

export default function MenuPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('appetizers');

  const menuCategories = [
    { id: 'appetizers', name: 'Appetizers & Canapés', icon: '🥂' },
    { id: 'mains', name: 'Main Courses', icon: '🍽️' },
    { id: 'desserts', name: 'Desserts', icon: '🍰' },
    { id: 'beverages', name: 'Beverages & Cocktails', icon: '🍹' },
    { id: 'dietary', name: 'Dietary Options', icon: '🌱' }
  ];

  const menuItems = {
    appetizers: [
      { name: 'Smoked Salmon Canapés', description: 'House-cured salmon on artisan crackers with dill cream', price: 'Market Price', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80' },
      { name: 'Truffle Arancini', description: 'Crispy risotto balls with truffle oil and parmesan', price: 'Market Price', image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80' },
      { name: 'Beef Tenderloin Skewers', description: 'Grilled beef with chimichurri and roasted vegetables', price: 'Market Price', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Artisan Cheese Board', description: 'Selection of local and imported cheeses with accompaniments', price: 'Market Price', image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80' }
    ],
    mains: [
      { name: 'Pan-Seared Halibut', description: 'Fresh halibut with seasonal vegetables and lemon butter', price: 'Market Price', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80' },
      { name: 'Herb-Crusted Lamb', description: 'Ontario lamb with rosemary crust and red wine reduction', price: 'Market Price', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Wild Mushroom Risotto', description: 'Creamy arborio rice with foraged mushrooms and truffle', price: 'Market Price', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Grilled Chicken Supreme', description: 'Free-range chicken with seasonal accompaniments', price: 'Market Price', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' }
    ],
    desserts: [
      { name: 'Chocolate Lava Cake', description: 'Warm chocolate cake with molten center and vanilla ice cream', price: 'Market Price', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80' },
      { name: 'Crème Brûlée Trio', description: 'Classic vanilla, lavender honey, and espresso flavors', price: 'Market Price', image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Seasonal Fruit Tart', description: 'Fresh seasonal fruits on pastry cream with almond crust', price: 'Market Price', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2126&q=80' },
      { name: 'Tiramisu', description: 'Traditional Italian dessert with espresso and mascarpone', price: 'Market Price', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2020&q=80' }
    ],
    beverages: [
      { name: 'Signature Cocktails', description: 'Custom cocktails designed for your event theme', price: 'Market Price', image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Wine Selection', description: 'Curated wines from Ontario and international vineyards', price: 'Market Price', image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Craft Beer', description: 'Local craft beers and imported selections', price: 'Market Price', image: 'https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Non-Alcoholic Options', description: 'Artisan sodas, fresh juices, and specialty coffees', price: 'Market Price', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80' }
    ],
    dietary: [
      { name: 'Vegan Options', description: 'Plant-based dishes with seasonal vegetables and grains', price: 'Market Price', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Gluten-Free Menu', description: 'Full menu available with gluten-free alternatives', price: 'Market Price', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2053&q=80' },
      { name: 'Keto-Friendly', description: 'Low-carb, high-fat options for ketogenic diets', price: 'Market Price', image: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80' },
      { name: 'Halal & Kosher', description: 'Certified halal and kosher options available', price: 'Market Price', image: 'https://images.unsplash.com/photo-1574484284002-952d92456975?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2087&q=80' }
    ]
  };

  return (
    <div className={styles.menuPage}>
      {/* Shared Header */}
      <SharedHeader currentPage="/sip-and-savour/menu" />

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroVideo}>
          <img
            src="https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            alt="Our Menu"
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
          <div className={styles.heroOverlay}></div>
        </div>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Our <span className={styles.highlight}>Menu</span>
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Curated culinary experiences crafted with the finest ingredients
          </motion.p>
        </div>
      </section>

      {/* Menu Section */}
      <section className={styles.menuSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.menuHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.menuTitle}>Sample Menu Items</h2>
            <p className={styles.menuSubtitle}>
              All menus are customized for your event. Pricing varies based on guest count, service style, and seasonal availability.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className={styles.categoryTabs}>
            {menuCategories.map((category) => (
              <motion.button
                key={category.id}
                className={`${styles.categoryTab} ${activeCategory === category.id ? styles.active : ''}`}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={styles.categoryIcon}>{category.icon}</span>
                {category.name}
              </motion.button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <motion.div
            className={styles.menuGrid}
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {menuItems[activeCategory].map((item, index) => (
              <motion.div
                key={index}
                className={styles.menuItem}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.03 }}
              >
                <div className={styles.itemImage}>
                  <img src={item.image} alt={item.name} />
                  <div className={styles.itemOverlay}>
                    <span className={styles.itemPrice}>{item.price}</span>
                  </div>
                </div>
                <div className={styles.itemContent}>
                  <h3 className={styles.itemName}>{item.name}</h3>
                  <p className={styles.itemDescription}>{item.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Custom Menu CTA */}
      <section className={styles.customMenuSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.customMenuContent}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className={styles.customMenuTitle}>Custom Menu Design</h2>
            <p className={styles.customMenuDescription}>
              Every event is unique, and so should be your menu. Our chefs work with you to create 
              a personalized dining experience that reflects your taste, dietary requirements, and event style.
            </p>
            <div className={styles.customMenuFeatures}>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>👨‍🍳</span>
                <span>Chef Consultation</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🍽️</span>
                <span>Menu Tasting</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>🌱</span>
                <span>Dietary Accommodations</span>
              </div>
              <div className={styles.feature}>
                <span className={styles.featureIcon}>📋</span>
                <span>Seasonal Ingredients</span>
              </div>
            </div>
            <div className={styles.customMenuButtons}>
              <motion.button
                className={styles.primaryButton}
                onClick={() => router.push('/sip-and-savour/pricing')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Request Custom Menu
              </motion.button>
              <motion.button
                className={styles.secondaryButton}
                onClick={() => router.push('/sip-and-savour/services')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Catering Services
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
