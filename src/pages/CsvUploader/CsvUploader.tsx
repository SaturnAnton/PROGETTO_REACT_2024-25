import React, { useState } from 'react';
import { auth, db } from './../../main';
import { collection, addDoc, doc, setDoc, arrayUnion} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import Papa from 'papaparse';
import './CsvUploader.css'
import Navbar from "../Navbar/Navbar";

const CsvToFirestore: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState<string | null>(null);

  // Monitorare l'utente autenticato
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log(user.uid);
      } else {
        setUserId(null);
        setMessage('Nessun utente autenticato.');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) {
      setMessage('Devi essere autenticato per importare i dati.');
      return;
    }

    setUploading(true);
    setMessage('');

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const data = results.data as Record<string, any>[];
        try {
          // Creazione di una raccolta dinamica basata sull'ID utente e un identificativo unico
          const uniqueCollectionName = `${userId}_file_${Date.now()}`;
          const collectionRef = collection(db, uniqueCollectionName);
          for (const row of data) {
            await addDoc(collectionRef, row);
          }
          // Aggiorna la lista delle raccolte associate all'utente
          const userCollectionsRef = doc(db, 'user_collections', userId);
          await setDoc(userCollectionsRef, {
            collections: arrayUnion(uniqueCollectionName),
          }, { merge: true });
          console.log("Documento aggiornato con successo per:", userId);

          setMessage(`Dati importati con successo nella raccolta: ${uniqueCollectionName}`);
        } catch (error) {
          console.error('Errore durante l\'importazione:', error);
          setMessage('Errore durante l\'importazione dei dati.');
        } finally {
          setUploading(false);
        }
      },
      error: (error) => {
        console.error('Errore durante la lettura del file:', error);
        setMessage('Errore durante la lettura del file CSV.');
        setUploading(false);
      },
    });
  };

  return (
    <div>
      <Navbar />
      <h1 className='importo'>IMPORTA UN FILE CSV IN FIRESTORE</h1>
      <div className='centro'>
      <input type="file" accept=".csv" onChange={handleFileUpload} disabled={!userId} />
      {!userId && <p>Autenticati per importare i dati.</p>}
      {uploading && <p>Importazione in corso...</p>}
      {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default CsvToFirestore;
