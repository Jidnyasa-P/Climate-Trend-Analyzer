import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  Search, 
  LayoutDashboard, 
  Database, 
  Settings,
  BrainCircuit,
  ChevronRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { TemperatureTrendChart, CO2CorrelationChart } from './components/ClimateCharts';
import { StatsCard } from './components/StatsCard';

interface ClimateData {
  year: number;
  temperature: number;
  co2: number;
  rainfall: number;
}

interface AIAnalysis {
  trend: string;
  anomalies: string;
  prediction: string;
  recommendation: string;
}

export default function App() {
  const [data, setData] = useState<ClimateData[]>([]);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetch('/api/climate-data')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  const runAIAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ climateData: data.slice(-10) }) // Send last 10 years for analysis
      });
      const result = await res.json();
      setAnalysis(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || data.length < 2) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">Initializing Climate Telemetry...</p>
        </div>
      </div>
    );
  }

  const currentStats = data[data.length - 1];
  const lastYearStats = data[data.length - 2];
  const tempDiff = (currentStats.temperature - lastYearStats.temperature).toFixed(2);
  const co2Diff = (currentStats.co2 - lastYearStats.co2).toFixed(1);

  const renderValue = (val: any) => {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return val.toString();
    if (val === null || val === undefined) return '';
    return JSON.stringify(val);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-3 text-blue-600 tracking-tighter">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white">
              <BarChart3 className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl">CTA-Engine</span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <LayoutDashboard className="w-4 h-4" /> Dashboard
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50">
            <Database className="w-4 h-4" /> Dataset
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50">
            <Settings className="w-4 h-4" /> Configuration
          </button>
        </nav>

        <div className="p-4 m-4 bg-slate-900 rounded-2xl text-white">
          <div className="flex items-center gap-2 mb-2">
            <BrainCircuit className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Analysis Tool</span>
          </div>
          <p className="text-sm font-medium mb-4 italic opacity-80">"How is our planet changing today?"</p>
          <button 
            onClick={runAIAnalysis}
            disabled={analyzing}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
          >
            {analyzing ? 'Analyzing...' : 'Run GenAI Analysis'}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Climate Pulse</h2>
            <p className="text-slate-500 mt-1 italic">Real-time simulation of global environmental health indicators.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search telemetry..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all w-64"
              />
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Global Temp" 
            value={`${currentStats.temperature}°C`} 
            icon={Thermometer} 
            trend={`+${tempDiff}°C vs last yr`}
            trendType="up"
            colorClass="bg-red-100 text-red-600"
          />
          <StatsCard 
            title="CO2 Concentration" 
            value={`${currentStats.co2} ppm`} 
            icon={Wind} 
            trend={`+${co2Diff} ppm`}
            trendType="up"
            colorClass="bg-blue-100 text-blue-600"
          />
          <StatsCard 
            title="Annual Rainfall" 
            value={`${currentStats.rainfall} mm`} 
            icon={Droplets} 
            trend="Stable"
            trendType="neutral"
            colorClass="bg-emerald-100 text-emerald-600"
          />
          <StatsCard 
            title="Anomaly Index" 
            value="Moderate" 
            icon={AlertTriangle} 
            trend="High Variance"
            trendType="up"
            colorClass="bg-amber-100 text-amber-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <TemperatureTrendChart data={data} />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <CO2CorrelationChart data={data} />
          </motion.div>
        </div>

        {/* AI Insight Section */}
        <AnimatePresence>
          {analysis && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white border-2 border-blue-100 rounded-3xl p-8 shadow-xl shadow-blue-500/5 mb-8 overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 p-4 bg-blue-50 text-blue-600 rounded-bl-3xl">
                <Cpu className="w-8 h-8 opacity-20" />
              </div>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-xl text-white shadow-lg shadow-blue-200">
                  <BrainCircuit className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">AI Analytical Engine Report</h3>
                  <p className="text-sm text-slate-500">Processed by Gemini 1.5 Flash</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" /> Observed Trend
                    </h4>
                    <p className="text-slate-700 leading-relaxed font-medium">{renderValue(analysis.trend)}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600 mb-2 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" /> Anomaly Indicators
                    </h4>
                    <p className="text-slate-700 leading-relaxed font-medium">{renderValue(analysis.anomalies)}</p>
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-900 mb-2">Decadal Forecast</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{renderValue(analysis.prediction)}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600 mb-2 font-mono">Expert Recommendation</h4>
                    <p className="text-slate-900 text-sm font-semibold">{renderValue(analysis.recommendation)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer info for GitHub proof */}
        <footer className="mt-12 pt-8 border-t border-slate-200 text-center">
          <p className="text-slate-400 text-xs font-medium uppercase tracking-[0.3em]">
            Climate Trend Analyzer System &copy; 2024 | Powered by Satellite Telemetry Simulation
          </p>
        </footer>
      </main>
    </div>
  );
}
