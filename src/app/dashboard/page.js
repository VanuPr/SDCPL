"use client";
import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css';
import { db, auth } from '../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function DashboardOverview() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    activeProjects: 0,
    supportTickets: 0,
    completedProjects: 0
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch quick stats
        try {
          const ticketsQ = query(collection(db, "contact_submissions"), where("userId", "==", currentUser.uid));
          const ticketsSnap = await getDocs(ticketsQ);

          const projectsQ = query(collection(db, "build_calculator_leads"), where("googleUserId", "==", currentUser.uid));
          const projectsSnap = await getDocs(projectsQ);
          
          setStats(prev => ({
            ...prev,
            supportTickets: ticketsSnap.docs.length,
            activeProjects: projectsSnap.docs.length,
            completedProjects: 0
          }));
        } catch (e) {
          console.error(e);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) return null; // handled by layout

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Welcome back, {user.displayName || 'Customer'}!</h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>Here's an overview of your STAVYA construction projects.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Active Projects</h3>
          <p style={{ fontSize: '32px', color: '#0f172a', fontWeight: 'bold' }}>{stats.activeProjects}</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Support Tickets</h3>
          <p style={{ fontSize: '32px', color: '#0f172a', fontWeight: 'bold' }}>{stats.supportTickets}</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Completed Projects</h3>
          <p style={{ fontSize: '32px', color: '#0f172a', fontWeight: 'bold' }}>{stats.completedProjects}</p>
        </div>
      </div>

      <div style={{ background: 'white', padding: '32px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>Quick Actions</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          <Link href="/build" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', background: '#f1f5f9', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s', color: '#0f172a', fontWeight: '600' }} onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}>
            <span style={{ fontSize: '24px', marginBottom: '12px' }}>🏗️</span>
            Start New Project
          </Link>
          <Link href="/contact" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', background: '#f1f5f9', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s', color: '#0f172a', fontWeight: '600' }} onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}>
            <span style={{ fontSize: '24px', marginBottom: '12px' }}>🎧</span>
            Request Support
          </Link>
          <Link href="/dashboard/billing" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '24px', background: '#f1f5f9', borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s', color: '#0f172a', fontWeight: '600' }} onMouseOver={(e) => e.currentTarget.style.background = '#e2e8f0'} onMouseOut={(e) => e.currentTarget.style.background = '#f1f5f9'}>
            <span style={{ fontSize: '24px', marginBottom: '12px' }}>💳</span>
            View Invoices
          </Link>
        </div>
      </div>
    </div>
  );
}
