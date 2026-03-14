import InputForm from '../components/InputForm';
import LoadingAnalysis from '../components/LoadingAnalysis';
import ResultCard from '../components/ResultCard';
import { useAnalyze } from '../hooks/useAnalyze';

export default function Home() {
  const { result, loading, error, step, analyze, reset } = useAnalyze();

  return (
    <div className="space-y-8">
      {/* Hero */}
      {!result && !loading && (
        <div className="text-center space-y-4 pt-8">
          <div className="inline-block bg-red-500/10 text-red-400 border border-red-500/20 
                          rounded-full px-4 py-1 text-sm mb-4">
            11,000+ Indian students scammed in 2023
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">
            Is this job posting{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              real?
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Paste any job URL or description. AI analyzes it in seconds and tells you 
            exactly why it might be a scam — not just a vague warning.
          </p>
        </div>
      )}

      {/* Input or Loading or Result */}
      {!loading && !result && (
        <InputForm onSubmit={analyze} error={error} />
      )}

      {loading && (
        <LoadingAnalysis step={step} />
      )}

      {result && !loading && (
        <ResultCard result={result} onReset={reset} />
      )}
    </div>
  );
}