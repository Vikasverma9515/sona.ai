'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    createdAt: Date;
}

interface SelectionState {
    text: string;
    rect: DOMRect;
    messageId: string;
    anchorChar: number;
}

// A single Q&A turn inside the micro-chat thread
interface MicroTurn {
    question: string;
    answer: string;       // built up via streaming
    isLoading: boolean;
}

// The full micro-chat popup — now supports a whole thread
interface MicroChat {
    id: string;
    messageId: string;
    selectedText: string;
    anchorChar: number;
    thread: MicroTurn[];  // array of Q&A turns
    inputValue: string;   // live typing state for the current input
    isStreaming: boolean; // true while any turn is loading
}

type MicroChatMap = Record<string, MicroChat[]>;

// ─── Streaming helpers ────────────────────────────────────────────────────────
async function streamMainChat(
    messages: { role: string; content: string }[],
    onChunk: (c: string) => void,
    onDone: () => void,
) {
    const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
    });
    if (!res.ok || !res.body) { onDone(); return; }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(decoder.decode(value, { stream: true }));
    }
    onDone();
}

async function streamMicroChat(
    selectedText: string,
    userQuestion: string,
    messageContext: string,
    thread: { question: string; answer: string }[],
    onChunk: (c: string) => void,
    onDone: () => void,
) {
    const res = await fetch('/api/micro-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ selectedText, userQuestion, messageContext, thread }),
    });
    if (!res.ok || !res.body) { onDone(); return; }
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        onChunk(decoder.decode(value, { stream: true }));
    }
    onDone();
}

// ─── Icons & tiny helpers ─────────────────────────────────────────────────────
function TypingDots() {
    return (
        <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#10a37f]/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1.5 h-1.5 bg-[#10a37f]/60 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
            <span className="w-1.5 h-1.5 bg-[#10a37f]/60 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
        </div>
    );
}

function SonaIcon({ size = 28 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="16" fill="#10a37f" />
            <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold" fontFamily="system-ui">S</text>
        </svg>
    );
}

function UserIcon() {
    return <div className="w-7 h-7 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">V</div>;
}

// ─── Inline formatting ────────────────────────────────────────────────────────
function InlineFormat({ text }: { text: string }) {
    const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
    return (
        <>
            {parts.map((part, i) => {
                if (part.startsWith('**') && part.endsWith('**'))
                    return <strong key={i} className="text-white font-semibold">{part.slice(2, -2)}</strong>;
                if (part.startsWith('`') && part.endsWith('`'))
                    return <code key={i} className="px-1.5 py-0.5 rounded text-[#10a37f] text-xs font-mono" style={{ background: 'rgba(16,163,127,0.12)' }}>{part.slice(1, -1)}</code>;
                return <span key={i}>{part}</span>;
            })}
        </>
    );
}

function RenderLine({ line, idx }: { line: string; idx: number }) {
    if (line.startsWith('## '))
        return <h2 key={idx} className="text-base font-bold text-white mt-4 mb-1">{line.slice(3)}</h2>;
    if (line.startsWith('### '))
        return <h3 key={idx} className="text-sm font-semibold text-white/90 mt-3 mb-0.5">{line.slice(4)}</h3>;
    if (line.startsWith('- ') || line.startsWith('• '))
        return <li key={idx} className="text-sm text-white/85 leading-relaxed ml-4 list-disc"><InlineFormat text={line.slice(2)} /></li>;
    if (line.match(/^    /))
        return <pre key={idx} className="text-xs text-[#10a37f] font-mono px-3 py-1.5 rounded-lg my-1" style={{ background: 'rgba(16,163,127,0.1)' }}>{line.trim()}</pre>;
    if (line === '')
        return <div key={idx} className="h-1" />;
    return <p key={idx} className="text-sm text-white/85 leading-relaxed"><InlineFormat text={line} /></p>;
}

