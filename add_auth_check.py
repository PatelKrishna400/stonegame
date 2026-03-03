import os
import re

user_files = [
    'game.html',
    'upgrade.html',
    'daily_task.html',
    'withdraw.html',
    'premium.html',
    'profile.html',
    'refral.html',
    'user_stone.html',
    'contact.html',
    'help.html',
    'index.html'
]

auth_js = """
    function checkAuth() {
        const isIndex = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/');
        const loggedIn = sessionStorage.getItem('hammerStrikeUserLoggedIn') === 'true';
        const hasData = localStorage.getItem('hammerStrikeSave') !== null;
        
        if (isIndex) {
            if (loggedIn && hasData) {
                window.location.href = 'user_stone.html';
            }
        } else {
            if (!loggedIn || !hasData) {
                window.location.href = 'index.html';
            }
        }
    }
    checkAuth();
    window.addEventListener('storage', (e) => {
        if (e.key === 'hammerStrikeSave' && e.newValue === null) {
            window.location.href = 'index.html';
        }
    });
"""

for filename in user_files:
    if not os.path.exists(filename):
        continue
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if 'checkAuth()' in content:
        continue # Avoid double adding

    # Insert after <script> or at end of <body>
    if '<script>' in content:
        content = content.replace('<script>', f'<script>{auth_js}', 1)
    else:
        content = content.replace('</body>', f'<script>{auth_js}</script></body>')
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Added auth check to {filename}")
