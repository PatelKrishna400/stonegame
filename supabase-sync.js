/**
 * Supabase Sync System for Hammer Strike
 * This handles cloud persistence so data is safe for months.
 */

// REPLACE THESE WITH YOUR ACTUAL SUPABASE CREDENTIALS
const SUPABASE_URL = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY';

/**
 * Save user data to Supabase
 */
export async function saveToCloud(username) {
    if (!username || username === 'Guest Player') return; // Don't sync guests to admin panel

    const data = JSON.parse(localStorage.getItem('hammerStrikeSave') || '{}');
    if (!data.userId) return; // Only sync registered users

    console.log(`[CloudSync] Saving data for ${username}...`);

    try {
        // We use a simple table named 'users_data'
        // Columns: username (unique), userId, coins, level, stars, maxEnergy, lastSave, allData (jsonb)
        const response = await fetch(`${SUPABASE_URL}/rest/v1/users_data?username=eq.${username}`, {
            method: 'PATCH',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'resolution=merge-duplicates'
            },
            body: JSON.stringify({
                userId: data.userId,
                coins: data.coins || 0,
                level: data.level || 1,
                stars: data.stars || 0,
                maxEnergy: data.maxEnergy || 100,
                lastSave: new Date().toISOString(),
                allData: data // Store everything else as JSON
            })
        });

        if (response.status === 204 || response.ok) {
            console.log("[CloudSync] Sync successful.");
        } else if (response.status === 404 || (await response.json()).length === 0) {
            // If PATCH fails because it doesn't exist, try POST
            await fetch(`${SUPABASE_URL}/rest/v1/users_data`, {
                method: 'POST',
                headers: {
                    'apikey': SUPABASE_KEY,
                    'Authorization': `Bearer ${SUPABASE_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    userId: data.userId,
                    coins: data.coins || 0,
                    level: data.level || 1,
                    stars: data.stars || 0,
                    maxEnergy: data.maxEnergy || 100,
                    lastSave: new Date().toISOString(),
                    allData: data
                })
            });
        }
    } catch (err) {
        console.warn("[CloudSync] Sync failed. Ensure Supabase credentials are set.", err);
    }
}

/**
 * Load user data from Supabase
 */
export async function loadFromCloud(username) {
    if (!username || username === 'Guest Player') return;

    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/users_data?username=eq.${username}&select=*`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        const result = await response.json();
        if (result && result.length > 0) {
            const cloudData = result[0].allData;
            localStorage.setItem('hammerStrikeSave', JSON.stringify(cloudData));
            console.log("[CloudSync] Data restored from cloud.");
            return cloudData;
        }
    } catch (err) {
        console.warn("[CloudSync] Failed to load from cloud.", err);
    }
    return null;
}

/**
 * Fetch all users for Admin Panel (Registered only)
 */
export async function fetchAllUsers() {
    try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/users_data?select=*&order=coins.desc`, {
            method: 'GET',
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        });

        const users = await response.json();
        if (users && users.length >= 0) {
            // Store it in a special key for admin panel to use
            localStorage.setItem('hsAdminUsersList', JSON.stringify(users));
            return users;
        }
    } catch (err) {
        console.warn("[CloudSync] Failed to fetch all users.", err);
    }
    return [];
}
