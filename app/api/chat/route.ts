import Groq from 'groq-sdk';
import { NextRequest } from 'next/server';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
    const { messages } = await req.json();

    const stream = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: [
            {
                role: 'system',
                content: `You are Sona, an intelligent AI assistant built for productivity inside WhatsApp. 
You help users manage their WhatsApp messages, schedule meetings, extract tasks, summarize group chats, and integrate with tools like Notion, Jira, and Google Calendar.
When explaining technical concepts or giving detailed answers, use clear markdown formatting:
- Use ## for main headings and ### for subheadings
- Use bullet points for lists
- Use **bold** for emphasis
- Use \`code\` for technical terms or formulas
Keep responses helpful, concise and well-structured.`,
            },
            ...messages,
        ],
        stream: true,
        max_tokens: 1024,
        temperature: 0.7,
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
        async start(controller) {
            try {
                for await (const chunk of stream) {
                    const delta = chunk.choices[0]?.delta?.content ?? '';
                    if (delta) {
                        controller.enqueue(encoder.encode(delta));
                    }
                }
            } catch (err) {
                console.error('Groq stream error:', err);
            } finally {
                controller.close();
            }
        },
    });

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'Cache-Control': 'no-cache',
            'X-Content-Type-Options': 'nosniff',
        },
    });
}
