class NewsService {
  constructor() {
    this.rssFeeds = {
      technology: 'https://feeds.feedburner.com/TechCrunch/',
      business: 'https://rss.cnn.com/rss/money_latest.rss',
      general: 'https://feeds.bbci.co.uk/news/rss.xml',
      science: 'https://rss.science.com/',
      entertainment: 'https://feeds.feedburner.com/variety/news/frontpage',
      sports: 'https://feeds.a.dj.com/rss/RSSSports.xml'
    };
  }

  async getTopHeadlines(category = 'technology', pageSize = 5) {
    try {
      console.log('📰 Fetching RSS headlines for category:', category);
      
      const feedUrl = this.rssFeeds[category] || this.rssFeeds.technology;
      const articles = await this.fetchRSSFeed(feedUrl, pageSize);
      return articles;
    } catch (error) {
      console.error('RSS Feed Error:', error);
      return this.getFallbackNews(category, pageSize);
    }
  }

  async searchNews(query, pageSize = 5) {
    try {
      console.log('🔍 Searching RSS news for query:', query);
      
      // For search, we'll use a general news feed and filter
      const articles = await this.fetchRSSFeed(this.rssFeeds.general, pageSize * 2);
      
      // Filter articles based on query
      const filteredArticles = articles.filter(article => 
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, pageSize);
      
      if (filteredArticles.length > 0) {
        return filteredArticles;
      }
      
      // If no matches, return recent articles
      return articles.slice(0, pageSize);
    } catch (error) {
      console.error('RSS Search Error:', error);
      return this.getFallbackNews('general', pageSize);
    }
  }

  async fetchRSSFeed(url, maxItems = 5) {
    try {
      // Use multiple CORS proxies
      const proxies = [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/'
      ];
      
      for (const proxy of proxies) {
        try {
          console.log(`Trying RSS proxy: ${proxy}`);
          const response = await fetch(proxy + encodeURIComponent(url));
          
          if (response.ok) {
            const text = await response.text();
            console.log('RSS Response received, parsing...');
            return this.parseRSS(text, maxItems);
          }
        } catch (proxyError) {
          console.log(`RSS Proxy ${proxy} failed:`, proxyError);
          continue;
        }
      }
      
      throw new Error('All RSS proxies failed');
    } catch (error) {
      console.error('RSS Fetch Error:', error);
      throw error;
    }
  }

  parseRSS(xmlText, maxItems = 5) {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, "text/xml");
      
      const items = xmlDoc.getElementsByTagName("item");
      const articles = [];
      
      for (let i = 0; i < Math.min(items.length, maxItems); i++) {
        const item = items[i];
        
        // Extract data with fallbacks
        const title = this.getElementText(item, "title") || "No title";
        const description = this.getElementText(item, "description") || "";
        const link = this.getElementText(item, "link") || "#";
        const pubDate = this.getElementText(item, "pubDate") || new Date().toISOString();
        
        // Clean up description (remove HTML tags)
        const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
        
        articles.push({
          title: title,
          description: cleanDescription,
          url: link,
          publishedAt: pubDate,
          source: this.extractSourceFromURL(link)
        });
      }
      
      return articles;
    } catch (error) {
      console.error('RSS Parse Error:', error);
      return [];
    }
  }

  getElementText(parentElement, tagName) {
    const element = parentElement.getElementsByTagName(tagName)[0];
    return element ? element.textContent : '';
  }

  extractSourceFromURL(url) {
    try {
      const hostname = new URL(url).hostname;
      return hostname.replace('www.', '').split('.')[0];
    } catch {
      return 'News Source';
    }
  }

  formatNewsForChat(articles) {
    if (articles.length === 0) {
      return "Sorry, I couldn't find any recent news. Please try again later.";
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

  // Fallback method using mock data
  getFallbackNews(category, pageSize) {
    console.log('📰 Using fallback news data');
    
    const mockNews = [
      {
        title: "Major Tech Breakthrough Announced",
        description: "Scientists have made a significant advancement in quantum computing technology that could revolutionize the industry.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Tech News"
      },
      {
        title: "Global Markets Show Positive Trends",
        description: "Stock markets around the world are experiencing growth as economic indicators show promising signs.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Business Daily"
      },
      {
        title: "New Climate Policy Framework Introduced",
        description: "International coalition announces comprehensive climate action plan with ambitious targets for 2030.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Environmental Report"
      },
      {
        title: "AI Research Reaches New Milestone",
        description: "Researchers have developed a new AI model that demonstrates unprecedented capabilities in natural language understanding.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "AI Journal"
      },
      {
        title: "Healthcare Innovation Improves Patient Outcomes",
        description: "New medical technology shows remarkable results in early clinical trials, offering hope for better treatments.",
        url: "#",
        publishedAt: new Date().toISOString(),
        source: "Medical Today"
      }
    ];
    
    return mockNews.slice(0, pageSize);
  }
}

// Create and export instance
const newsServiceInstance = new NewsService();
export default newsServiceInstance;