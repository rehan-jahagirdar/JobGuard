const STEPS = {
  fetching:  { icon: '🌐', text: 'Fetching job posting...', sub: 'Scraping the URL you provided' },
  analyzing: { icon: '🧠', text: 'AI is analyzing...', sub: 'Checking against 50+ scam patterns' },
};

export default function LoadingAnalysis({ step }) {
  const current = STEPS[step] || STEPS.analyzing;

  return (
    <div className="flex flex-col items-center justify-center py-20 space-y-6">
      <div className="text-6xl animate-bounce">{current.icon}</div>
      <div className="text-center space-y-2">
        <p className="text-xl font-semibold">{current.text}</p>
        <p className="text-gray-400">{current.sub}</p>
      </div>
      <div className="flex gap-1">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}