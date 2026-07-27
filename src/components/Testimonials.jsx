"use client";
import React, { useState, useEffect } from 'react';
import styles from './Testimonials.module.css';
import { db, auth } from '../lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Neelam & Ratan Okhandiar",
      year: "2024",
      crn: "CRN211861",
      image: "/testimonial1.png",
      quote: `"After a lifetime of service, we needed someone we could rely on-and we found it with STAVYA."`,
      rating: 4.5,
      isVideo: true
    },
    {
      id: 2,
      name: "Rajasri Suresh",
      year: "2025",
      crn: "CRN299808",
      image: "/testimonial2.png",
      quote: `"Ajay and Rajasri's Dream Home"`,
      rating: 5,
      isVideo: true
    },
    {
      id: 3,
      name: "Gajanan K Hegde",
      year: "2024",
      crn: "CRN162781",
      image: "/testimonial3.png",
      quote: `"We looked at so many apartments, but nothing felt like home."`,
      rating: 5,
      isVideo: true
    }
  ];

  const [dbReviews, setDbReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [isWriting, setIsWriting] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "reviews"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setDbReviews(data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    };
    fetchReviews();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthOnly = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in.");
    }
  };

  const handleAuthAndSubmit = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      alert("Please write a review first.");
      return;
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await submitGivenUser(result.user);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      alert("Failed to sign in.");
    }
  };

  const submitGivenUser = async (currentUser) => {
    setSubmitting(true);
    try {
      const newReview = {
        name: currentUser.displayName,
        year: new Date().getFullYear().toString(),
        crn: "G-Auth User",
        image: currentUser.photoURL,
        quote: `"${reviewText.trim()}"`,
        rating: rating,
        timestamp: new Date().toISOString()
      };
      const docRef = await addDoc(collection(db, "reviews"), newReview);
      setDbReviews([{ id: docRef.id, ...newReview }, ...dbReviews]);
      setIsWriting(false);
      setReviewText('');
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Failed to submit review.");
    }
    setSubmitting(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;
    
    const isGoogle = user && user.displayName && user.photoURL;
    
    if (!isGoogle) {
      await handleAuthAndSubmit(e);
      return;
    }
    await submitGivenUser(user);
  };

  const allReviews = [...dbReviews, ...testimonials];
  const isGoogleUser = user && user.displayName && user.photoURL;

  const filters = [
    "✓ All", "Basic Package", "Premium Package", "> 1000 sqft", "3+ BHK", "> 1 floor", "> ₹ 50 lakhs"
  ];

  return (
    <section className="section bg-secondary">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 className="section-title">10,000+ Homeowners. Real Experiences.</h2>
            <p className="section-subtitle">
              Watch real homeowners share their experience from planning to handover
            </p>
          </div>
          <div>
            {!isWriting ? (
              <button onClick={() => setIsWriting(true)} className={styles.addReviewBtn}>
                Write a Review
              </button>
            ) : (
              <button onClick={() => setIsWriting(false)} className={styles.cancelReviewBtn}>Cancel</button>
            )}
          </div>
        </div>

        {isWriting && (
          <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
            <div className={styles.formHeader}>
              {isGoogleUser ? (
                <>
                  <img src={user.photoURL} alt={user.displayName} className={styles.userPhoto} />
                  <div>
                    <strong>{user.displayName}</strong>
                    <p>Posting publicly</p>
                  </div>
                </>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div>
                    <strong>Guest User</strong>
                    <p>You will need to sign in to post</p>
                  </div>
                  <button type="button" onClick={handleAuthOnly} className={styles.addReviewBtn} style={{ padding: '6px 12px', fontSize: '13px' }}>
                    Sign in with Google
                  </button>
                </div>
              )}
            </div>
            <div className={styles.ratingSelect}>
              <label>Rating: </label>
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                <option value={3}>⭐⭐⭐ (3/5)</option>
                <option value={2}>⭐⭐ (2/5)</option>
                <option value={1}>⭐ (1/5)</option>
              </select>
            </div>
            <textarea 
              required
              className={styles.reviewInput}
              placeholder="Share details of your own experience at this place"
              value={reviewText}
              onChange={e => setReviewText(e.target.value)}
              rows="4"
            />
            <div style={{ textAlign: 'right', marginTop: '12px' }}>
              {isGoogleUser ? (
                <button type="submit" disabled={submitting} className={styles.submitReviewBtn}>
                  {submitting ? 'Posting...' : 'Post Review'}
                </button>
              ) : (
                <button type="button" onClick={handleAuthAndSubmit} disabled={submitting} className={styles.submitReviewBtn}>
                  Sign in with Google to Post
                </button>
              )}
            </div>
          </form>
        )}

        <div className={styles.filtersWrapper}>
          {filters.map((filter, idx) => (
            <button key={idx} className={`${styles.filterBtn} ${idx === 0 ? styles.active : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        <div className={styles.grid}>
          {allReviews.map(item => (
            <div key={item.id} className={styles.card}>
              <div className={styles.videoWrapper}>
                <img src={item.image} alt={item.name} className={styles.thumbnail} style={!item.isVideo ? { objectFit: 'contain', background: '#f8fafc' } : {}} />
                {item.isVideo && (
                  <>
                    <div className={styles.playBtn}>
                      <svg viewBox="0 0 24 24" fill="white" width="24" height="24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className={styles.badge}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
                    </div>
                  </>
                )}
              </div>
              <div className={styles.content}>
                <div className={styles.headerRow}>
                  <h3 className={styles.name}>{item.name}</h3>
                  <span className={styles.year}>{item.year}</span>
                </div>
                <p className={styles.crn}>{item.crn}</p>
                <div className={styles.stars}>
                  {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                </div>
                <p className={styles.quote}>{item.quote}</p>
                <button className={styles.readMore}>Read more ...</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
