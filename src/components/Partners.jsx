"use client";
import React from 'react';
import styles from './Partners.module.css';

export default function Partners() {
  const brands = [
    { name: "Tata Steel (ISI)", logo: "/partners/isi-steel.png" },
    { name: "UltraTech Cement", logo: "/partners/ultratech.png" },
    { name: "Jaquar", logo: "/partners/jaquar.svg" },
    { name: "Asian Paints", logo: "/partners/asian-paints.png" },
    { name: "Kajaria", logo: "/partners/kajaria.png" },
    { name: "Hindware", logo: "/partners/hindware.png" },
    { name: "Greenply", logo: "/partners/greenply.png" },
    { name: "Havells", logo: "/partners/havells.webp" },
    { name: "Saint Gobain", logo: "/partners/saint-gobain.webp" }
  ];

  const bankBrands = [
    { name: "SBI", logo: "/partners/SBI-Logo.png" },
    { name: "Punjab National Bank", logo: "/partners/pnb.svg" },
    { name: "ICICI Bank", logo: "/partners/icici.png" },
    { name: "Axis Bank", logo: "/partners/Axis_Bank_logo.svg.webp" },
    { name: "HDFC Bank", logo: "/partners/HDFC_Bank_Logo.svg.webp" },
    { name: "LIC Housing", logo: "/partners/LIC_Housing_Finance_logo.png" }
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
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className={styles.brandLogo} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* Banking Partners */}
        <div className={styles.partnersSection} style={{ marginTop: '60px' }}>
          <h2 className="section-title text-center">Banking & Finance Partners</h2>
          <p className="text-center" style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
            We have tied up with leading financial institutions to ensure smooth home loan approvals.
          </p>
          
          <div className={styles.partnerGrid}>
            {bankBrands.map((brand, idx) => (
              <div key={idx} className={styles.partnerCard}>
                <img 
                  src={brand.logo} 
                  alt={brand.name} 
                  className={styles.brandLogo} 
                  style={{ objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150x60?text=" + brand.name;
                  }}
                />
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
