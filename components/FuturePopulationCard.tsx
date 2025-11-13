'use client';

import { FuturePopulationData } from '@/types';
import { memo, useMemo } from 'react';

interface FuturePopulationCardProps {
  data: FuturePopulationData;
}

// Simple Line Chart Component
const LineChart = memo(({ data }: { data: { year: number; population: number; index: number }[] }) => {
  const maxPopulation = Math.max(...data.map(d => d.population));
  const minPopulation = Math.min(...data.map(d => d.population));
  const range = maxPopulation - minPopulation;

  // SVG dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Calculate points
  const points = data.map((item, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - ((item.population - minPopulation) / range) * chartHeight;
    return { x, y, ...item };
  });

  // Create path for line
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minWidth: '600px' }}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padding + chartHeight * (1 - ratio);
          const value = minPopulation + range * ratio;
          return (
            <g key={ratio}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="#E5E7EB"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={y + 4}
                textAnchor="end"
                fontSize="12"
                fill="#6B7280"
              >
                {(value / 1000).toFixed(0)}千
              </text>
            </g>
          );
        })}

        {/* Line path */}
        <path
          d={linePath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points */}
        {points.map((point, index) => (
          <g key={index}>
            {/* Circle */}
            <circle
              cx={point.x}
              cy={point.y}
              r="6"
              fill={point.year === 2020 ? '#EF4444' : '#3B82F6'}
              stroke="white"
              strokeWidth="2"
            />
            {/* Year label */}
            <text
              x={point.x}
              y={height - padding + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#374151"
              fontWeight={point.year === 2020 ? 'bold' : 'normal'}
            >
              {point.year}
            </text>
          </g>
        ))}

        {/* 2020年 baseline indicator */}
        {points.find(p => p.year === 2020) && (
          <line
            x1={points.find(p => p.year === 2020)!.x}
            y1={padding}
            x2={points.find(p => p.year === 2020)!.x}
            y2={height - padding}
            stroke="#EF4444"
            strokeWidth="2"
            strokeDasharray="4 4"
            opacity="0.5"
          />
        )}
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-gray-700">実績値（2020年）</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span className="text-gray-700">推計値（2025～2050年）</span>
        </div>
      </div>
    </div>
  );
});
LineChart.displayName = 'LineChart';

const FuturePopulationCard = ({ data }: FuturePopulationCardProps) => {
  // トレンド判定
  const isDecreasing = data.trends.changeRate2020to2050 < 0;
  const changeRateAbs = Math.abs(data.trends.changeRate2020to2050);

  // 現在人口（2020年）と2050年予測を取得
  const population2020 = data.timeSeries.find(t => t.year === 2020)?.population || 0;
  const population2050 = data.timeSeries.find(t => t.year === 2050)?.population || 0;

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200 shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-500 p-3 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">将来人口推計</h3>
            <p className="text-sm text-gray-600">
              {data.prefecture} {data.name}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          isDecreasing
            ? 'bg-orange-100 text-orange-800'
            : 'bg-green-100 text-green-800'
        }`}>
          {isDecreasing ? '人口減少' : '人口増加'}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <dt className="text-xs font-semibold text-gray-600 mb-1">2020年人口（実績）</dt>
          <dd className="text-2xl font-bold text-gray-900">
            {(population2020 / 1000).toFixed(1)}
            <span className="text-sm font-normal text-gray-600 ml-1">千人</span>
          </dd>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <dt className="text-xs font-semibold text-gray-600 mb-1">2050年推計人口</dt>
          <dd className="text-2xl font-bold text-indigo-600">
            {(population2050 / 1000).toFixed(1)}
            <span className="text-sm font-normal text-gray-600 ml-1">千人</span>
          </dd>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <dt className="text-xs font-semibold text-gray-600 mb-1">変化率（2020→2050）</dt>
          <dd className={`text-2xl font-bold ${isDecreasing ? 'text-orange-600' : 'text-green-600'}`}>
            {isDecreasing ? '-' : '+'}{changeRateAbs.toFixed(1)}
            <span className="text-sm font-normal text-gray-600 ml-1">%</span>
          </dd>
        </div>
      </div>

      {/* Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-4">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          人口推移（2020年～2050年）
        </h4>
        <LineChart data={data.timeSeries} />
      </div>

      {/* Data Table */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          詳細データ
        </h4>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  年
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  人口（人）
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  指数（2020年=100）
                </th>
                <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                  前期比
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.timeSeries.map((item, index) => {
                const prevPopulation = index > 0 ? data.timeSeries[index - 1].population : item.population;
                const changeRate = ((item.population - prevPopulation) / prevPopulation) * 100;
                const isBaseline = item.year === 2020;

                return (
                  <tr
                    key={item.year}
                    className={`hover:bg-gray-50 transition-colors ${
                      isBaseline
                        ? 'bg-red-50 font-semibold'
                        : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.year}年
                      {isBaseline && (
                        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
                          基準
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                      {item.population.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      {item.index.toFixed(2)}
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                      index === 0
                        ? 'text-gray-400'
                        : changeRate >= 0
                          ? 'text-green-600'
                          : 'text-orange-600'
                    }`}>
                      {index === 0 ? '-' : `${changeRate >= 0 ? '+' : ''}${changeRate.toFixed(2)}%`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-indigo-200">
        <div className="flex items-start gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p>※出典: 国立社会保障・人口問題研究所「日本の地域別将来推計人口（2023年推計）」</p>
            <p className="mt-1">※2020年は国勢調査による実績値、2025年以降は推計値です。</p>
            <p className="mt-1">※ピーク年: {data.trends.peakYear}年（{(data.trends.peakPopulation / 1000).toFixed(1)}千人）</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(FuturePopulationCard);
