export async function onRequestPost({ request, env }: any) {
  try {
    const { prompt, systemPrompt } = await request.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), { status: 400 });
    }

    // Use Cloudflare Workers AI with Gemma 7B IT
    // Gemma may ignore 'system' roles, so we merge it into the user prompt
    const messages = [];
    let finalPrompt = prompt;
    if (systemPrompt) {
      finalPrompt = `${systemPrompt}\n\n---\nユーザーからの質問:\n${prompt}`;
    }
    messages.push({ role: 'user', content: finalPrompt });

    const response = await env.AI.run('@cf/google/gemma-7b-it-lora', {
      messages: messages
    });

    return new Response(JSON.stringify(response), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
