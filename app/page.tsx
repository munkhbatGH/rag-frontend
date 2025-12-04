import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";

import { title, subtitle } from "@/components/primitives";
import { Button } from "@heroui/button";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center">
        <span className={title()}>Python&nbsp;</span>
        <span className={title({ color: "violet" })}>RAG&nbsp;</span>
        <br />
        <span className={title()}>
          Fastapi & Nextjs
        </span>
        <div className={subtitle({ class: "mt-4" })}>
          Langchain & chromadb & pypdf & sqlalchemy.
        </div>
      </div>

      <div>
        <a
          href="/monopoly.pdf"
          download
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Жишээ pdf татах - monopoly.pdf
        </a>
      </div>

      <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="bordered">
          <span>
            <Code color="primary">
              Та нэврэх хуудас руу очин туршина уу.
            </Code>
          </span>
        </Snippet>
      </div>
    </section>
  );
}
