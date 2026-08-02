"use client";
import React, { useState, useEffect } from 'react';
import { auth } from '../../../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const MOCK_INVOICES = [
  { id: 'INV-2026-001', project: 'PROJ-893X2A', date: '2026-03-15', amount: 500000, status: 'Paid', due: '2026-03-25' },
  { id: 'INV-2026-008', project: 'PROJ-893X2A', date: '2026-04-10', amount: 1500000, status: 'Paid', due: '2026-04-20' },
  { id: 'INV-2026-024', project: 'PROJ-893X2A', date: '2026-06-01', amount: 800000, status: 'Paid', due: '2026-06-15' },
  { id: 'INV-2026-042', project: 'PROJ-893X2A', date: '2026-07-25', amount: 1000000, status: 'Pending', due: '2026-08-05' },
  { id: 'INV-2026-045', project: 'PROJ-442B9Z', date: '2026-07-28', amount: 150000, status: 'Pending', due: '2026-08-07' }
];

export default function Billing() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  if (!user) return null;

  const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', color: '#0f172a', fontWeight: 'bold' }}>Billing & Invoices</h1>
        <p style={{ color: '#64748b', fontSize: '15px', marginTop: '4px' }}>Manage your payments and download past invoices.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Total Paid</h3>
          <p style={{ fontSize: '28px', color: '#15803d', fontWeight: 'bold' }}>{formatCurrency(2800000)}</p>
        </div>
        <div style={{ background: 'white', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ fontSize: '14px', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '600' }}>Outstanding Balance</h3>
          <p style={{ fontSize: '28px', color: '#b91c1c', fontWeight: 'bold' }}>{formatCurrency(1150000)}</p>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Invoice ID</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Project</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Amount</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: '600', color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_INVOICES.map((inv, i) => (
                <tr key={inv.id} style={{ borderBottom: i === MOCK_INVOICES.length - 1 ? 'none' : '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px 24px', fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{inv.id}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>{inv.project}</td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#64748b' }}>{new Date(inv.date).toLocaleDateString()}</td>
                  <td style={{ padding: '16px 24px', fontSize: '15px', fontWeight: '600', color: '#0f172a' }}>{formatCurrency(inv.amount)}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', padding: '4px 10px', borderRadius: '20px', background: inv.status === 'Paid' ? '#dcfce7' : '#fee2e2', color: inv.status === 'Paid' ? '#15803d' : '#b91c1c' }}>
                      {inv.status}
                    </span>
                  </td>
                  <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                    {inv.status === 'Pending' ? (
                      <button style={{ padding: '6px 12px', background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Pay Now</button>
                    ) : (
                      <button style={{ padding: '6px 12px', background: '#f1f5f9', color: '#64748b', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>Download PDF</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
