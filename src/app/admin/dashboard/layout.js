"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Link from 'next/link';
import Image from 'next/image';
import styles from './AdminLayout.module.css';

export default function AdminDashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        if (currentUser.email === 'admin@sd.in') {
          setUser(currentUser);
        } else {
          await signOut(auth);
          router.push('/admin/login?error=unauthorized');
        }
      } else {
        router.push('/admin/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/admin/login');
  };

  if (loading) {
    return <div className={styles.loader}>Loading Admin...</div>;
  }

  if (!user) return null; // Prevent flash of content before redirect

  const navItems = [
    { name: 'Projects', path: '/admin/dashboard/projects' },
    { name: 'Custom Leads', path: '/admin/dashboard/leads' },
    { name: 'Calculator Submissions', path: '/admin/dashboard/calculator' },
    { name: 'Contacts', path: '/admin/dashboard/contacts' },
    { name: 'Franchise Apps', path: '/admin/dashboard/franchise' },
    { name: 'Designer Apps', path: '/admin/dashboard/designers' },
    { name: 'Reviews', path: '/admin/dashboard/reviews' },
    { name: 'Cost Constants', path: '/admin/dashboard/cost-constants' },
  ];

  return (
    <div className={`admin-theme dark ${styles.adminLayout}`}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoContainer}>
          <Image src="/logo.png" alt="SDCPL Logo" width={150} height={50} className={styles.logoImage} />
          <span className={styles.adminTag}>Admin</span>
        </div>
        <nav className={styles.nav}>
          {navItems.map(item => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <p className={styles.userEmail}>{user.email}</p>
          <button onClick={handleLogout} className={styles.logoutBtn}>Logout</button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
