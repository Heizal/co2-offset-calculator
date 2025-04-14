import { db } from "../config/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, onSnapshot, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
//Collection reference
const emissionsCollection = collection(db, "emissions");
//Save emission data
export const saveEmissionData = async (energyUsage, emissions, startDate, endDate, category, region_name, description) => {
    try {
        const user = getAuth().currentUser;
        if (!user)
            throw new Error("User not authenticated");
        await addDoc(emissionsCollection, {
            userId: user.uid,
            energyUsage,
            emissions,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            createdAt: new Date().toISOString(),
            category,
            region_name,
            description
        });
    }
    catch (error) {
        console.error("Error saving emission data:", error);
    }
};
export const listenToEmissions = (callback) => {
    // Ensure the user is authenticated
    const user = getAuth().currentUser;
    if (!user)
        throw new Error("User not authenticated");
    const userQuery = query(emissionsCollection, where("userId", "==", user.uid));
    return onSnapshot(userQuery, (snapshot) => {
        console.log("Firestore real.time update received", snapshot.docs.length, "documents");
        const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            description: doc.data().description || "No specific description",
        }));
        console.log("Emission history updated:", data);
        callback(data);
    });
};
//Clear all emission history
export const clearEmissionHistory = async () => {
    try {
        const user = getAuth().currentUser;
        if (!user)
            throw new Error("User not authenticated");
        const userQuery = query(emissionsCollection, where("userId", "==", user.uid));
        const snapshot = await getDocs(userQuery);
        const deletePromises = snapshot.docs.map((document) => deleteDoc(doc(db, "emissions", document.id)));
        await Promise.all(deletePromises); // Wait for all delete promises to resolve
        console.log("All emisssion history cleared");
    }
    catch (error) {
        console.error("Error clearing emission history:", error);
    }
};
