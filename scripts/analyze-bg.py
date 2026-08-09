#!/usr/bin/env python3
"""تحليل دقيق للون الخلفية في صورة كوبيستو"""

from PIL import Image
import numpy as np

img = Image.open('/home/z/my-project/public/kubisto-idle-sprite.jpg').convert('RGB')
arr = np.array(img)

print(f"Image size: {img.size}")
print(f"Array shape: {arr.shape}")

# عينة من زوايا الصورة (حيث تكون الخلفية واضحة)
corners = [
    ('top-left', arr[10, 10]),
    ('top-right', arr[10, -10]),
    ('bottom-left', arr[-10, 10]),
    ('bottom-right', arr[-10, -10]),
    ('center-top', arr[100, arr.shape[1]//2]),
    ('center-edge-left', arr[arr.shape[0]//2, 5]),
    ('center-edge-right', arr[arr.shape[0]//2, -5]),
]

print("\nBackground colors at corners/edges:")
for name, color in corners:
    print(f"  {name}: RGB{tuple(color)} - #{color[0]:02x}{color[1]:02x}{color[2]:02x}")

# متوسط لون الزوايا (الخلفية)
corner_pixels = [arr[10, 10], arr[10, -10], arr[-10, 10], arr[-10, -10]]
avg_color = np.mean(corner_pixels, axis=0).astype(int)
print(f"\nAverage background color: RGB({avg_color[0]}, {avg_color[1]}, {avg_color[2]}) - #{avg_color[0]:02x}{avg_color[1]:02x}{avg_color[2]:02x}")

# توزيع الألوان
print(f"\nColor distribution:")
print(f"  R range: {arr[:,:,0].min()} - {arr[:,:,0].max()} (mean: {arr[:,:,0].mean():.0f})")
print(f"  G range: {arr[:,:,1].min()} - {arr[:,:,1].max()} (mean: {arr[:,:,1].mean():.0f})")
print(f"  B range: {arr[:,:,2].min()} - {arr[:,:,2].max()} (mean: {arr[:,:,2].mean():.0f})")

# كم بكسل قريب من اللون الأخضر المتوسط
target = avg_color.astype(int)
diff = np.abs(arr.astype(int) - target)
distance = np.sqrt(np.sum(diff ** 2, axis=2))
total_pixels = arr.shape[0] * arr.shape[1]
green_pixels = (distance < 30).sum()
print(f"\nPixels close to background (distance < 30): {green_pixels} / {total_pixels} ({100*green_pixels/total_pixels:.1f}%)")
