"use client";
import React, { useState, useEffect } from 'react';
import { auth } from '../../lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './DashboardLayout.module.css';

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', icon: '🏠' },
    { name: 'My Projects', path: '/dashboard/projects', icon: '🏗️' },
    { name: 'Billing & Invoices', path: '/dashboard/billing', icon: '💳' },
    { name: 'Support Tickets', path: '/dashboard/support', icon: '🎧' },
    { name: 'Profile Settings', path: '/dashboard/profile', icon: '⚙️' },
  ];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <h2>Customer Portal</h2>
          <p>Sign in with your Google account to access your STAVYA construction dashboard, track progress, view live updates, and manage your invoices.</p>
          <button onClick={handleSignIn} className={styles.googleBtn}>
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.layoutContainer}>
      <aside className={styles.sidebar}>
        <div className={styles.userProfile}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" className={styles.avatar} />
          ) : (
            <div className={styles.avatarPlaceholder}>{user.email[0].toUpperCase()}</div>
          )}
          <div className={styles.userInfo}>
            <p className={styles.userName}>{user.displayName || 'Customer'}</p>
            <p className={styles.userEmail}>{user.email}</p>
          </div>
        </div>
        
        <nav className={styles.navMenu}>
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link 
                key={item.path} 
                href={item.path} 
                className={`${styles.navItem} ${isActive ? styles.activeNavItem : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>
        
        <button onClick={() => signOut(auth)} className={styles.signOutBtn}>
          Sign Out
        </button>
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
