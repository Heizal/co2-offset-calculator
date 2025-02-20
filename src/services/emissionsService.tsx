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
export const saveEmissionData = async (energyUsage: number, emissions: number, startDate: Date, endDate: Date) => {
  try{
    await addDoc(emissionsCollection, {
      energyUsage,
      emissions,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdAt: new Date().toISOString(),
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
        startDate: data.startDate ? data.startDate : new Date().toISOString(), // Ensure startDate exists
        endDate: data.endDate ? data.endDate : new Date().toISOString(), // Ensure endDate exists
      };
    });
};

//Real-time listener for emission history
export const listenToEmissions = (callback: (data: { id: string; energyUsage: number; emissions: number; startDate: string; endDate: string }[]) => void) => {
    return onSnapshot(emissionsCollection, (snapshot: QuerySnapshot<DocumentData>) => {
      const data = snapshot.docs.map((doc) => {
        const docData = doc.data();
        return {
          id: doc.id,
          energyUsage: docData.energyUsage || 0,
          emissions: docData.emissions || 0,
          startDate: docData.startDate ? docData.startDate : new Date().toISOString(), // Ensure startDate exists
          endDate: docData.endDate ? docData.endDate : new Date().toISOString(), // Ensure endDate exists
        };
      });
  
      callback(data);
    });
};

//Clear all emission history
export const clearEmissionHistory = async () => {
  try{
    const snapshot = await getDocs(emissionsCollection)
    const deletePromises = snapshot.docs.map((document) => deleteDoc(doc(db, "emissions", document.id)));
    await Promise.all(deletePromises); // Wait for all delete promises to resolve
    console.log("All emisssion history cleared");
  } catch(error){
    console.error("Error clearing emission history:", error);
  }
};