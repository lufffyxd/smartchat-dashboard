class NewsService {
  constructor() {
    this.apiKey = process.env.REACT_APP_NEWSAPI_KEY;
    this.apiUrl = 'https://newsapi.org/v2';
  }

  async getTopHeadlines(category = 'technology', pageSize = 5) {
    try {
      console.log('📰 Fetching top headlines for category:', category);
      
      // Try multiple CORS proxies
      const proxies = [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/'
      ];
      
      const targetUrl = `${this.apiUrl}/top-headlines?category=${category}&pageSize=${pageSize}&apiKey=${this.apiKey}`;
      
      for (const proxy of proxies) {
        try {
          console.log(`Trying proxy: ${proxy}`);
          const response = await fetch(proxy + encodeURIComponent(targetUrl));
          
          if (response.ok) {
            const data = await response.json();
            console.log('News API Response:', data);
            
            if (data.status === 'ok' && data.articles) {
              return data.articles.map(article => ({
                title: article.title,
                description: article.description || '',
                url: article.url,
                publishedAt: article.publishedAt,
                source: article.source?.name || 'Unknown'
              }));
            }
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed:`, proxyError);
          continue;
        }
      }
      
      // If all proxies fail, return empty array
      console.log('All proxies failed for News API');
      return [];
    } catch (error) {
      console.error('News API Error:', error);
      return [];
    }
  }

  async searchNews(query, pageSize = 5) {
    try {
      console.log('🔍 Searching news for query:', query);
      
      // Try multiple CORS proxies
      const proxies = [
        'https://api.allorigins.win/get?url=',
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/'
      ];
      
      const targetUrl = `${this.apiUrl}/everything?q=${encodeURIComponent(query)}&pageSize=${pageSize}&apiKey=${this.apiKey}`;
      
      for (const proxy of proxies) {
        try {
          console.log(`Trying proxy: ${proxy}`);
          const response = await fetch(proxy + encodeURIComponent(targetUrl));
          
          if (response.ok) {
            const rawData = await response.json();
            // Handle different proxy response formats
            const data = rawData.contents ? JSON.parse(rawData.contents) : rawData;
            console.log('News Search Response:', data);
            
            if (data.status === 'ok' && data.articles) {
              return data.articles.map(article => ({
                title: article.title,
                description: article.description || '',
                url: article.url,
                publishedAt: article.publishedAt,
                source: article.source?.name || 'Unknown'
              }));
            }
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed:`, proxyError);
          continue;
        }
      }
      
      // If all proxies fail, return empty array
      console.log('All proxies failed for News Search');
      return [];
    } catch (error) {
      console.error('News Search Error:', error);
      return [];
    }
  }

  formatNewsForChat(articles) {
    if (articles.length === 0) {
      return "Sorry, I couldn't find any recent news on that topic. Please try a different search term.";
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