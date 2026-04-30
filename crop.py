from PIL import Image

img = Image.open('/Users/brain/.gemini/antigravity/brain/279eedd2-a482-4702-bd77-1ba5d5e34430/media__1777513829944.png').convert("RGBA")

min_x, min_y = img.width, img.height
max_x, max_y = 0, 0

# Pass 1: find bounding box of non-grayscale, non-dark colors (to avoid text)
for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = img.getpixel((x, y))
        
        # skip white/gray background
        if r > 230 and g > 230 and b > 230:
            continue
            
        # skip dark text (r,g,b all < 100)
        if r < 100 and g < 100 and b < 100:
            continue
            
        # skip blue text "将任务加注星标" (it's blue, r<100, g<150, b>200, wait, illustration also has blue shirt)
        # However, the illustration is in the middle of the pane.
        if x > 400 and x < 900 and y > 80 and y < 350:
            if x < min_x: min_x = x
            if x > max_x: max_x = x
            if y < min_y: min_y = y
            if y > max_y: max_y = y

# Now we have a rough bounding box of the colored illustration.
# Let's expand it by 5px and include all pixels inside (except white background).
if max_x > min_x and max_y > min_y:
    box = (min_x - 5, min_y - 5, max_x + 5, max_y + 5)
    cropped = img.crop(box)
    
    # Make white background transparent
    data = cropped.getdata()
    new_data = []
    for item in data:
        # if almost white, make transparent
        if item[0] > 240 and item[1] > 240 and item[2] > 240:
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
    cropped.putdata(new_data)
    
    cropped.save('/Users/brain/MY/node-learning/vue-frontend/src/assets/empty-star.png', "PNG")
    print(f"Saved empty-star.png with box {box}")
else:
    print("Illustration not found")

