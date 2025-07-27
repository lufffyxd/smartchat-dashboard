import newsService from './newsService';
import webSearchService from './webSearch';

class AIService {
  async processUserMessage(userMessage, windowData, conversationHistory = []) {
    try {
      // Handle automatic web search for questions
      const searchResult = await this.handleAutomaticSearch(userMessage);
      if (searchResult) {
        return searchResult;
      }

      // Handle news requests
      const newsResult = await this.handleNewsRequest(userMessage);
      if (newsResult) {
        return newsResult;
      }

      // Handle special window types
      if (windowData.id === 'news') {
        if (userMessage.toLowerCase().includes('latest') || 
            userMessage.toLowerCase().includes('news') ||
            userMessage.toLowerCase().includes('today') ||
            userMessage.toLowerCase().includes('headlines')) {
          const articles = await newsService.getTopHeadlines(windowData.newsTopic || 'technology');
          return newsService.formatNewsForChat(articles);
        } else {
          const articles = await newsService.searchNews(userMessage);
          return newsService.formatNewsForChat(articles);
        }
      }

      if (windowData.id === 'workout') {
        if (userMessage.toLowerCase().includes('plan') || 
            userMessage.toLowerCase().includes('generate')) {
          return this.getMockWorkoutPlan();
        }
      }

      // For other messages, return a mock response (since we don't have Hugging Face key)
      return this.getMockResponse(userMessage, windowData.title, conversationHistory);
    } catch (error) {
      console.error('AI Service Error:', error);
      return `Sorry, I encountered an error: ${error.message}. Please try rephrasing your question.`;
    }
  }

  async handleAutomaticSearch(userMessage) {
    // Detect questions that likely need web search
    const questionPatterns = [
      /^(what|who|where|when|why|how|which|can you|could you|tell me about|explain|define|meaning of)/i,
      /(latest|recent|current|today's|breaking|price of|cost of|population of|statistics)/i
    ];

    const isQuestion = questionPatterns.some(pattern => pattern.test(userMessage));
    
    if (isQuestion) {
      const cleanQuery = this.cleanSearchQuery(userMessage);
      const results = await webSearchService.search(cleanQuery);
      return webSearchService.formatSearchResults(results);
    }
    
    return null;
  }

  async handleNewsRequest(userMessage) {
    const newsKeywords = [
      'latest news', 'current news', 'recent news', 
      'news about', 'news on', 'what\'s happening',
      'breaking news', 'today\'s news'
    ];
    
    const isNewsRequest = newsKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    if (isNewsRequest) {
      let searchTerm = userMessage;
      newsKeywords.forEach(keyword => {
        searchTerm = searchTerm.replace(new RegExp(keyword, 'gi'), '').trim();
      });
      
      if (searchTerm === '') {
        searchTerm = 'latest';
      }
      
      const articles = await newsService.searchNews(searchTerm);
      return newsService.formatNewsForChat(articles);
    }
    
    return null;
  }

  cleanSearchQuery(query) {
    return query
      .replace(/^(what is|who is|where is|when is|why is|how is|can you|could you|tell me|explain|define|meaning of|information about|facts about|details about)/i, '')
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
      `Thanks for sharing that about "${userMessage}" in your ${windowTitle} workspace. How else can I assist you today?`
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async handleSpecialAction(action, windowData) {
    try {
      switch (action) {
        case 'fetchNews':
          const articles = await newsService.getTopHeadlines(windowData.newsTopic || 'technology');
          return newsService.formatNewsForChat(articles);
          
        case 'generatePlan':
          return this.getMockWorkoutPlan();
          
        case 'toggleNotify':
          return "Price change notifications setting has been updated successfully!";
          
        default:
          return "Action completed successfully!";
      }
    } catch (error) {
      return `Sorry, I encountered an error processing your request: ${error.message}`;
    }
  }
}

export default new AIService();