"use client";
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Link from 'next/link';

export default function ProjectsRepository() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('Ongoing');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const q = query(collection(db, "build_calculator_leads"), where("googleUserId", "==", currentUser.uid));
          const snap = await getDocs(q);
          const userProjects = snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          // Sort by timestamp descending
          userProjects.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setProjects(userProjects);
        } catch (e) {
          console.error("Error fetching projects", e);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!user) return null; // handled by layout

  const filteredProjects = projects.filter(p => activeTab === 'Ongoing' ? (p.status !== 'Completed') : (p.status === 'Completed'));

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>My Projects</h1>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>Track the progress of your active and past constructions.</p>
        </div>
        <Link href="/build" style={{ padding: '10px 20px', background: 'var(--primary-color)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontWeight: '600' }}>
          + New Project Request
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px' }}>
        {['Ongoing', 'Completed Archive'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '12px 24px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--primary-color)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary-color)' : '#64748b',
              fontWeight: activeTab === tab ? '600' : '500',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
            <p style={{ color: '#64748b' }}>Loading your projects...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>No {activeTab} Projects Found</h3>
            <p style={{ color: '#64748b' }}>You don't have any projects in this category.</p>
          </div>
        ) : (
          filteredProjects.map(project => (
            <Link href={`/dashboard/projects/${project.id}`} key={project.id} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ height: '160px', background: '#f1f5f9', position: 'relative' }}>
                  {/* Default cover image if none available */}
                  <img src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=800&auto=format&fit=crop" alt="Project Cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', top: '12px', right: '12px', background: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: '#0f172a', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    {project.status || 'Pending'}
                  </div>
                </div>
                <div style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{project.id.slice(0, 8)}</span>
                      <h3 style={{ fontSize: '18px', color: '#0f172a', fontWeight: 'bold', marginTop: '4px' }}>{project.siteType || 'Custom Project'} ({project.area || 0} sqft)</h3>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                      <span style={{ color: '#475569', fontWeight: '500' }}>Overall Progress</span>
                      <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>0%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '0%', height: '100%', background: 'var(--primary-color)' }}></div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Submitted On</span>
                      <span style={{ display: 'block', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>{project.timestamp ? new Date(project.timestamp).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '12px', color: '#64748b' }}>Estimated Cost</span>
                      <span style={{ display: 'block', fontSize: '14px', color: '#0f172a', fontWeight: '500' }}>₹{((project.totalCost || 0)/100000).toFixed(1)}L</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
