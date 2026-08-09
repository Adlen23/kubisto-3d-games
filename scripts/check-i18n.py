#!/usr/bin/env python3
"""
فحص شامل لملف i18n لاكتشاف المفاتيح الناقصة بين العربية والإنجليزية
"""

import re
import sys

def parse_object_keys(text, start_idx):
    """استخراج المفاتيح من كائن JavaScript بشكل متكرر"""
    keys = set()
    i = start_idx
    depth = 0
    while i < len(text):
        c = text[i]
        if c == '{':
            depth += 1
        elif c == '}':
            depth -= 1
            if depth == 0:
                return keys, i
        elif c == "'" or c == '"':
            # skip string
            quote = c
            i += 1
            while i < len(text) and text[i] != quote:
                if text[i] == '\\':
                    i += 1
                i += 1
        elif depth == 1:
            # match key: pattern at depth 1
            m = re.match(r'\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:', text[i:])
            if m and (i == 0 or text[i-1] in ' \t\n{,'):
                keys.add(m.group(1))
        i += 1
    return keys, i

def get_all_keys(obj_str):
    """استخراج كل المفاتيح من كائن بشكل متكرر مع المسار"""
    paths = set()
    
    def walk(text, start, prefix):
        i = start
        depth = 0
        while i < len(text):
            c = text[i]
            if c == '{':
                depth += 1
                if depth == 1:
                    # start of object content
                    pass
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return i
            elif c == "'" or c == '"':
                quote = c
                i += 1
                while i < len(text) and text[i] != quote:
                    if text[i] == '\\':
                        i += 1
                    i += 1
            elif depth == 1:
                m = re.match(r'\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*', text[i:])
                if m and (i == 0 or text[i-1] in ' \t\n{,'):
                    key = m.group(1)
                    new_path = f"{prefix}.{key}" if prefix else key
                    j = i + m.end()
                    # skip whitespace
                    while j < len(text) and text[j] in ' \t\n':
                        j += 1
                    if j < len(text) and text[j] == '{':
                        # nested object
                        paths.add(new_path + '.*')
                        end = walk(text, j, new_path)
                        i = end
                    else:
                        paths.add(new_path)
                    i += m.end() - 1
            i += 1
        return i
    
    walk(obj_str, 0, '')
    return paths

# قراءة الملف
with open('/home/z/my-project/src/lib/i18n.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# العثور على كائنات ar و en
ar_match = re.search(r'\bar:\s*\{', content)
en_match = re.search(r'\ben:\s*\{', content)

if not ar_match or not en_match:
    print("ERROR: Could not find ar or en objects")
    sys.exit(1)

# استخراج الكائنات
def extract_object(text, start):
    depth = 0
    i = start
    while i < len(text):
        if text[i] == '{':
            depth += 1
        elif text[i] == '}':
            depth -= 1
            if depth == 0:
                return text[start:i+1]
        elif text[i] == "'" or text[i] == '"':
            quote = text[i]
            i += 1
            while i < len(text) and text[i] != quote:
                if text[i] == '\\':
                    i += 1
                i += 1
        i += 1
    return None

ar_obj = extract_object(content, ar_match.end() - 1)
en_obj = extract_object(content, en_match.end() - 1)

ar_keys = get_all_keys(ar_obj)
en_keys = get_all_keys(en_obj)

print("=" * 60)
print("تقرير فحص الترجمات - i18n")
print("=" * 60)
print(f"\nمفاتيح العربية: {len(ar_keys)}")
print(f"مفاتيح الإنجليزية: {len(en_keys)}")

# مفاتيح في العربية وليس في الإنجليزية
only_ar = ar_keys - en_keys
only_en = en_keys - ar_keys

if only_ar:
    print(f"\n❌ مفاتيح في العربية وليس في الإنجليزية ({len(only_ar)}):")
    for k in sorted(only_ar):
        print(f"   - {k}")

if only_en:
    print(f"\n❌ مفاتيح في الإنجليزية وليس في العربية ({len(only_en)}):")
    for k in sorted(only_en):
        print(f"   - {k}")

if not only_ar and not only_en:
    print("\n✅ جميع المفاتيح متطابقة بين العربية والإنجليزية")
