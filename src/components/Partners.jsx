import React from 'react';
import styles from './Partners.module.css';

export default function Partners() {
  const brands = [
    { name: "ISI Steel" },
    { name: "UltraTech Cement" },
    { name: "Jaquar" },
    { name: "Asian Paints" },
    { name: "Kajaria" },
    { name: "Hindware" },
    { name: "Greenply" },
    { name: "Havells" },
    { name: "Saint Gobain" }
  ];

  return (
    <section className="section bg-white">
      <div className="container">
        
        {/* Referral Banner */}
        <div className={styles.referralBanner}>
          <div className={styles.bannerImage}>
            {/* Simple CSS illustration placeholder for the boy on phone */}
            <div className={styles.illustration}>
              <div className={styles.circle}></div>
              <div className={styles.person}>📱</div>
            </div>
          </div>
          <div className={styles.bannerContent}>
            <h3>Refer your friends and family looking to build their dream home and earn up to <br/> <span className={styles.amount}>₹1,00,000</span></h3>
            <button className={styles.learnMoreBtn}>Learn More</button>
          </div>
        </div>

        {/* Banking Partners */}
        <div className={styles.partnersSection}>
          <h2 className="section-title text-center">Trusted Materials & Brands</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
            As a Government-approved civil engineering firm, we only use the highest quality materials.
          </p>
          
          <div className={styles.partnerGrid}>
            {brands.map((brand, idx) => (
              <div key={idx} className={styles.partnerCard}>
                <span className={styles.brandName}>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* In the news header */}
        <div className={styles.newsSection}>
          <h2 className="section-title">STAVYA in the news !</h2>
        </div>

      </div>
    </section>
  );
}
