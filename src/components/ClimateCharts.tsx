import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area } from 'recharts';
import { cn } from '../lib/utils';

interface ChartProps {
  data: any[];
  className?: string;
}

export const TemperatureTrendChart: React.FC<ChartProps> = ({ data, className }) => {
  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100", className)}>
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        Global Temperature Trend <span className="text-xs font-normal text-gray-500">(1974 - 2024)</span>
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="temperature" 
              stroke="#ef4444" 
              strokeWidth={3} 
              dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
              name="Temp (°C)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const CO2CorrelationChart: React.FC<ChartProps> = ({ data, className }) => {
  return (
    <div className={cn("bg-white p-6 rounded-2xl shadow-sm border border-gray-100", className)}>
      <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
        CO2 Concentration Patterns <span className="text-xs font-normal text-gray-500">(ppm)</span>
      </h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorCO2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Area 
              type="monotone" 
              dataKey="co2" 
              stroke="#3b82f6" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCO2)" 
              name="CO2 (ppm)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
