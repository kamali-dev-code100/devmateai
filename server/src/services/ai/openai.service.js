const groq = require('../../config/openai');

class AIService {
  /**
   * Standard chat completion
   */
  async chat(systemPrompt, messages = [], options = {}) {
    const response = await groq.chat.completions.create({
      model: options.model || 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
    });

    return response.choices[0].message.content;
  }

  /**
   * Parse JSON response safely
   */
  parseJSON(content) {
    try {
      const cleaned = content.replace(/```json\n?|\n?```/g, '').trim();
      return JSON.parse(cleaned);
    } catch {
      // Try to extract JSON from response
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        try {
          return JSON.parse(match[0]);
        } catch {
          return null;
        }
      }
      return null;
    }
  }
}

module.exports = new AIService();