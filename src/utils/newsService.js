class NewsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_NEWSAPI_KEY;
    this.apiUrl = 'https://newsapi.org/v2';
  }

  async getTopHeadlines(category = 'technology', pageSize = 5) {
    try {
      // Using a CORS proxy for the free tier
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = `${this.apiUrl}/top-headlines?category=${category}&pageSize=${pageSize}&apiKey=${this.apiKey}`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        return data.articles.map(article => ({
          title: article.title,
          description: article.description || '',
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source?.name || 'Unknown'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('News API Error:', error);
      return [];
    }
  }

  async searchNews(query, pageSize = 5) {
    try {
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const targetUrl = `${this.apiUrl}/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&apiKey=${this.apiKey}`;
      
      const response = await fetch(proxyUrl + encodeURIComponent(targetUrl));
      const data = await response.json();
      
      if (data.status === 'ok' && data.articles) {
        return data.articles.map(article => ({
          title: article.title,
          description: article.description || '',
          url: article.url,
          publishedAt: article.publishedAt,
          source: article.source?.name || 'Unknown'
        }));
      }
      
      return [];
    } catch (error) {
      console.error('News Search Error:', error);
      return [];
    }
  }

  formatNewsForChat(articles) {
    if (articles.length === 0) {
      return "Sorry, I couldn't find any recent news on that topic.";
    }
    
    let response = "Here are the latest news updates:\n\n";
    articles.forEach((article, index) => {
      const date = new Date(article.publishedAt).toLocaleDateString();
      response += `${index + 1}. **${article.title}**\n`;
      response += `   ${article.description}\n`;
      response += `   Source: ${article.source} | ${date}\n\n`;
    });
    
    return response;
  }
}

export default new NewsService();