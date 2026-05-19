'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const EASE  = [0.16, 1, 0.3, 1];
const CREAM  = '#FAF8F3';
const INK    = '#1C1714';
const GOLD   = '#8B6914';
const GOLD_LT = '#C4955A';
const MUTED  = 'rgba(28,23,20,0.48)';
const RULE   = 'rgba(28,23,20,0.1)';

function FadeUp({ children, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-6% 0px' });
  return (
    <motion.div ref={ref} style={style}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >{children}</motion.div>
  );
}

function MenuNav() {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 48px', height: 72,
      background: 'rgba(250,248,243,0.97)', backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 0 rgba(28,23,20,0.08)',
    }}>
      <Link href="/sip-and-savour" style={{ fontSize: '0.62rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: INK, textDecoration: 'none', fontWeight: 600 }}>
        ← Savour &amp; Sip
      </Link>
      <Link href="/sip-and-savour" style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', letterSpacing: '0.12em', color: INK, textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
        Savour &amp; Sip
      </Link>
      <a href="mailto:hospitality@baltar.ca" style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '10px 24px', border: `1px solid ${INK}`, color: INK, textDecoration: 'none' }}>
        Get in Touch
      </a>
    </nav>
  );
}

/* ── ALL FIVE MENUS ── */
const MENUS = [
  {
    id: 'flavours-of-the-season',
    name: 'Flavours of the Season',
    tagline: 'Our signature seasonal offering — rooted in locally sourced ingredients and thoughtful presentation.',
    heroImg: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1400&q=85',
    accent: GOLD,
    subcategories: [
      {
        name: 'Fresh & Vibrant Salads',
        items: [
          { name: 'Spring Kale Crunch', desc: 'Hand-massaged kale with candied pecans, shaved carrots, crisp apple, dried cranberries, and a house poppy seed dressing.' },
          { name: 'Classic Caesar, Elevated', desc: 'Crisp romaine hearts with smoky bacon lardons, shaved Parmesan, garlic croutons, and a bright lemon Caesar dressing.' },
          { name: 'Roasted Beet & Chickpea Salad', desc: 'Seasoned chickpeas paired with fresh roasted beets, creamy feta, and a zesty lemon-garlic vinaigrette.' },
        ],
      },
      {
        name: "Chef's Mains",
        items: [
          { name: 'Guinness BBQ Chicken Breast', desc: 'Herb-brined and marinated chicken breast finished with a house-made Guinness barbecue glaze.' },
          { name: '12-Hour Slow-Roasted Beef Spare Ribs', desc: 'Marinated overnight and slow-cooked for 12 hours — fall-off-the-bone ribs glazed in a red wine teriyaki reduction.' },
          { name: 'Korean-Style Pork Chops', desc: 'Overnight-marinated in sweet chili, gochujang, ginger, garlic, and soy, topped with fresh green onion.' },
        ],
      },
      {
        name: 'Hearty Sides & Vegetables',
        items: [
          { name: 'Honey Garlic Roasted Root Vegetable Medley', desc: 'Parsnips, carrots, yams, and sweet potatoes roasted until caramelized in a house honey-garlic glaze.' },
          { name: 'Seasonal Vegetable Medley', desc: 'A colourful blend of broccoli, snap peas, cauliflower, peppers, carrots, mushrooms, and baby corn.' },
          { name: 'Classic Ratatouille Gratin', desc: 'Layers of zucchini, eggplant, peppers, and potatoes simmered with fresh herbs, finished with béchamel.' },
        ],
      },
      {
        name: 'Add-ons & Substitutions',
        items: [
          { name: 'Caribbean-Style Jerk Chicken', desc: 'Spiced and grilled jerk-marinated chicken.' },
          { name: 'Fragrant Rice Pilaf', desc: 'Fluffy basmati rice pilaf with aromatic herbs.' },
          { name: 'Pepper Roti', desc: 'Trinidadian stuffed flatbread with seasoned spicy filling.' },
          { name: 'Char Siu-Style Pork Chops', desc: 'Pork chops marinated in Cantonese char siu glaze.' },
          { name: 'Flaky Cheddar Biscuits', desc: 'Flaky, buttery biscuits with white cheddar and fresh chives.' },
        ],
      },
      {
        name: 'Artisan Sandwiches',
        items: [
          { name: 'Herb-Roasted Turkey', desc: 'Rosemary garlic aioli, arugula & Havarti.' },
          { name: 'Mortadella & Ham', desc: 'Sun-dried tomato aioli, crisp lettuce & creamy Boursin.' },
          { name: 'Roast Beef Classic', desc: 'Honey mustard, spinach & sun-dried tomatoes.' },
        ],
      },
      {
        name: 'Desserts & Sweet Endings',
        items: [
          { name: 'Seasonal Baked Pies', desc: 'Choose from apple, pear, strawberry & coconut cream — baked fresh and served golden.' },
          { name: 'Cookie & Pastry Platters', desc: 'Banana chocolate cookies, browned butter chocolate chip, and cranberry oatmeal cookies.' },
          { name: 'Fresh Seasonal Fruit Platter', desc: 'Oranges, kiwis, pineapple, strawberries, watermelon & blueberries.' },
        ],
      },
      {
        name: 'Bar Program',
        items: [
          { name: 'Crisp White Wines', desc: 'Sauvignon Blanc, Pinot Grigio & Chardonnay — light and refreshing, ideal for salads and chicken.' },
          { name: 'Elegant Red Wines', desc: 'Cabernet Sauvignon, Merlot & Pinot Noir — rich and full-bodied.' },
          { name: 'Elderflower Spring Spritz', desc: 'Prosecco, elderflower liqueur, soda water, and a lemon twist.' },
          { name: 'Blackberry Bourbon Smash', desc: 'Bourbon muddled with fresh blackberries, mint, and a hint of lemon.' },
          { name: 'Mocktails', desc: 'Elderflower Fizz, Cucumber Mint Cooler & Virgin Mojito.' },
        ],
      },
    ],
    photos: [
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'summer-sensation',
    name: 'Summer Sensation',
    tagline: 'Sun-drenched flavours built for outdoor entertaining — bold, fresh, and effortlessly social.',
    heroImg: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1400&q=85',
    accent: '#C4955A',
    subcategories: [
      {
        name: 'Appetizers & Grazing Boards',
        items: [
          { name: 'Summer Charcuterie Board', desc: 'Prosciutto, brie, goat cheese, fig jam, dehydrated strawberries, crackers, nuts.' },
          { name: 'Tropical Shrimp Skewers', desc: 'Chili-lime shrimp with grilled pineapple on bamboo skewers.' },
          { name: 'Watermelon Gazpacho', desc: 'Garnished with mint and a drizzle of balsamic reduction.' },
          { name: 'Stuffed Cucumber Cups', desc: 'With herbed cream cheese or smoked salmon mousse.' },
        ],
      },
      {
        name: 'Salads & Sides',
        items: [
          { name: 'Summer Berry Spinach Salad', desc: 'Baby spinach, strawberries, blueberries, goat cheese, candied pecans, raspberry vinaigrette.' },
          { name: 'Grilled Corn & Avocado Salad', desc: 'With cilantro-lime dressing and cherry tomatoes.' },
          { name: 'Classic Potato Salad', desc: 'Creamy, herbed, or mustard-based.' },
          { name: 'Coleslaw Trio', desc: 'Creamy slaw, vinegar slaw, and tropical slaw with mango.' },
        ],
      },
      {
        name: 'Grill & Main Courses',
        items: [
          { name: 'BBQ Chicken Thighs or Breast', desc: 'Marinated in house spice rub or bourbon BBQ sauce.' },
          { name: 'Cedar-Plank Salmon', desc: 'With maple glaze and lemon dill butter.' },
          { name: 'Beef or Veggie Sliders', desc: 'On mini brioche buns with house pickles and chipotle mayo.' },
          { name: 'Jerk Chicken Drumsticks', desc: 'Spicy, smoky, served with grilled lime wedges.' },
          { name: 'Pulled Pork Sandwiches', desc: 'Served with tangy slaw and soft buns.' },
          { name: 'Grilled Vegetable Platter', desc: 'Seasonal squash, peppers, mushrooms, asparagus, balsamic drizzle.' },
          { name: 'Grilled Portobello Steaks or Jackfruit BBQ Sandwiches', desc: 'Plant-based option.' },
        ],
      },
      {
        name: 'Desserts',
        items: [
          { name: 'Mini Cup Cheesecakes', desc: 'Strawberry swirl, key lime, or blueberry compote.' },
          { name: 'Fruit Skewers with Honey Yogurt Dip', desc: 'Colourful seasonal fruit, served with a honey-lime yogurt.' },
        ],
      },
      {
        name: 'Drinks & Add-Ons',
        items: [
          { name: 'Fresh Lemonade Trio', desc: 'Classic, strawberry basil, and cucumber mint.' },
          { name: 'Iced Tea Infusions', desc: 'Hibiscus-berry, peach, and Earl Grey vanilla.' },
          { name: 'Watermelon Mojito', desc: 'Signature summer cocktail.' },
          { name: 'Pineapple Rum Punch', desc: 'Tropical and refreshing.' },
          { name: 'Sparkling Rosé Sangria', desc: 'Light and celebratory.' },
          { name: 'Classic Margarita', desc: 'Three selections available.' },
        ],
      },
    ],
    photos: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'summer-crave',
    name: 'Summer Crave',
    tagline: 'Crafted for effortless enjoyment on summer days — cool, shareable, and fresh.',
    heroImg: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=1400&q=85',
    accent: '#7E9B8A',
    subcategories: [
      {
        name: 'Signature Finger Sandwiches & Wraps',
        items: [
          { name: 'Chicken Waldorf Mini Croissants', desc: 'Shredded chicken, apple, celery, grapes, and walnut in light mayo dressing.' },
          { name: 'Mediterranean Veggie Wraps (Vegan)', desc: 'Roasted red peppers, hummus, cucumber, olives, spinach — rolled in spinach tortillas and sliced into pinwheels.' },
          { name: 'Roast Beef & Arugula Sliders', desc: 'With horseradish aioli on soft mini brioche buns.' },
        ],
      },
      {
        name: 'Seafood Selection',
        items: [
          { name: 'Classic Shrimp Cocktail', desc: 'Plump chilled shrimp served with lemon wedges and house-made cocktail sauce.' },
          { name: 'Mini Crab Cakes (Cold Served)', desc: 'Bite-sized with citrus aioli dip.' },
          { name: 'Smoked Trout Crostini', desc: 'Topped with lemon crème fraîche and chives on a crisp toast point.' },
        ],
      },
      {
        name: 'Fresh Platters & Grazing',
        items: [
          { name: 'Fruit Skewers & Dip', desc: 'Colourful mix of pineapple, strawberry, mango, kiwi, and grapes, with honey-lime yogurt dip.' },
          { name: 'Coastal Cheese & Bites Board', desc: 'Brie, aged cheddar, grapes, dried fruits, nuts, artisan crackers, honey drizzle.' },
          { name: 'Crudité Cups', desc: 'Individual veggie cups with tzatziki or hummus — bell peppers, cucumber, cherry tomatoes, snap peas.' },
        ],
      },
      {
        name: 'Sweets',
        items: [
          { name: 'Mini Cheesecake Bites', desc: 'Assorted: berry swirl, key lime, and chocolate marble.' },
          { name: 'Lemon Shortbread Bars', desc: 'Zesty and buttery with a delicate crumb, perfect for warm weather.' },
        ],
      },
      {
        name: 'Beverage Add-Ons',
        items: [
          { name: 'Fresh Juice Jars', desc: 'Watermelon mint, pineapple ginger, cucumber lime.' },
          { name: 'Sparkling Infused Water Dispensers', desc: 'Strawberry basil, citrus cucumber.' },
          { name: 'Coconut Mojito', desc: 'Signature boat cocktail.' },
          { name: 'Blueberry Basil Spritz', desc: 'Light and refreshing.' },
          { name: 'Guava Lemonade', desc: 'Can be made non-alcoholic.' },
        ],
      },
    ],
    photos: [
      'https://images.unsplash.com/photo-1551218372-a8789b81b253?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'solstice-luxe',
    name: 'Solstice Luxe',
    tagline: 'Refined, sun-kissed, and artfully presented. Inspired by coastal summers and global elegance.',
    heroImg: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85',
    accent: '#8B6914',
    subcategories: [
      {
        name: 'Amuse-Bouche & Starters',
        items: [
          { name: 'Mini Mexican Elote Cups', desc: 'Grilled corn, chili-lime crema, cotija cheese, cilantro, lime zest.' },
          { name: 'Ahi Tuna Tartare on Plantain Crisps', desc: 'Citrus ponzu, avocado, sesame, microgreens.' },
          { name: 'Crispy Halloumi Bites', desc: 'With hot honey drizzle and mint yogurt.' },
          { name: 'Heirloom Tomato & Burrata Spoons', desc: 'Aged balsamic pearls, basil oil, smoked sea salt.' },
        ],
      },
      {
        name: 'Shared Seasonal Salads',
        items: [
          { name: 'Watermelon & Feta Mosaic', desc: 'With arugula, pickled shallot, mint vinaigrette.' },
          { name: 'Grilled Peach & Prosciutto Salad', desc: 'Baby greens, fennel, almonds, champagne vinaigrette.' },
        ],
      },
      {
        name: 'Main Courses',
        items: [
          { name: 'Tequila-Lime Chicken Breast', desc: 'With poblano-corn salsa and charred scallion crema.' },
          { name: 'Cedar-Smoked Salmon', desc: 'Passionfruit glaze, on a roasted tomato quinoa bed.' },
          { name: 'Wild Mushroom & Truffle Risotto', desc: 'Finished with white truffle oil. Vegan option available.' },
          { name: 'Lamb Lollipops (upgrade)', desc: 'With pistachio mint gremolata.' },
        ],
      },
      {
        name: 'Luxury Sides',
        items: [
          { name: 'Esquites Gratin (Street Corn Bake)', desc: 'Baked with cotija, crema, roasted garlic, chili-lime topping.' },
          { name: 'Charred Zucchini Ribbons & Baby Carrots', desc: 'With preserved lemon and sea salt.' },
          { name: 'Saffron Couscous with Roasted Chickpeas', desc: 'Light and fluffy with crisp textures.' },
        ],
      },
      {
        name: 'Desserts',
        items: [
          { name: 'Mango & Coconut Panna Cotta', desc: 'Silky coconut cream base layered with mango purée, topped with candied lime zest and gold-dusted mint leaves.' },
          { name: 'Mango Cheesecake Domes', desc: 'Mousse-style with mango gelée core, crisp cookie base, tropical glaze, optional gold leaf.' },
        ],
      },
      {
        name: 'Signature Beverages',
        items: [
          { name: 'Cucumber Elderflower Sparkler', desc: 'With edible flowers and cucumber ribbons.' },
          { name: 'Pineapple Jalapeño Agua Fresca', desc: 'Bright and bold.' },
          { name: 'Rosé Sangria with White Peach & Strawberry', desc: 'Light and floral.' },
          { name: 'Cocktail Bar (Optional)', desc: 'Mezcal Palomas, Hibiscus Margaritas, Coconut Daiquiris.' },
        ],
      },
    ],
    photos: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: 'carnival-heat',
    name: 'Carnival Heat',
    tagline: 'Flavour that moves to the rhythm. Inspired by the islands. Made for the vibe.',
    heroImg: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=1400&q=85',
    accent: '#A0522D',
    subcategories: [
      {
        name: 'Island Starters & Street Bites',
        items: [
          { name: 'Trini Pepper Wings', desc: 'Fried chicken in a light batter, marinated overnight in Chadon-Beni, cooked in a spicy sauce.' },
          { name: 'Bake & Buljol Sliders', desc: 'Fluffy fried bake with saltfish, sweet peppers, onions, and tomato — served mini for cocktail service.' },
          { name: 'Mini Beef Patties', desc: 'Flaky crust with scotch bonnet spice, available mild or spicy.' },
          { name: 'Sweet Plantain Cups', desc: 'Filled with spiced ackee, seasoned callaloo, or curried lentils.' },
        ],
      },
      {
        name: 'Caribbean-Style Sides',
        items: [
          { name: 'Trini Macaroni Pie', desc: 'Baked with sharp cheddar, Caribbean seasoning, and golden top.' },
          { name: 'Festive Slaw', desc: 'Red cabbage, carrots, pineapple, tossed in citrus-honey dressing.' },
          { name: 'Rice & Peas (Jamaican-Style)', desc: 'Cooked in coconut milk, thyme, scallion, and kidney beans.' },
          { name: 'Cassava / Breadfruit (Optional Upgrade)', desc: 'Root vegetables boiled in coconut milk, taro leaves, carrots until tender.' },
        ],
      },
      {
        name: 'Main Attractions',
        items: [
          { name: 'Jerk Chicken Quarters or Boneless Breast', desc: 'Served with house scotch bonnet sauce on the side.' },
          { name: 'Island BBQ Ribs', desc: 'Slow-cooked and glazed in guava-rum BBQ sauce.' },
          { name: 'Curry Goat or Duck', desc: 'Bone-in, tender and full of flavour — marinated with green seasoning and scotch bonnet, served with buss-up-shut (paratha roti).' },
          { name: 'Fried Fish Fillets', desc: 'Seasoned with lime, allspice, and garlic — paired with pepper sauce or tartar dip.' },
          { name: 'Island Tacos Station (Optional Add-On)', desc: 'Fill-your-own: jerk chicken, grilled shrimp, tropical salsa, slaw, sauces.' },
        ],
      },
      {
        name: 'Sweet Tingz',
        items: [
          { name: 'Mini Rum Cake Bites', desc: 'Rich, boozy, and moist with a rum glaze.' },
          { name: 'Sorrel Jelly Cups', desc: 'Chilled dessert served with hibiscus syrup and mint.' },
        ],
      },
      {
        name: 'Signature Festival Drinks',
        items: [
          { name: 'Rum Punch (Classic or Frozen)', desc: 'Spiked with overproof rum, tropical juice blend, and a splash of lime.' },
          { name: 'Sorrel & Ginger', desc: 'With or without rum — tart, spicy, and refreshing.' },
          { name: "Queen's Park Swizzle", desc: "Classic Trinidad & Tobago cocktail." },
          { name: 'Mango-Passionfruit Fizz', desc: 'Bright and bubbly. Non-alcoholic available.' },
        ],
      },
      {
        name: 'Add-On Options',
        items: [
          { name: 'Pepper Roti', desc: 'Trinidadian stuffed flatbread.' },
          { name: 'Callaloo', desc: 'Thick and creamy taro leaf, carrots, pumpkin, and okra cooked with coconut milk. Crab optional.' },
        ],
      },
    ],
    photos: [
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80',
    ],
  },
];

export default function MenuPage() {
  const [activeMenu, setActiveMenu] = useState('flavours-of-the-season');
  const current = MENUS.find(m => m.id === activeMenu);

  return (
    <div style={{ background: CREAM, color: INK, minHeight: '100vh', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <MenuNav />

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '65vh', minHeight: 480, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={current.id + '-hero'}
            src={current.heroImg}
            alt={current.name}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 40%' }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
        </AnimatePresence>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 80, textAlign: 'center', zIndex: 2 }}>
          <motion.span
            key={current.id + '-tag'}
            style={{ fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: 16 }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          >
            Savour &amp; Sip — Our Menus
          </motion.span>
          <motion.h1
            key={current.id + '-title'}
            style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2.4rem, 5.5vw, 5rem)', fontWeight: 400, lineHeight: 1.05, color: '#fff', margin: '0 0 16px', padding: '0 24px' }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          >
            {current.name}
          </motion.h1>
          <motion.p
            key={current.id + '-tagline'}
            style={{ fontSize: 'clamp(0.88rem, 1.4vw, 1rem)', color: 'rgba(255,255,255,0.6)', maxWidth: 520, lineHeight: 1.7, padding: '0 24px' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
          >
            {current.tagline}
          </motion.p>
        </div>
      </section>

      {/* ── MENU SELECTOR TABS ── */}
      <div style={{ background: '#FDF9F2', borderBottom: `1px solid ${RULE}`, position: 'sticky', top: 72, zIndex: 50, overflowX: 'auto' }}>
        <div style={{ display: 'flex', padding: '0 48px', minWidth: 'max-content' }}>
          {MENUS.map(m => (
            <button
              key={m.id}
              onClick={() => setActiveMenu(m.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '18px 28px 20px',
                fontFamily: 'inherit',
                fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase',
                fontWeight: 600,
                color: activeMenu === m.id ? INK : MUTED,
                borderBottom: activeMenu === m.id ? `2px solid ${m.accent || GOLD}` : '2px solid transparent',
                transition: 'color 0.2s, border-color 0.2s',
                marginBottom: -1,
                whiteSpace: 'nowrap',
              }}
            >
              {m.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── MENU CONTENT ── */}
      <AnimatePresence mode="wait">
        <motion.section
          key={activeMenu}
          style={{ padding: '80px 80px 120px', maxWidth: 1400, margin: '0 auto', boxSizing: 'border-box' }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {/* Photos strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4, marginBottom: 80, height: 280 }}>
            {current.photos.map((src, i) => (
              <div key={i} style={{ position: 'relative', overflow: 'hidden' }}>
                <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                />
              </div>
            ))}
          </div>

          {/* Subcategory grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '0 80px' }}>
            {current.subcategories.map((sub, si) => (
              <FadeUp key={sub.name} delay={si * 0.05}>
                <div style={{ marginBottom: 56 }}>
                  {/* Category header with rules */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 28 }}>
                    <div style={{ flex: 1, height: 1, background: RULE }} />
                    <span style={{ fontSize: '0.58rem', letterSpacing: '0.24em', textTransform: 'uppercase', color: current.accent || GOLD, whiteSpace: 'nowrap', fontWeight: 600 }}>
                      {sub.name}
                    </span>
                    <div style={{ flex: 1, height: 1, background: RULE }} />
                  </div>
                  {sub.items.map((item, ii) => (
                    <div key={item.name} style={{ paddingBottom: 20, marginBottom: 20, borderBottom: ii < sub.items.length - 1 ? `1px solid ${RULE}` : 'none' }}>
                      <h4 style={{ fontFamily: 'Georgia, serif', fontSize: '1rem', fontWeight: 400, color: INK, margin: '0 0 5px' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.82rem', color: MUTED, margin: 0, lineHeight: 1.7 }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            ))}
          </div>

          {/* Bottom note */}
          <div style={{ marginTop: 24, paddingTop: 48, borderTop: `1px solid ${RULE}`, textAlign: 'center' }}>
            <p style={{ fontSize: '0.85rem', color: MUTED, lineHeight: 1.75, maxWidth: 520, margin: '0 auto 28px' }}>
              All menus are fully customisable to your event, guest count, and dietary requirements. We accommodate vegan, halal, gluten-free, and all allergen needs.
            </p>
            <a href="mailto:hospitality@baltar.ca" style={{ display: 'inline-block', padding: '14px 44px', background: INK, color: CREAM, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#3a2e29'}
              onMouseLeave={e => e.currentTarget.style.background = INK}
            >
              Request a Custom Menu
            </a>
          </div>
        </motion.section>
      </AnimatePresence>

      {/* ── FOOTER ── */}
      <footer style={{ background: INK, color: 'rgba(255,255,255,0.4)', padding: '40px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)' }}>Savour &amp; Sip</span>
          <nav style={{ display: 'flex', gap: 32 }}>
            {[{ l: 'Services', h: '/sip-and-savour/services' }, { l: 'Events', h: '/sip-and-savour/events' }, { l: 'Back to Home', h: '/sip-and-savour' }].map(({ l, h }) => (
              <Link key={h} href={h} style={{ fontSize: '0.68rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>{l}</Link>
            ))}
          </nav>
          <span style={{ fontSize: '0.68rem' }}>© {new Date().getFullYear()} Savour &amp; Sip. A Baltar Hospitality Company.</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .menu-photos { grid-template-columns: 1fr 1fr !important; height: 200px !important; }
          .menu-photos > div:last-child { display: none; }
        }
        @media (max-width: 480px) {
          .menu-photos { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
