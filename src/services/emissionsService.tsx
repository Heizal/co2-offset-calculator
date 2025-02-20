import { db } from "../config/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";

//Collection reference
const emissionsCollection = collection(db, "emissions");

// Define the emission data type
interface EmissionData {
    id: string;
    energyUsage: number;
    emissions: number;
    date: string;
  }

//Save emission data
export const saveEmissionData = async (energyUsage: number, emissions: number) => {
  try{
    await addDoc(emissionsCollection, {
      energyUsage,
      emissions,
      date: new Date().toISOString(),
    });
  } catch(error){
    console.error("Error saving emission data:", error);
  }
};

// Retrieve past emissions
export const getEmissionHistory = async () => {
    const snapshot = await getDocs(emissionsCollection);
    
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        energyUsage: data.energyUsage || 0, // Ensure default values
        emissions: data.emissions || 0,
        date: data.date || new Date().toISOString(),
      };
    });
};

//Real-time listener for emission history
export const listenToEmissions = (callback: (data: EmissionData[]) => void) => {
    return onSnapshot(emissionsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
    console.log("📡 Real-time update received:", snapshot.docs.length, "documents");

      const data: EmissionData[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        energyUsage: doc.data().energyUsage || 0,
        emissions: doc.data().emissions || 0,
        date: doc.data().date || new Date().toISOString(),
      }));
      callback(data);
    });
  };

//Clear all emission history
export const clearEmissionHistory = async () => {
  const snapshot = await getDocs(emissionsCollection);
  snapshot.forEach(async (docRef) => {
    await deleteDoc(doc(db, "emissions", docRef.id));
  });
}