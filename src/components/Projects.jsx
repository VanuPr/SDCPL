import React from 'react';
import styles from './Projects.module.css';

export default function Projects() {
  const projects = [
    {
      id: 1,
      title: "Modern Hilltop Residence",
      location: "Deoghar",
      type: "Residential",
      status: "Completed",
      image: "/project1.png"
    },
    {
      id: 2,
      title: "White Box Villa",
      location: "Jasidih",
      type: "Residential",
      status: "In Progress",
      image: "/project2.png"
    },
    {
      id: 3,
      title: "Luxury Floor Apartment",
      location: "Dumka",
      type: "Interior",
      status: "Completed",
      image: "/project3.png"
    },
    {
      id: 4,
      title: "Mixed-Use Tower",
      location: "Deoghar",
      type: "Commercial",
      status: "Planning",
      image: "/project4.png"
    }
  ];

  return (
    <section className="section bg-white" id="projects">
      <div className="container">
        <h2 className="section-title">Our Construction Projects</h2>
        <p className="section-subtitle">
          Built with precision, quality, and trust, ensuring your dream home is crafted to perfection.
        </p>
        
        <div className={styles.grid}>
          {projects.map(project => (
            <div key={project.id} className={styles.card}>
              <span className={styles.tag}>{project.type}</span>
              <span className={styles.tag}>{project.status}</span>
              <h3 className={styles.cardTitle}>{project.title}</h3>
              <div className={styles.imageWrapper}>
                <img src={project.image} alt={project.title} className={styles.cardImage} />
              </div>
              <p className={styles.location}>{project.location}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.actions}>
          <button className={styles.outlineBtn}>View 12 more projects</button>
        </div>
      </div>
    </section>
  );
}
