from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Enable CORS for frontend connectivity
CORS(app)

# Supabase Configuration
# These should be set in Render Environment Variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: SUPABASE_URL or SUPABASE_KEY not found in environment.")

supabase: Client = None
if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Error initializing Supabase client: {e}")

@app.route('/')
def home():
    return jsonify({
        "message": "Krishna Stone Game Backend is Running",
        "status": "online",
        "admin": "Krishna"
    })

@app.route('/health')
def health():
    return jsonify({"status": "healthy"}), 200

# User Login/Registration Bridge
@app.route('/api/auth/sync', methods=['POST'])
def sync_user():
    if not supabase:
        return jsonify({"error": "Database not connected"}), 500
    
    data = request.json
    username = data.get('username')
    user_id = data.get('userId')
    save_data = data.get('allData')

    if not username:
        return jsonify({"error": "Username is required"}), 400

    try:
        # Check if user exists or update
        res = supabase.table('users').upsert({
            "username": username,
            "userId": user_id,
            "hammer_strike_save": save_data,
            "last_updated": "now()"
        }).execute()
        return jsonify({"success": True, "message": "User data synced"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Admin: Fetch All Users
@app.route('/api/admin/users', methods=['GET'])
def get_all_users():
    if not supabase:
        return jsonify({"error": "Database not connected"}), 500
    
    try:
        res = supabase.table('users').select('*').execute()
        return jsonify(res.data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
