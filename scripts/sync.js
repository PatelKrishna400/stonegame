// Krishna Stone Game - Cloud Sync Logic
// This connects the Frontend to the Flask Backend on Render

const API_CONFIG = {
    // REPLACE THIS URL with your actual Render Backend URL after deployment
    // Example: https://stone-game-backend.onrender.com
    BASE_URL: "https://stone-game-backend.onrender.com"
};

window.saveToCloud = async function (username) {
    const rawSave = localStorage.getItem('hammerStrikeSave');
    if (!rawSave || !username) return;

    try {
        const payload = {
            username: username,
            userId: localStorage.getItem('hsGlobalUserId') || 'N/A',
            allData: JSON.parse(rawSave)
        };

        const response = await fetch(`${API_CONFIG.BASE_URL}/api/auth/sync`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const result = await response.json();
        console.log("✅ Cloud Sync Successful:", result);
    } catch (error) {
        console.error("❌ Cloud Sync Failed:", error);
    }
};

// Auto-sync function to be called from game/tasks
window.triggerAutoSync = function () {
    const user = localStorage.getItem('hsGlobalUsername');
    const rawSave = localStorage.getItem('hammerStrikeSave');
    if (user && rawSave) {
        // 1. Sync to Render Backend
        window.saveToCloud(user);

        // 2. Sync to Supabase Direct (Fallback/Redundancy)
        if (window.syncToSupabaseDirect) {
            window.syncToSupabaseDirect(user, JSON.parse(rawSave));
        }
    }
};
