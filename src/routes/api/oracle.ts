import { createFileRoute } from "@tanstack/react-router";
import { streamText, type ModelMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

type Body = {
  messages?: Array<{ role: "user" | "assistant" | "system"; content: string }>;
  context?: { name?: string; city?: string; basin?: string; health?: number };
};

export const Route = createFileRoute("/api/oracle")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const { messages = [], context } = (await request.json()) as Body;
        if (!Array.isArray(messages) || messages.length === 0) {
          return new Response("messages required", { status: 400 });
        }

        const ctxLine = context?.name
          ? `Focus node: ${context.name}${context.basin ? ` (${context.basin})` : ""}${
              context.city ? `, near ${context.city}` : ""
            }${context.health != null ? `. Current health index: ${context.health}/100.` : ""}`
          : "No specific node selected — answer for the wider Atlas Sanctum network.";

        const system = [
          "You are the Atlas Oracle, the planetary intelligence layer of Atlas Sanctum.",
          "You watch over rivers, watersheds, cities, and ecosystems through satellite, sensor, and ranger telemetry.",
          "Voice: concise, instrument-grade, calmly authoritative. Prefer short paragraphs and bulleted action lists.",
          "Always ground your answer in plausible signals (satellite IDs like SAT-09, ranger reports, NOAA models). Cite 1-3 sources at the end as bracketed tags, e.g. [SAT-09] [Ranger-04].",
          "Never claim certainty you don't have; flag risk windows with day ranges.",
          ctxLine,
        ].join(" ");

        const provider = createLovableAiGatewayProvider(key);
        const model = provider("google/gemini-3-flash-preview");

        const modelMessages: ModelMessage[] = [
          { role: "system", content: system },
          ...messages.map((m) => ({ role: m.role, content: m.content }) as ModelMessage),
        ];

        const result = streamText({ model, messages: modelMessages });
        return result.toTextStreamResponse();
      },
    },
  },
});
