import { db } from "../config/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

//Collection reference
const emissionsCollection = collection(db, "emissions");

//Save emission data
export const saveEmissionData = async (energyUsage: number, emissions: number) => {
  try{
    await addDoc(emissionsCollection, {
      energyUsage,
      emissions,
      data: new Date().toISOString(),
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

//Clear all emission history
export const clearEmissionHistory = async () => {
  const snapshot = await getDocs(emissionsCollection);
  snapshot.forEach(async (docRef) => {
    await deleteDoc(doc(db, "emissions", docRef.id));
  });
}