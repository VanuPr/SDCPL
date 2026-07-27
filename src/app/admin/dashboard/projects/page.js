"use client";
import React, { useState, useEffect } from 'react';
import { db, storage } from '../../../../lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import styles from './ProjectsAdmin.module.css';

export default function ProjectsAdmin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    location: '',
    type: 'Residential',
    status: 'Upcoming',
    hideFromPublic: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [existingImage, setExistingImage] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "projects"));
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingId(project.id);
      setFormData({
        title: project.title,
        location: project.location,
        type: project.type,
        status: project.status,
        hideFromPublic: project.hideFromPublic || false
      });
      setExistingImage(project.image);
      setImageUrlInput(project.image);
    } else {
      setEditingId(null);
      setFormData({ title: '', location: '', type: 'Residential', status: 'Upcoming', hideFromPublic: false });
      setExistingImage('');
      setImageUrlInput('');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      let imageUrl = existingImage;

      if (imageFile) {
        const imageRef = ref(storage, `projects/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(imageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else if (imageUrlInput && imageUrlInput !== existingImage) {
        imageUrl = imageUrlInput;
      }

      const projectData = { ...formData, image: imageUrl };

      if (editingId) {
        await updateDoc(doc(db, "projects", editingId), projectData);
      } else {
        await addDoc(collection(db, "projects"), projectData);
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      console.error("Error saving project:", err);
      alert("Failed to save project. Make sure Firebase Storage and Firestore are configured.");
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteDoc(doc(db, "projects", id));
        fetchProjects();
      } catch (err) {
        console.error("Error deleting project:", err);
      }
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Manage Projects</h1>
        <button className={styles.addBtn} onClick={() => handleOpenModal()}>+ Add New Project</button>
      </div>

      {loading ? (
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th><th>Title</th><th>Location</th><th>Type</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4].map(n => (
                <tr key={n}>
                  <td><div className={`${styles.skeletonThumb} ${styles.skeleton}`}></div></td>
                  <td><div className={`${styles.skeletonText} ${styles.skeleton}`}></div></td>
                  <td><div className={`${styles.skeletonText} ${styles.skeleton}`}></div></td>
                  <td><div className={`${styles.skeletonBadge} ${styles.skeleton}`}></div></td>
                  <td><div className={`${styles.skeletonBadge} ${styles.skeleton}`}></div></td>
                  <td><div className={`${styles.skeletonTextSmall} ${styles.skeleton}`}></div></td>
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
                <th>Image</th>
                <th>Title</th>
                <th>Location</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 ? (
                <tr><td colSpan="6" className={styles.empty}>No projects found. Add one above!</td></tr>
              ) : (
                projects.map(proj => (
                  <tr key={proj.id}>
                    <td>
                      <img src={proj.image} alt={proj.title} className={styles.thumb} />
                    </td>
                    <td className={styles.fw600}>{proj.title}</td>
                    <td>{proj.location}</td>
                    <td><span className={styles.badge}>{proj.type}</span></td>
                    <td>
                      <span className={`${styles.badge} ${styles['status' + proj.status.replace(' ', '')]}`}>
                        {proj.status}
                      </span>
                      {proj.hideFromPublic && <span className={styles.badge} style={{marginLeft: '4px', background: 'var(--destructive)', color: 'white'}}>Hidden</span>}
                    </td>
                    <td>
                      <div className={styles.actionBtns}>
                        <button onClick={() => handleOpenModal(proj)} className={styles.editBtn}>Edit</button>
                        <button onClick={() => handleDelete(proj.id)} className={styles.delBtn}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h2 className={styles.modalTitle}>{editingId ? 'Edit Project' : 'Add New Project'}</h2>
            
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Project Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              
              <div className={styles.formGroup}>
                <label>Location</label>
                <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Interior">Interior</option>
                    <option value="Industrial">Industrial</option>
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Upcoming">Upcoming</option>
                    <option value="Processing">Processing</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Project Image (Upload or Provide Link)</label>
                <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => {
                      setImageFile(e.target.files[0]);
                      setImageUrlInput('');
                    }} 
                  />
                  <span style={{ fontSize: '12px', color: 'var(--muted-foreground)', textAlign: 'center' }}>OR</span>
                  <input 
                    type="url" 
                    placeholder="https://example.com/image.jpg" 
                    value={imageUrlInput}
                    onChange={e => {
                      setImageUrlInput(e.target.value);
                      setImageFile(null);
                    }}
                  />
                </div>
                {existingImage && !imageFile && imageUrlInput === existingImage && (
                  <p className={styles.helpText}>Current image will be kept if no new file or link is provided.</p>
                )}
              </div>

              <div className={styles.formGroup} style={{ flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
                <input 
                  type="checkbox" 
                  id="hideFromPublic"
                  checked={formData.hideFromPublic}
                  onChange={e => setFormData({...formData, hideFromPublic: e.target.checked})}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="hideFromPublic" style={{ margin: 0 }}>Hide this project from public view (Homepage)</label>
              </div>

              <div className={styles.modalActions}>
                <button type="button" onClick={() => setIsModalOpen(false)} className={styles.cancelBtn}>Cancel</button>
                <button type="submit" disabled={saving} className={styles.saveBtn}>
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
