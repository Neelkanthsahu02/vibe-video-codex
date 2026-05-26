export interface BraveWebResult { title: string; url: string; source?: string }

export async function braveImageSearch(query: string, count = 10): Promise<BraveWebResult[]> {
  const key = process.env.BRAVE_SEARCH_API_KEY;
  if (!key) throw new Error('BRAVE_SEARCH_API_KEY is required');
  const url = new URL('https://api.search.brave.com/res/v1/images/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', String(count));
  const response = await fetch(url, { headers: { Accept: 'application/json', 'X-Subscription-Token': key } });
  if (!response.ok) throw new Error(`Brave API error: ${response.status} ${await response.text()}`);
  const json = (await response.json()) as any;
  const results = json.results ?? [];
  return results.map((r: any) => ({ title: r.title ?? '', url: r.properties?.url ?? r.url, source: r.source }));
}
