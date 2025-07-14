'use client';
import styles from './MenuPage.module.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import SharedHeader from '../../components/SavourAndSip/SharedHeaderComponent/SharedHeader';

export default function MenuPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState('summer-sensation');

  const menuCategories = [
    { id: 'summer-sensation', name: 'Summer Sensation', icon: '☀️' },
    { id: 'summer-crave', name: 'Summer Crave', icon: '🌊' },
    { id: 'solstice-luxe', name: 'Solstice Luxe', icon: '✨' },
    { id: 'carnival-heat', name: 'Carnival Heat', icon: '🌶️' }
  ];

  const menuItems = {
    'summer-sensation': [
      {
        name: 'Summer Charcuterie Board',
        description: 'Prosciutto, brie, goat cheese, fig jam, dried mango, strawberries, crackers, nuts',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        category: 'Appetizers & Grazing Boards'
      },
      {
        name: 'Tropical Shrimp Skewers',
        description: 'Chili-lime shrimp with grilled pineapple on bamboo skewers',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2065&q=80',
        category: 'Appetizers & Grazing Boards'
      },
      {
        name: 'BBQ Chicken Thighs',
        description: 'Marinated in house spice rub or bourbon BBQ sauce',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Grill & Main Courses'
      },
      {
        name: 'Cedar-Plank Salmon',
        description: 'With maple glaze and lemon dill butter',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        category: 'Grill & Main Courses'
      },
      {
        name: 'Summer Berry Spinach Salad',
        description: 'Baby spinach, strawberries, blueberries, goat cheese, candied pecans, raspberry vinaigrette',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Salads & Sides'
      },
      {
        name: 'Watermelon Mojito',
        description: 'Fresh watermelon, mint, lime, and rum - signature summer cocktail',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Drinks & Add-Ons'
      }
    ],
    'summer-crave': [
      {
        name: 'Chicken Waldorf Mini Croissants',
        description: 'Shredded chicken, apple, celery, grapes, and walnut in light mayo dressing',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80',
        category: 'Signature Finger Sandwiches & Wraps'
      },
      {
        name: 'Mediterranean Veggie Wraps',
        description: 'Roasted red peppers, hummus, cucumber, olives, spinach — rolled in spinach tortillas (Vegan)',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Signature Finger Sandwiches & Wraps'
      },
      {
        name: 'Classic Shrimp Cocktail',
        description: 'Plump chilled shrimp served with lemon wedges and house-made cocktail sauce',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1558818498-28c1e002b655?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Seafood Selection'
      },
      {
        name: 'Coastal Cheese & Bites Board',
        description: 'Brie, aged cheddar, grapes, dried fruits, nuts, artisan crackers, honey drizzle',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2073&q=80',
        category: 'Fresh Platters & Grazing'
      },
      {
        name: 'Coconut Mojito',
        description: 'Tropical twist on classic mojito with coconut rum and fresh mint',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Beverage Add-Ons'
      }
    ],
    'solstice-luxe': [
      {
        name: 'Ahi Tuna Tartare on Plantain Crisps',
        description: 'Citrus ponzu, avocado, sesame, microgreens',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Amuse-Bouche & Starters'
      },
      {
        name: 'Tequila-Lime Chicken Breast',
        description: 'With poblano-corn salsa and charred scallion crema',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Main Courses'
      },
      {
        name: 'Cedar-Smoked Salmon',
        description: 'Passionfruit glaze, on a roasted tomato quinoa bed',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80',
        category: 'Main Courses'
      },
      {
        name: 'Mango & Coconut Panna Cotta',
        description: 'Silky coconut cream base layered with mango purée, topped with candied lime zest',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Desserts'
      },
      {
        name: 'Cucumber Elderflower Sparkler',
        description: 'With edible flowers and cucumber ribbons',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Signature Summer Beverages'
      }
    ],
    'carnival-heat': [
      {
        name: 'Trini Pepper Wings',
        description: 'Fried chicken in light batter, marinated overnight in Chadon-Beni, cooked in spicy sauce',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Island Starters & Street Bites'
      },
      {
        name: 'Jerk Chicken Quarters',
        description: 'Served with house scotch bonnet sauce on the side',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Main Attractions'
      },
      {
        name: 'Curry Goat',
        description: 'Bone-in, tender and full of flavour — marinated with green seasoning and scotch bonnet, served with buss-up-shut (paratha roti)',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Main Attractions'
      },
      {
        name: 'Rice & Peas (Jamaican-Style)',
        description: 'Cooked in coconut milk, thyme, scallion, and kidney beans',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Caribbean-Style Sides'
      },
      {
        name: 'Rum Punch',
        description: 'Classic or frozen - spiked with overproof rum, tropical juice blend, and a splash of lime',
        price: 'Market Price',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        category: 'Signature Festival Drinks'
      }
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
            <h2 className={styles.menuTitle}>Signature Menu Collections</h2>
            <p className={styles.menuSubtitle}>
              Choose from our curated seasonal collections or let us create a custom menu for your event. All menus are tailored to your preferences, guest count, and dietary requirements.
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
                  {item.category && (
                    <span className={styles.itemCategory}>{item.category}</span>
                  )}
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
