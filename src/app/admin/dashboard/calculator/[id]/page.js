"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../../../../lib/firebase';
import { doc, getDoc, updateDoc, addDoc, collection } from 'firebase/firestore';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './LeadDetails.module.css';

export default function LeadDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, "build_calculator_leads", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setLead({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log("No such document!");
        }
      } catch (err) {
        console.error("Error fetching lead:", err);
      }
      setLoading(false);
    };

    fetchLead();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
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

      if (finalStatus === 'In Progress' && lead && !lead.projectId) {
        const projectData = {
          title: `${lead.name}'s Project`,
          location: lead.siteType || 'India',
          type: 'Residential',
          status: 'Ongoing',
          hideFromPublic: true,
          image: '',
          leadId: id
        };
        const pRef = await addDoc(collection(db, "projects"), projectData);
        await updateDoc(doc(db, "build_calculator_leads", id), { projectId: pRef.id });
        updateData.projectId = pRef.id;
        alert("Project auto-created! Go to Projects tab to add photos and make it public.");
      }

      setLead({ ...lead, ...updateData });
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const PREDEFINED_STATUSES = ["Initialized", "Under Audit", "Visit Scheduled", "In Progress", "Completed", "Rejected"];

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeletonHeader}></div>
        <div className={styles.skeletonBody}></div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className={styles.container}>
        <h2>Lead not found</h2>
        <Link href="/admin/dashboard/calculator" className={styles.backBtn}>Back to Submissions</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Link href="/admin/dashboard/calculator" className={styles.backBtn}>← Back</Link>
        <div className={styles.actions}>
          <select 
            value={lead.status || 'Initialized'} 
            onChange={(e) => handleStatusChange(e.target.value)}
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
        </div>
      </div>

      <div className={styles.card}>
        <h1 className={styles.title}>Client Details: {lead.name}</h1>
        
        <div className={styles.grid}>
          <div className={styles.gridItem}>
            <span className={styles.label}>Phone Number</span>
            <span className={styles.value}>{lead.phone}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Submission Date</span>
            <span className={styles.value}>{new Date(lead.timestamp).toLocaleString()}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Project Type</span>
            <span className={styles.value}>{lead.siteType}</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Project Area</span>
            <span className={styles.value}>{lead.area} sqft</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Base Rate</span>
            <span className={styles.value}>₹{lead.basePackageRate}/sqft</span>
          </div>
          <div className={styles.gridItem}>
            <span className={styles.label}>Total Estimated Cost</span>
            <span className={styles.valueCost}>₹{lead.totalCost?.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className={styles.materialsSection}>
          <h2 className={styles.sectionTitle}>Selected Materials ({lead.selectedMaterials?.length || 0})</h2>
          <div className={styles.materialsList}>
            {lead.selectedMaterials && lead.selectedMaterials.length > 0 ? (
              lead.selectedMaterials.map((mat, i) => (
                <span key={i} className={styles.matTag}>{mat}</span>
              ))
            ) : (
              <span className={styles.none}>No materials selected</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
