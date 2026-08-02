"use client";
import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', phone: '', address: '' });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        // Fetch profile data from Firestore
        const docRef = doc(db, 'customers', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfileData({
            name: data.name || currentUser.displayName || '',
            phone: data.phone || '',
            address: data.address || ''
          });
        } else {
          setProfileData(prev => ({ ...prev, name: currentUser.displayName || '' }));
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'customers', user.uid), {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        email: user.email,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    }
    setIsSaving(false);
  };

  if (!user) return null;

  return (
    <div>
      <div style={{ marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>My Profile</h1>
          <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>View and manage your personal information.</p>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} style={{ padding: '10px 20px', background: 'white', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            Edit Profile
          </button>
        )}
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', padding: '40px', maxWidth: '800px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '40px', paddingBottom: '32px', borderBottom: '1px solid #e2e8f0' }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', fontWeight: 'bold' }}>
              {user.email[0].toUpperCase()}
            </div>
          )}
          <div>
            <h2 style={{ fontSize: '20px', color: '#0f172a', fontWeight: 'bold' }}>{user.displayName || 'STAVYA Customer'}</h2>
            <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>Linked via Google Authentication</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Full Name</label>
                <input type="text" value={profileData.name} onChange={(e) => setProfileData({...profileData, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Email Address (Verified)</label>
                <input type="email" value={user.email} disabled style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', background: '#f1f5f9', color: '#64748b' }} />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Phone Number</label>
                <input type="tel" value={profileData.phone} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} placeholder="+91 00000 00000" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#334155', marginBottom: '8px' }}>Address</label>
                <input type="text" value={profileData.address} onChange={(e) => setProfileData({...profileData, address: e.target.value})} placeholder="Your residential address" style={{ width: '100%', padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '15px', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px' }}>
              <button type="button" onClick={() => setIsEditing(false)} disabled={isSaving} style={{ padding: '12px 24px', background: 'white', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}>Cancel</button>
              <button type="submit" disabled={isSaving} style={{ padding: '12px 24px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', opacity: isSaving ? 0.7 : 1 }}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Full Name</span>
                <p style={{ fontSize: '16px', color: '#0f172a', fontWeight: '500' }}>{profileData.name || 'Not Provided'}</p>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Email Address</span>
                <p style={{ fontSize: '16px', color: '#0f172a', fontWeight: '500' }}>{user.email}</p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Phone Number</span>
                <p style={{ fontSize: '16px', color: '#0f172a', fontWeight: '500' }}>{profileData.phone || 'Not Provided'}</p>
              </div>
              <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ display: 'block', fontSize: '13px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600', marginBottom: '4px' }}>Address</span>
                <p style={{ fontSize: '16px', color: '#0f172a', fontWeight: '500' }}>{profileData.address || 'Not Provided'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
