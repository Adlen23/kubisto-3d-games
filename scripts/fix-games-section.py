#!/usr/bin/env python3
"""
تحويل عناصر الألعاب في GamesSection من title/description إلى titleAr/titleEn/descAr/descEn
"""

import re

# ترجمات الألعاب (من i18n.ts)
GAMES_AR = {
    1: ('عدّاء كوبيستو', 'اقفز على المنصات واجمع الإجابة الصحيحة للسؤال الرياضي! لعبة بلاتفورمر مثيرة بأسلوب ماريو!'),
    2: ('تحدي الرياضيات', 'اختبر مهاراتك الحسابية! أجب عن أسئلة الجمع والطرح والضرب مع كوبيستو!'),
    3: ('ترتيب الأرقام', 'اضغط على الأرقام بالترتيب من الأصغر للأكبر! طريقة ممتعة لتعلّم التسلسل!'),
    4: ('فقع البالونات', 'فقع البالون الذي يحمل الإجابة الصحيحة! حل المعادلات وانفجر البالونات!'),
    5: ('تهجئة الكلمات', 'رتّب الحروف لتكوين الكلمة الصحيحة! تعلّم المفردات مع صور ممتعة!'),
    6: ('طابق الكلمة والصورة', 'طابق كل صورة مع الكلمة المناسبة! لعبة ذاكرة ثنائية اللغة!'),
    7: ('تعلّم الحروف العربية', 'تعلّم الحروف العربية واحدة واحدة مع طريقة النطق! اختبر نفسك!'),
    8: ('مغامرة الحروف', 'اقفز واجمع الحروف العربية بالترتيب الصحيح! لعبة بلاتفورمر ممتعة لتعلّم الأبجدية!'),
    9: ('عدّ مع كوبيستو', 'تعلّم الأرقام والعد من 1 إلى 20 بطريقة ممتعة! كم ثمرة ترى؟'),
    10: ('ذاكرة كوبيستو', 'اختبر ذاكرتك! اقلب البطاقات واعثر على الأزواج المتشابهة!'),
    11: ('أصوات الحيوانات', 'استمع لأصوات الحيوانات واختر الحيوان المناسب! معلومات ممتعة!'),
    12: ('استكشاف المجموعة الشمسية', 'اكتشف الكواكب وتعلّم معلومات مدهشة! استكشف مع كوبيستو!'),
    13: ('مختبر الألوان', 'امزج الألوان لاكتشاف ألوان جديدة! تعلّم نظرية الألوان في مختبر كوبيستو!'),
    14: ('لوحة الرسم', 'ارسم وابدع بالألوان والفرش! تتبع القوالب وعبر عن نفسك!'),
    15: ('تعرّف على النمط', 'ما الذي يأتي بعد في النمط؟ درّب عقلك مع تسلسلات ممتعة!'),
    16: ('موسيقى البيانو', 'اعزف ألحاناً جميلة على بيانو ملون! اتبع اللحن أو أنشئ موسيقاك!'),
}

GAMES_EN = {
    1: ('Kopisto Runner', 'Jump on platforms and collect the right math answer! A Mario-style platformer!'),
    2: ('Math Quiz Challenge', 'Test your math skills! Answer addition, subtraction and multiplication questions!'),
    3: ('Number Order', 'Tap the numbers in ascending order! A fun way to learn number sequences!'),
    4: ('Math Balloon Pop', 'Pop the balloon with the correct answer! Solve equations and pop balloons!'),
    5: ('Word Spelling', 'Arrange the letters to spell the word correctly! Learn vocabulary with fun pictures!'),
    6: ('Word-Picture Match', 'Match each picture with its word! A bilingual memory game!'),
    7: ('Arabic Alphabet', 'Learn Arabic letters one by one with pronunciation! Test yourself!'),
    8: ('Letter Adventure', 'Jump and collect Arabic letters in the correct order! A fun platformer to learn the alphabet!'),
    9: ('Count with Kopisto', 'Learn numbers and counting from 1 to 20 in a fun way! How many fruits?'),
    10: ('Kopisto Memory', 'Test your memory! Flip the cards and find matching pairs!'),
    11: ('Animal Sounds', 'Listen to animal sounds and pick the right animal! Fun facts!'),
    12: ('Solar System Explorer', 'Discover planets and learn amazing facts! Explore with Kopisto!'),
    13: ('Color Mixing Lab', 'Mix colors to discover new ones! Learn color theory in Kopisto\'s lab!'),
    14: ('Drawing Canvas', 'Draw and create with colors and brushes! Follow templates and express yourself!'),
    15: ('Pattern Recognition', 'What comes next in the pattern? Train your brain with fun sequences!'),
    16: ('Music Piano', 'Play beautiful melodies on a colorful piano! Follow the tune or create your own!'),
}

with open('/home/z/my-project/src/components/kopisto/GamesSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# لكل لعبة، استبدل title/description بـ titleAr/titleEn/descAr/descEn
for game_id, (title_ar, desc_ar) in GAMES_AR.items():
    title_en, desc_en = GAMES_EN[game_id]
    
    # البحث عن نمط: id: X, \n    title: '...', \n    description: '...',
    # واستبداله
    
    # نمط title
    pattern_title = rf"(id:\s*{game_id},\s*\n\s*)title:\s*'[^']*',\s*\n\s*description:\s*'[^']*',"
    replacement_title = rf"\1titleAr: '{title_ar}',\n    titleEn: '{title_en}',\n    descAr: '{desc_ar}',\n    descEn: '{desc_en}',"
    
    new_content, count = re.subn(pattern_title, replacement_title, content, flags=re.MULTILINE)
    if count > 0:
        content = new_content
        print(f"✓ لعبة {game_id}: تم التحديث")
    else:
        # محاولة نمط مختلف (مع علامات اقتباس مزدوجة أو نصوص أطول)
        pattern_title2 = rf"(id:\s*{game_id},\s*\n\s*)title:\s*\"[^\"]*\",\s*\n\s*description:\s*\"[^\"]*\","
        new_content, count = re.subn(pattern_title2, replacement_title.replace("'", "\""), content, flags=re.MULTILINE)
        if count > 0:
            content = new_content
            print(f"✓ لعبة {game_id}: تم التحديث (double quotes)")
        else:
            # نمط مع escape characters
            pattern_title3 = rf"(id:\s*{game_id},\s*\n\s*)title:\s*'([^']*)',\s*\n\s*description:\s*'((?:[^'\\]|\\.)*)',"
            match = re.search(pattern_title3, content, flags=re.MULTILINE)
            if match:
                # تجنب مشاكل الـ escape في النص الجديد
                desc_ar_safe = desc_ar.replace("'", "\\'")
                desc_en_safe = desc_en.replace("'", "\\'")
                replacement = rf"\1titleAr: '{title_ar}',\n    titleEn: '{title_en}',\n    descAr: '{desc_ar_safe}',\n    descEn: '{desc_en_safe}',"
                content = re.sub(pattern_title3, replacement, content, flags=re.MULTILINE)
                print(f"✓ لعبة {game_id}: تم التحديث (escape)")
            else:
                print(f"✗ لعبة {game_id}: لم يتم العثور على النمط")

with open('/home/z/my-project/src/components/kopisto/GamesSection.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ تم تحديث جميع الألعاب")
