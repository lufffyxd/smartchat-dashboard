class WebSearchService {
  async search(query, maxResults = 5) {
    try {
      // Using DuckDuckGo Instant Answer API (free, no key required)
      const encodedQuery = encodeURIComponent(query);
      const url = `https://api.duckduckgo.com/?q=${encodedQuery}&format=json&no_html=1&skip_disambig=1`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      const results = [];
      
      // Add instant answer if available
      if (data.Answer) {
        results.push({
          title: `Quick Answer: ${query}`,
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
    } catch (error) {
      console.error('Web Search Error:', error);
      return [];
    }
  }

  formatSearchResults(results) {
    if (results.length === 0) {
      return "Sorry, I couldn't find any results for that search.";
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

export default new WebSearchService();