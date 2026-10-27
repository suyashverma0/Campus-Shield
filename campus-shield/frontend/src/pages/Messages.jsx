import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Send, Shield, MessageSquare, ArrowUpRight, CheckCheck } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import Button from "../components/common/Button";
import { messageService } from "../services/messageService";
import { useAuth } from "../context/AuthContext";
import { timeAgo, formatDateTime } from "../utils/helpers";

export default function Messages() {
  const { currentUser } = useAuth();
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    async function loadThreads() {
      await messageService.initMessages();
      const allThreads = await messageService.getThreads();
      setThreads(allThreads);
      if (allThreads.length > 0) {
        setActiveThreadId(allThreads[0].id);
      }
    }
    loadThreads();
  }, []);

  const activeThread = threads.find((t) => t.id === activeThreadId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeThread?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || !activeThreadId) return;

    const textToSend = inputText.trim();
    setInputText("");

    const newMsg = await messageService.sendMessage(
      activeThreadId,
      textToSend,
      currentUser?.id || "usr-01"
    );

    setThreads((prev) =>
      prev.map((t) =>
        t.id === activeThreadId
          ? {
              ...t,
              messages: [...t.messages, newMsg],
              lastActivity: new Date().toISOString()
            }
          : t
      )
    );

    // Simulate smart auto-reply from student finder / owner after 1 second
    setTimeout(async () => {
      const autoReplyText =
        "Thanks for the message! I'm around the library / student center today. Let's meet at the reception desk to hand over the item.";
      const replyMsg = await messageService.sendMessage(
        activeThreadId,
        autoReplyText,
        activeThread.participantId
      );

      setThreads((prev) =>
        prev.map((t) =>
          t.id === activeThreadId
            ? {
                ...t,
                messages: [...t.messages, replyMsg],
                lastActivity: new Date().toISOString()
              }
            : t
        )
      );
    }, 1200);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <Sidebar className="hidden lg:flex" />

        <div className="flex-1 w-full rounded-3xl border-2 border-ink bg-paper-2 shadow-hard overflow-hidden flex flex-col md:flex-row h-[700px]">
          {/* Thread list column */}
          <div className="w-full md:w-80 border-r-2 border-paper-3 flex flex-col bg-paper">
            <div className="p-4 border-b-2 border-paper-3 bg-paper-2">
              <h2 className="font-heavy text-base font-black text-ink flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                Security & Claimant Chat
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto divide-y-2 divide-paper-3">
              {threads.map((thread) => {
                const isSelected = thread.id === activeThreadId;
                const lastMsg = thread.messages[thread.messages.length - 1];
                return (
                  <button
                    key={thread.id}
                    onClick={() => setActiveThreadId(thread.id)}
                    className={`w-full text-left p-4 flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? "bg-pop-wash border-l-4 border-accent" : "hover:bg-paper-2"
                    }`}
                  >
                    <img
                      src={thread.participantAvatar}
                      alt={thread.participantName}
                      className="w-10 h-10 rounded-full border border-ink object-cover shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-heavy text-xs font-black text-ink truncate">
                          {thread.participantName}
                        </span>
                        <span className="text-[10px] font-bold text-ink-3">
                          {timeAgo(thread.lastActivity)}
                        </span>
                      </div>
                      <p className="text-[11px] font-bold text-accent truncate">
                        Re: {thread.relatedItemTitle}
                      </p>
                      <p className="text-[11px] font-medium text-ink-2 truncate mt-1">
                        {lastMsg ? lastMsg.text : "No messages"}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat details column */}
          <div className="flex-1 flex flex-col bg-paper-2">
            {activeThread ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b-2 border-paper-3 flex items-center justify-between bg-paper-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeThread.participantAvatar}
                      alt={activeThread.participantName}
                      className="w-10 h-10 rounded-full border-2 border-ink object-cover"
                    />
                    <div>
                      <h3 className="font-heavy text-sm font-black text-ink">
                        {activeThread.participantName}
                      </h3>
                      <p className="text-[11px] font-bold text-ink-3">
                        {activeThread.participantRole} · Verified Student
                      </p>
                    </div>
                  </div>

                  <Link
                    to={`/item/${activeThread.relatedItemId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border-2 border-ink bg-paper text-xs font-black uppercase text-ink hover:bg-pop shadow-hard-sm transition-all"
                  >
                    <span>Item Dossier</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                {/* Messages Body */}
                <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3 bg-paper/50">
                  <div className="mx-auto my-2 px-3 py-1 rounded-full border border-ink bg-pop-wash text-[10px] font-extrabold uppercase text-ink">
                    End-to-End Campus Handover Protected
                  </div>

                  {activeThread.messages.map((msg) => {
                    const isMe = msg.senderId === (currentUser?.id || "usr-01");
                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col max-w-[75%] ${
                          isMe ? "self-end items-end" : "self-start items-start"
                        }`}
                      >
                        <div
                          className={`p-3.5 rounded-2xl border-2 border-ink shadow-hard-sm text-xs font-semibold leading-relaxed ${
                            isMe
                              ? "bg-accent text-accent-fg rounded-tr-none"
                              : "bg-paper-2 text-ink rounded-tl-none"
                          }`}
                        >
                          {msg.text}
                        </div>
                        <span className="text-[9px] font-bold text-ink-3 mt-1 px-1">
                          {formatDateTime(msg.timestamp)}
                        </span>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Bar */}
                <form
                  onSubmit={handleSend}
                  className="p-4 border-t-2 border-paper-3 bg-paper-2 flex items-center gap-3"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message (e.g. 'I can meet at library lobby at 3pm')..."
                    className="flex-1 rounded-2xl border-2 border-ink bg-paper py-3 px-4 text-xs font-bold text-ink focus:outline-none focus:shadow-hard-sm"
                  />
                  <Button type="submit" variant="accent" size="sm" icon={Send}>
                    Send
                  </Button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-8 text-center text-ink-3 font-bold text-xs">
                Select a conversation thread to review details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
