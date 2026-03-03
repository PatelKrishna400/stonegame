import { supabase } from './supabase-config.js';

/**
 * Saves current localStorage data to Supabase
 * @param {string} username - The unique identifier for the user
 */
export async function saveToCloud(username) {
    if (!username) return;

    try {
        const localSave = localStorage.getItem('hammerStrikeSave');
        const dataToSave = {
            username: username,
            hs_global_email: localStorage.getItem('hsGlobalEmail'),
            hs_global_phone: localStorage.getItem('hsGlobalPhone'),
            hs_global_password: localStorage.getItem('hsGlobalPassword'),
            hammer_strike_user_registered: localStorage.getItem('hammerStrikeUserRegistered') === 'true',
            hammer_strike_save: localSave ? JSON.parse(localSave) : null,
            last_sync: new Date().toISOString()
        };

        const { error } = await supabase
            .from('users')
            .upsert(dataToSave, { onConflict: 'username' });

        if (error) throw error;
        console.log("Data synced to Supabase successfully");
    } catch (error) {
        console.error("Error syncing to Supabase:", error);
    }
}

/**
 * Loads data from Supabase and updates localStorage
 * @param {string} username - The unique identifier for the user
 */
export async function loadFromCloud(username) {
    if (!username) return null;

    try {
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .single();

        if (error) {
            if (error.code === 'PGRST116') {
                console.log("No cloud data found for user in Supabase");
                return null;
            }
            throw error;
        }

        if (data) {
            if (data.hs_global_email) localStorage.setItem('hsGlobalEmail', data.hs_global_email);
            if (data.hs_global_phone) localStorage.setItem('hsGlobal_phone', data.hs_global_phone);
            if (data.hs_global_password) localStorage.setItem('hsGlobalPassword', data.hs_global_password);
            if (data.hammer_strike_user_registered) localStorage.setItem('hammerStrikeUserRegistered', 'true');
            localStorage.setItem('hsGlobalUsername', username);

            if (data.hammer_strike_save) {
                localStorage.setItem('hammerStrikeSave', JSON.stringify(data.hammer_strike_save));
            }

            console.log("Data loaded from Supabase successfully");
            return data;
        }
    } catch (error) {
        console.error("Error loading from Supabase:", error);
        return null;
    }
}

/**
 * Fetches all users from Supabase and updates hammerStrikeAllUsers in localStorage
 * Used mainly for Admin Dashboard/Leaderboard
 */
export async function fetchAllUsers() {
    try {
        const { data, error } = await supabase
            .from('users')
            .select('username, hammer_strike_save');

        if (error) throw error;

        let allUsers = [];
        data.forEach((user) => {
            if (user.hammer_strike_save) {
                const save = user.hammer_strike_save;
                allUsers.push({
                    nickname: save.nickname || user.username,
                    coins: save.coins || 0,
                    level: save.level || 1
                });
            }
        });

        localStorage.setItem('hammerStrikeAllUsers', JSON.stringify(allUsers));
        console.log("All users fetched from Supabase");
        return allUsers;
    } catch (error) {
        console.error("Error fetching all users from Supabase:", error);
        return [];
    }
}
