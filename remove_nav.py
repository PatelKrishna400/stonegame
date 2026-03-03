import os
import re

files_to_clean = [
    'daily_task.html',
    'game.html',
    'premium.html',
    'profile.html',
    'refral.html',
    'upgrade.html',
    'user_stone.html',
    'withdraw.html',
    'contact.html',
    'help.html'
]

# Regex to remove .bottom-nav CSS block
css_regex = re.compile(r'\.bottom-nav\s*\{[^\}]+\}', re.MULTILINE | re.DOTALL)
nav_item_regex = re.compile(r'\.nav-item[^\}]*\{[^\}]+\}', re.MULTILINE | re.DOTALL)
nav_icon_regex = re.compile(r'\.nav-icon[^\}]*\{[^\}]+\}', re.MULTILINE | re.DOTALL)

# Regex to remove the bottom-nav HTML block
html_regex = re.compile(r'<div class="bottom-nav">.*?</div>', re.MULTILINE | re.DOTALL)

for filename in files_to_clean:
    if not os.path.exists(filename):
        continue
    
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove CSS
    content = css_regex.sub('', content)
    content = nav_item_regex.sub('', content)
    content = nav_icon_regex.sub('', content)
    
    # Remove HTML
    content = html_regex.sub('', content)
    
    # Also remove padding-bottom from body if present
    content = re.sub(r'padding-bottom:\s*\d+px;', '', content)
    
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Cleaned {filename}")
