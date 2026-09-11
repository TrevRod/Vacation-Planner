import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  onSnapshot, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trip } from '../types';

// Helper to remove undefined properties which Firestore rejects
function sanitizeForFirestore<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

/**
 * Real-time listener for all trips belonging to a user
 */
export function subscribeToUserTrips(
  userId: string,
  onTrips: (trips: Trip[]) => void,
  onError?: (err: Error) => void
) {
  const tripsRef = collection(db, 'users', userId, 'trips');
  
  return onSnapshot(
    tripsRef,
    (snapshot) => {
      const tripsList: Trip[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data && data.id && data.title) {
          tripsList.push(data as Trip);
        }
      });

      // Sort by startDate ascending or fallback by title
      tripsList.sort((a, b) => {
        const dateA = new Date(a.startDate || 0).getTime();
        const dateB = new Date(b.startDate || 0).getTime();
        return dateA - dateB;
      });

      onTrips(tripsList);
    },
    (err) => {
      console.error('Firestore trips snapshot error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a single trip in the user's private cloud collection
 */
export async function saveTripToFirestore(userId: string, trip: Trip): Promise<void> {
  if (!userId || !trip.id) return;
  const tripRef = doc(db, 'users', userId, 'trips', trip.id);
  const cleanTrip = sanitizeForFirestore({
    ...trip,
    updatedAt: new Date().toISOString()
  });
  await setDoc(tripRef, cleanTrip, { merge: true });
}

/**
 * Delete a trip document from the user's private cloud collection
 */
export async function deleteTripFromFirestore(userId: string, tripId: string): Promise<void> {
  if (!userId || !tripId) return;
  const tripRef = doc(db, 'users', userId, 'trips', tripId);
  await deleteDoc(tripRef);
}

/**
 * Batch upload existing offline/local trips into the user's cloud account
 */
export async function migrateLocalTripsToFirestore(userId: string, localTrips: Trip[]): Promise<void> {
  if (!userId || localTrips.length === 0) return;
  const batch = writeBatch(db);
  for (const trip of localTrips) {
    if (!trip.id) continue;
    const ref = doc(db, 'users', userId, 'trips', trip.id);
    batch.set(ref, sanitizeForFirestore({
      ...trip,
      updatedAt: new Date().toISOString()
    }), { merge: true });
  }
  await batch.commit();
}
