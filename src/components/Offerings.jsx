'use client';
import React, { useState } from 'react';
import styles from './Offerings.module.css';

export default function Offerings() {
  const [activeTab, setActiveTab] = useState('Basic');
  const tabs = ['Basic', 'Classic', 'Premium', 'Royale'];

  return (
    <section className="section bg-secondary">
      <div className="container">
        <h2 className="section-title text-center">
          Take a Closer Look at STAVYA Design & Construction <br /> Company offerings
        </h2>
        
        <div className={styles.imageContainer}>
          <img src="/offerings-kitchen.png" alt="Kitchen Sink Offerings" className={styles.mainImage} />
          
          {/* Tooltips overlay */}
          <div className={styles.tooltipContainer}>
            
            {/* Tooltip 1 */}
            <div className={`${styles.tooltipWrapper} ${styles.pos1}`}>
              <div className={styles.dot}></div>
              <div className={styles.line}></div>
              <div className={styles.tooltipBox}>
                <strong>Ceramic Wall Dado</strong> - Upto Rs.40 per Sqft
              </div>
            </div>

            {/* Tooltip 2 */}
            <div className={`${styles.tooltipWrapper} ${styles.pos2}`}>
              <div className={styles.dot}></div>
              <div className={styles.line}></div>
              <div className={styles.tooltipBox}>
                <strong>Kitchen Sink</strong> - Stainless Steel of Single Sink make worth Rs. 3,000
              </div>
            </div>

            {/* Tooltip 3 */}
            <div className={`${styles.tooltipWrapper} ${styles.pos3}`}>
              <div className={styles.dot}></div>
              <div className={styles.line}></div>
              <div className={styles.tooltipBox}>
                <strong>Main Sink Faucet</strong> - Upto Rs.1300 <br/>
                <span style={{fontWeight: 'normal', fontSize: '11px'}}>Any other Faucet or Accessories - ISI Marked</span>
              </div>
            </div>
            
          </div>
        </div>

        <div className={styles.tabsWrapper}>
          <div className={styles.tabs}>
            {tabs.map(tab => (
              <button 
                key={tab}
                className={`${styles.tabBtn} ${activeTab === tab ? styles.active : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
}
