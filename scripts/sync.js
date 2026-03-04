// Krishna Stone Game - Cloud Sync Logic
// This connects the Frontend to the Flask Backend on Render

const API_CONFIG = {
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log("✅ Cloud Save Successful");
        }
    } catch (error) {
        console.error("❌ Cloud Save Failed:", error);
    }
};

window.loadFromCloud = async function (username) {
    if (!username) return;
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}/api/admin/users`);
        if (response.ok) {
            const users = await response.json();
            const user = users.find(u => u.username === username);
            if (user && user.hammer_strike_save) {
                localStorage.setItem('hammerStrikeSave', JSON.stringify(user.hammer_strike_save));
                console.log("✅ Cloud Data Loaded for:", username);
                return user.hammer_strike_save;
            }
        }
    } catch (error) {
        console.error("❌ Cloud Load Failed:", error);
    }
    return null;
};

// Auto-sync function to be called from game/tasks
window.triggerAutoSync = function () {
    const user = localStorage.getItem('hsGlobalUsername');
    const rawSave = localStorage.getItem('hammerStrikeSave');
    if (user && rawSave) {
        window.saveToCloud(user);
        if (window.syncToSupabaseDirect) {
            window.syncToSupabaseDirect(user, JSON.parse(rawSave));
        }
    }
};

// INITIALIZATION: Pull latest data if logged in
(function () {
    const loggedUser = localStorage.getItem('hsGlobalUsername');
    if (loggedUser && sessionStorage.getItem('hammerStrikeUserLoggedIn') === 'true') {
        window.loadFromCloud(loggedUser);
    }
})();
