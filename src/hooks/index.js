import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

export const useRealTime = (collectionName, conditions = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    
    const q = conditions.length > 0
      ? query(collection(db, collectionName), ...conditions.map(c => where(c.field, c.operator, c.value)))
      : query(collection(db, collectionName));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const documents = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(documents);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Real-time listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(conditions)]);

  return { data, loading, error };
};

export const useFirestore = (collectionName) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date().toISOString()
      });
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const updateDocument = async (docId, data) => {
    setLoading(true);
    setError(null);
    try {
      await updateDoc(doc(db, collectionName, docId), {
        ...data,
        updatedAt: new Date().toISOString()
      });
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const deleteDocument = async (docId) => {
    setLoading(true);
    setError(null);
    try {
      await deleteDoc(doc(db, collectionName, docId));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { addDocument, updateDocument, deleteDocument, loading, error };
};
