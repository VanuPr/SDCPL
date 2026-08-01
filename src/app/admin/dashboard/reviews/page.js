"use client";
import React, { useState, useEffect } from 'react';
import { db } from '../../../../../lib/firebase';
import { collection, query, orderBy, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editQuote, setEditQuote] = useState("");
  const [editRating, setEditRating] = useState(5);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setReviews(fetched);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDoc(doc(db, "reviews", id));
        setReviews(reviews.filter(r => r.id !== id));
      } catch (error) {
        console.error("Error deleting review:", error);
        alert("Failed to delete review");
      }
    }
  };

  const startEdit = (review) => {
    setEditingId(review.id);
    setEditQuote(review.quote.replace(/^"|"$/g, '')); // Strip quotes for editing
    setEditRating(review.rating);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditQuote("");
    setEditRating(5);
  };

  const saveEdit = async (id) => {
    try {
      await updateDoc(doc(db, "reviews", id), {
        quote: `"${editQuote.trim()}"`,
        rating: editRating
      });
      
      setReviews(reviews.map(r => {
        if (r.id === id) {
          return { ...r, quote: `"${editQuote.trim()}"`, rating: editRating };
        }
        return r;
      }));
      
      setEditingId(null);
    } catch (error) {
      console.error("Error updating review:", error);
      alert("Failed to update review.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading Reviews...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h1>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
          {reviews.length} Total Reviews
        </span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Review Text</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No reviews found.
                  </td>
                </tr>
              ) : (
                reviews.map((review) => (
                  <tr key={review.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {review.image ? (
                          <img src={review.image} alt={review.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-500">{review.name?.charAt(0) || 'U'}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{review.name}</p>
                          {review.email && <p className="text-xs text-gray-500">{review.email}</p>}
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {editingId === review.id ? (
                        <select 
                          value={editRating} 
                          onChange={(e) => setEditRating(Number(e.target.value))}
                          className="border border-gray-300 dark:border-gray-600 rounded p-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      ) : (
                        <div className="flex items-center text-primary">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 min-w-[300px]">
                      {editingId === review.id ? (
                        <textarea
                          value={editQuote}
                          onChange={(e) => setEditQuote(e.target.value)}
                          className="w-full border border-gray-300 dark:border-gray-600 rounded p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          rows="3"
                        />
                      ) : (
                        <p className="line-clamp-2" title={review.quote}>{review.quote}</p>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(review.timestamp).toLocaleDateString()}
                    </td>
                    
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {editingId === review.id ? (
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => saveEdit(review.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button 
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 justify-end">
                          <button 
                            onClick={() => startEdit(review)}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(review.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
