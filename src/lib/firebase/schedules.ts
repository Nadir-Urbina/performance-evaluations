import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  getDoc,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { EvaluationSchedule } from '@/types/database';

const COLLECTION_NAME = 'evaluationSchedules';

/**
 * Create a new evaluation schedule
 */
export async function createSchedule(scheduleData: Omit<EvaluationSchedule, 'id' | 'createdAt' | 'updatedAt'>) {
  try {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...scheduleData,
      createdAt: now,
      updatedAt: now,
    });
    
    return {
      id: docRef.id,
      ...scheduleData,
      createdAt: now,
      updatedAt: now,
    };
  } catch (error) {
    console.error('Error creating schedule:', error);
    throw error;
  }
}

/**
 * Get all evaluation schedules for an organization
 */
export async function getSchedules(organizationId: string, filter?: 'active' | 'draft' | 'completed' | 'canceled') {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('organizationId', '==', organizationId),
      orderBy('updatedAt', 'desc')
    );
    
    if (filter) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('organizationId', '==', organizationId),
        where('status', '==', filter),
        orderBy('updatedAt', 'desc')
      );
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as EvaluationSchedule[];
  } catch (error) {
    console.error('Error getting schedules:', error);
    throw error;
  }
}

/**
 * Get a single evaluation schedule by ID
 */
export async function getScheduleById(scheduleId: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, scheduleId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data()
      } as EvaluationSchedule;
    } else {
      throw new Error('Schedule not found');
    }
  } catch (error) {
    console.error('Error getting schedule:', error);
    throw error;
  }
}

/**
 * Update an evaluation schedule
 */
export async function updateSchedule(scheduleId: string, scheduleData: Partial<Omit<EvaluationSchedule, 'id' | 'createdAt' | 'updatedAt'>>) {
  try {
    const docRef = doc(db, COLLECTION_NAME, scheduleId);
    await updateDoc(docRef, {
      ...scheduleData,
      updatedAt: Timestamp.now(),
    });
    
    return {
      id: scheduleId,
      ...scheduleData,
    };
  } catch (error) {
    console.error('Error updating schedule:', error);
    throw error;
  }
}

/**
 * Delete an evaluation schedule
 */
export async function deleteSchedule(scheduleId: string) {
  try {
    const docRef = doc(db, COLLECTION_NAME, scheduleId);
    await deleteDoc(docRef);
    return true;
  } catch (error) {
    console.error('Error deleting schedule:', error);
    throw error;
  }
}

/**
 * Update schedule status
 */
export async function updateScheduleStatus(scheduleId: string, status: EvaluationSchedule['status']) {
  try {
    const docRef = doc(db, COLLECTION_NAME, scheduleId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
    
    return { id: scheduleId, status };
  } catch (error) {
    console.error('Error updating schedule status:', error);
    throw error;
  }
}

/**
 * Get active evaluation schedules for a specific job function
 */
export async function getActiveSchedulesForJobFunction(organizationId: string, jobFunctionId: string) {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('organizationId', '==', organizationId),
      where('status', '==', 'active'),
      where('jobFunctionIds', 'array-contains', jobFunctionId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as EvaluationSchedule[];
  } catch (error) {
    console.error('Error getting active schedules for job function:', error);
    throw error;
  }
} 