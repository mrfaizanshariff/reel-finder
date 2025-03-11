"use client"
import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [username, setUsername] = useState('');
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/search-reels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, keyword }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      
      const data = await response.json();
      setResults(data.reels || []);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Reels Finder | Search Instagram Reels</title>
        <meta name="description" content="Search Instagram reels by username and keyword" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">Reels Finder</h1>
          <p className="text-gray-600 text-lg">Find Instagram reels by username and keyword</p>
        </div>

        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
                Instagram Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. natgeo"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="keyword" className="block text-gray-700 font-medium mb-2">
                Keyword
              </label>
              <input
                type="text"
                id="keyword"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g. wildlife"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition duration-300 ease-in-out"
            >
              {loading ? 'Searching...' : 'Search Reels'}
            </button>
          </form>
        </div>

        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p>{error}</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((reel) => (
                <div key={reel.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {reel.thumbnail_url && (
                    <img 
                      src={reel.thumbnail_url} 
                      alt="Reel thumbnail" 
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-2 truncate">{reel.caption || 'No caption'}</h3>
                    <p className="text-gray-600 text-sm mb-3">
                      Views: {reel.play_count || 'N/A'} • {new Date(reel.timestamp).toLocaleDateString()}
                    </p>
                    <a 
                      href={reel.permalink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800 text-sm font-medium"
                    >
                      View on Instagram →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Reels Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}