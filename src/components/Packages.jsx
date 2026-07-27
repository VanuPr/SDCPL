"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './Packages.module.css';
import CustomContactModal from './CustomContactModal';

export default function Packages() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const packages = [
    {
      name: "Standard Package",
      price: "₹1,650",
      description: "Basic and durable home construction",
      features: [
        "RCC structure with ISI steel",
        "Vitrified tiles flooring",
        "Standard sanitary fittings",
        "Acrylic distemper paint"
      ],
      isPopular: false
    },
    {
      name: "Gold Package",
      price: "₹1,950",
      description: "Premium finish with branded materials",
      features: [
        "Premium vitrified tiles",
        "Jaquar / Cera branded fittings",
        "Premium emulsion paint",
        "Modular kitchen base included"
      ],
      isPopular: true
    },
    {
      name: "Platinum Package",
      price: "₹2,350",
      description: "Luxury finish with smart features",
      features: [
        "Imported marble / wooden floors",
        "Designer modular kitchen with island",
        "Smart home automation",
        "Designer false ceiling with lighting"
      ],
      isPopular: false
    }
  ];

  return (
    <section className="section bg-secondary" id="packages">
      <div className="container">
        <h2 className="section-title text-center">
          Turnkey Construction Packages
        </h2>
        <p className="text-center" style={{color: 'var(--text-secondary)', marginBottom: '40px'}}>
          Transparent pricing based on square feet area
        </p>
        
        <div className={styles.grid}>
          {packages.map((pkg, idx) => (
            <div key={idx} className={`${styles.card} ${pkg.isPopular ? styles.popular : ''}`}>
              {pkg.isPopular && <div className={styles.badge}>Most Popular</div>}
              <h3 className={styles.name}>{pkg.name}</h3>
              <div className={styles.priceContainer}>
                <span className={styles.price}>{pkg.price}</span>
                <span className={styles.unit}>/ sqft</span>
              </div>
              <p className={styles.desc}>{pkg.description}</p>
              
              <ul className={styles.features}>
                {pkg.features.map((feature, fIdx) => (
                  <li key={fIdx}>
                    <span className={styles.check}>✓</span> {feature}
                  </li>
                ))}
              </ul>
              
              <Link href={`/build?package=${pkg.name.split(' ')[0].toLowerCase()}`} className={`btn-primary ${styles.btn}`} style={{ display: 'block', textAlign: 'center' }}>
                Let's Build
              </Link>
            </div>
          ))}
        </div>

        <div className={styles.customBanner}>
          <div className={styles.customBannerContent}>
            <h3>Need a custom package?</h3>
            <p>We tailor materials, finishes and timelines to your exact brief and budget.</p>
            <button className={styles.talkBtn} onClick={() => setIsModalOpen(true)}>Talk to our team</button>
          </div>
        </div>

        <div style={{
          marginTop: '50px',
          padding: '25px',
          background: 'white',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-sm)',
          borderLeft: '4px solid var(--primary-color)',
          textAlign: 'center'
        }}>
          <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px', color: 'var(--text-primary)' }}>
            ✓ Absolute Price Transparency (Itemised BOQ)
          </h4>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '15px', lineHeight: '1.6' }}>
            We provide a detailed <strong>Itemised BOQ (Bill of Quantities)</strong> before starting any project. 
            This means there are <strong>no hidden costs</strong>, and billing is strictly done based on work milestones achieved.
          </p>
        </div>

        <CustomContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </section>
  );
}
