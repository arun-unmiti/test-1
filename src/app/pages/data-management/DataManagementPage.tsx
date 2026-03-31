import { useState } from 'react';
import {
  Search, Plus, Edit2, Trash2, Download, Filter, ChevronDown,
  Building2, Users, Beef, Droplets, ShoppingCart, DollarSign, MessageSquare,
  CheckCircle2, Clock, AlertCircle, X,
} from 'lucide-react';
import { farmsData, herdsData, animalsData, milkProductionData, salesData, costsData, advisoriesData } from '../../data/mockData';

type Tab = 'farms' | 'herd' | 'animals' | 'milk' | 'sales' | 'cost' | 'advisories';

const tabs: { id: Tab; label: string; icon: React.ReactNode; count: number }[] = [
  { id: 'farms', label: 'Farms', icon: <Building2 className="h-4 w-4" />, count: farmsData.length },
  { id: 'herd', label: 'Herd', icon: <Users className="h-4 w-4" />, count: herdsData.length },
  { id: 'animals', label: 'Animals', icon: <Beef className="h-4 w-4" />, count: animalsData.length },
  { id: 'milk', label: 'Milk Production', icon: <Droplets className="h-4 w-4" />, count: milkProductionData.length },
  { id: 'sales', label: 'Sales', icon: <ShoppingCart className="h-4 w-4" />, count: salesData.length },
  { id: 'cost', label: 'Cost', icon: <DollarSign className="h-4 w-4" />, count: costsData.length },
  { id: 'advisories', label: 'Advisories', icon: <MessageSquare className="h-4 w-4" />, count: advisoriesData.length },
];

const fmt = (n: number) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    inactive: 'bg-gray-100 text-gray-500',
    Completed: 'bg-green-100 text-green-700',
    Pending: 'bg-amber-100 text-amber-700',
    Open: 'bg-red-100 text-red-600',
    Acknowledged: 'bg-blue-100 text-blue-700',
    Resolved: 'bg-green-100 text-green-700',
    Lactating: 'bg-green-100 text-green-700',
    Dry: 'bg-amber-100 text-amber-700',
    Heifer: 'bg-purple-100 text-purple-700',
    Calf: 'bg-blue-100 text-blue-700',
    'Grade A': 'bg-green-100 text-green-700',
    'Grade B': 'bg-amber-100 text-amber-700',
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const styles: Record<string, string> = {
    High: 'bg-red-100 text-red-700',
    Medium: 'bg-amber-100 text-amber-700',
    Low: 'bg-green-100 text-green-700',
  };
  return (
    <span className={`inline-block text-xs px-2 py-0.5 rounded-full font-medium ${styles[priority] ?? 'bg-gray-100 text-gray-600'}`}>
      {priority}
    </span>
  );
}

function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 bg-gray-50 whitespace-nowrap">
      {children}
    </th>
  );
}

