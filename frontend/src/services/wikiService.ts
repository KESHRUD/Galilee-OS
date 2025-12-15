
export const fetchWikiSummary = async (query: string): Promise<string | null> => {
    if (!query) return null;

    // Clean query (remove punctuation like '?' often found in flashcards)
    const cleanQuery = query.replace(/[?.,]/g, '').trim();

    // Use keywords extraction (simple heuristic: take longest words)
    // For a real app, we'd use NLP. Here we just try the full query or the last significant word.
    const searchTerms = cleanQuery;

    try {
        // Wikipedia API (Free, no key required)
        const endpoint = `https://fr.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&redirects=1&origin=*&titles=${encodeURIComponent(searchTerms)}`;
        
        const response = await fetch(endpoint);
        const data = await response.json();
        
        const pages = data.query?.pages;
        if (!pages) return null;

        const pageId = Object.keys(pages)[0];
        if (pageId === '-1') return null; // Not found

        const extract = pages[pageId].extract;
        if (!extract) return null;

        // Limit length
        return extract.length > 500 ? extract.substring(0, 500) + '...' : extract;
    } catch (error) {
        console.error("Wiki API Error", error);
        return null;
    }
};
