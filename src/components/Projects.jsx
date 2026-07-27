"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';
import styles from './Projects.module.css';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        const projectsData = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(proj => !proj.hideFromPublic); // Filter out hidden projects
        setProjects(projectsData);
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };


  return (
    <section className="section bg-white" id="projects">
      <div className="container">
        <h2 className="section-title">Our Construction Projects</h2>
        <p className="section-subtitle">
          Built with precision, quality, and trust, ensuring your dream home is crafted to perfection.
        </p>
        
        {loading ? (
          <div className={styles.grid}>
            {[1, 2, 3].map((n) => (
              <div key={n} className={styles.card}>
                <div className={`${styles.imageWrapper} ${styles.skeleton}`}></div>
                <div className={styles.cardContent}>
                  <div className={`${styles.skeletonText} ${styles.skeleton}`}></div>
                  <div className={`${styles.skeletonTextSmall} ${styles.skeleton}`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No projects available yet.</div>
        ) : (
          <div className={styles.grid}>
            {projects.slice(0, visibleCount).map(project => (
              <div key={project.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {project.image ? (
                    <img src={project.image} alt={project.title} className={styles.cardImage} />
                  ) : (
                    <div className={styles.placeholderImage}>No Image</div>
                  )}
                  <div className={styles.tagsContainer}>
                    <span className={styles.tag}>{project.type}</span>
                    <span className={`${styles.tag} ${project.status === 'Completed' ? styles.statusCompleted : styles.statusProgress}`}>{project.status}</span>
                  </div>
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <p className={styles.location}>
                    <span className={styles.locationIcon}>📍</span> {project.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {projects.length > visibleCount && (
          <div className={styles.actions}>
            <button className={styles.outlineBtn} onClick={handleLoadMore}>
              View {Math.min(12, projects.length - visibleCount)} more projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
