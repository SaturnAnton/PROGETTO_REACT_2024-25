import './Raccolte.css';
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "./../main";
import { doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Raccolte() {
    const [loading, setLoading] = useState(false);
    const [userCollections, setUserCollections] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const auth = getAuth();
    const navigate = useNavigate();
    const userId = auth.currentUser?.uid;

    const fetchUserCollections = async () => {
        if (!userId) {
            setError("Devi essere autenticato.");
            return;
        }

        try {
            setLoading(true);
            setError(null); // Reset degli errori
            const userDocRef = doc(db, "user_collections", userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userCollectionsData = userDoc.data().collections || [];
                setUserCollections(userCollectionsData);
                localStorage.setItem('userCollections', JSON.stringify(userCollectionsData));
                console.log("Raccolte aggiornate:", userCollectionsData); // Debug
            } else {
                setUserCollections([]);
                setError("Nessuna raccolta trovata per l'utente.");
            }
        } catch (err) {
            console.error("Errore nel recupero delle raccolte:", err);
            setError("Errore nel recupero delle raccolte.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                fetchUserCollections(); // Recupera i dati al login
            } else {
                navigate("/login");
            }
        });

        return unsubscribe; // Cleanup listener
    }, [navigate]);

    return (
        <div>
            <h2 className="raccolte">LE TUE RACCOLTE</h2>
            {loading && <p>Caricamento in corso...</p>}
            {error && <p className="error">{error}</p>}
            <ul className="raccolte-elenco">
                {userCollections.length > 0 ? (
                    userCollections.slice(1).map((collectionName, index) => (
                        <li key={index}>{collectionName}</li>
                    ))
                ) : (
                    !loading && <p>Non hai raccolte.</p>
                )}
            </ul>
            <Link to='/analizza' className="no-det">
                <h1 className="title4">Back</h1>
            </Link>
        </div>
    );
}

export default Raccolte;
