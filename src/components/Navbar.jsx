'use client';
import React, { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import Link from 'next/link';
import { useLocation } from '@/context/LocationContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const { city, setIsModalOpen, isLoaded } = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navContainer}`}>
        <div className={styles.logoGroup}>
          <Link href="/" className={styles.logo}>
            <img src="/logo.png" alt="Stavya Design & Construction" style={{ height: '45px', objectFit: 'contain' }} />
          </Link>
          <div className={styles.locationDropdown} onClick={() => setIsModalOpen(true)}>
            {isLoaded ? (city || 'Select City') : '...'} <span className={styles.arrow}>▼</span>
          </div>
        </div>

        <ul className={styles.navLinks}>
          <li><Link href="/about">Company Profile</Link></li>
          <li><Link href="/services">Services</Link></li>
          <li><Link href="/#packages">Turnkey Packages</Link></li>
          <li><Link href="/#projects">Portfolio</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>

        <div className={styles.navActions}>
          <div className={styles.contactDetails}>
            <div className={styles.email}>✉ info@stavyadesignconstruction.com</div>
            <div className={styles.phone}>📞 +91 8825166415</div>
          </div>
          <Link href="/build" className="btn-primary">Let's Build</Link>
        </div>
      </div>
    </nav>
  );
}
