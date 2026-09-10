import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user profile from Firestore or local state
  const loadUserProfile = async (user) => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    try {
      const docRef = doc(db, 'users', user.uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        setUserProfile(snap.data());
      } else {
        // Create initial profile for new user
        const newProfile = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          photoURL: user.photoURL || null,
          role: user.email?.includes('admin') ? 'admin' : 'customer', // Auto-grant admin role if email contains admin
          status: 'active',
          createdAt: new Date().toISOString()
        };
        await setDoc(docRef, newProfile);
        setUserProfile(newProfile);
      }
    } catch (err) {
      console.warn('Auth profile fetch fallback:', err);
      // Fallback profile object
      setUserProfile({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || user.email.split('@')[0],
        role: user.email?.includes('admin') ? 'admin' : 'customer',
        status: 'active'
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signup = async (email, password, displayName) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const newProfile = {
      uid: res.user.uid,
      email: res.user.email,
      displayName: displayName || email.split('@')[0],
      role: email.includes('admin') ? 'admin' : 'customer',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', res.user.uid), newProfile);
    } catch (e) {
      console.warn('Profile doc write warning:', e);
    }
    setUserProfile(newProfile);
    return res.user;
  };

  const login = async (email, password) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    await loadUserProfile(res.user);
    return res.user;
  };

  const loginWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    await loadUserProfile(res.user);
    return res.user;
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  // Demo shortcut login for quick testing of Admin / Customer roles
  const loginDemoRole = (roleType = 'customer') => {
    const demoUser = {
      uid: roleType === 'admin' ? 'demo-admin-id' : 'demo-customer-id',
      email: roleType === 'admin' ? 'admin@velvetfrost.com' : 'customer@gmail.com',
      displayName: roleType === 'admin' ? 'Boutique Admin' : 'Jane Doe'
    };
    const demoProf = {
      ...demoUser,
      role: roleType === 'admin' ? 'admin' : 'customer',
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setCurrentUser(demoUser);
    setUserProfile(demoProf);
  };

  const role = userProfile?.role || 'visitor';
  const status = userProfile?.status || 'active';
  const isAdmin = role === 'admin' || role === 'superAdmin';
  const isSuperAdmin = role === 'superAdmin';
  const isBanned = status === 'banned';

  const value = {
    currentUser,
    userProfile,
    role,
    status,
    isAdmin,
    isSuperAdmin,
    isBanned,
    loading,
    signup,
    login,
    loginWithGoogle,
    logout,
    loginDemoRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
