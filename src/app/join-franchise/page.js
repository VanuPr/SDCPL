"use client";
import React, { useState } from 'react';
import styles from './Franchise.module.css';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function JoinFranchise() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    location: '',
    investment: '',
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
      await addDoc(collection(db, "franchise_leads"), {
        ...formData,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', location: '', investment: '', message: '' });
      setTimeout(() => setSuccess(false), 8000);
    } catch (error) {
      console.error("Error submitting franchise form:", error);
      alert("Failed to send application. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className={styles.pageBackground}>
      <div className={styles.header}>
        <div className="container text-center">
          <h1 className={styles.title}>Join Our Franchise Network</h1>
          <p className={styles.subtitle}>Partner with STAVYA Design & Construction and build a profitable business in your city.</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        <div className={styles.formCard}>
          <h3>Apply for Franchise</h3>
          
          {success && (
            <div className={styles.successMessage}>
              Thank you for your interest! Your franchise application has been submitted successfully. Our team will contact you shortly.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input type="text" name="name" required value={formData.name} onChange={handleChange} className={styles.inputField} placeholder="John Doe" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} className={styles.inputField} placeholder="+91 00000 00000" />
            </div>
            
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input type="email" name="email" required value={formData.email} onChange={handleChange} className={styles.inputField} placeholder="john@example.com" />
            </div>

            <div className={styles.formGroup}>
              <label>Proposed Franchise Location (City/Town)</label>
              <input type="text" name="location" required value={formData.location} onChange={handleChange} className={styles.inputField} placeholder="e.g. Ranchi, Jharkhand" />
            </div>

            <div className={styles.formGroup}>
              <label>Investment Capacity</label>
              <select name="investment" required value={formData.investment} onChange={handleChange} className={styles.selectField}>
                <option value="" disabled>Select Investment Capacity</option>
                <option value="5 Lakhs - 10 Lakhs">₹5 Lakhs - ₹10 Lakhs</option>
                <option value="10 Lakhs - 25 Lakhs">₹10 Lakhs - ₹25 Lakhs</option>
                <option value="25 Lakhs - 50 Lakhs">₹25 Lakhs - ₹50 Lakhs</option>
                <option value="50 Lakhs+">₹50 Lakhs+</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label>Why do you want to partner with us?</label>
              <textarea name="message" required value={formData.message} onChange={handleChange} className={styles.inputField} placeholder="Tell us about your background and why you are interested in a STAVYA franchise..." />
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
