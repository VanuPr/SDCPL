"use client";
import React, { useState } from 'react';
import styles from './Contact.module.css';
import { db } from '../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
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
      await addDoc(collection(db, "contact_submissions"), {
        ...formData,
        timestamp: new Date().toISOString()
      });
      setSuccess(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.error("Error submitting contact form:", error);
      alert("Failed to send message. Please try again.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <main className={styles.pageBackground}>
      <div className={styles.header}>
        <div className="container text-center">
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>Have a question or want to discuss a project? We're here to help.</p>
        </div>
      </div>

      <div className={`container ${styles.layout}`}>
        
        {/* Contact Information */}
        <div className={styles.infoCard}>
          <h3>Get in Touch</h3>
          
          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>📍</div>
            <div className={styles.contactText}>
              <h4>Head Office</h4>
              <p>STAVYA Design & Construction<br/>Karmik Nagar, Dhanbad<br/>Jharkhand - 826004</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>📞</div>
            <div className={styles.contactText}>
              <h4>Phone</h4>
              <p>+91 8825166415</p>
            </div>
          </div>

          <div className={styles.contactItem}>
            <div className={styles.contactIcon}>✉️</div>
            <div className={styles.contactText}>
              <h4>Email</h4>
              <p>info@stavyadesignconstruction.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className={styles.formCard}>
          <h3>Send us a Message</h3>
          
          {success && (
            <div className={styles.successMessage}>
              Thank you! Your message has been sent successfully. We will get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                required 
                value={formData.name} 
                onChange={handleChange} 
                className={styles.inputField} 
                placeholder="John Doe" 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input 
                type="tel" 
                name="phone" 
                required 
                value={formData.phone} 
                onChange={handleChange} 
                className={styles.inputField} 
                placeholder="+91 00000 00000" 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Email Address</label>
              <input 
                type="email" 
                name="email" 
                required 
                value={formData.email} 
                onChange={handleChange} 
                className={styles.inputField} 
                placeholder="john@example.com" 
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Your Message</label>
              <textarea 
                name="message" 
                required 
                value={formData.message} 
                onChange={handleChange} 
                className={styles.inputField} 
                placeholder="How can we help you?" 
              />
            </div>
            
            <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
