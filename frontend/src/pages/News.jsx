import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Newspaper, Calendar, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchNews = async () => {
    setLoading(true);
    setError('');
    try {
      // NewsAPI endpoint for banking and finance news
      const apiKey = 'b3157a6052c24ef2aab80222a6de5464';
      const response = await axios.get(`https://newsapi.org/v2/everything?q=banking+OR+finance+OR+economy&language=en&sortBy=publishedAt&pageSize=12&apiKey=${apiKey}`);
      
      // Filter out removed or empty articles
      const validArticles = response.data.articles.filter(article => article.title && article.title !== '[Removed]');
      setArticles(validArticles);
    } catch (err) {
      console.error("Error fetching news:", err);
      setError('Failed to load latest news. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 flex items-center gap-3">
              <Newspaper className="text-[var(--primary-color)] w-10 h-10" /> Financial News
            </h1>
            <p className="mt-2 text-lg text-gray-600">Real-time updates from the banking and financial world.</p>
          </div>
          <button 
            onClick={fetchNews}
            disabled={loading}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 text-red-700 mb-8 border border-red-100">
            <AlertCircle size={24} />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 w-full"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <a 
                key={index} 
                href={article.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col h-full group"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  {article.urlToImage ? (
                    <img 
                      src={article.urlToImage} 
                      alt={article.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { e.target.onerror = null; e.target.src = '/assets/secure_banking.png'; }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">
                      <Newspaper size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--primary-color)]">
                    {article.source.name}
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={14} />
                    {new Date(article.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-[var(--primary-color)] transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-6 line-clamp-3 text-sm flex-grow">
                    {article.description || 'No description available for this article.'}
                  </p>
                  <div className="mt-auto flex items-center text-[var(--primary-color)] font-medium text-sm group-hover:gap-2 transition-all">
                    Read Full Article <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : !error && (
          <div className="text-center py-20 text-gray-500">
            <Newspaper className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium">No news found right now.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default News;
