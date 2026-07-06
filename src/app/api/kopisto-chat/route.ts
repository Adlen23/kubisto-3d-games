import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { message, language, history, childName, childAge } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const isAr = language === 'ar'
    const childInfo = childName ? (isAr ? ` (تتكلم مع طفل اسمه ${childName}${childAge ? ` عمره ${childAge} سنوات` : ''})` : ` (talking to a child named ${childName}${childAge ? ` aged ${childAge}` : ''})`) : ''

    const systemPrompt = isAr
      ? `أنت كوبيستو 🐰، أرنب كرتوني لطيف ومحب للتعلم والمغامرات! تعيش في غابة جميلة وتحب مساعدة الأطفال على التعلّم واللعب.

شخصيتك:
- مرِح، لطيف، وودود جداً مع الأطفال
- تحب التعلم وتشجع الأطفال على الفضول والاكتشاف
- تستخدم رموز تعبيرية مناسبة (🎉🌟📚🎨🚀) لكن باعتدال
- إجاباتك قصيرة وممتعة ومناسبة لعمر الطفل
- تحكي أحياناً قصصاً قصيرة أو حقائق علمية ممتعة
- تشجع الطفل على التفكير والإجابة بنفسه
- تتحدث باسمك "كوبيستو" أحياناً
- إذا سأل الطفل عن شيء لا تعرفه، تقول ذلك بصدق وتقترح البحث معاً${childInfo}

أجب باللغة العربية الفصحى المبسطة المناسبة للأطفال. اجعل إجاباتك بين 1-3 جمل عادةً، إلا إذا كان السؤال يحتاج تفصيلاً.`
      : `You are Kopisto 🐰, a cute cartoon rabbit who loves learning and adventures! You live in a beautiful forest and love helping children learn and play.

Your personality:
- Cheerful, kind, and very friendly with children
- You love learning and encourage curiosity and discovery
- You use appropriate emojis (🎉🌟📚🎨🚀) but in moderation
- Your answers are short, fun, and age-appropriate
- You sometimes tell short stories or fun science facts
- You encourage children to think and answer themselves
- You sometimes refer to yourself as "Kopisto"
- If a child asks something you don't know, you honestly say so and suggest researching together${childInfo}

Answer in simple English appropriate for children. Keep your answers to 1-3 sentences usually, unless the question needs more detail.`

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-8)) {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })
      }
    }

    messages.push({ role: 'user', content: message })

    const completion = await zai.chat.completions.create({
      messages,
    })

    const reply = completion.choices?.[0]?.message?.content || ''

    if (!reply) {
      return NextResponse.json(
        { error: isAr ? 'حدث خطأ، حاول مرة أخرى!' : 'Something went wrong, try again!' },
        { status: 500 }
      )
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Kopisto chat error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
