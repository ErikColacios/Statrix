import React from "react"

export default function FaqItem({ question, answer }: { question: string, answer: string }) {

    return (
        <details className="group border-b border-edge py-5">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium text-snow [&::-webkit-details-marker]:hidden">
                {question}
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-edge text-smoke transition group-open:rotate-45 group-open:border-green-500/50 group-open:text-green-400">
                    +
                </span>
            </summary>
            <p className="mt-3 max-w-[62ch] text-smoke leading-relaxed">{answer}</p>
        </details>
    )
}
