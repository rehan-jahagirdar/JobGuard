import { useState } from 'react';
import { Link, Globe, AlertCircle } from 'lucide-react';

export default function InputForm({ onSubmit, error }) {
  const [activeTab, setActiveTab] = useState('url');
  const [urlInput, setUrlInput] = useState('');
  const [textInput, setTextInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const content = activeTab === 'url' ? urlInput.trim() : textInput.trim();
    if (!content) return;
    onSubmit({ type: activeTab, content });
  };

  const isValid = activeTab === 'url' 
    ? urlInput.trim().startsWith('http') 
    : textInput.trim().length > 50;

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 shadow-xl">
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'url'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <Globe size={16} /> Paste URL
        </button>
        <button
          onClick={() => setActiveTab('text')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
            ${activeTab === 'text'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}
        >
          <Link size={16} /> Paste Text
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {activeTab === 'url' ? (
          <div>
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://linkedin.com/jobs/view/..."
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                         focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            <p className="text-gray-500 text-xs mt-2">
              Supports LinkedIn, Naukri, Internshala, and most job sites
            </p>
          </div>
        ) : (
          <div>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste the full job description here — include everything: title, company, salary, requirements, contact details..."
              rows={8}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 
                         text-white placeholder-gray-500 focus:outline-none focus:border-blue-500
                         focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
            />
            <p className="text-gray-500 text-xs mt-2">
              {textInput.length}/6000 characters · minimum 50 characters
            </p>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 
                          rounded-xl p-4 text-red-400 text-sm">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={!isValid}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed
                     text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                     flex items-center justify-center gap-2"
        >
          🔍 Analyze Job Posting
        </button>
      </form>
    </div>
  );
}