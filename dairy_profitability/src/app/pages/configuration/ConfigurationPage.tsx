import { useState } from 'react';
import { Settings, DollarSign, Calculator } from 'lucide-react';
import { RevenueConfig } from '../../components/menu/RevenueConfig';
import { CostConfig } from '../../components/menu/CostConfig';
import { PreCalculatedConfig } from '../../components/menu/PreCalculatedConfig';

type Tab = 'revenue' | 'cost' | 'precalc';

const tabs: { id: Tab; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: 'revenue',
    label: 'Revenue Assumptions',
    icon: <DollarSign className="h-4 w-4" />,
    description: 'Configure milk prices, animal sale prices, and other revenue sources',
  },
  {
    id: 'cost',
    label: 'Cost Assumptions',
    icon: <Settings className="h-4 w-4" />,
    description: 'Configure feed costs, labor rates, breeding, and health expenses',
  },
  {
    id: 'precalc',
    label: 'Pre-Calculated Parameters',
    icon: <Calculator className="h-4 w-4" />,
    description: 'System-wide constants and derived calculation parameters',
  },
];

export function ConfigurationPage() {
  const [activeTab, setActiveTab] = useState<Tab>('revenue');

  const currentTab = tabs.find(t => t.id === activeTab)!;

  return (
    <div className="p-6 space-y-6 max-w-screen-xl mx-auto">
      {/* Page Header */}
      <div>
        <h1 className="text-gray-900 mb-1">Configuration</h1>
        <p className="text-gray-500 text-sm">Manage revenue assumptions, cost configuration, and pre-calculated parameters</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left p-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                  activeTab === tab.id ? 'bg-green-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`flex items-center gap-2 mb-1 ${activeTab === tab.id ? 'text-green-700' : 'text-gray-700'}`}>
                  <span className={activeTab === tab.id ? 'text-green-600' : 'text-gray-400'}>
                    {tab.icon}
                  </span>
                  <span className="text-sm font-medium">{tab.label}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{tab.description}</p>
                {activeTab === tab.id && (
                  <div className="mt-2 h-0.5 bg-green-500 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            {/* Config Header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
              <div className="p-2 rounded-lg bg-green-50">
                <span className="text-green-600">{currentTab.icon}</span>
              </div>
              <div>
                <h2 className="text-gray-800 text-base">{currentTab.label}</h2>
                <p className="text-gray-400 text-xs">{currentTab.description}</p>
              </div>
            </div>

            {/* Config Components */}
            <div className="p-6">
              {activeTab === 'revenue' && <RevenueConfig />}
              {activeTab === 'cost' && <CostConfig />}
              {activeTab === 'precalc' && <PreCalculatedConfig />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
