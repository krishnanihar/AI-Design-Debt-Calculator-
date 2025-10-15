import { useState } from 'react';
import { Calculator, BarChart3, FileText, Activity } from 'lucide-react';
import { QuickAnalysis } from './components/Calculator/QuickAnalysis';
import { ComponentAnalysis } from './components/Calculator/ComponentAnalysis';
import { DebtHeatmap } from './components/Calculator/DebtHeatmap';
import { ExecutiveReport } from './components/Reports/ExecutiveReport';

type Tab = 'quick' | 'components' | 'heatmap' | 'report';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quick');

  const tabs = [
    { id: 'quick' as const, label: 'Quick Analysis', icon: Calculator },
    { id: 'components' as const, label: 'Components', icon: Activity },
    { id: 'heatmap' as const, label: 'Heatmap', icon: BarChart3 },
    { id: 'report' as const, label: 'Report', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-purple-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">AI Design Debt Calculator</h1>
              <p className="mt-1 text-purple-100">
                Quantify component readiness before AI integration
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-purple-100">Based on MIT Research</p>
                <p className="text-xs text-purple-200">95% of AI projects fail without proper design systems</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${
                      isActive
                        ? 'border-purple-600 text-purple-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'quick' && <QuickAnalysis />}
        {activeTab === 'components' && <ComponentAnalysis />}
        {activeTab === 'heatmap' && <DebtHeatmap />}
        {activeTab === 'report' && <ExecutiveReport />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-gray-600">
              AI Design Debt Calculator • Built for Product Designers
            </p>
            <p className="text-xs text-gray-500 mt-2 md:mt-0">
              74% of design system components break when AI is introduced
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
