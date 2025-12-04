"use client"

import ChatLayout from "@/components/chat";

export default function LoginPage() {

  return (
    <div className="flex min-h-full flex-col justify-center">
      <div className="pl-5 flex gap-16">
        <h2 className="text-center text-2xl/9 font-bold tracking-tight">Admin RAG page</h2>
        <div>
          <a
            href="/monopoly.pdf"
            download
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Жишээ pdf татах - monopoly.pdf
          </a>
        </div>
      </div>
      <ChatLayout />
    </div>
  );
}
