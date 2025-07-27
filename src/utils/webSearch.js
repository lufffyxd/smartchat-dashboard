class WebSearchService {
  async search(query, maxResults = 5) {
    try {
      console.log('🔍 Web searching for:', query);
      
      // Using DuckDuckGo Instant Answer API (free, no key required)
      const encodedQuery = encodeURIComponent(query);
      const url = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`;
      
      // Try direct fetch first
      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          console.log('DuckDuckGo Direct Response:', data);
          return this.processDuckDuckGoResults(data, maxResults);
        }
      } catch (directError) {
        console.log('Direct fetch failed, trying with proxy...');
      }
      
      // Try with CORS proxy if direct fails
      const proxies = [
        'https://corsproxy.io/?',
        'https://thingproxy.freeboard.io/fetch/',
        'https://api.allorigins.win/get?url='
      ];
      
      for (const proxy of proxies) {
        try {
          console.log(`Trying proxy: ${proxy}`);
          const response = await fetch(proxy + encodeURIComponent(url));
          
          if (response.ok) {
            const rawData = await response.json();
            // Handle different proxy response formats
            const data = rawData.contents ? JSON.parse(rawData.contents) : rawData;
            console.log('DuckDuckGo Proxy Response:', data);
            return this.processDuckDuckGoResults(data, maxResults);
          }
        } catch (proxyError) {
          console.log(`Proxy ${proxy} failed:`, proxyError);
          continue;
        }
      }
      
      console.log('All web search attempts failed');
      return [];
    } catch (error) {
      console.error('Web Search Error:', error);
      return [];
    }
  }

  processDuckDuckGoResults(data, maxResults) {
    const results = [];
    
    // Add instant answer if available
    if (data.Answer) {
      results.push({
        title: `Quick Answer`,
        snippet: data.Answer,
        url: data.AbstractURL || '#'
      });
    }
    
    // Add related topics
    if (data.RelatedTopics && data.RelatedTopics.length > 0) {
      const relatedResults = data.RelatedTopics
        .slice(0, maxResults - results.length)
        .filter(topic => topic.FirstURL && topic.Text)
        .map(topic => ({
          title: topic.Text,
          snippet: '',
          url: topic.FirstURL
        }));
      results.push(...relatedResults);
    }
    
    return results;
  }

  formatSearchResults(results) {
    if (results.length === 0) {
      return "Sorry, I couldn't find any results for that search. Please try rephrasing your question or check your internet connection.";
    }
    
    let response = "I found this information for you:\n\n";
    results.forEach((result, index) => {
      response += `${index + 1}. **${result.title}**\n`;
      if (result.snippet) {
        response += `   ${result.snippet}\n`;
      }
      response += `   Source: ${result.url}\n\n`;
    });
    
    return response;
  }
}

// Create and export instance
const webSearchServiceInstance = new WebSearchService();
export default webSearchServiceInstance;