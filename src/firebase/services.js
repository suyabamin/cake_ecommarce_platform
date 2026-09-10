import { 
  collection, doc, getDocs, getDoc, addDoc, setDoc, updateDoc, deleteDoc, 
  query, where, orderBy, onSnapshot, serverTimestamp, limit 
} from 'firebase/firestore';
import { db } from './config';

// ----------------------------------------------------
// DEFAULT SEED DATA (Used when Firestore collection is empty)
// ----------------------------------------------------
export const DEFAULT_CATEGORIES = [
  { id: 'cat-1', name: 'Birthday Cakes', slug: 'birthday-cakes', image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=600&q=80', description: 'Make birthdays unforgettable with custom artisan cakes', active: true },
  { id: 'cat-2', name: 'Wedding & Elegance', slug: 'wedding-cakes', image: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=600&q=80', description: 'Multi-tiered bridal masterpieces crafted with love', active: true },
  { id: 'cat-3', name: 'Chocolate Supreme', slug: 'chocolate-cakes', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80', description: 'Rich Belgian chocolate, ganache, and decadent truffles', active: true },
  { id: 'cat-4', name: 'Cheesecakes', slug: 'cheesecakes', image: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=600&q=80', description: 'Creamy New York style cheesecakes with fresh berry compote', active: true },
  { id: 'cat-5', name: 'Red Velvet Special', slug: 'red-velvet', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=600&q=80', description: 'Classic velvety layers paired with rich cream cheese frosting', active: true },
  { id: 'cat-6', name: 'Pastries & Cupcakes', slug: 'pastries-cupcakes', image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=600&q=80', description: 'Bite-sized delights for celebrations and afternoon teas', active: true }
];

export const DEFAULT_CAKES = [
  {
    id: 'cake-1',
    name: 'Rose Gold Velvet Dream',
    slug: 'rose-gold-velvet-dream',
    categoryId: 'cat-5',
    categoryName: 'Red Velvet Special',
    description: 'Signature 3-tier red velvet cake enveloped in smooth rose gold Swiss meringue buttercream, garnished with edible gold leaf and blush macarons.',
    price: 65.00,
    discountPrice: 54.99,
    images: [
      'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    availability: 'in-stock',
    stock: 12,
    featured: true,
    ingredients: 'French Butter, Madagascar Vanilla, Cocoa, Cream Cheese, Edible Gold Leaf',
    flavor: 'Red Velvet & Vanilla Cream',
    weight: '1.5 kg (6-8 servings)',
    size: '8 inches',
    preparationTime: '24 Hours',
    rating: 4.9,
    reviewCount: 28,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cake-2',
    name: 'Midnight Belgian Truffle',
    slug: 'midnight-belgian-truffle',
    categoryId: 'cat-3',
    categoryName: 'Chocolate Supreme',
    description: 'Intense 70% dark Belgian chocolate sponge filled with chocolate ganache and crowned with hand-rolled dark chocolate truffles.',
    price: 72.00,
    discountPrice: 62.00,
    images: [
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    availability: 'in-stock',
    stock: 8,
    featured: true,
    ingredients: '70% Belgian Dark Chocolate, Heavy Cream, Dutch Cocoa, Espresso',
    flavor: 'Dark Chocolate Ganache',
    weight: '2.0 kg (8-10 servings)',
    size: '9 inches',
    preparationTime: '24 Hours',
    rating: 5.0,
    reviewCount: 42,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cake-3',
    name: 'Wild Strawberry Blossom Cheesecake',
    slug: 'wild-strawberry-blossom-cheesecake',
    categoryId: 'cat-4',
    categoryName: 'Cheesecakes',
    description: 'Slow-baked authentic New York cheesecake with buttery graham cracker crust, drizzled with fresh organic strawberry compote and white chocolate curls.',
    price: 58.00,
    discountPrice: 49.99,
    images: [
      'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80',
    availability: 'in-stock',
    stock: 15,
    featured: true,
    ingredients: 'Philadelphia Cream Cheese, Organic Strawberries, Graham Crust, Lemon Zest',
    flavor: 'Strawberry & Cream Cheese',
    weight: '1.2 kg (6 servings)',
    size: '7 inches',
    preparationTime: '12 Hours',
    rating: 4.8,
    reviewCount: 19,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cake-4',
    name: 'Floral Bridal Romance Tier',
    slug: 'floral-bridal-romance-tier',
    categoryId: 'cat-2',
    categoryName: 'Wedding & Elegance',
    description: 'A 2-tier showstopper covered in pearl white buttercream, adorned with hand-sculpted sugar flowers and delicate vanilla bean buttercream filling.',
    price: 180.00,
    discountPrice: 159.00,
    images: [
      'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=800&q=80',
    availability: 'pre-order',
    stock: 5,
    featured: true,
    ingredients: 'Madagascar Vanilla Bean, Swiss Buttercream, Almond Extract, Sugar Flowers',
    flavor: 'Vanilla Bean & Almond Cream',
    weight: '4.5 kg (25-30 servings)',
    size: '12 & 8 inches',
    preparationTime: '48 Hours',
    rating: 5.0,
    reviewCount: 14,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cake-5',
    name: 'Berry Celebration Sprinkle Cake',
    slug: 'berry-celebration-sprinkle-cake',
    categoryId: 'cat-1',
    categoryName: 'Birthday Cakes',
    description: 'Funfetti vanilla layers frosted with pastel pink buttercream and topped with fresh raspberries, blueberries, and celebration candles.',
    price: 52.00,
    discountPrice: null,
    images: [
      'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&w=800&q=80',
    availability: 'in-stock',
    stock: 20,
    featured: false,
    ingredients: 'Pure Vanilla, Rainbow Sprinkles, Fresh Berries, Organic Milk',
    flavor: 'Funfetti Berry Vanilla',
    weight: '1.5 kg (6-8 servings)',
    size: '8 inches',
    preparationTime: '12 Hours',
    rating: 4.7,
    reviewCount: 16,
    createdAt: new Date().toISOString()
  },
  {
    id: 'cake-6',
    name: 'Pastel Rose Macaron Cupcake Box (Set of 6)',
    slug: 'pastel-rose-macaron-cupcake-box',
    categoryId: 'cat-6',
    categoryName: 'Pastries & Cupcakes',
    description: 'Assortment of 6 moist red velvet and vanilla cupcakes topped with rose buttercream swirls and French macarons.',
    price: 34.00,
    discountPrice: 29.99,
    images: [
      'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80'
    ],
    thumbnail: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    availability: 'in-stock',
    stock: 30,
    featured: false,
    ingredients: 'Almond Flour, Buttercream, French Macarons, Raspberry Jam',
    flavor: 'Assorted Vanilla & Raspberry',
    weight: '0.8 kg (6 pieces)',
    size: 'Standard Box',
    preparationTime: '6 Hours',
    rating: 4.9,
    reviewCount: 31,
    createdAt: new Date().toISOString()
  }
];

export const DEFAULT_SITE_CONTENT = {
  heroTitle: 'Artisanal Pink Boutique Cakes Crafted for Magical Moments',
  heroSubtitle: 'Handcrafted luxury birthday, wedding, and celebration cakes delivered fresh to your doorstep with love.',
  bannerText: '✨ Special Offer: Enjoy 15% OFF on Rose Gold Dream Cakes this week!',
  aboutTitle: 'Welcome to Velvet & Frost',
  aboutBody: 'Founded with a passion for pastry perfection, Velvet & Frost merges classic French baking techniques with modern aesthetics. Every cake is baked fresh daily using premium Madagascar vanilla, 70% dark Belgian chocolate, and pure butter.',
  contactEmail: 'contact@velvetfrostcakes.com',
  contactPhone: '+1 (555) 234-5678',
  deliveryPolicy: 'We deliver in temperature-controlled vans. Requested delivery dates are reviewed promptly by our master baker.',
  footerText: '© 2026 Velvet & Frost Boutique Cakes. All rights reserved.'
};

// Local storage helper for offline fallback state
function getLocalStorage(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
}

// ----------------------------------------------------
// CAKES API
// ----------------------------------------------------
export async function fetchCakes() {
  try {
    const q = query(collection(db, 'cakes'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn('Firestore fetchCakes fallback to local cache:', err);
  }
  return getLocalStorage('vf_cakes', DEFAULT_CAKES);
}

export async function fetchCakeById(id) {
  try {
    const docRef = doc(db, 'cakes', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() };
    }
  } catch (err) {
    console.warn('Firestore fetchCakeById fallback:', err);
  }
  const localCakes = getLocalStorage('vf_cakes', DEFAULT_CAKES);
  return localCakes.find(c => c.id === id) || null;
}

export async function createCake(cakeData) {
  const newCake = {
    ...cakeData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    rating: cakeData.rating || 5.0,
    reviewCount: cakeData.reviewCount || 0
  };

  try {
    const docRef = await addDoc(collection(db, 'cakes'), newCake);
    newCake.id = docRef.id;
  } catch (err) {
    console.warn('Firestore createCake fallback:', err);
    newCake.id = 'cake-' + Date.now();
  }

  const localCakes = getLocalStorage('vf_cakes', DEFAULT_CAKES);
  const updated = [newCake, ...localCakes];
  setLocalStorage('vf_cakes', updated);
  return newCake;
}

export async function updateCake(id, cakeData) {
  const payload = { ...cakeData, updatedAt: new Date().toISOString() };
  try {
    const docRef = doc(db, 'cakes', id);
    await updateDoc(docRef, payload);
  } catch (err) {
    console.warn('Firestore updateCake fallback:', err);
  }

  const localCakes = getLocalStorage('vf_cakes', DEFAULT_CAKES);
  const updated = localCakes.map(c => c.id === id ? { ...c, ...payload } : c);
  setLocalStorage('vf_cakes', updated);
  return { id, ...payload };
}

export async function deleteCake(id) {
  try {
    await deleteDoc(doc(db, 'cakes', id));
  } catch (err) {
    console.warn('Firestore deleteCake fallback:', err);
  }
  const localCakes = getLocalStorage('vf_cakes', DEFAULT_CAKES);
  const updated = localCakes.filter(c => c.id !== id);
  setLocalStorage('vf_cakes', updated);
  return true;
}

// ----------------------------------------------------
// CATEGORIES API
// ----------------------------------------------------
export async function fetchCategories() {
  try {
    const snapshot = await getDocs(collection(db, 'categories'));
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn('Firestore fetchCategories fallback:', err);
  }
  return getLocalStorage('vf_categories', DEFAULT_CATEGORIES);
}

export async function createCategory(catData) {
  const newCat = {
    ...catData,
    slug: catData.slug || catData.name.toLowerCase().replace(/\s+/g, '-'),
    active: catData.active !== undefined ? catData.active : true,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'categories'), newCat);
    newCat.id = docRef.id;
  } catch (err) {
    newCat.id = 'cat-' + Date.now();
  }

  const local = getLocalStorage('vf_categories', DEFAULT_CATEGORIES);
  setLocalStorage('vf_categories', [...local, newCat]);
  return newCat;
}

export async function updateCategory(id, catData) {
  try {
    await updateDoc(doc(db, 'categories', id), catData);
  } catch (err) {
    console.warn('updateCategory fallback:', err);
  }
  const local = getLocalStorage('vf_categories', DEFAULT_CATEGORIES);
  const updated = local.map(c => c.id === id ? { ...c, ...catData } : c);
  setLocalStorage('vf_categories', updated);
  return { id, ...catData };
}

export async function deleteCategory(id) {
  try {
    await deleteDoc(doc(db, 'categories', id));
  } catch (err) {
    console.warn('deleteCategory fallback:', err);
  }
  const local = getLocalStorage('vf_categories', DEFAULT_CATEGORIES);
  setLocalStorage('vf_categories', local.filter(c => c.id !== id));
  return true;
}

// ----------------------------------------------------
// ORDERS API & DELIVERY DATE NEGOTIATION
// ----------------------------------------------------
export async function createOrder(orderPayload) {
  const newOrder = {
    ...orderPayload,
    orderNumber: 'VF-' + Math.floor(100000 + Math.random() * 900000),
    orderStatus: 'Pending', // Pending -> Under Review -> Approved -> Preparing -> Ready for Delivery -> Out for Delivery -> Delivered -> Completed
    paymentStatus: orderPayload.paymentMethod === 'cod' ? 'Unpaid (COD)' : 'Paid Online',
    agreedDeliveryDate: orderPayload.requestedDeliveryDate,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'orders'), newOrder);
    newOrder.id = docRef.id;
  } catch (err) {
    console.warn('Firestore createOrder fallback:', err);
    newOrder.id = 'ord-' + Date.now();
  }

  const localOrders = getLocalStorage('vf_orders', []);
  setLocalStorage('vf_orders', [newOrder, ...localOrders]);
  return newOrder;
}

export async function fetchCustomerOrders(customerId) {
  try {
    const q = query(
      collection(db, 'orders'), 
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn('Firestore fetchCustomerOrders fallback:', err);
  }
  const localOrders = getLocalStorage('vf_orders', []);
  return localOrders.filter(o => o.customerId === customerId);
}

export async function fetchAllOrders() {
  try {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn('Firestore fetchAllOrders fallback:', err);
  }
  return getLocalStorage('vf_orders', []);
}

export async function updateOrderStatus(orderId, status, additionalFields = {}) {
  const payload = { 
    orderStatus: status, 
    ...additionalFields, 
    updatedAt: new Date().toISOString() 
  };

  try {
    await updateDoc(doc(db, 'orders', orderId), payload);
  } catch (err) {
    console.warn('updateOrderStatus fallback:', err);
  }

  const localOrders = getLocalStorage('vf_orders', []);
  const updated = localOrders.map(o => o.id === orderId ? { ...o, ...payload } : o);
  setLocalStorage('vf_orders', updated);
  return payload;
}

// ----------------------------------------------------
// REAL-TIME MESSAGING / CHAT SYSTEM
// ----------------------------------------------------
export async function sendMessage({ orderId = null, senderId, senderName, senderRole, receiverId, messageText }) {
  const msgObj = {
    orderId,
    senderId,
    senderName,
    senderRole,
    receiverId,
    messageText,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'messages'), msgObj);
    msgObj.id = docRef.id;
  } catch (err) {
    msgObj.id = 'msg-' + Date.now();
  }

  const localMsgs = getLocalStorage('vf_messages', []);
  setLocalStorage('vf_messages', [...localMsgs, msgObj]);
  return msgObj;
}

export function listenToOrderMessages(orderId, callback) {
  try {
    const q = query(
      collection(db, 'messages'),
      where('orderId', '==', orderId),
      orderBy('createdAt', 'asc')
    );
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      callback(msgs);
    }, (err) => {
      console.warn('Firestore message listener fallback to storage:', err);
      const local = getLocalStorage('vf_messages', []);
      callback(local.filter(m => m.orderId === orderId));
    });
  } catch (err) {
    const local = getLocalStorage('vf_messages', []);
    callback(local.filter(m => m.orderId === orderId));
    return () => {};
  }
}

// ----------------------------------------------------
// REVIEWS SYSTEM (VERIFIED PURCHASERS ONLY)
// ----------------------------------------------------
export async function fetchCakeReviews(cakeId) {
  try {
    const q = query(
      collection(db, 'reviews'), 
      where('cakeId', '==', cakeId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn('fetchCakeReviews fallback:', err);
  }
  
  const defaultReviews = [
    {
      id: 'rev-1',
      cakeId: 'cake-1',
      customerName: 'Sophia Reynolds',
      rating: 5,
      comment: 'The Rose Gold Velvet Dream was the absolute highlight of my birthday! The buttercream was silky and not overly sweet.',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
    },
    {
      id: 'rev-2',
      cakeId: 'cake-2',
      customerName: 'Marcus Vance',
      rating: 5,
      comment: 'Best chocolate cake in town! Decadent, dark, and beautifully packaged.',
      verifiedPurchase: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
    }
  ];
  
  const local = getLocalStorage('vf_reviews', defaultReviews);
  return local.filter(r => r.cakeId === cakeId);
}

export async function createReview(reviewPayload) {
  const newReview = {
    ...reviewPayload,
    createdAt: new Date().toISOString()
  };

  try {
    const docRef = await addDoc(collection(db, 'reviews'), newReview);
    newReview.id = docRef.id;
  } catch (err) {
    newReview.id = 'rev-' + Date.now();
  }

  const local = getLocalStorage('vf_reviews', []);
  setLocalStorage('vf_reviews', [newReview, ...local]);
  return newReview;
}

// ----------------------------------------------------
// SITE CONTENT CMS API
// ----------------------------------------------------
export async function fetchSiteContent() {
  try {
    const docRef = doc(db, 'siteContent', 'main');
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('fetchSiteContent fallback:', err);
  }
  return getLocalStorage('vf_site_content', DEFAULT_SITE_CONTENT);
}

export async function updateSiteContent(contentData) {
  try {
    await setDoc(doc(db, 'siteContent', 'main'), contentData, { merge: true });
  } catch (err) {
    console.warn('updateSiteContent fallback:', err);
  }
  setLocalStorage('vf_site_content', contentData);
  return contentData;
}

// ----------------------------------------------------
// USER MANAGEMENT API
// ----------------------------------------------------
export async function fetchUsers() {
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (!snap.empty) {
      return snap.docs.map(d => ({ id: d.id, ...d.data() }));
    }
  } catch (err) {
    console.warn('fetchUsers fallback:', err);
  }

  const defaultUsers = [
    { id: '1', uid: '1', displayName: 'Jane Doe', email: 'customer@gmail.com', role: 'customer', status: 'active', phone: '+1 555-0199', createdAt: '2026-09-01T10:00:00.000Z' },
    { id: '2', uid: '2', displayName: 'Boutique Baker Admin', email: 'admin@velvetfrost.com', role: 'admin', status: 'active', phone: '+1 555-0100', createdAt: '2026-08-15T08:30:00.000Z' }
  ];

  return getLocalStorage('vf_users', defaultUsers);
}

export async function updateUserRole(userId, newRole) {
  const payload = { role: newRole, updatedAt: new Date().toISOString() };
  try {
    await updateDoc(doc(db, 'users', userId), payload);
  } catch (err) {
    console.warn('updateUserRole fallback:', err);
  }

  const localUsers = getLocalStorage('vf_users', []);
  const updated = localUsers.map(u => u.id === userId || u.uid === userId ? { ...u, ...payload } : u);
  setLocalStorage('vf_users', updated);
  return payload;
}

export async function updateUserStatus(userId, newStatus) {
  const payload = { status: newStatus, updatedAt: new Date().toISOString() };
  try {
    await updateDoc(doc(db, 'users', userId), payload);
  } catch (err) {
    console.warn('updateUserStatus fallback:', err);
  }

  const localUsers = getLocalStorage('vf_users', []);
  const updated = localUsers.map(u => u.id === userId || u.uid === userId ? { ...u, ...payload } : u);
  setLocalStorage('vf_users', updated);
  return payload;
}

// ----------------------------------------------------
// DASHBOARD HERO SLIDER API
// ----------------------------------------------------
export async function fetchSliderImages() {
  const content = await fetchSiteContent();
  return content?.sliderImages || [];
}

export async function updateSliderImages(sliderImages) {
  return await updateSiteContent({ sliderImages });
}

