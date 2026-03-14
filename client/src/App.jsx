import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Result from './pages/Result';
import History from './pages/History';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="border-b border-gray-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-sm font-bold">
                JG
              </div>
              <span className="font-bold text-lg">JobGuard</span>
              <span className="text-gray-500 text-sm hidden sm:block">
                Check before you apply
              </span>
            </div>
            <a href="/history" className="text-gray-400 hover:text-white text-sm transition-colors">
              History
            </a>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/result/:shareId" element={<Result />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;