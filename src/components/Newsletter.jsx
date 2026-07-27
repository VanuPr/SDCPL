"use client";
import React, { useState } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import styles from './Newsletter.module.css';

export default function Newsletter() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, "newsletter_subscribers"), {
        ...formData,
        subscribedAt: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', city: '' });
    } catch (err) {
      console.error("Error subscribing:", err);
      alert("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <section className={styles.newsletterSection}>
      <div className="container">
        <div className={styles.newsletterCard}>
          <div className={styles.content}>
            <h2 className={styles.title}>Subscribe to our Newsletter</h2>
            <p className={styles.subtitle}>Get the latest updates on premium construction projects, design trends, and exclusive offers.</p>
          </div>
          
          <div className={styles.formContainer}>
            {success ? (
              <div className={styles.successMessage}>
                <h3>Thank you for subscribing!</h3>
                <p>We'll keep you updated.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                  <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={styles.input} />
                  <input type="tel" placeholder="Phone Number" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={styles.input} />
                </div>
                <div className={styles.inputGroup}>
                  <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className={styles.input} />
                  <input type="text" placeholder="City" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className={styles.input} />
                </div>
                <button type="submit" disabled={loading} className={styles.submitBtn}>
                  {loading ? 'Subscribing...' : 'Subscribe Now'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
