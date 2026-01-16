import csv
import os
import urllib.request
import re
from pathlib import Path

# Create the output folder
output_folder = Path("Product Images")
output_folder.mkdir(exist_ok=True)

def sanitize_filename(name):
    """Remove or replace characters that are invalid in filenames."""
    # Replace problematic characters
    sanitized = re.sub(r'[<>:"/\\|?*]', '-', name)
    # Remove leading/trailing spaces and dots
    sanitized = sanitized.strip('. ')
    # Limit length to avoid filesystem issues
    if len(sanitized) > 200:
        sanitized = sanitized[:200]
    return sanitized

def download_image(url, filename):
    """Download an image from URL and save it with the given filename."""
    try:
        # Set up request with headers to avoid being blocked
        headers = {
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36'
        }
        request = urllib.request.Request(url, headers=headers)
        
        with urllib.request.urlopen(request, timeout=30) as response:
            data = response.read()
        
        # Get the file extension from the URL
        ext = os.path.splitext(url)[1].split('?')[0]  # Remove query params if any
        if not ext:
            ext = '.jpg'  # Default to .jpg if no extension found
        
        # Sanitize the filename and add extension
        safe_filename = sanitize_filename(filename) + ext
        filepath = output_folder / safe_filename
        
        # Write the image
        with open(filepath, 'wb') as f:
            f.write(data)
        
        return True, safe_filename
    except Exception as e:
        return False, str(e)

# Read the CSV and download images
print("Starting image download...")
print("-" * 50)

with open('sports_items.csv', 'r', encoding='utf-8') as csvfile:
    reader = csv.DictReader(csvfile)
    
    total = 0
    success = 0
    failed = 0
    
    for row in reader:
        total += 1
        image_url = row['js-search-image src']
        product_title = row['listing-product__title']
        
        print(f"[{total}] Downloading: {product_title[:50]}...")
        
        result, info = download_image(image_url, product_title)
        
        if result:
            success += 1
            print(f"    ✓ Saved as: {info}")
        else:
            failed += 1
            print(f"    ✗ Failed: {info}")

print("-" * 50)
print(f"Complete! Downloaded {success}/{total} images. Failed: {failed}")
print(f"Images saved to: {output_folder.absolute()}")
