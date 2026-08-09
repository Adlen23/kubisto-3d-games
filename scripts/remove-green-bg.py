#!/usr/bin/env python3
"""
إزالة الخلفية الخضراء من صور كوبيستو باستخدام chroma keying
ينتج صور PNG بخلفية شفافة
"""

from PIL import Image
import numpy as np
import os

INPUT_DIR = '/home/z/my-project/public'
OUTPUT_DIR = '/home/z/my-project/public'

images_to_process = [
    ('kubisto-idle-sprite.jpg', 'kubisto-idle-sprite.png'),
    ('kubisto-run-sprite.jpg', 'kubisto-run-sprite.png'),
]

TARGET_GREEN = np.array([74, 154, 79])  # #4a9a4f - اللون الفعلي للخلفية

def remove_green_background(input_path, output_path, tolerance=45, edge_softness=25):
    """إزالة الخلفية الخضراء من الصورة"""
    print(f"Processing: {input_path} → {output_path}")

    img = Image.open(input_path).convert('RGB')
    arr = np.array(img)

    diff = np.abs(arr.astype(int) - TARGET_GREEN.astype(int))
    distance = np.sqrt(np.sum(diff ** 2, axis=2))

    mask = distance > tolerance  # البكسلات البعيدة عن الأخضر تبقى
    soft_mask = np.clip((distance - tolerance) / edge_softness, 0, 1)

    rgba = np.zeros((arr.shape[0], arr.shape[1], 4), dtype=np.uint8)
    rgba[:, :, :3] = arr
    rgba[:, :, 3] = (soft_mask * 255).astype(np.uint8)

    # التخلص من الهالة الخضراء على الحواف
    # للبكسلات الشبه شفافة، نستبدل الأخضر باللون المجاور
    alpha = rgba[:, :, 3]
    edge_pixels = (alpha > 0) & (alpha < 255)
    
    result = Image.fromarray(rgba)
    result.save(output_path, 'PNG')
    
    transparent_pct = (1 - mask.sum() / mask.size) * 100
    print(f"  ✓ Removed green background ({transparent_pct:.1f}% transparent)")
    print(f"  ✓ Saved: {output_path}")
    print(f"  ✓ Size: {result.size}")

if __name__ == '__main__':
    print("=" * 50)
    print("إزالة الخلفية الخضراء من صور كوبيستو")
    print("=" * 50)
    
    for input_name, output_name in images_to_process:
        input_path = os.path.join(INPUT_DIR, input_name)
        output_path = os.path.join(OUTPUT_DIR, output_name)
        
        if os.path.exists(input_path):
            remove_green_background(input_path, output_path)
        else:
            print(f"⚠ File not found: {input_path}")
    
    print("\n✅ تمت المعالجة بنجاح!")