// ─── Selection Tooltip ────────────────────────────────────────────────────────
function SelectionTooltip({ selection, onAsk }: { selection: SelectionState; onAsk: () => void }) {
    return (
        <div
            style={{ position: 'fixed', top: selection.rect.top - 46, left: selection.rect.left + selection.rect.width / 2, transform: 'translateX(-50%)', zIndex: 9999, pointerEvents: 'all' }}
            className="animate-fadeInUp"
        >
            <button
                onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); onAsk(); }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg,#10a37f 0%,#0d8f6f 100%)', boxShadow: '0 4px 24px rgba(16,163,127,0.45),0 2px 8px rgba(0,0,0,0.5)' }}
            >
                <span>✨</span> Ask about this
            </button>
            <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #10a37f', margin: '0 auto' }} />
        </div>
    );
}

// ─── Inline Micro-Chat Card (threaded) ───────────────────────────────────────
function InlineMicroChatCard({ mc, msgContent, onClose, onInputChange, onSubmit }: {
    mc: MicroChat;
    msgContent: string;
    onClose: (id: string) => void;
    onInputChange: (id: string, val: string) => void;
    onSubmit: (id: string) => void;
}) {
    const inputRef = useRef<HTMLInputElement>(null);
    const threadEndRef = useRef<HTMLDivElement>(null);

    // Focus input whenever a new turn finishes loading
    useEffect(() => {
        if (!mc.isStreaming) {
            inputRef.current?.focus();
        }
    }, [mc.isStreaming]);

    // Scroll thread end into view when a new turn is added
    useEffect(() => {
        threadEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, [mc.thread.length, mc.thread[mc.thread.length - 1]?.answer]);

    const hasThread = mc.thread.length > 0;

    return (
        <div
            className="animate-expandIn"
            style={{
                margin: '8px 0',
                borderRadius: '16px',
                border: '1px solid rgba(16,163,127,0.3)',
                background: 'rgba(10,20,18,0.80)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,163,127,0.08)',
                overflow: 'hidden',
            }}
        >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderBottom: '1px solid rgba(16,163,127,0.15)', background: 'rgba(16,163,127,0.08)' }}>
                <div className="flex items-center gap-2">
                    <span style={{ fontSize: 13 }}>🧠</span>
                    <span className="text-xs font-semibold text-[#10a37f]">Inline Clarification</span>
                    {hasThread && (
                        <span className="text-[10px] text-white/30 ml-1">
                            {mc.thread.length} {mc.thread.length === 1 ? 'question' : 'questions'}
                        </span>
                    )}
                </div>
                <button onClick={() => onClose(mc.id)} className="w-5 h-5 flex items-center justify-center rounded-md text-white/30 hover:text-white hover:bg-white/10 transition-all text-xs">✕</button>
            </div>

            {/* ── Selected text pill ── */}
            <div className="px-4 pt-3 pb-2">
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5 font-semibold">Selected text</p>
                <div className="text-xs text-[#10a37f] px-3 py-2 rounded-lg" style={{ background: 'rgba(16,163,127,0.1)', borderLeft: '3px solid #10a37f', fontStyle: 'italic' }}>
                    &ldquo;{mc.selectedText.length > 140 ? mc.selectedText.slice(0, 140) + '…' : mc.selectedText}&rdquo;
                </div>
            </div>

            {/* ── Thread of Q&A turns ── */}
            {hasThread && (
                <div className="px-4 pb-2 space-y-4 max-h-[360px] overflow-y-auto scrollbar-thin">
                    {mc.thread.map((turn, idx) => (
                        <div key={idx}>
                            {/* User question */}
                            <div className="flex items-start gap-2 mb-2">
                                <div className="w-5 h-5 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-[9px] font-bold flex-shrink-0 mt-0.5">V</div>
                                <p className="text-xs text-white/60 italic leading-relaxed pt-0.5">{turn.question}</p>
                            </div>

                            {/* Sona answer */}
                            <div className="flex items-start gap-2">
                                <div className="flex-shrink-0 mt-0.5"><SonaIcon size={18} /></div>
                                {turn.isLoading && turn.answer === '' ? (
                                    <div className="pt-1"><TypingDots /></div>
                                ) : (
                                    <p className="text-xs text-white/85 leading-relaxed flex-1">
                                        <InlineFormat text={turn.answer} />
                                        {turn.isLoading && <span className="inline-block w-1.5 h-3 ml-0.5 bg-[#10a37f] rounded-sm animate-pulse align-middle" />}
                                    </p>
                                )}
                            </div>

                            {/* Divider between turns (not last) */}
                            {idx < mc.thread.length - 1 && (
                                <div className="mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
                            )}
                        </div>
                    ))}
                    <div ref={threadEndRef} />
                </div>
            )}

            {/* ── Input bar — always visible ── */}
            <div className="px-4 pb-3 pt-2">
                {!hasThread && (
                    <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1.5 font-semibold">Your question</p>
                )}
                {hasThread && !mc.isStreaming && (
                    <div className="flex items-center gap-1.5 mb-2">
                        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
                        <span className="text-[10px] text-white/25 whitespace-nowrap">Ask a follow-up</span>
                        <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.07)' }} />
                    </div>
                )}

                <div
                    className="flex items-center gap-2 rounded-xl px-3 py-2 transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${mc.isStreaming ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.14)'}` }}
                >
                    <input
                        ref={inputRef}
                        type="text"
                        value={mc.inputValue}
                        onChange={e => onInputChange(mc.id, e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && mc.inputValue.trim() && !mc.isStreaming) { e.preventDefault(); onSubmit(mc.id); } }}
                        placeholder={mc.isStreaming ? 'Waiting for response…' : (hasThread ? 'Ask a follow-up question…' : 'Ask your question about this…')}
                        disabled={mc.isStreaming}
                        className="flex-1 bg-transparent text-sm text-white placeholder-white/25 outline-none disabled:opacity-50"
                    />
                    <button
                        onClick={() => { if (mc.inputValue.trim() && !mc.isStreaming) onSubmit(mc.id); }}
                        disabled={!mc.inputValue.trim() || mc.isStreaming}
                        className="w-6 h-6 flex items-center justify-center rounded-full transition-all flex-shrink-0"
                        style={{ background: mc.inputValue.trim() && !mc.isStreaming ? '#10a37f' : 'rgba(255,255,255,0.08)', color: mc.inputValue.trim() && !mc.isStreaming ? 'white' : 'rgba(255,255,255,0.2)' }}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                    </button>
                </div>
                {!mc.isStreaming && <p className="text-[10px] text-white/20 mt-1.5 ml-1">Press Enter to send</p>}
            </div>
        </div>
    );

    // suppress unused warning — needed for streaming context
    void msgContent;
}

