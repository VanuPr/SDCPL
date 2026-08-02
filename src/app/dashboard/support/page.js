"use client";
import React, { useState, useEffect } from 'react';
import styles from '../Dashboard.module.css';
import { db, auth } from '../../../lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function ClientDashboard() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchTickets(currentUser.uid);
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchTickets = async (uid) => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "contact_submissions"),
        where("userId", "==", uid)
      );
      const querySnapshot = await getDocs(q);
      const fetchedTickets = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort in memory because Firestore requires an index for compound queries (where + orderBy)
      fetchedTickets.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setTickets(fetchedTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
    setLoading(false);
  };

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Pending': return styles.statusPending;
      case 'Under Audit': return styles.statusUnderAudit;
      case 'In Progress': return styles.statusInProgress;
      case 'Completed': return styles.statusCompleted;
      case 'Rejected': return styles.statusRejected;
      default: return styles.statusCustom;
    }
  };

  return (
    <main className={styles.pageBackground}>
      <div className={styles.header}>
        <div className="container text-center">
          <h1 className={styles.pageTitle}>Client Dashboard</h1>
          <p className={styles.subtitle}>Track your support tickets and service requests.</p>
        </div>
      </div>

      <div className={`container ${styles.contentContainer}`}>
        {loading ? (
          <div className={styles.loading}>Loading your dashboard...</div>
        ) : !user ? (
          <div className={styles.signInContainer}>
            <h2>Sign in to view your tickets</h2>
            <p>You need to be logged in with Google to access your support dashboard.</p>
            <button onClick={handleSignIn} className={styles.googleBtn}>
              Sign In with Google
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', color: '#0f172a' }}>Your Support Tickets</h2>
              <span style={{ color: '#64748b', fontSize: '14px' }}>Logged in as {user.email}</span>
            </div>

            {tickets.length === 0 ? (
              <div className={styles.emptyState}>
                <h3>No tickets found</h3>
                <p>You haven't submitted any support requests or linked them to this account yet.</p>
                <Link href="/contact" className={styles.linkBtn}>Submit a Request</Link>
              </div>
            ) : (
              <div className={styles.ticketGrid}>
                {tickets.map(ticket => (
                  <div key={ticket.id} className={styles.ticketCard}>
                    <div className={styles.ticketHeader}>
                      <span className={styles.ticketId}>{ticket.id}</span>
                      <span className={`${styles.statusBadge} ${getStatusClass(ticket.status)}`}>
                        {ticket.status || 'Pending'}
                      </span>
                    </div>
                    
                    <div className={styles.ticketBody}>
                      <span className={styles.ticketLabel}>Message</span>
                      <p className={styles.ticketMessage}>{ticket.message}</p>
                    </div>

                    <div className={styles.ticketFooter}>
                      <span>{new Date(ticket.timestamp).toLocaleDateString()}</span>
                      <span>{new Date(ticket.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
