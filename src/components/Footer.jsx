'use client';
import React from 'react';
import styles from './Footer.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocation } from '@/context/LocationContext';

export default function Footer() {
  const { city } = useLocation();
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) return null;

  const mockAddresses = {
    Dhanbad: "Mock Office, Dhanbad, Jharkhand, India",
    Deoghar: "By Pass Road Rampur, Near Jha Thakur Fuel Pump, Deoghar Jharkhand, India",
    Ranchi: "Mock Office, Ranchi, Jharkhand, India",
    Bhagalpur: "Mock Office, Bhagalpur, Bihar, India"
  };

  const addressToShow = mockAddresses[city] || mockAddresses['Deoghar'];
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.footerContainer}`}>
        
        {/* Column 1: Location */}
        <div className={styles.column}>
          <h4 className={styles.heading}>LOCATION</h4>
          <div className={styles.logoSection}>
            <Link href="/" className={styles.logo}>
              <img src="/logo.png" alt="Stavya Design & Construction" style={{ height: '50px', objectFit: 'contain' }} />
            </Link>
            <address className={styles.address}>
              By Pass Road Rampur,<br/>
              Near Jha Thakur Fuel Pump,<br/>
              Deoghar, Jharkhand,<br/>
              India.
            </address>
          </div>
        </div>

        {/* Column 2: Site Map */}
        <div className={styles.column}>
          <h4 className={styles.heading}>SITE MAP</h4>
          <ul className={styles.links}>
            <li><Link href="/about">Company Profile</Link></li>
            <li><Link href="/services">Services</Link></li>
            <li><Link href="/#packages">Turnkey Packages</Link></li>
            <li><Link href="/#features">Key Features</Link></li>
            <li><Link href="/#partners">Material Partners</Link></li>
            <li><Link href="/#service-areas">Service Areas</Link></li>
            <li><Link href="/#projects">Portfolio Highlights</Link></li>
          </ul>
        </div>

        {/* Column 3: Service Areas */}
        <div className={styles.column}>
          <h4 className={styles.heading}>SERVICE AREAS</h4>
          <p className={styles.address} style={{lineHeight: '1.8'}}>
            Deoghar, Dumka, Jasidih, Madhupur, Sarath, Karon, Mohanpur, Sarwan, Devipur, Margomunda, Palojori, Sonaraithari.
          </p>
          
          <h4 className={styles.heading} style={{marginTop: '30px'}}>TESTIMONIALS</h4>
          <div className={styles.testimonial}>
            <span className={styles.quoteMark}>&#8220;</span>
            <p className={styles.quoteText}>best construction work I have ever seen</p>
            <p className={styles.author}>- Angel</p>
            <span className={styles.quoteMarkBottom}>&#8221;</span>
          </div>
        </div>

        {/* Column 4: Contact & Social */}
        <div className={styles.column}>
          <h4 className={styles.heading}>CONTACT</h4>
          <div className={styles.contactInfo}>
            <p>✉ info@stavyadesignconstruction.com</p>
            <p>📞 Mobile : +91 8825166415</p>
          </div>
          
          <h4 className={styles.heading} style={{marginTop: '30px'}}>SOCIAL LINKS</h4>
          <div className={styles.socials}>
            <a href="#" className={styles.icon}>🐦</a>
            <a href="#" className={styles.icon}>▶</a>
            <a href="#" className={styles.icon}>f</a>
            <a href="#" className={styles.icon}>in</a>
            <a href="#" className={styles.icon}>📷</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
