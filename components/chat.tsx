"use client";

import { Button } from "@heroui/button";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";

export default function ChatLayout() {
    const [history, setHistory] = useState([
      { title: "Question 1?" },
      { title: "Question 22?" },
      { title: "Question 33?" },
      { title: "Question 144444?" },
      { title: "Question 3331?" },
      { title: "Question 4444444444?" },
      { title: "Question 133?" },
    ]);

    const [sampleQuestions, setSampleQuestions] = useState([
      { name: `What happens if I land on an unowned property?` },
      { name: `Can I collect rent on a mortgaged property?` },
      { name: `What is the rule for building houses evenly?` },
      { name: `How do I get out of Jail in Monopoly?` },
      { name: `What happens if the Bank runs out of money?` },
      { name: `How is Income Tax calculated?` },
      { name: `When do I start using the Speed Die?` },
      { name: `What are the actions when I roll a Mr. Monopoly on the Speed Die?` },
    ]);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello! How can I help you today?" },
    { role: "user", content: "Hello! How can I help you today? Hello! How can I help you today? Hello! How can I help you today? Hello! How can I help you today?" },
    { role: "user", content: "Hello! How can I help you today?" },
    { role: "assistant", content: "Hello! How can I help you today?" },
    { role: "user", content: "Hello! How can I help you today?" },
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState("question");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    try {
        if (!input.trim()) return;
        setLoading(true);

        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setInput("");

        await new Promise((resolve) => setTimeout(resolve, 3000));
        // setMessages((prev) => [
        //     ...prev,
        //     {
        //         role: "assistant",
        //         content: "This is a fake response. Plug your RAG model here.",
        //     },
        // ]);

        const token_name = process.env.NEXT_PUBLIC_TOKEN || "eas-token";
        const cookieToken = Cookies.get(token_name) || null;
        const body = { query: input.trim() }
        const options = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${cookieToken}`
            },
            method: 'POST', body: JSON.stringify(body)
        }
        const res = await fetch('http://localhost:8000/query-auth', options);
        if (res?.ok) {
            const response = await res.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: response.result, // "This is a fake response. Plug your RAG model here.",
                },
            ]);
            if (response.result.includes('What happens if I land on an unowned property?')) {
              setMessages((prev) => [
                  ...prev,
                  {
                      role: "assistant",
                      content: `
                        - Эхлээд доорх кодыг ажиллуулж text-г vector болгон хувиргаж байгаа
                          curl -X 'POST' 'http://127.0.0.1:8000/upload-pdf'
                      `,
                  },
              ]);
            }
        } else {
            const error = await res.json();
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Error.",
                },
            ]);
        }
    } catch (error: any) {
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className=" h-[800px] flex gap-3">

      <div className="hidden md:flex flex-col w-64 bg-[#202123] text-white p-4 rounded-lg">
        <Button className="mb-4 px-4 py-2 bg-[#343541] rounded hover:bg-[#3e3f45] text-sm" onPress={() => setType("question")}>
          ? Жишээ асуултууд
        </Button>
        <Button className="mb-4 px-4 py-2 bg-[#343541] rounded hover:bg-[#3e3f45] text-sm" onPress={() => setType("history")}>
            Хайлтын түүх
        </Button>

        <div className="px-3 py-2 text-sm bg-transparent hover:bg-[#343541] rounded cursor-pointer border-b border-gray-700 pt-4">
            { type === "question" ? "Жишээ асуултууд" : "Хайлтын түүх" }
        </div>
        <div className="flex-1 overflow-y-auto space-y-2 text-sm">
            <div className="overflow-x-auto pt-5 grid gap-5 p-5">
                {
                    type === "question"
                        ? (
                            sampleQuestions.map((hist, i) => (
                                <div className="flex justify-start cursor-pointer hover:font-bold" key={i}>
                                    <div>{ hist.name }</div><br/>
                                </div>
                            ))
                        )
                        : (
                            history.map((hist, i) => (
                                <div className="flex justify-start cursor-pointer hover:font-bold" key={i}>
                                    <div>{ hist.title }</div><br/>
                                </div>
                            ))
                        )
                }
            </div>
        </div>

        <div className="mt-auto border-t border-gray-700 pt-4 text-xs opacity-70">
        </div>
      </div>

      <div className="flex flex-col flex-1 bg-[#202123] gap-3 rounded-lg">

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {messages.map((msg, i) => (
                <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                    <pre
                        className={`
                            flex rounded-xl p-4 text-sm overflow-x-auto break-words whitespace-pre-wrap w-full
                            ${msg.role === "user" ? "justify-end bg-green-600 text-white" : "justify-start bg-[#000] text-white"}
                        `}
                    >
                        <code>{msg.content}</code>
                    </pre>
                </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <pre className="max-w-[80%] rounded-xl p-4 text-sm bg-gray-700 text-white">
                  <code>...Loading</code>
                </pre>
              </div>
            )}
            <div ref={messagesEndRef}></div>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-2 max-w-3xl mx-auto w-full">
            <input
              className="flex-1 rounded-xl border border-gray-300 p-3 text-[15px] focus:outline-none focus:border-gray-500"
              placeholder="..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button
              onPress={sendMessage}
              className="bg-danger px-4 py-2 rounded-xl"
            >
              Асуух
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
