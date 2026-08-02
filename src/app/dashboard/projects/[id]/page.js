"use client";
import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';

import { db } from '../../../../lib/firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

export default function ProjectDetails(props) {
  const params = use(props.params);
  const [activeTab, setActiveTab] = useState('overview'); // overview, timeline, gallery, budget, documents
  const [project, setProject] = useState(null);
  const [realProject, setRealProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProject() {
      try {
        const docRef = doc(db, 'build_calculator_leads', params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const leadData = { id: docSnap.id, ...docSnap.data() };
          setProject(leadData);

          // If the project has been converted and started by admin
          if (leadData.projectId) {
             const projRef = doc(db, 'projects', leadData.projectId);
             const projSnap = await getDoc(projRef);
             if (projSnap.exists()) {
                const projData = { id: projSnap.id, ...projSnap.data() };
                setRealProject(projData);

                // Fetch milestones
                const msSnap = await getDocs(collection(db, 'projects', leadData.projectId, 'milestones'));
                const msList = msSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setMilestones(msList);

                // Fetch media
                const mediaSnap = await getDocs(collection(db, 'projects', leadData.projectId, 'media'));
                const mediaList = mediaSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
                setMediaItems(mediaList);
             }
          }
        } else {
          console.error("No such project!");
        }
      } catch (e) {
        console.error("Error fetching project:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProject();
  }, [params.id]);

  if (loading) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>Loading project details...</div>;
  }

  if (!project) {
    return <div style={{ padding: '60px', textAlign: 'center', color: '#b91c1c' }}>Project not found.</div>;
  }

  // Map real data to UI format
  // If realProject exists, we use its live data. Otherwise, we fallback to lead data.
  const p = {
    id: realProject ? realProject.id : project.id,
    title: realProject ? realProject.title : `${project.siteType || 'Custom Project'} (${project.area || 0} sqft)`,
    serviceType: "Construction",
    pmName: realProject && realProject.assignedStaff?.pm ? 'Assigned (View in Contact)' : 'Pending Allocation',
    status: realProject ? realProject.status : (project.onboardingStatus || "Initialized"),
    dates: {
      created: project.timestamp ? new Date(project.timestamp).toLocaleDateString() : 'N/A',
      estCompletion: realProject?.startDate ? "In Progress" : "TBD"
    },
    progress: realProject?.completion || 0,
    budget: {
      estimated: realProject?.initialRequirements?.totalCost || project.totalCost || 0,
      spent: (realProject?.labourCost || 0) + (realProject?.materialCost || 0),
      breakdown: []
    },
    phases: [
      { name: 'Initial Planning', status: realProject ? 'Completed' : 'In Progress', progress: realProject ? 100 : 50 },
      { name: 'Construction', status: realProject?.status === 'In Progress' ? 'In Progress' : 'Pending', progress: realProject?.completion || 0 }
    ],
    milestones: milestones,
    gallery: mediaItems.filter(m => m.category === 'Photo' || m.category === 'Video').map(m => ({
      id: m.id,
      url: m.url,
      label: m.name,
      date: new Date(m.uploadedAt).toLocaleDateString(),
      type: m.category
    })),
    logs: [],
    documents: mediaItems.filter(m => m.category === 'Document').map(m => ({
      id: m.id,
      url: m.url,
      name: m.name,
      type: m.category,
      date: new Date(m.uploadedAt).toLocaleDateString()
    }))
  };

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div style={{ paddingBottom: '60px' }}>
      {/* Back Button & Header */}
      <div style={{ marginBottom: '24px' }}>
        <Link href="/dashboard/projects" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', fontSize: '14px', marginBottom: '16px' }}>
          ← Back to Projects
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 'bold', margin: 0 }}>{p.title}</h1>
              <span style={{ background: '#e0e7ff', color: '#4338ca', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>{p.status}</span>
            </div>
            <div style={{ display: 'flex', gap: '16px', color: '#64748b', fontSize: '14px' }}>
              <span>ID: <strong style={{ color: '#0f172a' }}>{p.id}</strong></span>
              <span>•</span>
              <span>PM: <strong style={{ color: '#0f172a' }}>{p.pmName}</strong></span>
              <span>•</span>
              <span>Est. Completion: <strong style={{ color: '#0f172a' }}>{p.dates.estCompletion}</strong></span>
            </div>
          </div>
          <button style={{ padding: '10px 20px', background: 'white', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', color: '#0f172a', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            Contact PM
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid #e2e8f0', marginBottom: '32px', overflowX: 'auto' }}>
        {[
          { id: 'overview', label: 'Overview & Logs' },
          { id: 'timeline', label: 'Timeline & Milestones' },
          { id: 'gallery', label: 'Site Gallery' },
          { id: 'budget', label: 'Budget Tracker' },
          { id: 'documents', label: 'Documents Vault' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 20px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary-color)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary-color)' : '#64748b',
              fontWeight: activeTab === tab.id ? '600' : '500',
              fontSize: '15px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ display: 'grid', gap: '32px' }}>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', alignItems: 'start' }}>
            {/* Main Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Overall Progress Card */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Overall Progress</h3>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary-color)' }}>{p.progress}%</span>
                </div>
                <div style={{ width: '100%', height: '12px', background: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{ width: `${p.progress}%`, height: '100%', background: 'var(--primary-color)' }}></div>
                </div>
              </div>
              
              {/* Latest Gallery Snippet */}
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a' }}>Latest Site Photos</h3>
                  <button onClick={() => setActiveTab('gallery')} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: '600', cursor: 'pointer' }}>View All</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  {p.gallery.length === 0 ? (
                    <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                      <p style={{ color: '#64748b', fontSize: '14px' }}>No photos uploaded yet.</p>
                    </div>
                  ) : (
                    p.gallery.slice(0, 3).map((img, i) => (
                      <div key={i} style={{ borderRadius: '8px', overflow: 'hidden', height: '120px', position: 'relative', background: '#f1f5f9' }}>
                        {img.type === 'Video' ? (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Video</div>
                        ) : (
                          <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Side Column (Activity Log) */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '20px' }}>Live Activity Log</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {p.logs.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>No activity logs yet.</p>
                  </div>
                ) : (
                  p.logs.map(log => (
                    <div key={log.id} style={{ display: 'flex', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e0e7ff', color: '#4338ca', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px', flexShrink: 0 }}>
                        {log.author[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: '14px', color: '#0f172a', marginBottom: '4px', lineHeight: '1.4' }}>{log.text}</p>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                          <strong>{log.author}</strong> • {log.time}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TIMELINE TAB */}
        {activeTab === 'timeline' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px' }}>Phase-wise Timeline</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {p.phases.map((phase, i) => (
                  <div key={i}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{phase.name}</span>
                      <span style={{ fontSize: '12px', fontWeight: '600', color: phase.status === 'Completed' ? '#15803d' : phase.status === 'In Progress' ? '#1d4ed8' : '#64748b', background: phase.status === 'Completed' ? '#dcfce7' : phase.status === 'In Progress' ? '#dbeafe' : '#f1f5f9', padding: '2px 8px', borderRadius: '12px' }}>
                        {phase.status}
                      </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${phase.progress}%`, height: '100%', background: phase.status === 'Completed' ? '#22c55e' : 'var(--primary-color)' }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px' }}>Milestone Checklist</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {p.milestones.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Milestones not set yet.</p>
                  </div>
                ) : (
                  p.milestones.map(ms => (
                    <div key={ms.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: ms.status === 'Completed' ? '#22c55e' : 'transparent', border: ms.status === 'Completed' ? 'none' : '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px' }}>
                        {ms.status === 'Completed' && '✓'}
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '14px', fontWeight: '600', color: ms.status === 'Completed' ? '#64748b' : '#0f172a', textDecoration: ms.status === 'Completed' ? 'line-through' : 'none' }}>{ms.title}</p>
                        <p style={{ fontSize: '12px', color: '#94a3b8' }}>Est: {ms.date}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* GALLERY TAB */}
        {activeTab === 'gallery' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {p.gallery.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>No Gallery Photos</h3>
                <p style={{ color: '#64748b' }}>Site photos have not been uploaded yet.</p>
              </div>
            ) : (
              p.gallery.map((img, i) => (
                <div key={i} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                  <div style={{ height: '200px', background: '#f8fafc' }}>
                    {img.type === 'Video' ? (
                      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '18px', fontWeight: 'bold' }}>
                        <a href={img.url} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: 'var(--primary-color)' }}>Watch Video</a>
                      </div>
                    ) : (
                      <img src={img.url} alt={img.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
                  <div style={{ padding: '16px' }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>{img.label}</p>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>{img.date}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* BUDGET TAB */}
        {activeTab === 'budget' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#0f172a', marginBottom: '24px' }}>Total Expenditure Overview</h3>
              
              <div style={{ display: 'flex', gap: '40px', marginBottom: '32px' }}>
                <div>
                  <p style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Total Estimated</p>
                  <p style={{ fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>{formatCurrency(p.budget.estimated)}</p>
                </div>
                <div>
                  <p style={{ fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Total Spent</p>
                  <p style={{ fontSize: '28px', color: 'var(--primary-color)', fontWeight: 'bold' }}>{formatCurrency(p.budget.spent)}</p>
                </div>
              </div>

              <div style={{ width: '100%', height: '16px', background: '#f1f5f9', borderRadius: '8px', overflow: 'hidden', marginBottom: '40px' }}>
                <div style={{ width: `${(p.budget.spent / p.budget.estimated) * 100}%`, height: '100%', background: 'var(--primary-color)' }}></div>
              </div>

              <h4 style={{ fontSize: '16px', fontWeight: '600', color: '#0f172a', marginBottom: '16px' }}>Category Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {p.budget.breakdown.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
                    <p style={{ color: '#64748b', fontSize: '14px' }}>Budget breakdown not available yet.</p>
                  </div>
                ) : (
                  p.budget.breakdown.map((cat, i) => (
                    <div key={i} style={{ padding: '16px', border: '1px solid #f1f5f9', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>{cat.category}</p>
                        <p style={{ fontSize: '13px', color: '#64748b' }}>{((cat.spent / cat.total) * 100).toFixed(0)}% used of {formatCurrency(cat.total)}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a' }}>{formatCurrency(cat.spent)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === 'documents' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
            {p.documents.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', padding: '60px', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                <h3 style={{ fontSize: '18px', color: '#0f172a', marginBottom: '8px' }}>No Documents</h3>
                <p style={{ color: '#64748b' }}>No documents have been uploaded to the vault yet.</p>
              </div>
            ) : (
              p.documents.map(doc => (
                <div key={doc.id} style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                    📄
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '4px' }}>{doc.name}</p>
                    <p style={{ fontSize: '13px', color: '#64748b' }}>{doc.type}</p>
                  </div>
                  <a href={doc.url} target="_blank" rel="noreferrer" style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', textDecoration: 'none', fontWeight: '600', fontSize: '14px' }}>
                    Download / View
                  </a>
                </div>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
