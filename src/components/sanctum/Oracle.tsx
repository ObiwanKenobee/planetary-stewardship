import { useEffect, useRef, useState } from "react";
import { Radio, Send } from "lucide-react";
import { Panel } from "./SanctumShell";

type Msg = { role: "user" | "assistant"; text: string };

export function Oracle({
  context,
  seed,
}: {
  context?: { name?: string; city?: string; basin?: string; health?: number };
  seed?: Msg[];
}) {
  const [messages, setMessages] = useState<Msg[]>(
    seed ?? [
      {
        role: "assistant",
        text:
          "Oracle online. Ask about a basin, sensor, or restoration window. I'll cross-reference live telemetry, ranger reports, and satellite signals.",
      },
    ],
  );
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollerRef.current?.scrollTo({ top: 9e6, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    const next: Msg[] = [...messages, { role: "user", text }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/oracle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.text })),
          context,
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text().catch(() => "error"));
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      setMessages((m) => [...m, { role: "assistant", text: "" }]);
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = m.slice();
          copy[copy.length - 1] = { role: "assistant", text: acc };
          return copy;
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Oracle uplink failed.";
      setMessages((m) => [
        ...m,
        { role: "assistant", text: `⚠ uplink fault — ${msg}` },
      ]);
    } finally {
      setBusy(false);
    }
  }

  const suggestions = context?.name
    ? [
        `What threatens ${context.name} this season?`,
        `Recommend a 30-day response plan for ${context.name}.`,
        `Summarize biodiversity trend in ${context.basin ?? context.name}.`,
      ]
    : [
        "What threatens the Tana Delta this season?",
        "Which basin needs the most rangers next week?",
        "Summarize verified actions in the last 24h.",
      ];

  return (
    <Panel className="p-0 overflow-hidden flex flex-col h-[520px]">
      <div className="px-4 py-2.5 border-b border-border flex items-center gap-2 bg-secondary/40">
        <Radio className="size-3.5 text-river" strokeWidth={1.5} />
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
          Oracle Terminal · v2.4
        </span>
        {context?.name && (
          <span className="font-mono text-[10px] text-river ml-2">▸ {context.name}</span>
        )}
        <span className="ml-auto font-mono text-[10px] text-signal-emerald flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-signal-emerald" />
          listening
        </span>
      </div>

      <div ref={scrollerRef} className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className="flex gap-3">
            <span
              className={`shrink-0 font-mono text-[10px] uppercase tracking-widest pt-1 ${
                m.role === "assistant" ? "text-river" : "text-muted-foreground"
              }`}
            >
              {m.role === "assistant" ? "ATLAS ▸" : "YOU ▸"}
            </span>
            <p
              className={`flex-1 min-w-0 text-[13.5px] leading-relaxed whitespace-pre-wrap ${
                m.role === "assistant" ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {m.text || (busy ? "…" : "")}
            </p>
          </div>
        ))}
        {busy && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3">
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-widest pt-1 text-river">
              ATLAS ▸
            </span>
            <span className="font-mono text-river/70 text-sm">
              <span className="blink">▌</span> resolving signal…
            </span>
          </div>
        )}
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 border border-border rounded-sm text-muted-foreground hover:text-river hover:border-river/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="border-t border-border px-4 py-3 flex items-center gap-2"
      >
        <span className="font-mono text-river text-sm">›</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={busy}
          placeholder={
            context?.name ? `Query ${context.name}…` : "Query the planet…"
          }
          className="flex-1 bg-transparent outline-none text-[13px] placeholder:text-muted-foreground disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="size-7 grid place-items-center text-river hover:bg-river/10 rounded-sm disabled:opacity-30 disabled:hover:bg-transparent"
        >
          <Send className="size-3.5" />
        </button>
      </form>
    </Panel>
  );
}