// ─── Split message and inject popups at anchor line ───────────────────────────
function SplitMessageWithPopups({ content, microChats, msgContent, onClose, onInputChange, onSubmit }: {
    content: string;
    microChats: MicroChat[];
    msgContent: string;
    onClose: (id: string) => void;
    onInputChange: (id: string, val: string) => void;
    onSubmit: (id: string) => void;
}) {
    const lines = content.split('\n');

    function getLineIndex(anchorChar: number): number {
        let charCount = 0;
        for (let i = 0; i < lines.length; i++) {
            charCount += lines[i].length + 1;
            if (charCount > anchorChar) return i;
        }
        return lines.length - 1;
    }

    const popupAfterLine = new Map<number, MicroChat[]>();
    for (const mc of microChats) {
        const li = getLineIndex(mc.anchorChar);
        if (!popupAfterLine.has(li)) popupAfterLine.set(li, []);
        popupAfterLine.get(li)!.push(mc);
    }

    const elements: React.ReactNode[] = [];
    lines.forEach((line, i) => {
        elements.push(<RenderLine key={`line-${i}`} line={line} idx={i} />);
        const popsHere = popupAfterLine.get(i);
        if (popsHere) {
            popsHere.forEach(mc =>
                elements.push(
                    <InlineMicroChatCard
                        key={`popup-${mc.id}`}
                        mc={mc}
                        msgContent={msgContent}
                        onClose={onClose}
                        onInputChange={onInputChange}
                        onSubmit={onSubmit}
                    />
                )
            );
        }
    });
    return <>{elements}</>;
}

