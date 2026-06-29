import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { message, language, history } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Missing required field: message' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const isAr = language === 'ar'
    const systemPrompt = isAr
      ? `أنت مساعد ذكي متخصص في تربية الأطفال وتعليمهم. أنت تعمل مع منصة كوبيستو التعليمية للأطفال. أجب على أسئلة الآباء والأمهات بنصائح عملية ومفيدة مبنية على أحدث الأبحاث التربوية. كن ودوداً ومتفهماً. قدم نصائح قابلة للتطبيق ومحددة. إذا كان السؤال خارج نطاق التربية والتعليم، وجّه المستخدم بلطف إلى استشارة متخصص. أجب باللغة العربية.`
      : `You are a smart assistant specializing in child upbringing and education. You work with Kopisto, an educational platform for children. Answer parents' questions with practical and useful advice based on the latest educational research. Be friendly and understanding. Provide actionable and specific advice. If the question is outside the scope of parenting and education, gently direct the user to consult a specialist. Answer in English.`

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: systemPrompt },
    ]

    // Add conversation history if provided
    if (history && Array.isArray(history)) {
      for (const msg of history.slice(-10)) { // Keep last 10 messages for context
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
        { error: isAr ? 'حدث خطأ في معالجة الطلب' : 'Failed to process request' },
        { status: 500 }
      )
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Parent assistant error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
