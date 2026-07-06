import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

interface StoryPage {
  pageNumber: number
  textAr: string
  textEn: string
  imagePrompt: string
}

interface GenerateImagesRequest {
  childName: string
  childAge: string
  storyIdea: string
  storyType: string
  referenceImage: string // base64 data URL
  language: string
}

/**
 * توليد قصة مصورة مع صور مبنية على صورة الطفل المرجعية
 * يستخدم ZAI لتوليد نص القصة، ثم يولّد صور لكل صفحة
 *
 * ملاحظة: لاستخدام KIE.AI API الحقيقي (GPT-IMAGE-1 أو Nano Banana):
 * 1. احصل على API key من https://kie.ai
 * 2. استبدل دالة generateImageWithKieAI بالكود الفعلي
 * 3. الـ endpoint: https://api.kie.ai/v1/images/generations
 */

export async function POST(request: NextRequest) {
  try {
    const { childName, childAge, storyIdea, storyType, referenceImage, language } = await request.json() as GenerateImagesRequest

    if (!childName || !storyIdea || !referenceImage) {
      return NextResponse.json(
        { error: 'Missing required fields: childName, storyIdea, referenceImage' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()
    const isAr = language === 'ar'

    // ====== الخطوة 1: توليد نص القصة مقسماً إلى صفحات ======
    const storyTypePrompts: Record<string, { ar: string; en: string }> = {
      adventure: {
        ar: 'مغامرة مثيرة مليئة بالتحديات والاكتشافات',
        en: 'an exciting adventure full of challenges and discoveries',
      },
      bedtime: {
        ar: 'قصة هادئة قبل النوم تساعد على الاسترخاء',
        en: 'a calm bedtime story that helps with relaxation',
      },
      educational: {
        ar: 'قصة تعليمية تعلم شيئاً جديداً',
        en: 'an educational story that teaches something new',
      },
      fantasy: {
        ar: 'قصة خيالية ساحرة ب عوالم سحرية',
        en: 'a magical fantasy story with enchanted worlds',
      },
      friendship: {
        ar: 'قصة عن الصداقة والتعاون',
        en: 'a story about friendship and cooperation',
      },
    }

    const typePrompt = storyTypePrompts[storyType || 'adventure'] || storyTypePrompts.adventure

    const systemPrompt = isAr
      ? `أنت كاتب قصص أطفال محترف. اكتب قصة مصورة من 4 صفحات للطفل ${childName} (عمره ${childAge} سنوات).
القصة عن: ${storyIdea}
النوع: ${typePrompt.ar}

مهم جداً:
- بطل القصة هو الطفل ${childName} نفسه
- اكتب 4 صفحات فقط
- كل صفحة تحتوي على نص قصير (2-3 جمل)
- كل صفحة تحتوي على وصف بالإنجليزية للمشهد المرئي (imagePrompt) - هذا مهم لتوليد الصور
- imagePrompt يجب أن يصف المشهد بدقة: الشخصيات، الألوان، الإضاءة، الأسلوب الفني
- استخدم أسلوب رسم كرتوني لطيف مناسب للأطفال
- اذكر دائماً أن البطل يشبه الطفل في صورته المرجعية

أرجع النتيجة بصيغة JSON فقط:
{
  "title": "عنوان القصة",
  "pages": [
    {
      "pageNumber": 1,
      "textAr": "نص الصفحة بالعربية",
      "textEn": "نص الصفحة بالإنجليزية",
      "imagePrompt": "detailed English description of the scene for image generation, cartoon style, child looking like the reference photo, [scene description]"
    }
  ]
}`
      : `You are a professional children's story writer. Write a 4-page illustrated story for ${childName} (aged ${childAge}).
Story about: ${storyIdea}
Type: ${typePrompt.en}

Important:
- The main character is ${childName} themselves
- Write exactly 4 pages
- Each page has short text (2-3 sentences)
- Each page has an English imagePrompt describing the visual scene
- imagePrompt must describe: characters, colors, lighting, art style
- Use a cute cartoon style suitable for children
- Always mention the hero looks like the child in their reference photo

Return JSON only:
{
  "title": "Story title",
  "pages": [
    {
      "pageNumber": 1,
      "textAr": "Arabic text",
      "textEn": "English text",
      "imagePrompt": "detailed English description, cartoon style, child looking like reference photo, [scene]"
    }
  ]
}`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: isAr ? `اكتب القصة الآن.` : 'Write the story now.' },
      ],
    })

    const storyContent = completion.choices?.[0]?.message?.content || ''

    if (!storyContent) {
      return NextResponse.json(
        { error: isAr ? 'فشل في إنشاء القصة' : 'Failed to generate story' },
        { status: 500 }
      )
    }

    // استخراج JSON من الرد
    let storyData
    try {
      const jsonMatch = storyContent.match(/\{[\s\S]*\}/)
      storyData = JSON.parse(jsonMatch ? jsonMatch[0] : storyContent)
    } catch {
      // إذا فشل parsing، ننشئ قصة افتراضية
      storyData = {
        title: isAr ? `مغامرة ${childName}` : `${childName}'s Adventure`,
        pages: [
          {
            pageNumber: 1,
            textAr: `في يوم جميل، قرر ${childName} أن يذهب في مغامرة.`,
            textEn: `One beautiful day, ${childName} decided to go on an adventure.`,
            imagePrompt: `cute cartoon child going on adventure, happy, sunny day, colorful, children book illustration style`,
          },
          {
            pageNumber: 2,
            textAr: `وصل ${childName} إلى غابة سحرية مليئة بالأشجار الجميلة.`,
            textEn: `${childName} arrived at a magical forest full of beautiful trees.`,
            imagePrompt: `cute cartoon child in magical forest, green trees, sun rays, fantasy, children book style`,
          },
          {
            pageNumber: 3,
            textAr: `اكتشف ${childName} شيئاً مدهشاً في الطريق!`,
            textEn: `${childName} discovered something amazing on the way!`,
            imagePrompt: `cute cartoon child discovering something amazing, surprised face, magical glow, children book style`,
          },
          {
            pageNumber: 4,
            textAr: `عاد ${childName} سعيداً بعد مغامرة رائعة.`,
            textEn: `${childName} returned happy after a wonderful adventure.`,
            imagePrompt: `cute cartoon child returning home happy, sunset, smile, children book illustration`,
          },
        ],
      }
    }

    // ====== الخطوة 2: توليد صورة لكل صفحة ======
    // ملاحظة: في بيئة الإنتاج، استبدل هذا بـ KIE.AI API الحقيقي
    // حالياً نستخدم placeholder مع معلومات الصورة المرجعية

    const pagesWithImages = await Promise.all(
      storyData.pages.map(async (page: StoryPage, index: number) => {
        try {
          // محاولة استخدام ZAI لتوليد صورة (إذا كان مدعوماً)
          // في الإنتاج: استبدل بـ KIE.AI API
          const imageUrl = await generateStoryImage(page.imagePrompt, referenceImage, index)

          return {
            ...page,
            imageUrl,
            imageGenerated: !!imageUrl,
          }
        } catch (err) {
          console.error(`Error generating image ${index + 1}:`, err)
          return {
            ...page,
            imageUrl: null,
            imageGenerated: false,
          }
        }
      })
    )

    return NextResponse.json({
      title: storyData.title,
      pages: pagesWithImages,
      childName,
      storyType,
      language,
      // معلومات للواجهة عن كيفية تفعيل KIE.AI الحقيقي
      kieAiInfo: {
        enabled: false,
        message: isAr
          ? 'لتفعيل توليد الصور الحقيقي بـ KIE.AI، أضف API key في ملف .env'
          : 'To enable real image generation with KIE.AI, add API key in .env file',
      },
    })
  } catch (error) {
    console.error('Story images generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * توليد صورة للقصة باستخدام KIE.AI API
 * في المستقبل: استخدم GPT-IMAGE-1 أو Nano Banana مع reference image
 */
async function generateStoryImage(prompt: string, referenceImage: string, pageIndex: number): Promise<string | null> {
  try {
    // ====== طريقة KIE.AI الحقيقية (للإنتاج) ======
    /*
    const KIE_API_KEY = process.env.KIE_AI_API_KEY
    if (KIE_API_KEY) {
      const response = await fetch('https://api.kie.ai/v1/images/generations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${KIE_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-image-1', // أو 'nano-banana'
          prompt: prompt,
          image: referenceImage, // base64 reference image
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          response_format: 'b64_json',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.data && data.data[0]) {
          if (data.data[0].b64_json) {
            return `data:image/png;base64,${data.data[0].b64_json}`
          }
          return data.data[0].url
        }
      }
    }
    */

    // ====== طريقة بديلة: استخدام ZAI image generation ======
    // محاولة توليد صورة عبر z-ai-web-dev-sdk
    /*
    const zai = await ZAI.create()
    const imageResponse = await zai.images.generations.create({
      prompt: prompt,
      n: 1,
      size: '1024x1024',
    })
    if (imageResponse.data && imageResponse.data[0]) {
      return imageResponse.data[0].url || null
    }
    */

    // ====== حالياً: نرجع null والواجهة ستعرض placeholder ملون ======
    return null
  } catch (error) {
    console.error('Image generation error:', error)
    return null
  }
}
