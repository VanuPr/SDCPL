'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './Hero.module.css';
import { useLocation } from '@/context/LocationContext';

export default function Hero() {
  const { city } = useLocation();
  const [formCity, setFormCity] = useState('');

  useEffect(() => {
    if (city) {
      setFormCity(city);
    }
  }, [city]);
  return (
    <section className={styles.heroSection}>
      <div className={styles.overlay}></div>
      <div className={`container ${styles.heroContainer}`}>
        
        {/* Left Side: Text and Stats */}
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Construct Your <br/>
            <span className={styles.highlight}>Dream Home</span> <br/>
            <span className={styles.withBox}>with STAVYA</span>
          </h1>
          <p className={styles.subtitle}>
            Turning ideas into <strong>concrete reality</strong> with itemised BOQ and zero hidden costs.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/build" className={styles.primaryBtn}>
              Let's Build! (Cost Calculator)
            </Link>
            <Link href="#packages" className={styles.secondaryBtn}>
              Explore Packages
            </Link>
          </div>
          
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <h3>8+</h3>
              <p>Years Experience</p>
            </div>
            <div className={styles.statItem}>
              <h3>120+</h3>
              <p>Homes Built</p>
            </div>
            <div className={styles.statItem}>
              <h3>20+</h3>
              <p>Expert Team</p>
            </div>
          </div>
        </div>

        {/* Right Side: Lead Form */}
        <div className={styles.formCard}>
          <h2 className={styles.formTitle}>Talk to Our Expert</h2>
          <form className={styles.leadForm} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="text" 
              placeholder="Name" 
              className={styles.inputField} 
              required
            />
            <div className={styles.phoneInput}>
              <span className={styles.countryCode}>🇮🇳 +91</span>
              <input 
                type="tel" 
                placeholder="Phone Number" 
                className={styles.inputField}
                required
              />
            </div>
            <select 
              className={styles.inputField} 
              required 
              value={formCity} 
              onChange={(e) => setFormCity(e.target.value)}
            >
              <option value="" disabled>Location of your Plot - City*</option>
              <option value="Dhanbad">Dhanbad</option>
              <option value="Deoghar">Deoghar</option>
              <option value="Ranchi">Ranchi</option>
              <option value="Bhagalpur">Bhagalpur</option>
            </select>
            <button type="submit" className={styles.submitBtn}>
              Book Free Consultation
            </button>
            <p className={styles.disclaimer}>
              By submitting, you agree to our <span>privacy policy</span>, allowing us to use your information as outlined.
            </p>
          </form>
        </div>

      </div>
    </section>
  );
}
