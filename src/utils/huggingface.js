class HuggingFaceService {
  constructor() {
    this.apiKey = process.env.REACT_APP_HUGGINGFACE_API_KEY;
    this.apiUrl = 'https://api-inference.huggingface.co/models/';
  }

  async getTextGeneration(prompt, model = 'google/flan-t5-base') {
    try {
      if (!this.apiKey) {
        throw new Error('Hugging Face API key not configured');
      }

      console.log('🤖 Calling Hugging Face API with prompt:', prompt.substring(0, 100) + '...');

      const response = await fetch(`${this.apiUrl}${model}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            top_p: 0.9,
            repetition_penalty: 1.2
          }
        })
      });

      console.log('🤖 Hugging Face Response Status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log('🤖 Hugging Face Response Data:', data);

      // Handle different response formats
      if (Array.isArray(data) && data.length > 0) {
        if (data[0]?.generated_text) {
          return data[0].generated_text;
        }
      } else if (data?.generated_text) {
        return data.generated_text;
      }

      throw new Error('Unexpected response format from Hugging Face API');
    } catch (error) {
      console.error('❌ Hugging Face API Error:', error);
      throw new Error(`Failed to get response from AI: ${error.message}`);
    }
  }

  // Specialized methods for different tasks
  async getWebSearchResponse(query) {
    const prompt = `Answer this question based on general knowledge: ${query}. Provide a concise, factual response.`;
    return await this.getTextGeneration(prompt, 'google/flan-t5-xxl');
  }

  async getWorkoutPlan(fitnessLevel = 'intermediate') {
    const prompt = `Create a detailed 4-day ${fitnessLevel} workout plan. Include exercise names, sets, reps, and rest periods. Format clearly with day headings.`;
    return await this.getTextGeneration(prompt, 'google/flan-t5-xxl');
  }

  async getNewsSummary(topic) {
    const prompt = `Summarize recent news about ${topic}. Provide 3 key points with brief explanations.`;
    return await this.getTextGeneration(prompt, 'google/flan-t5-xxl');
  }
}

// Create and export instance
const huggingFaceServiceInstance = new HuggingFaceService();
export default huggingFaceServiceInstance;