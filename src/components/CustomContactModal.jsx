"use client";
import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './CustomContactModal.module.css';

export default function CustomContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addDoc(collection(db, "custom_package_leads"), {
        ...formData,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', requirements: '' });
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (err) {
      console.error("Error adding document: ", err);
      // Since we don't have actual Firebase credentials yet, it will fail here.
      // We'll show a friendly error reminding them about credentials.
      if (err.message && err.message.includes("API key not valid")) {
         setError("Firebase API Key is missing. Please configure src/lib/firebase.js");
      } else {
         setError("Something went wrong. Please check Firebase configuration.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>×</button>
        
        <h2 className={styles.title}>Need a Custom Package?</h2>
        <p className={styles.subtitle}>Fill out your details and our team will get back to you with a tailored quote.</p>

        {success ? (
          <div className={styles.successMessage}>
            <span className={styles.successIcon}>✓</span>
            <p>Thank you! Your request has been received. We will contact you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.errorMessage}>{error}</div>}
            
            <div className={styles.formGroup}>
              <label>Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className={styles.input}
                placeholder="John Doe"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  className={styles.input}
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  className={styles.input}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Brief Requirements *</label>
              <textarea 
                name="requirements" 
                value={formData.requirements} 
                onChange={handleChange} 
                required 
                className={styles.textarea}
                placeholder="E.g., I want a mix of Gold and Platinum materials, mostly for a 2BHK villa..."
                rows="4"
              ></textarea>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Request Custom Quote'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
