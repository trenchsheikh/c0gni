import { LangChainTracer } from "langchain/callbacks";

let tracerSingleton: LangChainTracer | null = null;

export function getLangsmithTracer(): LangChainTracer | null {
  // Respect env flag; create tracer only when tracing enabled
  const enabled = (process.env.LANGSMITH_TRACING || process.env.LANGCHAIN_TRACING_V2 || '').toString().toLowerCase() === 'true'
  if (!enabled) return null

  if (!tracerSingleton) {
    tracerSingleton = new LangChainTracer({
      projectName: process.env.LANGSMITH_PROJECT || 'c0gni',
    })
  }
  return tracerSingleton
}

