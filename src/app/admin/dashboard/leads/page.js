"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../../../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styles from './LeadsAdmin.module.css';

export default function LeadsAdmin() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const q = query(collection(db, "custom_package_leads"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);
        const leadsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setLeads(leadsData);
      } catch (err) {
        console.error("Error fetching leads:", err);
      }
      setLoading(false);
    };

    fetchLeads();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Custom Package Enquiries</h1>
        <p className={styles.subtitle}>People who filled out the Custom Package form.</p>
      </div>

      {loading ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Date</th><th>Name</th><th>Contact Info</th><th>Requirements</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(n => (
                <tr key={n}>
                  <td><div className={`${styles.skeletonText} ${styles.skeleton}`}></div></td>
                  <td><div className={`${styles.skeletonText} ${styles.skeleton}`}></div></td>
                  <td>
                    <div className={`${styles.skeletonText} ${styles.skeleton}`} style={{marginBottom: '4px'}}></div>
                    <div className={`${styles.skeletonTextSmall} ${styles.skeleton}`}></div>
                  </td>
                  <td>
                    <div className={`${styles.skeletonText} ${styles.skeleton}`} style={{width: '100%', marginBottom: '4px'}}></div>
                    <div className={`${styles.skeletonText} ${styles.skeleton}`} style={{width: '80%'}}></div>
                  </td>
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
                <th>Name</th>
                <th>Contact Info</th>
                <th>Requirements</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan="4" className={styles.empty}>No custom leads received yet.</td></tr>
              ) : (
                leads.map(lead => (
                  <tr key={lead.id}>
                    <td className={styles.dateCell}>
                      {new Date(lead.timestamp).toLocaleDateString()} <br />
                      <span className={styles.time}>{new Date(lead.timestamp).toLocaleTimeString()}</span>
                    </td>
                    <td className={styles.fw600}>{lead.name}</td>
                    <td>
                      <div>{lead.phone}</div>
                      <div className={styles.email}>{lead.email}</div>
                    </td>
                    <td className={styles.requirements}>{lead.requirements}</td>
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
