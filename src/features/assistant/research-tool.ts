export type ResearchSource = {
  title: string;
  snippet: string;
  url: string;
  score: number;
  source: "wikipedia" | "duckduckgo";
};

export type ResearchReport = {
  query: string;
  summary: string;
  keyFindings: string[];
  sources: ResearchSource[];
  graph: Array<{ label: string; score: number }>;
  usedTools: string[];
};

function normalizeScore(value: number) {
  return Math.max(10, Math.min(100, Math.round(value)));
}

async function tool_searchDuckDuckGo(query: string): Promise<ResearchSource[]> {
  const endpoint = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("DuckDuckGo search failed.");
  }

  const data = (await response.json()) as {
    AbstractText?: string;
    AbstractURL?: string;
    Heading?: string;
    RelatedTopics?: Array<{
      Text?: string;
      FirstURL?: string;
      Topics?: Array<{ Text?: string; FirstURL?: string }>;
    }>;
  };

  const items: ResearchSource[] = [];

  if (data.AbstractText && data.AbstractURL) {
    items.push({
      title: data.Heading || "DuckDuckGo result",
      snippet: data.AbstractText,
      url: data.AbstractURL,
      score: 88,
      source: "duckduckgo",
    });
  }

  for (const topic of data.RelatedTopics ?? []) {
    if (topic.Text && topic.FirstURL) {
      items.push({
        title: topic.Text.split(" - ")[0],
        snippet: topic.Text,
        url: topic.FirstURL,
        score: 72,
        source: "duckduckgo",
      });
      continue;
    }

    for (const nested of topic.Topics ?? []) {
      if (!nested.Text || !nested.FirstURL) {
        continue;
      }
      items.push({
        title: nested.Text.split(" - ")[0],
        snippet: nested.Text,
        url: nested.FirstURL,
        score: 68,
        source: "duckduckgo",
      });
    }
  }

  return items.slice(0, 6);
}

async function tool_searchWikipedia(query: string): Promise<ResearchSource[]> {
  const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error("Wikipedia search failed.");
  }

  const data = (await response.json()) as {
    query?: {
      search?: Array<{
        title: string;
        snippet: string;
        pageid: number;
      }>;
    };
  };

  return (data.query?.search ?? []).slice(0, 6).map((item, index) => ({
    title: item.title,
    snippet: item.snippet.replace(/<[^>]+>/g, ""),
    url: `https://en.wikipedia.org/?curid=${item.pageid}`,
    score: normalizeScore(80 - index * 7),
    source: "wikipedia" as const,
  }));
}

function tool_extractFindings(query: string, sources: ResearchSource[]) {
  const findings: string[] = [];
  const normalized = query.toLowerCase();

  if (normalized.includes("study") || normalized.includes("studying")) {
    findings.push("Use focused deep-work blocks (45-90 min) with short recovery breaks.");
    findings.push("Front-load hardest systems topics earlier in your most productive window.");
    findings.push("Use active recall and practice problems instead of passive rereading.");
  }

  if (normalized.includes("computer systems") || normalized.includes("njit") || normalized.includes("cs")) {
    findings.push("Prioritize architecture fundamentals, memory hierarchy, and concurrency patterns.");
    findings.push("Convert lectures and notes into weekly problem sets and timed review sessions.");
  }

  for (const source of sources.slice(0, 2)) {
    findings.push(`Source-backed insight: ${source.snippet.slice(0, 120)}${source.snippet.length > 120 ? "..." : ""}`);
  }

  return findings.slice(0, 5);
}

function tool_buildGraph(sources: ResearchSource[]) {
  return sources.slice(0, 5).map((source) => ({
    label: source.title.length > 20 ? `${source.title.slice(0, 20)}...` : source.title,
    score: normalizeScore(source.score),
  }));
}

export function looksLikeResearchPrompt(prompt: string) {
  const normalized = prompt.toLowerCase();
  return /(research|find|best way|how to|information on|look up|what is|compare|strategy)/i.test(normalized);
}

export async function runAgenticResearch(query: string): Promise<ResearchReport> {
  const usedTools: string[] = [];
  const results: ResearchSource[] = [];

  try {
    const duck = await tool_searchDuckDuckGo(query);
    usedTools.push("search_web_duckduckgo");
    results.push(...duck);
  } catch {
    usedTools.push("search_web_duckduckgo_failed");
  }

  try {
    const wiki = await tool_searchWikipedia(query);
    usedTools.push("search_wikipedia");
    results.push(...wiki);
  } catch {
    usedTools.push("search_wikipedia_failed");
  }

  const deduped = Array.from(new Map(results.map((item) => [item.url, item])).values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  const keyFindings = tool_extractFindings(query, deduped);
  usedTools.push("extract_key_findings");

  const graph = tool_buildGraph(deduped);
  usedTools.push("build_relevance_graph");

  const summary = deduped.length
    ? `I researched across ${new Set(deduped.map((source) => source.source)).size} source types and found ${deduped.length} relevant references.`
    : "I couldn't fetch live web sources right now, but I can still suggest a strong study plan based on proven methods.";

  return {
    query,
    summary,
    keyFindings,
    sources: deduped,
    graph,
    usedTools,
  };
}
