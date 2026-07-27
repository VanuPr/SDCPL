"use client";
import React, { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import styles from './Track.module.css';

const STAGES = [
  "Initialized",
  "Under Audit",
  "Visit Scheduled",
  "In Progress",
  "Completed"
];

export default function TrackProject() {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [error, setError] = useState('');

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;
    
    setLoading(true);
    setError('');
    setProject(null);

    try {
      const docRef = doc(db, "build_calculator_leads", trackingId.trim());
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      } else {
        setError('No project found with this Tracking ID. Please check and try again.');
      }
    } catch (err) {
      console.error("Error fetching project:", err);
      setError('An error occurred while fetching your project. Please try again later.');
    }
    setLoading(false);
  };

  const isCommercial = ['Commercial Building', 'Hotel', 'Office Space'].includes(project?.siteType);
  const propertyCategory = isCommercial ? 'COMMERCIAL' : 'RESIDENTIAL';

  let currentStageIndex = STAGES.indexOf(project?.status);
  let isCustomStatus = false;
  let isRejected = project?.status === 'Rejected';

  if (currentStageIndex === -1 && !isRejected && project?.status) {
    // Custom status, assume we don't know the exact progress, maybe highlight up to 'In Progress'
    // or just 'Initialized' based on logic. Let's just say it's active.
    isCustomStatus = true;
    currentStageIndex = 0; // fallback
  }

  return (
    <main className={styles.pageBackground}>
      <div className={styles.header}>
        <div className="container text-center">
          <h1 className={styles.pageTitle}>Track Your Project</h1>
          <p className={styles.subtitle}>Enter your Tracking ID to view real-time updates on your build.</p>
        </div>
      </div>

      <div className={`container ${styles.contentContainer}`}>
        {!project ? (
          <form onSubmit={handleTrack} className={styles.trackForm}>
            <input 
              type="text"
              placeholder="Enter your Tracking ID (e.g., FV5yCB...)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className={styles.inputField}
              required
            />
            <button type="submit" disabled={loading} className={styles.submitBtn}>
              {loading ? 'Searching...' : 'Track Status'}
            </button>
            {error && <p className={styles.errorMsg}>{error}</p>}
          </form>
        ) : (
          <div className={styles.dashboardCard}>
            
            <div className={styles.cardHeader}>
              <div className={styles.titleSection}>
                <h2 className={styles.projectTitle}>{project.name}'s {project.siteType}</h2>
                <div className={styles.badges}>
                  <span className={styles.badgePrimary}>
                    {project.basePackageRate === 1650 ? 'STANDARD PACKAGE' : project.basePackageRate === 1950 ? 'GOLD PACKAGE' : 'PLATINUM PACKAGE'}
                  </span>
                  <span className={styles.badgeSecondary}>OFFLINE SETUP</span>
                  <span className={styles.badgeWarning}>🏡 {propertyCategory}</span>
                </div>
              </div>
              <div className={styles.txnStatus}>
                TXN: OFFLINE / MANUAL
              </div>
            </div>

            <div className={styles.sectionBlock}>
              <h4 className={styles.sectionTitle}>CUSTOM SIZING OPTIONS</h4>
              <div className={styles.optionsList}>
                {project.selectedMaterials && project.selectedMaterials.length > 0 ? (
                  project.selectedMaterials.map((mat, i) => (
                    <span key={i} className={styles.optionBadge}>{mat}</span>
                  ))
                ) : (
                  <span className={styles.emptyText}>No additional options configured.</span>
                )}
              </div>
            </div>

            <div className={styles.infoGrid}>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>SITE LOCATION</span>
                <span className={styles.infoValue}>📍 Contact Office for Details</span>
              </div>
              <div className={styles.infoBlock}>
                <span className={styles.infoLabel}>PLOT DIMENSIONS / SIZING</span>
                <span className={styles.infoValue}>📐 {project.area} Sqft</span>
              </div>
            </div>

            <div className={styles.timelineSection}>
              <div className={styles.timelineHeader}>
                <h4 className={styles.sectionTitle}>CONSTRUCTION SITING STAGE</h4>
                <span className={`${styles.statusHighlight} ${isRejected ? styles.statusRejected : ''}`}>
                  {project.status.toUpperCase()}
                </span>
              </div>
              
              <div className={styles.timelineContainer}>
                {STAGES.map((stage, index) => {
                  let statusClass = styles.stagePending;
                  
                  if (isRejected) {
                    statusClass = styles.stageRejected;
                  } else if (isCustomStatus) {
                     // If custom, we only light up the first one as active, others pending
                     if (index === 0) statusClass = styles.stageActive;
                  } else {
                    if (index < currentStageIndex) statusClass = styles.stageCompleted;
                    else if (index === currentStageIndex) statusClass = styles.stageActive;
                  }

                  return (
                    <div key={stage} className={styles.timelineStage}>
                      <div className={`${styles.stageBar} ${statusClass}`}></div>
                      <span className={`${styles.stageLabel} ${index <= currentStageIndex && !isRejected ? styles.labelActive : ''}`}>
                        {stage.toUpperCase()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.dateInfo}>
                <span className={styles.dateLabel}>Initialized on</span>
                <span className={styles.dateValue}>
                  {new Date(project.timestamp).toLocaleDateString()}
                </span>
              </div>
              {project.updatedAt && (
                <div className={styles.dateInfo} style={{textAlign: 'right'}}>
                  <span className={styles.dateLabel}>Last Updated</span>
                  <span className={styles.dateValue}>
                    {new Date(project.updatedAt).toLocaleDateString()} {new Date(project.updatedAt).toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
            
            <button onClick={() => setProject(null)} className={styles.backBtn}>
              Track Another Project
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
