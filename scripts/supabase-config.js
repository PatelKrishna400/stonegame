// Krishna Stone Game - Supabase Configuration
// Frontend Client Setup

const SUPABASE_CONFIG = {
    URL: "https://mimjtdsovzbvwgbwjrlx.supabase.co",
    ANON_KEY: "sb_publishable_sUDodEmotvtizD6LbOS41g_rM1-vk-G"
};

// Note: Ensure you have the Supabase Script included in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabaseClient = null;

if (typeof supabase !== 'undefined') {
    supabaseClient = supabase.createClient(SUPABASE_CONFIG.URL, SUPABASE_CONFIG.ANON_KEY);
    console.log("✅ Supabase Frontend Client Initialized");
} else {
    console.warn("⚠️ Supabase script not loaded. Direct cloud access might fail.");
}

// Global helper to save data to Supabase directly from frontend
window.syncToSupabaseDirect = async function (username, data) {
    if (!supabaseClient) return;

    try {
        const { error } = await supabaseClient
            .from('users')
            .upsert({
                username: username,
                userId: localStorage.getItem('hsGlobalUserId') || 'N/A',
                hammer_strike_save: data,
                last_updated: new Date().toISOString()
            });

        if (error) throw error;
        console.log("☁️ Direct Supabase Sync Successful");
    } catch (err) {
        console.error("☁️ Direct Supabase Sync Failed:", err.message);
    }
};
