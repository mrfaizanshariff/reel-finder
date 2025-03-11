"use client"
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [username, setUsername] = useState('');
  const [search_key, setKeyword] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Load Instagram embed script when results are displayed
  useEffect(() => {
    if (results.length > 0) {
      // Load Instagram embed.js script
      const script = document.createElement('script');
      script.src = 'https://www.instagram.com/embed.js';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Clean up script when component unmounts
        document.body.removeChild(script);
      };
    }
  }, [results]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Replace with your actual API endpoint
      const response = await fetch('https://instagram-post-finder-fastapi.onrender.com/get-embed-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, search_key }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }
      
      const data = await response.json();
      setResults(data.embed_codes || []);
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
              <label htmlFor="username" className="block text-gray-900 font-medium mb-2">
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
              <label htmlFor="search_key" className="block text-gray-900 font-medium mb-2">
                Keyword
              </label>
              <input
                type="text"
                id="search_key"
                value={search_key}
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

        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        )}

        {results.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((embedHtml, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div 
                    className="instagram-embed"
                    html
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {results.length === 0 && !loading && (
          <div className="text-center text-gray-500 my-12">
            <p>Enter a username and keyword to search for Instagram reels</p>
          </div>
        )}
      </main>

      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Reels Finder. All rights reserved.</p>
      </footer>
    </div>
  );
}