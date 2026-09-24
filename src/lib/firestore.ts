import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc as firestoreUpdateDoc,
  deleteDoc as firestoreDeleteDoc,
  onSnapshot,
  query,
  QueryConstraint,
  DocumentData,
  Timestamp,
  WithFieldValue,
  Unsubscribe
} from 'firebase/firestore';
import { db } from './firebase';

export const COLLECTIONS = {
  USERS: 'users',
  PROFILES: 'profiles',
  CONTENT: 'content',
  SUBSCRIPTIONS: 'subscriptions',
  PAYMENTS: 'payments',
  AUDIT_LOGS: 'auditLogs',
  ADS: 'ads',
  NOTIFICATIONS: 'notifications',
  WATCH_PROGRESS: 'watchProgress',
  PLATFORM_SETTINGS: 'platformSettings',
} as const;

export const getCollectionRef = (collectionName: string) => {
  if (!db) throw new Error('Firestore is not initialized');
  return collection(db, collectionName);
};

export const getDocRef = (collectionName: string, id: string) => {
  if (!db) throw new Error('Firestore is not initialized');
  return doc(db, collectionName, id);
};

export async function getDocById<T>(collectionName: string, id: string): Promise<T | null> {
  const docRef = getDocRef(collectionName, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

export async function queryDocs<T>(collectionName: string, ...queryConstraints: QueryConstraint[]): Promise<T[]> {
  const collRef = getCollectionRef(collectionName);
  const q = query(collRef, ...queryConstraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
}

export async function createDoc<T extends WithFieldValue<DocumentData>>(collectionName: string, data: T): Promise<string> {
  const collRef = getCollectionRef(collectionName);
  const docRef = await addDoc(collRef, data);
  return docRef.id;
}

export async function updateDoc(collectionName: string, id: string, data: Partial<DocumentData>): Promise<void> {
  const docRef = getDocRef(collectionName, id);
  await firestoreUpdateDoc(docRef, data);
}

export async function deleteDoc(collectionName: string, id: string): Promise<void> {
  const docRef = getDocRef(collectionName, id);
  await firestoreDeleteDoc(docRef);
}

export function onDocSnapshot<T>(
  collectionName: string, 
  id: string, 
  callback: (data: T | null) => void
): Unsubscribe {
  const docRef = getDocRef(collectionName, id);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
}

export function onCollectionSnapshot<T>(
  collectionName: string,
  queryConstraints: QueryConstraint[],
  callback: (data: T[]) => void
): Unsubscribe {
  const collRef = getCollectionRef(collectionName);
  const q = query(collRef, ...queryConstraints);
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
    callback(data);
  });
}

export const convertTimestampToDate = (timestamp: Timestamp): Date => timestamp.toDate();
export const convertDateToTimestamp = (date: Date): Timestamp => Timestamp.fromDate(date);
