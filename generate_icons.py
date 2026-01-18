import os
from PIL import Image

def generate_icons(input_path, output_dir):
    """
    Generates required icons from a base logo image.
    Outputs:
    - logo192.png (192x192)
    - logo512.png (512x512)
    - favicon.ico (Multiple sizes: 64, 32, 24, 16)
    """
    if not os.path.exists(input_path):
        print(f"Error: {input_path} not found. Please ensure logo_raw.png is in the project root.")
        return

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    try:
        with Image.open(input_path) as img:
            # Ensure the image is square by cropping from the center
            width, height = img.size
            if width != height:
                print(f"Note: Input image is {width}x{height}. Cropping to square.")
                size = min(width, height)
                left = (width - size) / 2
                top = (height - size) / 2
                right = (width + size) / 2
                bottom = (height + size) / 2
                img = img.crop((left, top, right, bottom))

            # Generate PNGs for manifest and apple-touch-icon
            png_sizes = [192, 512]
            for size in png_sizes:
                out_name = f"logo{size}.png"
                out_path = os.path.join(output_dir, out_name)
                # Use Resampling.LANCZOS for high quality resizing
                img.resize((size, size), Image.Resampling.LANCZOS).save(out_path, "PNG")
                print(f"Successfully generated: {out_path}")

            # Generate multi-resolution favicon.ico
            ico_sizes = [(64, 64), (32, 32), (24, 24), (16, 16)]
            ico_path = os.path.join(output_dir, "favicon.ico")
            
            # Create a list of images for the ICO format
            icon_imgs = [img.resize(size, Image.Resampling.LANCZOS) for size in ico_sizes]
            # Save the first one and append the rest as secondary layers
            icon_imgs[0].save(
                ico_path, 
                format="ICO", 
                append_images=icon_imgs[1:]
            )
            print(f"Successfully generated: {ico_path}")

    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Settings
    INPUT_LOGO = "logo_raw.png"
    OUTPUT_FOLDER = "public"
    
    print(f"Starting icon generation from {INPUT_LOGO}...")
    generate_icons(INPUT_LOGO, OUTPUT_FOLDER)
    print("Done!")
