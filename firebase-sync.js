import { db, doc, setDoc, getDoc, updateDoc } from './firebase-config.js';

/**
 * Saves current localStorage data to Firebase
 * @param {string} username - The unique identifier for the user
 */
export async function saveToCloud(username) {
    if (!username) return;

    try {
        const localSave = localStorage.getItem('hammerStrikeSave');
        const globalData = {
            hsGlobalEmail: localStorage.getItem('hsGlobalEmail'),
            hsGlobalPhone: localStorage.getItem('hsGlobalPhone'),
            hsGlobalPassword: localStorage.getItem('hsGlobalPassword'), // Store for persistence, though better use Firebase Auth later
            hammerStrikeUserRegistered: localStorage.getItem('hammerStrikeUserRegistered'),
            lastSync: Date.now()
        };

        if (localSave) {
            globalData.hammerStrikeSave = JSON.parse(localSave);
        }

        const userRef = doc(db, "users", username);
        await setDoc(userRef, globalData, { merge: true });
        console.log("Data synced to cloud successfully");
    } catch (error) {
        console.error("Error syncing to cloud:", error);
    }
}

/**
 * Loads data from Firebase and updates localStorage
 * @param {string} username - The unique identifier for the user
 */
export async function loadFromCloud(username) {
    if (!username) return null;

    try {
        const userRef = doc(db, "users", username);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
            const data = docSnap.data();

            if (data.hsGlobalEmail) localStorage.setItem('hsGlobalEmail', data.hsGlobalEmail);
            if (data.hsGlobalPhone) localStorage.setItem('hsGlobalPhone', data.hsGlobalPhone);
            if (data.hsGlobalPassword) localStorage.setItem('hsGlobalPassword', data.hsGlobalPassword);
            if (data.hammerStrikeUserRegistered) localStorage.setItem('hammerStrikeUserRegistered', data.hammerStrikeUserRegistered);
            localStorage.setItem('hsGlobalUsername', username);

            if (data.hammerStrikeSave) {
                localStorage.setItem('hammerStrikeSave', JSON.stringify(data.hammerStrikeSave));
            }

            console.log("Data loaded from cloud successfully");
            return data;
        } else {
            console.log("No cloud data found for user");
            return null;
        }
    } catch (error) {
        console.error("Error loading from cloud:", error);
        return null;
    }
}
