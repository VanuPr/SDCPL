"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc, addDoc } from 'firebase/firestore';
import Link from 'next/link';
import styles from './CalculatorAdmin.module.css';

export default function CalculatorAdmin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const q = query(collection(db, "build_calculator_leads"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const leadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeads(leadsData);
      } catch (err) {
        console.error("Error fetching calculator leads:", err);
      }
      setLoading(false);
    };

    fetchLeads();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    let finalStatus = newStatus;
    if (newStatus === 'Custom') {
      const customStatus = window.prompt("Enter custom status:");
      if (!customStatus || customStatus.trim() === '') {
        return; // Cancelled
      }
      finalStatus = customStatus.trim();
    }

    try {
      const updateData = { status: finalStatus, updatedAt: new Date().toISOString() };
      await updateDoc(doc(db, "build_calculator_leads", id), updateData);
      
      const currentLead = leads.find(l => l.id === id);
      if (finalStatus === 'In Progress' && currentLead && !currentLead.projectId) {
        const projectData = {
          title: `${currentLead.name}'s Project`,
          location: currentLead.siteType || 'India',
          type: 'Residential',
          status: 'Ongoing',
          hideFromPublic: true, // Default to hidden until they edit and add photo
          image: '',
          leadId: id
        };
        const pRef = await addDoc(collection(db, "projects"), projectData);
        await updateDoc(doc(db, "build_calculator_leads", id), { projectId: pRef.id });
        updateData.projectId = pRef.id;
        alert("Project auto-created! Go to Projects tab to add photos and make it public.");
      }

      setLeads(leads.map(lead => lead.id === id ? { ...lead, ...updateData } : lead));
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const PREDEFINED_STATUSES = ["Initialized", "Under Audit", "Visit Scheduled", "In Progress", "Completed", "Rejected"];

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Let's Build Calculator Leads</h1>
        <p className={styles.subtitle}>People who calculated their build cost and requested a BOQ.</p>
      </div>

      {loading ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th><th>Client Info</th><th>Project Details</th><th>Selected Materials</th><th>Est. Cost</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(n => (
                <tr key={n}>
                  <td><div className={`${styles.skeletonText} ${styles.skeleton}`}></div></td>
                  <td>
                    <div className={`${styles.skeletonText} ${styles.skeleton}`} style={{marginBottom: '4px'}}></div>
                    <div className={`${styles.skeletonTextSmall} ${styles.skeleton}`}></div>
                  </td>
                  <td>
                    <div className={`${styles.skeletonText} ${styles.skeleton}`} style={{marginBottom: '4px'}}></div>
                    <div className={`${styles.skeletonTextSmall} ${styles.skeleton}`}></div>
                  </td>
                  <td><div className={`${styles.skeletonBadge} ${styles.skeleton}`}></div></td>
                  <td>
                    <div className={`${styles.skeletonText} ${styles.skeleton}`} style={{marginBottom: '4px'}}></div>
                    <div className={`${styles.skeletonTextSmall} ${styles.skeleton}`}></div>
                  </td>
                  <td><div className={`${styles.skeletonBadge} ${styles.skeleton}`}></div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Client Info</th>
                <th>Project Details</th>
                <th>Selected Materials</th>
                <th>Est. Cost</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan="6" className={styles.empty}>No calculator leads received yet.</td></tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id}>
                    <td className={styles.dateCell}>
                      {new Date(lead.timestamp).toLocaleDateString()} <br />
                      <span className={styles.time}>{new Date(lead.timestamp).toLocaleTimeString()}</span>
                    </td>
                    <td>
                      <div className={styles.fw600}>{lead.name}</div>
                      <div className={styles.phone}>{lead.phone}</div>
                    </td>
                    <td>
                      <div className={styles.fw600}>{lead.siteType}</div>
                      <div>{lead.area} sqft</div>
                      <div className={styles.tag}>Base: ₹{lead.basePackageRate}/sqft</div>
                    </td>
                    <td className={styles.materialsCell}>
                      {lead.selectedMaterials && lead.selectedMaterials.length > 0 ? (
                        <div className={styles.materialsList}>
                          {lead.selectedMaterials.slice(0, 3).map((mat, i) => <span key={i} className={styles.matTag}>{mat}</span>)}
                          {lead.selectedMaterials.length > 3 && (
                            <span className={styles.matTag} style={{ background: 'var(--secondary)', color: 'var(--secondary-foreground)', borderColor: 'var(--border)' }}>
                              +{lead.selectedMaterials.length - 3} more
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className={styles.none}>None selected</span>
                      )}
                    </td>
                    <td className={styles.costCell}>
                      <div className={styles.fw600}>₹{lead.totalCost?.toLocaleString('en-IN')}</div>
                      <div className={styles.rate}>Total: ₹{(lead.basePackageRate + lead.addonRate)}/sqft</div>
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <select 
                          value={lead.status || 'Initialized'} 
                          onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                          className={styles.statusSelect}
                        >
                          {lead.status && !PREDEFINED_STATUSES.includes(lead.status) && (
                            <option value={lead.status}>{lead.status}</option>
                          )}
                          {PREDEFINED_STATUSES.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                          <option value="Custom">Custom...</option>
                        </select>
                        <Link 
                          href={`/admin/dashboard/calculator/${lead.id}`}
                          className={styles.viewBtn} 
                        >
                          View Details
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
