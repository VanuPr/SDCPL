"use client";
import React, { useState, useEffect } from 'react';
import styles from './Build.module.css';
import { materialsData } from './materialsData';

// Custom hook for number animation
function useCountUp(end, duration = 1000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;
    const startValue = count;
    
    const easeOutExpo = (t) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutExpo(progress));
      setCount(currentCount);

      if (progress < 1) {
        animationFrame = window.requestAnimationFrame(step);
      } else {
        setCount(end);
      }
    };

    animationFrame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return count;
}

export default function BuildCalculator() {
  const [area, setArea] = useState(1000);
  const [siteType, setSiteType] = useState('Independent House');
  const [packageRate, setPackageRate] = useState(1650); // Default standard
  const [selectedMaterials, setSelectedMaterials] = useState(new Set());

  const handleMaterialToggle = (item) => {
    const newSet = new Set(selectedMaterials);
    if (newSet.has(item.id)) {
      newSet.delete(item.id);
    } else {
      newSet.add(item.id);
    }
    setSelectedMaterials(newSet);
  };

  const calculateAddons = () => {
    let addonRate = 0;
    materialsData.forEach(category => {
      category.items.forEach(item => {
        if (selectedMaterials.has(item.id)) {
          addonRate += item.pricePerSqft;
        }
      });
    });
    return addonRate;
  };

  const addonRate = calculateAddons();
  const totalRatePerSqft = packageRate + addonRate;
  const totalCost = area * totalRatePerSqft;
  
  const animatedCost = useCountUp(totalCost, 800);

  const siteTypes = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa", "Independent House", "Bungalow", "Commercial Building", "Hotel", "Office Space", "Apartment Complex"];

  return (
    <main className={styles.pageBackground}>
      <div className={styles.header}>
        <div className="container text-center">
          <h1 className={styles.title}>Let's Build Your Dream</h1>
          <p className={styles.subtitle}>Customize your requirements and instantly get a live estimated cost.</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        {/* Left Column: The Wizard */}
        <div className={styles.wizardColumn}>
          
          {/* Step 1: Property Details */}
          <section className={styles.wizardSection}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>1</span>
              <h2>Property Details</h2>
            </div>
            
            <div className={styles.inputGroup}>
              <label>Build Area (in sq. ft.)</label>
              <input 
                type="number" 
                value={area} 
                onChange={(e) => setArea(Math.max(100, Number(e.target.value)))}
                className={styles.inputField}
                min="100"
              />
            </div>
            
            <div className={styles.inputGroup}>
              <label>Site Type</label>
              <select 
                value={siteType}
                onChange={(e) => setSiteType(e.target.value)}
                className={styles.inputField}
              >
                {siteTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </section>

          {/* Step 2: Package Selection */}
          <section className={styles.wizardSection}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>2</span>
              <h2>Base Package</h2>
            </div>
            
            <div className={styles.packageGrid}>
              <div 
                className={`${styles.packageCard} ${packageRate === 1650 ? styles.activePackage : ''}`}
                onClick={() => setPackageRate(1650)}
              >
                <h4>Standard</h4>
                <p>₹1,650 / sqft</p>
              </div>
              <div 
                className={`${styles.packageCard} ${packageRate === 1950 ? styles.activePackage : ''} ${styles.goldPackage}`}
                onClick={() => setPackageRate(1950)}
              >
                <div className={styles.popularBadge}>Most Popular</div>
                <h4>Gold</h4>
                <p>₹1,950 / sqft</p>
              </div>
              <div 
                className={`${styles.packageCard} ${packageRate === 2350 ? styles.activePackage : ''}`}
                onClick={() => setPackageRate(2350)}
              >
                <h4>Platinum</h4>
                <p>₹2,350 / sqft</p>
              </div>
            </div>
          </section>

          {/* Step 3: Material Add-ons Checklist */}
          <section className={styles.wizardSection}>
            <div className={styles.stepHeader}>
              <span className={styles.stepNumber}>3</span>
              <h2>Custom Requirements & Materials</h2>
            </div>
            <p className={styles.helperText}>Select premium add-ons or specific material preferences to customize your build. Costs are added per sqft.</p>

            <div className={styles.materialsAccordion}>
              {materialsData.map((category, idx) => (
                <div key={idx} className={styles.categoryBlock}>
                  <h3 className={styles.categoryTitle}>{category.category}</h3>
                  <div className={styles.itemsGrid}>
                    {category.items.map((item) => (
                      <label 
                        key={item.id} 
                        className={`${styles.materialItem} ${selectedMaterials.has(item.id) ? styles.selectedMaterial : ''}`}
                      >
                        <input 
                          type="checkbox" 
                          checked={selectedMaterials.has(item.id)}
                          onChange={() => handleMaterialToggle(item)}
                          className={styles.checkbox}
                        />
                        <div className={styles.itemInfo}>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemPrice}>+ ₹{item.pricePerSqft}/sqft</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Right Column: Sticky Cost Panel */}
        <div className={styles.stickyColumn}>
          <div className={styles.costPanel}>
            <h3 className={styles.panelTitle}>Estimated Cost</h3>
            
            <div className={styles.animatedCostContainer}>
              <span className={styles.currencySymbol}>₹</span>
              <span className={styles.animatedNumber}>
                {animatedCost.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className={styles.costBreakdown}>
              <div className={styles.breakdownRow}>
                <span>Area:</span>
                <span>{area} sqft</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Base Package:</span>
                <span>₹{packageRate}/sqft</span>
              </div>
              <div className={styles.breakdownRow}>
                <span>Material Add-ons:</span>
                <span>+ ₹{addonRate}/sqft</span>
              </div>
              <div className={styles.divider}></div>
              <div className={`${styles.breakdownRow} ${styles.totalRate}`}>
                <span>Total Rate:</span>
                <span>₹{totalRatePerSqft}/sqft</span>
              </div>
            </div>
            
            <button className={styles.submitBtn}>
              Submit for Detailed Quote
            </button>
            <p className={styles.disclaimer}>
              *This is a live estimate. Final cost is provided via an itemised BOQ after physical site inspection.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
