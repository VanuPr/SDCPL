'use client';

import React from 'react';
import styles from './CityModal.module.css';
import { useLocation } from '@/context/LocationContext';

export default function CityModal() {
  const { isModalOpen, setIsModalOpen, setCity, city: currentCity } = useLocation();

  if (!isModalOpen) return null;

  const cities = [
    { name: 'Dhanbad', icon: '/dhanbad_icon.png' },
    { name: 'Deoghar', icon: '/deoghar_icon.png' },
    { name: 'Ranchi', icon: '/ranchi_icon.png' },
    { name: 'Bhagalpur', icon: '/bhagalpur_icon.png' }
  ];

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {/* Only show close button if a city is already selected (meaning user opened it manually) */}
        {currentCity && (
          <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>×</button>
        )}
        
        <h2 className={styles.title}>Select Your City</h2>
        <p className={styles.subtitle}>Choose your location to see customized offerings and accurate contact details.</p>
        
        <div className={styles.cityGrid}>
          {cities.map((cityOption) => (
            <button 
              key={cityOption.name}
              className={`${styles.cityBtn} ${currentCity === cityOption.name ? styles.active : ''}`}
              onClick={() => setCity(cityOption.name)}
            >
              <img src={cityOption.icon} alt={cityOption.name} className={styles.cityIcon} />
              <span className={styles.cityName}>{cityOption.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
