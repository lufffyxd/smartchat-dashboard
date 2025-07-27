import newsService from './newsService';
import webSearchService from './webSearch';
import huggingFaceService from './huggingface';

class AIService {
  async processUserMessage(userMessage, windowData, conversationHistory = []) {
    try {
      console.log('🤖 Processing user message:', userMessage);
      
      // Try Hugging Face AI first for better responses
      try {
        const aiResponse = await this.getAIResponse(userMessage, windowData, conversationHistory);
        if (aiResponse) {
          console.log('🤖 Returning AI response');
          return aiResponse;
        }
      } catch (aiError) {
        console.log('🤖 AI service failed, falling back to other methods:', aiError.message);
      }

      // Handle automatic web search for questions
      const searchResult = await this.handleAutomaticSearch(userMessage);
      if (searchResult) {
        console.log('🌐 Returning web search result');
        return searchResult;
      }

      // Handle news requests
      const newsResult = await this.handleNewsRequest(userMessage);
      if (newsResult) {
        console.log('📰 Returning news result');
        return newsResult;
      }

      // Handle special window types
      if (windowData.id === 'news') {
        if (userMessage.toLowerCase().includes('latest') || 
            userMessage.toLowerCase().includes('news') ||
            userMessage.toLowerCase().includes('today') ||
            userMessage.toLowerCase().includes('headlines')) {
          console.log('📰 Fetching latest news');
          const articles = await newsService.getTopHeadlines(windowData.newsTopic || 'technology');
          return newsService.formatNewsForChat(articles);
        } else {
          console.log('🔍 Searching news for:', userMessage);
          const articles = await newsService.searchNews(userMessage);
          return newsService.formatNewsForChat(articles);
        }
      }

      if (windowData.id === 'workout') {
        if (userMessage.toLowerCase().includes('plan') || 
            userMessage.toLowerCase().includes('generate')) {
          console.log('💪 Generating workout plan');
          return this.getMockWorkoutPlan();
        }
      }

      // For other messages, return a mock response
      console.log('💬 Returning mock response');
      return this.getMockResponse(userMessage, windowData.title, conversationHistory);
    } catch (error) {
      console.error('❌ AI Service Error:', error);
      return `Sorry, I encountered an error: ${error.message}. Please try rephrasing your question.`;
    }
  }

  async getAIResponse(userMessage, windowData, conversationHistory = []) {
    try {
      // Build context from conversation history
      let context = `You are a helpful AI assistant specialized in ${windowData.title || 'general topics'}.\n`;
      
      // Add recent conversation context (last 3 exchanges)
      if (conversationHistory.length > 0) {
        context += "Recent conversation:\n";
        const recentMessages = conversationHistory.slice(-6); // Last 3 exchanges
        recentMessages.forEach(msg => {
          const role = msg.sender === 'user' ? 'User' : 'Assistant';
          context += `${role}: ${msg.text}\n`;
        });
        context += "\n";
      }
      
      // Create prompt based on window type
      let prompt = context;
      
      if (windowData.id === 'workout') {
        prompt += `Create a detailed fitness plan for: ${userMessage}`;
      } else if (windowData.id === 'news') {
        prompt += `Summarize recent news about: ${userMessage}`;
      } else {
        prompt += `User asks: ${userMessage}\nAssistant:`;
      }
      
      console.log('🤖 Sending prompt to Hugging Face:', prompt.substring(0, 100) + '...');
      
      // Get response from Hugging Face
      const response = await huggingFaceService.getTextGeneration(prompt);
      return response;
    } catch (error) {
      console.error('❌ Hugging Face Error:', error);
      throw error;
    }
  }

  async handleAutomaticSearch(userMessage) {
    // More comprehensive question detection
    const questionWords = ['what', 'who', 'where', 'when', 'why', 'how', 'which', 'explain', 'define', 'meaning'];
    const factWords = ['ceo', 'founder', 'price', 'cost', 'population', 'statistics', 'latest', 'current', 'recent', 'tell me'];
    
    const lowerMessage = userMessage.toLowerCase();
    const hasQuestionWord = questionWords.some(word => lowerMessage.includes(word));
    const hasFactWord = factWords.some(word => lowerMessage.includes(word));
    
    // If it's clearly a question or contains fact-seeking words
    if (hasQuestionWord || hasFactWord || lowerMessage.includes('?') || lowerMessage.includes('search for')) {
      const cleanQuery = this.cleanSearchQuery(userMessage);
      console.log('🔍 Detected search query:', cleanQuery);
      const results = await webSearchService.search(cleanQuery);
      if (results && results.length > 0) {
        return webSearchService.formatSearchResults(results);
      }
    }
    
    return null;
  }

