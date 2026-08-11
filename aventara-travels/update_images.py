import json
import urllib.request
import re
import os

# Wikipedia API URL for getting images
url = "https://en.wikipedia.org/w/api.php?action=query&titles=Colombo|Kandy|Sigiriya|Dambulla_cave_temple|Nuwara_Eliya|Ella,_Sri_Lanka|Yala_National_Park|Galle|Mirissa|Trincomalee&prop=pageimages&format=json&pithumbsize=800"

req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
response = urllib.request.urlopen(req)
data = json.loads(response.read())

pages = data['query']['pages']
images = {}
for page_id, page_info in pages.items():
    title = page_info['title'].lower()
    if 'thumbnail' in page_info:
        img_url = page_info['thumbnail']['source']
        if 'colombo' in title: images['colombo'] = img_url
        elif 'kandy' in title: images['kandy'] = img_url
        elif 'sigiriya' in title: images['sigiriya'] = img_url
        elif 'dambulla' in title: images['dambulla'] = img_url
        elif 'nuwara eliya' in title: images['nuwaraeliya'] = img_url
        elif 'ella' in title: images['ella'] = img_url
        elif 'yala' in title: images['yala'] = img_url
        elif 'galle' in title: images['galle'] = img_url
        elif 'mirissa' in title: images['mirissa'] = img_url
        elif 'trincomalee' in title: images['trincomalee'] = img_url

# Fallbacks if Wikipedia fails
fallbacks = {
    'colombo': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Colombo_Lotus_Tower.jpg/800px-Colombo_Lotus_Tower.jpg',
    'kandy': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Temple_of_the_Tooth_Relic_Kandy.jpg/800px-Temple_of_the_Tooth_Relic_Kandy.jpg',
    'sigiriya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Sigiriya_Rock_Fortress.jpg/800px-Sigiriya_Rock_Fortress.jpg',
    'dambulla': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Dambulla_Cave_Temple.jpg/800px-Dambulla_Cave_Temple.jpg',
    'nuwaraeliya': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/Nuwara_Eliya_Post_Office.jpg/800px-Nuwara_Eliya_Post_Office.jpg',
    'ella': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Nine_Arch_Bridge_Ella.jpg/800px-Nine_Arch_Bridge_Ella.jpg',
    'yala': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Leopard_in_Yala_National_Park.jpg/800px-Leopard_in_Yala_National_Park.jpg',
    'galle': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Galle_Fort_Lighthouse.jpg/800px-Galle_Fort_Lighthouse.jpg',
    'mirissa': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Mirissa_Beach.jpg/800px-Mirissa_Beach.jpg',
    'trincomalee': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Koneswaram_Temple_Trincomalee.jpg/800px-Koneswaram_Temple_Trincomalee.jpg'
}

for k in fallbacks.keys():
    if k not in images:
        images[k] = fallbacks[k]

# Specific images for tours based on above
tour_images = {
    'tour1': images['sigiriya'],       # Sri Lanka Highlights
    'tour2': images['kandy'],          # Classic Sri Lanka
    'tour3': images['ella'],           # Hill Country Escape
    'tour4': images['yala'],           # Wildlife Adventure
    'tour5': images['mirissa'],        # Romantic Sri Lanka
    'tour6': images['galle']           # Luxury Sri Lanka
}

# Add tour images to the main replacement dict
images.update(tour_images)

def replace_in_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    for key, url in images.items():
        # Replace seeded picsum urls with the real image urls
        content = re.sub(rf'https://picsum\.photos/seed/{key}/\d+/\d+', url, content)
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

base_dir = r"C:\Users\Supun Sampath\.gemini\antigravity\scratch\aventara-travels"
for filename in ['index.html', 'destinations.html', 'tours.html']:
    replace_in_file(os.path.join(base_dir, filename))

print("Image replacement complete.")
