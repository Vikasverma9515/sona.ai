import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

interface ThreadTurn {
    question: string;
    answer: string;
}

export async function POST(req: NextRequest) {
    const { selectedText, userQuestion, messageContext, thread = [] } = await req.json() as {
        selectedText: string;
        userQuestion: string;
        messageContext: string;
        thread: ThreadTurn[];
    };

    // Build conversation history from previous turns
    const history = thread.flatMap((turn) => [
        { role: 'user' as const, content: turn.question },
        { role: 'assistant' as const, content: turn.answer },
    ]);

    const stream = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: `You are Sona's inline clarification assistant.
A user is reading an AI response and highlighted a piece of text to ask about it.
The highlighted text is: "${selectedText}"
Context from the AI response: "${messageContext?.slice(0, 500) ?? ''}..."

Rules for your responses:
- Be concise: 2-5 sentences max per reply
- Use **bold** for key terms, \`code\` for formulas/code snippets
- Be direct — no filler phrases like "Great question!" or "Of course!"
- Maintain a focused thread on the highlighted topic
- If the user asks a follow-up, remember the full conversation context above`,
            },
            ...history,
            { role: 'user', content: userQuestion },
        ],
        stream: true,
        max_tokens: 250,
        temperature: 0.5,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of stream) {
                    const delta = chunk.choices[0]?.delta?.content ?? '';
                    if (delta) controller.enqueue(encoder.encode(delta));
                }
            } catch (err) {
                console.error('Groq micro-chat stream error:', err);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
        },
    });
}
