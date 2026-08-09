#!/usr/bin/env python3
"""
فحص شامل للنصوص الصلبة (hardcoded) في مكونات React
يبحث عن نصوص عربية/إنجليزية لا تستخدم نظام الترجمة
"""

import re
import os
import sys

# المجلدات للفحص
SCAN_DIRS = [
    '/home/z/my-project/src/components',
    '/home/z/my-project/src/app',
    '/home/z/my-project/src/context',
]

# تجاهل هذه الملفات
IGNORE_FILES = [
    'i18n.ts',
    'game-store.ts',
    'use-game-input.ts',
    'audio.ts',
]

# أنماط النصوص العربية (Unicode range for Arabic)
ARABIC_PATTERN = re.compile(r'[\u0600-\u06FF]')

# أنماط لعرض النصوص في JSX (between > and <)
JSX_TEXT_PATTERN = re.compile(r'>([^<>{}\n]{2,})<')

# أنماط النصوص في خصائص (placeholder, title, alt, aria-label, etc.)
ATTR_TEXT_PATTERN = re.compile(r'(?:placeholder|title|alt|aria-label|label)=["\']([^"\']{2,})["\']')

# أنماط النصوص في arrays/objects بدون isAr
ARRAY_TEXT_PATTERN = re.compile(r"['\"]([\u0600-\u06FF]{2,}[\u0600-\u06FF\s]*)['\"]")

issues = []

def check_file(filepath):
    """فحص ملف واحد"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        lines = content.split('\n')
    
    filename = os.path.basename(filepath)
    if filename in IGNORE_FILES:
        return
    
    for i, line in enumerate(lines, 1):
        # تخطي الأسطر التي تحتوي isAr (نظام الترجمة)
        if 'isAr' in line or 'locale' in line or 't.' in line or 'pc.' in line:
            continue
        
        # تخطي التعليقات
        stripped = line.strip()
        if stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('/*'):
            continue
        
        # البحث عن نصوص عربية صلبة
        # 1. في JSX (بين > و <)
        for match in re.finditer(r'>([^<>{}\n]+)<', line):
            text = match.group(1).strip()
            if ARABIC_PATTERN.search(text) and len(text) > 1:
                # تخطي إذا كان فقط رموز/أيقونات
                if text in ['🕐', '📅', '⏰', '📚', '✅', '❌', '⭐', '🎉', '🏆', '🎯', '💡', '🤖', '📈', '🛒', '📸', '📖', '🎬', '👨', '👩', '👧', '👦', '🏫', '⏰', '🎨', '🎵', '💝', '🤝', '⚽', '🔬', '🔢', '🥗', '🌙', '🛡️', '👫', '❤️', '🎮', '🧘', '🤗']:
                    continue
                issues.append({
                    'file': filepath,
                    'line': i,
                    'type': 'JSX Arabic text',
                    'text': text[:80],
                    'code': line.strip()[:120]
                })
        
        # 2. في خصائص (placeholder, title, etc.)
        for match in ATTR_TEXT_PATTERN.finditer(line):
            text = match.group(1)
            if ARABIC_PATTERN.search(text) and len(text) > 1:
                issues.append({
                    'file': filepath,
                    'line': i,
                    'type': 'Attribute Arabic text',
                    'text': text[:80],
                    'code': line.strip()[:120]
                })
        
        # 3. نصوص عربية في strings (لكن ليس في i18n.ts)
        if 'i18n' not in filepath:
            for match in re.finditer(r"['\"]([^'\"]*[\u0600-\u06FF][^'\"]*)['\"]", line):
                text = match.group(1).strip()
                # تخطي إذا كان السطر يحتوي isAr (تم التحقق منه أعلاه، لكن نعيد التحقق)
                if 'isAr' in line:
                    continue
                # تخطي التعليقات
                if text.startswith('//'):
                    continue
                # تخطي الأيقونات
                if all(c in '🕐📅⏰📚✅❌⭐🎉🏆🎯💡🤖📈🛒📸📖🎬👨👩👧👦🏫🎨🎵💝🤝⚽🔬🔢🥗🌙🛡️👫❤️🎮🧘🤗 \t' for c in text):
                    continue
                if len(text) > 2:
                    issues.append({
                        'file': filepath,
                        'line': i,
                        'type': 'String Arabic text',
                        'text': text[:80],
                        'code': line.strip()[:120]
                    })

# فحص جميع الملفات
total_files = 0
for scan_dir in SCAN_DIRS:
    for root, dirs, files in os.walk(scan_dir):
        for file in files:
            if file.endswith(('.tsx', '.ts')):
                filepath = os.path.join(root, file)
                total_files += 1
                try:
                    check_file(filepath)
                except Exception as e:
                    print(f"Error checking {filepath}: {e}", file=sys.stderr)

print("=" * 70)
print(f"تقرير فحص النصوص الصلبة (Hardcoded Text Audit)")
print("=" * 70)
print(f"الملفات المفحوصة: {total_files}")
print(f"المشاكل المكتشفة: {len(issues)}")
print()

if issues:
    # تجميع حسب الملف
    by_file = {}
    for issue in issues:
        fname = os.path.basename(issue['file'])
        if fname not in by_file:
            by_file[fname] = []
        by_file[fname].append(issue)
    
    for fname, file_issues in by_file.items():
        print(f"\n📁 {fname} ({len(file_issues)} مشاكل):")
        print("-" * 60)
        for issue in file_issues[:10]:  # أول 10 مشاكل لكل ملف
            print(f"  L{issue['line']} [{issue['type']}]")
            print(f"    النص: {issue['text']}")
            print(f"    الكود: {issue['code']}")
        if len(file_issues) > 10:
            print(f"  ... و {len(file_issues) - 10} مشاكل أخرى")
else:
    print("✅ لا توجد نصوص صلبة غير مترجمة")
