import os
import glob
from PIL import Image

def remove_white_bg(image_path):
    img = Image.open(image_path).convert("RGBA")
    datas = img.getdata()

    new_data = []
    for item in datas:
        # If pixel is near-white (R>230, G>230, B>230), make it transparent
        if item[0] > 225 and item[1] > 225 and item[2] > 225:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)

    img.putdata(new_data)
    
    # Trim transparent borders so content is tight & centered
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)

    img.save(image_path, "PNG")
    print(f"Processed: {image_path}")

def main():
    brand_dir = os.path.join("public", "images", "brands")
    for filepath in glob.glob(os.path.join(brand_dir, "*.png")):
        remove_white_bg(filepath)

if __name__ == "__main__":
    main()