// ─── Assistant Message ────────────────────────────────────────────────────────
function AssistantMessage({ msg, microChats, onSelectionChange, onOpenMicroChat, onCloseMicroChat, onInputChange, onSubmitMicroChat, isStreaming }: {
    msg: Message;
    microChats: MicroChat[];
    onSelectionChange: (sel: SelectionState | null) => void;
    onOpenMicroChat: (messageId: string, text: string, anchorChar: number) => void;
    onCloseMicroChat: (messageId: string, mcId: string) => void;
    onInputChange: (messageId: string, mcId: string, val: string) => void;
    onSubmitMicroChat: (messageId: string, mcId: string) => void;
    isStreaming: boolean;
}) {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseUp = useCallback(() => {
        if (isStreaming) return;
        try {
            const sel = window.getSelection();
            if (!sel || sel.isCollapsed) return;
            const selectedText = sel.toString().trim();
            if (!selectedText || selectedText.length < 2) return;
            const range = sel.getRangeAt(0);
            if (!containerRef.current?.contains(range.commonAncestorContainer)) return;
            const rect = range.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return;
            const anchorChar = msg.content.indexOf(selectedText);
            onSelectionChange({ text: selectedText, rect, messageId: msg.id, anchorChar: anchorChar >= 0 ? anchorChar : 0 });
        } catch { /* ignore */ }
    }, [msg.id, msg.content, onSelectionChange, isStreaming]);

    return (
        <div className="flex gap-4 justify-start">
            <div className="flex-shrink-0 mt-1"><SonaIcon size={28} /></div>
            <div className="flex-1 min-w-0">
                <div ref={containerRef} onMouseUp={handleMouseUp} className="select-text cursor-text" style={{ userSelect: 'text' }}>
                    <SplitMessageWithPopups
                        content={msg.content}
                        microChats={microChats}
                        msgContent={msg.content}
                        onClose={(mcId) => onCloseMicroChat(msg.id, mcId)}
                        onInputChange={(mcId, val) => onInputChange(msg.id, mcId, val)}
                        onSubmit={(mcId) => onSubmitMicroChat(msg.id, mcId)}
                    />
                    {isStreaming && <span className="inline-block w-2 h-4 ml-0.5 bg-white/70 rounded-sm animate-pulse align-middle" />}
                </div>
            </div>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([
        { id: '1', title: 'WhatsApp automation ideas', messages: [], createdAt: new Date(Date.now() - 86400000) },
        { id: '2', title: 'Summarize group chats', messages: [], createdAt: new Date(Date.now() - 172800000) },
        { id: '3', title: 'Task extraction setup', messages: [], createdAt: new Date(Date.now() - 259200000) },
    ]);
    const [activeConvId, setActiveConvId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [streamingMsgId, setStreamingMsgId] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [modelOpen, setModelOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState('Sona AI');

    const [microChatMap, setMicroChatMap] = useState<MicroChatMap>({});
    const [activeSelection, setActiveSelection] = useState<SelectionState | null>(null);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<Message[]>(messages);
    useEffect(() => { messagesRef.current = messages; }, [messages]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
        }
    }, [input]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);

    useEffect(() => {
        const handler = () => { const sel = window.getSelection(); if (!sel || sel.isCollapsed) setActiveSelection(null); };
        document.addEventListener('selectionchange', handler);
        return () => document.removeEventListener('selectionchange', handler);
    }, []);

    useEffect(() => {
        const handler = (e: MouseEvent) => { if ((e.target as HTMLElement).closest('[data-tooltip]')) return; setActiveSelection(null); };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    function createNew() { setActiveConvId(null); setMessages([]); setInput(''); setMicroChatMap({}); setActiveSelection(null); setStreamingMsgId(null); }
    function loadConversation(conv: Conversation) { setActiveConvId(conv.id); setMessages(conv.messages); setInput(''); setMicroChatMap({}); setActiveSelection(null); setStreamingMsgId(null); }

    async function sendMessage(text = input.trim()) {
        if (!text || isTyping || streamingMsgId) return;
        setInput('');
        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text, timestamp: new Date() };
        const nextMessages = [...messagesRef.current, userMsg];
        setMessages(nextMessages);
        setIsTyping(true);
        const assistantId = (Date.now() + 1).toString();
        const assistantMsg: Message = { id: assistantId, role: 'assistant', content: '', timestamp: new Date() };
        setMessages([...nextMessages, assistantMsg]);
        setStreamingMsgId(assistantId);
        setIsTyping(false);
        await streamMainChat(
            nextMessages.map(m => ({ role: m.role, content: m.content })),
            (chunk) => {
                setMessages(prev => prev.map(m => m.id === assistantId ? { ...m, content: m.content + chunk } : m));
                bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
            },
            () => {
                setStreamingMsgId(null);
                setMessages(prev => {
                    const finalMessages = prev;
                    if (!activeConvId) {
                        const newConv: Conversation = { id: assistantId, title: text.length > 40 ? text.slice(0, 40) + '…' : text, messages: finalMessages, createdAt: new Date() };
                        setConversations(c => [newConv, ...c]);
                        setActiveConvId(newConv.id);
                    } else {
                        setConversations(c => c.map(cv => cv.id === activeConvId ? { ...cv, messages: finalMessages } : cv));
                    }
                    return finalMessages;
                });
            }
        );
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
    }

    const handleSelectionChange = useCallback((sel: SelectionState | null) => { setActiveSelection(sel); }, []);

    const handleOpenMicroChat = useCallback((messageId: string, selectedText: string, anchorChar: number) => {
        setActiveSelection(null);
        window.getSelection()?.removeAllRanges();
        const newMc: MicroChat = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
            messageId, selectedText, anchorChar,
            thread: [], inputValue: '', isStreaming: false,
        };
        setMicroChatMap(prev => ({ ...prev, [messageId]: [...(prev[messageId] ?? []), newMc] }));
    }, []);

    const handleCloseMicroChat = useCallback((messageId: string, mcId: string) => {
        setMicroChatMap(prev => ({ ...prev, [messageId]: (prev[messageId] ?? []).filter(mc => mc.id !== mcId) }));
    }, []);

    const handleInputChange = useCallback((messageId: string, mcId: string, val: string) => {
        setMicroChatMap(prev => ({
            ...prev,
            [messageId]: (prev[messageId] ?? []).map(mc => mc.id === mcId ? { ...mc, inputValue: val } : mc),
        }));
    }, []);

    // Submit a new turn (works for first question or any follow-up)
    const handleSubmitMicroChat = useCallback(async (messageId: string, mcId: string) => {
        let question = '';
        let selText = '';
        let existingThread: { question: string; answer: string }[] = [];

        setMicroChatMap(prev => {
            const list = (prev[messageId] ?? []).map(mc => {
                if (mc.id !== mcId) return mc;
                question = mc.inputValue.trim();
                selText = mc.selectedText;
                existingThread = mc.thread
                    .filter(t => !t.isLoading)
                    .map(t => ({ question: t.question, answer: t.answer }));
                const newTurn: MicroTurn = { question, answer: '', isLoading: true };
                return { ...mc, inputValue: '', isStreaming: true, thread: [...mc.thread, newTurn] };
            });
            return { ...prev, [messageId]: list };
        });

        const msg = messagesRef.current.find(m => m.id === messageId);
        const msgContent = msg?.content ?? '';
        const turnIndex = existingThread.length; // index of the new turn we just added

        await streamMicroChat(
            selText,
            question,
            msgContent,
            existingThread,
            (chunk) => {
                setMicroChatMap(prev => ({
                    ...prev,
                    [messageId]: (prev[messageId] ?? []).map(mc => {
                        if (mc.id !== mcId) return mc;
                        const updatedThread = mc.thread.map((t, i) =>
                            i === turnIndex ? { ...t, answer: t.answer + chunk } : t
                        );
                        return { ...mc, thread: updatedThread };
                    }),
                }));
            },
            () => {
                setMicroChatMap(prev => ({
                    ...prev,
                    [messageId]: (prev[messageId] ?? []).map(mc => {
                        if (mc.id !== mcId) return mc;
                        const updatedThread = mc.thread.map((t, i) =>
                            i === turnIndex ? { ...t, isLoading: false } : t
                        );
                        return { ...mc, isStreaming: false, thread: updatedThread };
                    }),
                }));
            }
        );
    }, []);

    const SUGGESTION_PROMPTS = [
        { icon: '🧠', label: 'Explain backpropagation', sub: 'with full details and examples' },
        { icon: '📅', label: 'Schedule a meeting', sub: 'for my team this week' },
        { icon: '✅', label: 'Extract action items', sub: 'from my last 50 messages' },
        { icon: '🤖', label: 'How does Sona', sub: 'integrate with Notion?' },
    ];

    return (
        <div className="flex h-screen bg-[#212121] text-white overflow-hidden" style={{ fontFamily: 'ui-sans-serif, system-ui, -apple-system, sans-serif' }}>

            {/* SIDEBAR */}
            <aside className="flex flex-col transition-all duration-300 ease-in-out" style={{ width: sidebarOpen ? '260px' : '0px', minWidth: sidebarOpen ? '260px' : '0px', backgroundColor: '#171717', overflow: 'hidden' }}>
                <div className="flex flex-col h-full w-[260px]">
                    <div className="flex items-center justify-between px-3 pt-3 pb-2">
                        <button onClick={() => setSidebarOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"><SidebarIcon /></button>
                        <button onClick={createNew} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"><EditIcon /></button>
                    </div>
                    <div className="px-2 py-1">
                        <button onClick={createNew} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/80 hover:text-white">
                            <span className="text-base">💬</span><span>New chat</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
                        <p className="text-[11px] font-semibold text-white/40 uppercase tracking-wider px-3 mb-2">Today</p>
                        {conversations.map(conv => (
                            <button key={conv.id} onClick={() => loadConversation(conv)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors truncate mb-0.5 ${activeConvId === conv.id ? 'bg-white/10 text-white' : 'text-white/70 hover:bg-white/8 hover:text-white'}`}>
                                {conv.title}
                            </button>
                        ))}
                    </div>
                    <div className="border-t border-white/10 p-3">
                        <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer">
                            <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">V</div>
                            <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">Vikas Verma</p><p className="text-xs text-white/50 truncate">Free plan</p></div>
                            <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" /></svg>
                        </div>
                        <Link href="/" className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm text-white/60 hover:text-white">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            Back to Sona
                        </Link>
                    </div>
                </div>
            </aside>

            {/* MAIN */}
            <main className="flex flex-col flex-1 min-w-0 relative">
                <div className="flex items-center justify-between px-4 py-3 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        {!sidebarOpen && (
                            <button onClick={() => setSidebarOpen(true)} className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white mr-1"><SidebarIcon /></button>
                        )}
                        <div className="relative">
                            <button onClick={() => setModelOpen(!modelOpen)} className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors text-white font-semibold text-sm">
                                <span>{selectedModel}</span>
                                <svg className="w-4 h-4 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {modelOpen && (
                                <div className="absolute top-full left-0 mt-1 bg-[#2f2f2f] border border-white/10 rounded-xl shadow-2xl py-1 z-50 min-w-[200px]">
                                    {['Sona AI', 'Sona Pro', 'Sona Mini', 'Sona Vision'].map(m => (
                                        <button key={m} onClick={() => { setSelectedModel(m); setModelOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/10 transition-colors flex items-center justify-between ${selectedModel === m ? 'text-white' : 'text-white/70'}`}>
                                            <span>{m}</span>
                                            {selectedModel === m && <svg className="w-4 h-4 text-[#10a37f]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(16,163,127,0.12)', border: '1px solid rgba(16,163,127,0.3)', color: '#10a37f' }}>
                            <span>✨</span><span>Highlight text to ask inline</span>
                        </div>
                        <button className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 transition-colors text-sm font-medium text-white/80 hover:text-white">Share</button>
                        <div className="w-8 h-8 rounded-full bg-[#5865f2] flex items-center justify-center text-white text-xs font-bold cursor-pointer">V</div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-4 pb-32">
                            <div className="mb-6"><SonaIcon size={46} /></div>
                            <h1 className="text-3xl font-semibold text-white mb-2 text-center">What can I help with?</h1>
                            <p className="text-sm text-white/40 mb-10 text-center">Highlight any text in a response to start an inline thread — powered by Groq ⚡</p>
                            <div className="grid grid-cols-2 gap-3 w-full max-w-lg">
                                {SUGGESTION_PROMPTS.map((p, i) => (
                                    <button key={i} onClick={() => sendMessage(`${p.label} ${p.sub}`)} className="flex items-start gap-3 p-4 rounded-2xl bg-[#2f2f2f] hover:bg-[#3a3a3a] transition-colors text-left">
                                        <span className="text-xl">{p.icon}</span>
                                        <div><p className="text-sm font-medium text-white">{p.label}</p><p className="text-xs text-white/50">{p.sub}</p></div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
                            {messages.map(msg =>
                                msg.role === 'assistant' ? (
                                    <AssistantMessage
                                        key={msg.id}
                                        msg={msg}
                                        microChats={microChatMap[msg.id] ?? []}
                                        onSelectionChange={handleSelectionChange}
                                        onOpenMicroChat={handleOpenMicroChat}
                                        onCloseMicroChat={handleCloseMicroChat}
                                        onInputChange={handleInputChange}
                                        onSubmitMicroChat={handleSubmitMicroChat}
                                        isStreaming={streamingMsgId === msg.id}
                                    />
                                ) : (
                                    <div key={msg.id} className="flex gap-4 justify-end">
                                        <div className="max-w-[80%] flex flex-col items-end">
                                            <div className="bg-[#2f2f2f] text-white px-5 py-3 rounded-3xl rounded-br-md text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
                                        </div>
                                        <div className="flex-shrink-0 mt-1"><UserIcon /></div>
                                    </div>
                                )
                            )}
                            {isTyping && (
                                <div className="flex gap-4 justify-start">
                                    <div className="flex-shrink-0 mt-1"><SonaIcon size={28} /></div>
                                    <div className="bg-transparent text-white text-sm">
                                        <div className="flex items-center gap-1 px-1 py-1">
                                            <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '160ms' }} />
                                            <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '320ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </div>

                {/* Input bar */}
                <div className="flex-shrink-0 px-4 pb-6 pt-2">
                    <div className="max-w-3xl mx-auto">
                        <div className="relative flex items-end gap-2 bg-[#2f2f2f] rounded-[1.75rem] px-4 py-3 shadow-lg border border-white/10 focus-within:border-white/20 transition-colors">
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white flex-shrink-0 mb-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                            </button>
                            <textarea ref={textareaRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Message Sona" rows={1}
                                className="flex-1 bg-transparent text-white placeholder-white/40 text-sm resize-none outline-none leading-6 max-h-[200px] overflow-y-auto py-1" style={{ fontFamily: 'inherit' }} />
                            <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white flex-shrink-0 mb-0.5">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                            </button>
                            <button onClick={() => sendMessage()} disabled={!input.trim() || !!streamingMsgId}
                                className={`w-8 h-8 flex items-center justify-center rounded-full transition-all flex-shrink-0 mb-0.5 ${input.trim() && !streamingMsgId ? 'bg-white text-[#212121] hover:bg-white/90 active:scale-95 cursor-pointer' : 'bg-white/20 text-white/30 cursor-not-allowed'}`}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                            </button>
                        </div>
                        <p className="text-center text-[11px] text-white/30 mt-3">
                            Powered by Groq ⚡ · Highlight any text to start an inline thread ✨
                        </p>
                    </div>
                </div>
            </main>

            {activeSelection && (
                <div data-tooltip>
                    <SelectionTooltip
                        selection={activeSelection}
                        onAsk={() => handleOpenMicroChat(activeSelection.messageId, activeSelection.text, activeSelection.anchorChar)}
                    />
                </div>
            )}

            {modelOpen && <div className="fixed inset-0 z-40" onClick={() => setModelOpen(false)} />}

            <style jsx>{`
        .scrollbar-thin::-webkit-scrollbar { width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
        @keyframes fadeInUp {
          from { opacity:0; transform:translateX(-50%) translateY(8px); }
          to   { opacity:1; transform:translateX(-50%) translateY(0); }
        }
        .animate-fadeInUp { animation: fadeInUp 0.18s ease-out forwards; }
        @keyframes expandIn {
          from { opacity:0; transform:scaleY(0.85); transform-origin:top; }
          to   { opacity:1; transform:scaleY(1); transform-origin:top; }
        }
        .animate-expandIn { animation: expandIn 0.2s ease-out forwards; }
      `}</style>
        </div>
    );
}

function SidebarIcon() {
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" /></svg>;
}
function EditIcon() {
    return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
}
