"use client";
import React, { useState } from 'react';
import styles from '../join-franchise/Franchise.module.css';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function JoinDesigner() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    portfolio: '',
    experience: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "designer_leads"), {
        ...formData,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', portfolio: '', experience: '', message: '' });
      setTimeout(() => setSuccess(false), 8000);
    } catch (error) {
      console.error("Error submitting designer form:", error);
      alert("Failed to send application. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className={styles.pageBackground}>
      <div className={styles.header}>
        <div className="container text-center">
          <h1 className={styles.title}>Join as a Designer / Architect</h1>
          <p className={styles.subtitle}>Bring your creative vision to life by joining the elite design team at STAVYA.</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.formCard}>
          <h3>Apply Now</h3>
          
          {success && (
            <div className={styles.successMessage}>
              Thank you for applying! Your portfolio and details have been submitted. Our HR team will reach out to you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className={styles.inputField} placeholder="Jane Doe" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={styles.inputField} placeholder="+91 00000 00000" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className={styles.inputField} placeholder="jane@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label>Portfolio Link (Behance, Google Drive, Website)</label>
              <input type="url" name="portfolio" required value={formData.portfolio} onChange={handleChange} className={styles.inputField} placeholder="https://..." />
            </div>

            <div className={styles.formGroup}>
              <label>Years of Experience</label>
              <select name="experience" required value={formData.experience} onChange={handleChange} className={styles.selectField}>
                <option value="" disabled>Select Experience</option>
                <option value="Fresher">Fresher (0 - 1 year)</option>
                <option value="1 - 3 Years">1 - 3 Years</option>
                <option value="3 - 5 Years">3 - 5 Years</option>
                <option value="5+ Years">5+ Years</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Tell us about yourself</label>
              <textarea name="message" required value={formData.message} onChange={handleChange} className={styles.inputField} placeholder="Briefly describe your design style and software proficiency (AutoCAD, SketchUp, 3ds Max, etc.)..." />
            </div>
            
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
