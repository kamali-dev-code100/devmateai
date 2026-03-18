const openai = require('../../config/openai');

class OpenAIService {
  /**
   * Standard chat completion (returns full response)
   * @param {string} systemPrompt
   * @param {Array} messages  - [{role, content}]
   * @param {object} options
   */
  async chat(systemPrompt, messages = [], options = {}) {
    const response = await openai.chat.completions.create({
      model: options.model || process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      response_format: options.jsonMode ? { type: 'json_object' } : undefined,
    });

    return response.choices[0].message.content;
  }

  /**
   * Streaming chat (returns stream for SSE)
   */
  async stream(systemPrompt, messages = [], res, options = {}) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const stream = await openai.chat.completions.create({
      model: options.model || process.env.OPENAI_MODEL || 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
      stream: true,
    });

    let fullContent = '';
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content || '';
      if (delta) {
        fullContent += delta;
        res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
    return fullContent;
  }

  /**
   * Parse JSON response safely
   */
  parseJSON(content) {
    try {
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      return null;
    }
  }
}

module.exports = new OpenAIService();
