export interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

export async function askOpenRouter(messages: ChatMessage[], model = 'openai/gpt-4o-mini'): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) throw new Error('OPENROUTER_API_KEY is required');

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ model, messages, temperature: 0.1 })
  });

  if (!response.ok) throw new Error(`OpenRouter request failed: ${response.status} ${await response.text()}`);
  const json = (await response.json()) as any;
  return json.choices?.[0]?.message?.content ?? '';
}