function TableCell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3 text-sm text-gray-700 ${className}`}>{children}</td>;
}

export function DataManagementPage() {
  const [activeTab, setActiveTab] = useState<Tab>('farms');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const renderFarmsTable = () => {
    const data = farmsData.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.owner.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full">
        <thead><tr>
          <TableHeader>Farm ID</TableHeader>
          <TableHeader>Farm Name</TableHeader>
          <TableHeader>Owner</TableHeader>
          <TableHeader>Location</TableHeader>
          <TableHeader>Level 1</TableHeader>
          <TableHeader>Level 2</TableHeader>
          <TableHeader>Size</TableHeader>
          <TableHeader>Registered</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr></thead>
        <tbody>
          {data.map((f, i) => (
            <tr key={f.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              <TableCell><span className="font-mono text-xs text-gray-500">{f.id}</span></TableCell>
              <TableCell><span className="font-medium text-gray-800">{f.name}</span></TableCell>
              <TableCell>{f.owner}</TableCell>
              <TableCell>{f.location}</TableCell>
              <TableCell>{f.level1}</TableCell>
              <TableCell>{f.level2}</TableCell>
              <TableCell>{f.size}</TableCell>
              <TableCell>{f.registered}</TableCell>
              <TableCell><StatusBadge status={f.status} /></TableCell>
              <TableCell><ActionButtons /></TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderHerdTable = () => {
    const data = herdsData.filter(f =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.farmName.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full">
        <thead><tr>
          <TableHeader>Herd ID</TableHeader>
          <TableHeader>Herd Name</TableHeader>
          <TableHeader>Farm</TableHeader>
          <TableHeader>Breed</TableHeader>
          <TableHeader>Total Animals</TableHeader>
          <TableHeader>Lactating</TableHeader>
          <TableHeader>Dry</TableHeader>
          <TableHeader>Heifers</TableHeader>
          <TableHeader>Last Updated</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr></thead>
        <tbody>
          {data.map((h, i) => (
            <tr key={h.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              <TableCell><span className="font-mono text-xs text-gray-500">{h.id}</span></TableCell>
              <TableCell><span className="font-medium text-gray-800">{h.name}</span></TableCell>
              <TableCell>{h.farmName}</TableCell>
              <TableCell>{h.breed}</TableCell>
              <TableCell className="text-center font-medium">{h.totalAnimals}</TableCell>
              <TableCell><span className="text-green-700 font-medium">{h.lactating}</span></TableCell>
              <TableCell><span className="text-amber-600 font-medium">{h.dry}</span></TableCell>
              <TableCell><span className="text-purple-600 font-medium">{h.heifers}</span></TableCell>
              <TableCell>{h.lastUpdated}</TableCell>
              <TableCell><StatusBadge status={h.status} /></TableCell>
              <TableCell><ActionButtons /></TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderAnimalsTable = () => {
    const data = animalsData.filter(f =>
      f.tag.toLowerCase().includes(search.toLowerCase()) ||
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.farmName.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full">
        <thead><tr>
          <TableHeader>Tag</TableHeader>
          <TableHeader>Name</TableHeader>
          <TableHeader>Herd</TableHeader>
          <TableHeader>Farm</TableHeader>
          <TableHeader>Breed</TableHeader>
          <TableHeader>Age</TableHeader>
          <TableHeader>Gender</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Milk Yield (L/day)</TableHeader>
          <TableHeader>Calving Date</TableHeader>
          <TableHeader>Weight (kg)</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr></thead>
        <tbody>
          {data.map((a, i) => (
            <tr key={a.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              <TableCell><span className="font-mono text-xs text-gray-600">{a.tag}</span></TableCell>
              <TableCell><span className="font-medium text-gray-800">{a.name}</span></TableCell>
              <TableCell>{a.herdName}</TableCell>
              <TableCell className="text-xs text-gray-500">{a.farmName}</TableCell>
              <TableCell>{a.breed}</TableCell>
              <TableCell>{a.age}</TableCell>
              <TableCell>{a.gender}</TableCell>
              <TableCell><StatusBadge status={a.status} /></TableCell>
              <TableCell className="text-center">
                {a.milkYield > 0 ? <span className="font-medium text-green-700">{a.milkYield}</span> : <span className="text-gray-300">—</span>}
              </TableCell>
              <TableCell>{a.calvingDate ?? <span className="text-gray-300">—</span>}</TableCell>
              <TableCell>{a.weight}</TableCell>
              <TableCell><ActionButtons /></TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderMilkTable = () => {
    const data = milkProductionData.filter(f =>
      f.farmName.toLowerCase().includes(search.toLowerCase()) ||
      f.buyer.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full">
        <thead><tr>
          <TableHeader>Record ID</TableHeader>
          <TableHeader>Farm</TableHeader>
          <TableHeader>Herd</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Session</TableHeader>
          <TableHeader>Volume (L)</TableHeader>
          <TableHeader>Price/L (KES)</TableHeader>
          <TableHeader>Total Value</TableHeader>
          <TableHeader>Buyer</TableHeader>
          <TableHeader>Quality</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr></thead>
        <tbody>
          {data.map((m, i) => (
            <tr key={m.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              <TableCell><span className="font-mono text-xs text-gray-500">{m.id}</span></TableCell>
              <TableCell><span className="font-medium text-gray-800">{m.farmName}</span></TableCell>
              <TableCell>{m.herdName}</TableCell>
              <TableCell>{m.date}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded-full ${m.session === 'Morning' ? 'bg-amber-100 text-amber-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {m.session}
                </span>
              </TableCell>
              <TableCell><span className="font-medium text-cyan-700">{m.volumeLitres}</span></TableCell>
              <TableCell>{m.pricePerLitre}</TableCell>
              <TableCell><span className="font-medium text-green-700">{fmt(m.totalValue)}</span></TableCell>
              <TableCell>{m.buyer}</TableCell>
              <TableCell><StatusBadge status={m.quality} /></TableCell>
              <TableCell><ActionButtons /></TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderSalesTable = () => {
    const data = salesData.filter(f =>
      f.farmName.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase()) ||
      f.buyer.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full">
        <thead><tr>
          <TableHeader>Sale ID</TableHeader>
          <TableHeader>Farm</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Item</TableHeader>
          <TableHeader>Qty</TableHeader>
          <TableHeader>Unit Price (KES)</TableHeader>
          <TableHeader>Total Amount</TableHeader>
          <TableHeader>Buyer</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr></thead>
        <tbody>
          {data.map((s, i) => (
            <tr key={s.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              <TableCell><span className="font-mono text-xs text-gray-500">{s.id}</span></TableCell>
              <TableCell><span className="font-medium text-gray-800">{s.farmName}</span></TableCell>
              <TableCell>{s.date}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  s.category === 'Milk' ? 'bg-cyan-100 text-cyan-700' :
                  s.category === 'Animal' ? 'bg-amber-100 text-amber-700' :
                  'bg-green-100 text-green-700'
                }`}>{s.category}</span>
              </TableCell>
              <TableCell>{s.item}</TableCell>
              <TableCell>{s.quantity} {s.unit}</TableCell>
              <TableCell>{fmt(s.unitPrice)}</TableCell>
              <TableCell><span className="font-medium text-green-700">{fmt(s.totalAmount)}</span></TableCell>
              <TableCell>{s.buyer}</TableCell>
              <TableCell><StatusBadge status={s.status} /></TableCell>
              <TableCell><ActionButtons /></TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderCostTable = () => {
    const data = costsData.filter(f =>
      f.farmName.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full">
        <thead><tr>
          <TableHeader>Cost ID</TableHeader>
          <TableHeader>Farm</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Sub-Category</TableHeader>
          <TableHeader>Description</TableHeader>
          <TableHeader>Qty</TableHeader>
          <TableHeader>Unit Cost (KES)</TableHeader>
          <TableHeader>Total Cost</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr></thead>
        <tbody>
          {data.map((c, i) => (
            <tr key={c.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              <TableCell><span className="font-mono text-xs text-gray-500">{c.id}</span></TableCell>
              <TableCell><span className="font-medium text-gray-800">{c.farmName}</span></TableCell>
              <TableCell>{c.date}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  c.category === 'Feeding' ? 'bg-green-100 text-green-700' :
                  c.category === 'Labor' ? 'bg-blue-100 text-blue-700' :
                  c.category === 'Breeding' ? 'bg-purple-100 text-purple-700' :
                  'bg-red-100 text-red-600'
                }`}>{c.category}</span>
              </TableCell>
              <TableCell>{c.subCategory}</TableCell>
              <TableCell className="max-w-[200px] truncate text-xs text-gray-500">{c.description}</TableCell>
              <TableCell>{c.quantity} {c.unit}</TableCell>
              <TableCell>{fmt(c.unitCost)}</TableCell>
              <TableCell><span className="font-medium text-red-600">{fmt(c.totalCost)}</span></TableCell>
              <TableCell><ActionButtons /></TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderAdvisoriesTable = () => {
    const data = advisoriesData.filter(f =>
      f.farmName.toLowerCase().includes(search.toLowerCase()) ||
      f.title.toLowerCase().includes(search.toLowerCase()) ||
      f.category.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <table className="w-full">
        <thead><tr>
          <TableHeader>ID</TableHeader>
          <TableHeader>Farm</TableHeader>
          <TableHeader>Farmer</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader>Category</TableHeader>
          <TableHeader>Priority</TableHeader>
          <TableHeader>Title</TableHeader>
          <TableHeader>Advisory</TableHeader>
          <TableHeader>Advisor</TableHeader>
          <TableHeader>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr></thead>
        <tbody>
          {data.map((a, i) => (
            <tr key={a.id} className={`border-t border-gray-100 ${i % 2 === 1 ? 'bg-gray-50/40' : ''}`}>
              <TableCell><span className="font-mono text-xs text-gray-500">{a.id}</span></TableCell>
              <TableCell><span className="font-medium text-gray-800">{a.farmName}</span></TableCell>
              <TableCell>{a.farmer}</TableCell>
              <TableCell>{a.date}</TableCell>
              <TableCell>
                <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">{a.category}</span>
              </TableCell>
              <TableCell><PriorityBadge priority={a.priority} /></TableCell>
              <TableCell className="max-w-[160px]">
                <p className="font-medium text-gray-800 text-xs truncate">{a.title}</p>
              </TableCell>
              <TableCell className="max-w-[220px]">
                <p className="text-xs text-gray-500 truncate" title={a.message}>{a.message}</p>
              </TableCell>
              <TableCell className="text-xs text-gray-600">{a.advisorName}</TableCell>
              <TableCell><StatusBadge status={a.status} /></TableCell>
              <TableCell><ActionButtons /></TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderTable = () => {
    switch (activeTab) {
      case 'farms': return renderFarmsTable();
      case 'herd': return renderHerdTable();
      case 'animals': return renderAnimalsTable();
      case 'milk': return renderMilkTable();
      case 'sales': return renderSalesTable();
      case 'cost': return renderCostTable();
      case 'advisories': return renderAdvisoriesTable();
      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-screen-2xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-gray-900 mb-1">Data Management</h1>
          <p className="text-gray-500 text-sm">Survey data — tabular view across all data types</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 bg-white shadow-sm">
            <Download className="h-4 w-4" /> Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium shadow-sm transition-colors"
          >
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex overflow-x-auto gap-1 bg-gray-100 rounded-xl p-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSearch(''); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-white text-green-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <span className={activeTab === tab.id ? 'text-green-600' : 'text-gray-400'}>{tab.icon}</span>
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeTab === tab.id ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search records..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <Filter className="h-4 w-4" /> Filter
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {renderTable()}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {tabs.find(t => t.id === activeTab)?.count ?? 0} records
            {search && ` (filtered)`}
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg bg-green-600 text-white">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddModal tab={activeTab} onClose={() => setShowAddModal(false)} />
      )}
    </div>
  );
}

function ActionButtons() {
  return (
    <div className="flex items-center gap-1">
      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
        <Edit2 className="h-3.5 w-3.5" />
      </button>
      <button className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AddModal({ tab, onClose }: { tab: Tab; onClose: () => void }) {
  const tabLabels: Record<Tab, string> = {
    farms: 'Farm', herd: 'Herd', animals: 'Animal',
    milk: 'Milk Production Record', sales: 'Sale Record',
    cost: 'Cost Record', advisories: 'Advisory',
  };
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-gray-800">Add {tabLabels[tab]}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 text-center">
            Form fields for <strong>{tabLabels[tab]}</strong> would appear here, connected to the backend data source.
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onClose} className="flex-1 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-medium transition-colors">
              Save Record
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
