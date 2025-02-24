import { db } from "../config/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, QuerySnapshot, DocumentData } from "firebase/firestore";

//Collection reference
const emissionsCollection = collection(db, "emissions");

//Save emission data
export const saveEmissionData = async (energyUsage: number, emissions: number, startDate: Date, endDate: Date, sector: string, region_name: string, ) => {
  try{
    await addDoc(emissionsCollection, {
      energyUsage,
      emissions,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      createdAt: new Date().toISOString(),
      sector,
      region_name,
    });
  } catch(error){
    console.error("Error saving emission data:", error);
  }
};

//Real-time listener for emission history
export const listenToEmissions = (callback: (data: any[]) => void) => {
  return onSnapshot(emissionsCollection, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
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