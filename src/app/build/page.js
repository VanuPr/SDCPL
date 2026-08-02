"use client";
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';
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
  const [city, setCity] = useState('Ranchi');
  const [packageRate, setPackageRate] = useState(1650); // Default standard
  const [selectedMaterials, setSelectedMaterials] = useState(new Set());
  
  // Lead Submission State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [locationText, setLocationText] = useState('');
  const [mapLink, setMapLink] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const pkg = params.get('package');
      if (pkg === 'standard') setPackageRate(1650);
      if (pkg === 'gold') setPackageRate(1950);
      if (pkg === 'platinum') setPackageRate(2350);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser && currentUser.displayName) {
        setContactName(prev => prev || currentUser.displayName);
      }
    });
    return () => unsubscribe();
  }, []);

  const isGoogleUser = user && user.displayName && user.photoURL;

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

  const handleAuthAndSubmit = async (e) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) {
      alert("Please fill all details.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await submitWithUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in.");
    }
  };

  const submitWithUser = async (currentUser) => {
    setIsSubmitting(true);
    try {
      const selectedMaterialNames = [];
      materialsData.forEach(cat => {
        cat.items.forEach(item => {
          if (selectedMaterials.has(item.id)) selectedMaterialNames.push(item.name);
        });
      });

      const docRef = await addDoc(collection(db, "build_calculator_leads"), {
        name: contactName,
        phone: contactPhone,
        email: currentUser.email,
        googleUserId: currentUser.uid,
        area: area,
        siteType: siteType,
        city: city,
        basePackageRate: packageRate,
        addonRate: addonRate,
        totalCost: totalCost,
        selectedMaterials: selectedMaterialNames,
        locationText: locationText,
        mapLink: mapLink,
        status: 'Initialized',
        timestamp: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setSubmissionId(docRef.id);
      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsModalOpen(false);
        setContactName(currentUser.displayName || '');
        setContactPhone('');
        setLocationText('');
        setMapLink('');
        setSubmissionId('');
      }, 10000);
    } catch (err) {
      console.error("Error submitting lead:", err);
      alert("Failed to submit.");
    }
    setIsSubmitting(false);
  };

  const handleSubmitLead = async (e) => {
    e.preventDefault();
    if (!isGoogleUser) {
      await handleAuthAndSubmit(e);
      return;
    }
    await submitWithUser(user);
  };

  const handleDownloadId = () => {
    const text = `SDCPL Project Submission\n\nTracking ID: ${submissionId}\nDate: ${new Date().toLocaleString()}\nEstimated Cost: Rs. ${totalCost.toLocaleString('en-IN')}\n\nYou can use this Tracking ID to track your project status on our website at /track.`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SDCPL_Tracking_${submissionId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setMapLink(`https://www.google.com/maps?q=${lat},${lng}`);
        if (!locationText) {
          setLocationText("Location detected via GPS");
        }
        setIsLocating(false);
      },
      (error) => {
        alert("Unable to retrieve location: " + error.message);
        setIsLocating(false);
      }
    );
  };

  const siteTypes = ["1 BHK", "2 BHK", "3 BHK", "4 BHK", "Villa", "Independent House", "Bungalow", "Commercial Building", "Hotel", "Office Space", "Apartment Complex"];
  const popularCities = ["Ranchi", "Jamshedpur", "Dhanbad", "Bokaro", "Patna", "Kolkata", "Other"];

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
            
            <div className={styles.inputGroup}>
              <label>City</label>
              <select 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={styles.inputField}
              >
                {popularCities.map(c => (
                  <option key={c} value={c}>{c}</option>
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
            
            <button className={styles.submitBtn} onClick={() => setIsModalOpen(true)}>
              Submit for Detailed Quote
            </button>
            <p className={styles.disclaimer}>
              *This is a live estimate. Final cost is provided via an itemised BOQ after physical site inspection.
            </p>
          </div>
        </div>
      </div>

      {/* Submission Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => !isSubmitting && !submitSuccess && setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            {submitSuccess ? (
              <div className={styles.successMessage}>
                <h3>Thank you, {contactName}!</h3>
                <p>We've received your build requirements and will contact you shortly.</p>
                <div className={styles.trackingBox}>
                  <h4>Your Tracking ID</h4>
                  <div className={styles.trackingId}>{submissionId}</div>
                  <p>Please save this ID to track your project status.</p>
                  <div className={styles.trackingActions}>
                    <button type="button" onClick={handleDownloadId} className={styles.downloadBtn}>
                      Download ID
                    </button>
                    <Link href="/track" className={styles.trackLinkBtn}>
                      Track Now
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <h3 className={styles.modalTitle}>Get Your Itemised BOQ</h3>
                <p className={styles.modalSubtitle}>Provide your contact details and our engineers will get in touch with you.</p>
                <form onSubmit={handleSubmitLead} className={styles.leadForm}>
                  <div className={styles.formGroup}>
                    <label>Full Name</label>
                    <input type="text" required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="John Doe" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <input type="tel" required value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+91 00000 00000" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Site Location / Address</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <input 
                        type="text" 
                        required 
                        value={locationText} 
                        onChange={e => setLocationText(e.target.value)} 
                        placeholder="Plot No., Street, Landmark" 
                        style={{ flex: 1 }}
                      />
                      <button 
                        type="button" 
                        onClick={handleAutoDetectLocation}
                        disabled={isLocating}
                        style={{
                          padding: '0 15px',
                          backgroundColor: mapLink ? '#10b981' : '#4f46e5',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontWeight: '500',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}
                      >
                        {isLocating ? 'Detecting...' : mapLink ? '✓ Detected' : 'Auto Detect GPS'}
                      </button>
                    </div>
                  </div>
                  <div className={styles.modalActions}>
                    <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
                    {isGoogleUser ? (
                      <button type="submit" disabled={isSubmitting} className={styles.confirmSubmitBtn}>
                        {isSubmitting ? 'Sending...' : 'Send Requirements'}
                      </button>
                    ) : (
                      <button type="button" onClick={handleAuthAndSubmit} disabled={isSubmitting} className={styles.confirmSubmitBtn}>
                        Sign in with Google to Submit
                      </button>
                    )}
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