  async handleNewsRequest(userMessage) {
    const newsKeywords = [
      'latest news', 'current news', 'recent news', 
      'news about', 'news on', 'what\'s happening',
      'breaking news', 'today\'s news'
    ];
    
    const lowerMessage = userMessage.toLowerCase();
    const isNewsRequest = newsKeywords.some(keyword => lowerMessage.includes(keyword));
    
    if (isNewsRequest) {
      console.log('📰 Detected news request:', userMessage);
      
      // Extract search term more effectively
      let searchTerm = userMessage;
      for (const keyword of newsKeywords) {
        searchTerm = searchTerm.replace(new RegExp(keyword, 'gi'), '').trim();
      }
      
      // Remove common words
      searchTerm = searchTerm.replace(/^(about|on|for|the|a|an)\s+/gi, '').trim();
      
      console.log('🔍 Searching news for:', searchTerm || 'general');
      
      if (searchTerm) {
        const articles = await newsService.searchNews(searchTerm);
        return newsService.formatNewsForChat(articles);
      } else {
        // Get general latest news
        const articles = await newsService.getTopHeadlines('general');
        return newsService.formatNewsForChat(articles);
      }
    }
    
    return null;
  }

  cleanSearchQuery(query) {
    return query
      .replace(/^(what is|who is|where is|when is|why is|how is|can you|could you|tell me|explain|define|meaning of|information about|facts about|details about|search for)/i, '')
      .replace(/\?$/g, '')
      .trim();
  }

  getMockWorkoutPlan() {
    return `Here's your personalized 4-day workout plan:
    
**Day 1: Chest & Triceps**
• Bench Press: 3 sets x 8-12 reps
• Incline Dumbbell Press: 3 sets x 10-12 reps
• Tricep Dips: 3 sets x 10-15 reps
• Cable Flyes: 3 sets x 12-15 reps

**Day 2: Back & Biceps**
• Pull-ups: 3 sets x 8-12 reps
• Bent-over Rows: 3 sets x 10-12 reps
• Barbell Curls: 3 sets x 10-12 reps
• Lat Pulldowns: 3 sets x 12-15 reps

**Day 3: Legs & Shoulders**
• Squats: 3 sets x 8-12 reps
• Deadlifts: 3 sets x 6-10 reps
• Military Press: 3 sets x 8-12 reps
• Leg Curls: 3 sets x 10-15 reps

**Day 4: Core & Cardio**
• Plank: 3 sets x 30-60 seconds
• Russian Twists: 3 sets x 20 reps
• 30-minute moderate cardio session
• Stretching routine: 15 minutes`;
  }

  getMockResponse(userMessage, windowTitle, conversationHistory) {
    // Simple mock responses based on context
    const responses = [
      `I understand you're asking about "${userMessage}" in the context of ${windowTitle}. How can I help you further with this topic?`,
      `That's an interesting point about "${userMessage}". In the context of ${windowTitle}, what specific information are you looking for?`,
      `Regarding "${userMessage}" in your ${windowTitle} context, I can provide more details if you'd like. What aspect interests you most?`,
      `I've processed your query about "${userMessage}" in ${windowTitle}. Would you like me to elaborate on any particular aspect?`,
      `Thanks for sharing that about "${userMessage}" in your ${windowTitle} workspace. How else can I assist you today?`,
      `I'd be happy to help with "${userMessage}" in your ${windowTitle} context. What would you like to know more about?`,
      `Great question about "${userMessage}"! In the context of ${windowTitle}, I can provide insights on this topic. What specifically interests you?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async handleSpecialAction(action, windowData) {
    try {
      switch (action) {
        case 'fetchNews':
          console.log('📰 Fetching latest news via special action');
          const articles = await newsService.getTopHeadlines(windowData.newsTopic || 'technology');
          return newsService.formatNewsForChat(articles);
          
        case 'generatePlan':
          console.log('💪 Generating workout plan via special action');
          return this.getMockWorkoutPlan();
          
        case 'toggleNotify':
          return "Price change notifications setting has been updated successfully!";
          
        default:
          return "Action completed successfully!";
      }
    } catch (error) {
      console.error('❌ Special Action Error:', error);
      return `Sorry, I encountered an error processing your request: ${error.message}`;
    }
  }
}

// Create and export instance
const aiServiceInstance = new AIService();
export default aiServiceInstance;