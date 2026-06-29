import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { childName, childAge, hobbies, storyType, language } = await request.json()

    if (!childName || !childAge || !hobbies) {
      return NextResponse.json(
        { error: 'Missing required fields: childName, childAge, hobbies' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const isAr = language === 'ar'

    const storyTypePrompts: Record<string, { ar: string; en: string }> = {
      adventure: {
        ar: 'اكتب قصة مغامرة مشوقة ومثيرة مليئة بالتحديات والاكتشافات. القصة يجب أن تحتوي على رحلة بطولية يخوضها الطفل مع كوبيستو.',
        en: 'Write an exciting adventure story full of challenges and discoveries. The story should contain a heroic journey the child takes with Kopisto.',
      },
      bedtime: {
        ar: 'اكتب قصة قبل النوم هادئة ومريحة تساعد الطفل على الاسترخاء والنوم بهدوء. القصة يجب أن تكون لطيفة ودافئة وتنتهي بنهاية مطمئنة.',
        en: 'Write a calm and soothing bedtime story to help the child relax and sleep peacefully. The story should be gentle, warm, and end with a reassuring conclusion.',
      },
      educational: {
        ar: 'اكتب قصة تعليمية ممتعة تعلم الطفل شيئاً جديداً بطريقة مشوقة. القصة يجب أن تحتوي على معلومات تعليمية مدمجة بشكل طبيعي في الحكاية.',
        en: 'Write a fun educational story that teaches the child something new in an engaging way. The story should contain educational information naturally woven into the narrative.',
      },
    }

    const typePrompt = storyTypePrompts[storyType || 'adventure'] || storyTypePrompts.adventure

    const systemPrompt = isAr
      ? `أنت كاتب قصص أطفال محترف. اكتب قصة تعليمية ممتعة ومشوقة للأطفال باللغة العربية. القصة يجب أن تكون مناسبة لعمر الطفل المحدد، وتتضمن اهتمامات الطفل وهواياته. القصة يجب أن تحتوي على درس تعليمي أو قيمة أخلاقية. اكتب القصة بأسلوب بسيط وممتع مع حوار مشوق. طول القصة بين 300-500 كلمة. ابدأ القصة بعنوان جذاب. ${typePrompt.ar}`
      : `You are a professional children's story writer. Write a fun and engaging educational story for children in English. The story should be appropriate for the specified child's age, and incorporate the child's interests and hobbies. The story should contain an educational lesson or moral value. Write in a simple and fun style with engaging dialogue. Story length between 300-500 words. Start with an engaging title. ${typePrompt.en}`

    const userPrompt = isAr
      ? `اكتب قصة مخصصة لطفل اسمه ${childName}، عمره ${childAge} سنوات، يحب ${hobbies}. القصة يجب أن تكون ممتعة وتعليمية وتشجع الطفل على التعلم والاستكشاف.`
      : `Write a personalized story for a child named ${childName}, aged ${childAge} years old, who loves ${hobbies}. The story should be fun, educational, and encourage the child to learn and explore.`

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })

    const story = completion.choices?.[0]?.message?.content || ''

    if (!story) {
      return NextResponse.json(
        { error: isAr ? 'حدث خطأ في إنشاء القصة' : 'Failed to generate story' },
        { status: 500 }
      )
    }

    return NextResponse.json({ story })
  } catch (error) {
    console.error('Story generation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
