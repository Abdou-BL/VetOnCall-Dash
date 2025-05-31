import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDRA93HE5U6kFUc3pn88LLMePldezD8sAg",
    appId: "1:115836402892:web:82691841ac065d8b13d669",
    messagingSenderId: "115836402892",
    projectId: "vetoncall-33dee",
    authDomain: "vetoncall-33dee.firebaseapp.com",
    storageBucket: "vetoncall-33dee.firebasestorage.app"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dxytyc5pn';
const CLOUDINARY_UPLOAD_PRESET = 'images';

export async function uploadToCloudinary(file) {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        
        const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        throw error;
    }
}

export async function signUpVeterinarian(email, password, userData) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, "Veterinarians"), {
            ...userData,
            email: email, 
            uid: userCredential.user.uid,
            createdAt: new Date()
        });
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

export async function signUpClinic(email, password, userData) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await addDoc(collection(db, "Clinics"), {
            ...userData,
            email: email, 
            uid: userCredential.user.uid,
            createdAt: new Date()
        });
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
}

export async function logOut() {
    try {
        await signOut(auth);
    } catch (error) {
        throw error;
    }
}

export async function getAccountForms(userId) {
    try {
        const appointmentsRef = collection(db, "appointments");
        const q = query(appointmentsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        const forms = [];
        querySnapshot.forEach((doc) => {
            forms.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        return forms;
    } catch (error) {
        console.error("Error getting forms:", error);
        throw error;
    }
}

export async function moveAppointmentToCustomers(appointmentId, appointmentData) {
    try {
        // Add to Customers collection
        await addDoc(collection(db, "Customers"), {
            ...appointmentData,
            movedAt: new Date(),
            status: "confirmed"  
        });
        
        // Delete from appointments collection after successful move
        await deleteDoc(doc(db, "appointments", appointmentId));
        
        return true;
    } catch (error) {
        console.error("Error moving appointment to customers:", error);
        throw error;
    }
}

export async function showNewFormModal(customerData = null) {
    // ... existing code remains unchanged, only the function signature has been defined
    const formData = new FormData();
    const data = {
        locationEmail: auth.currentUser.email,
        date: formData.get('date'),
        time: formData.get('time'),
        email: formData.get('email'),
        owners: formData.get('owners'),
        pets: formData.get('pets'),
        phoneNumber: formData.get('phoneNumber'),
        assignedVet: formData.get('assignedVet'),
        medicalCondition: formData.get('medicalCondition'),
        status: "pending",
        createdAt: new Date()
    };
    // ... rest of the code remains unchanged
}