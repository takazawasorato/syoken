'use client';

import { AnalysisResult, DualAnalysisResult } from '@/types';
import { exportToCSV } from '@/lib/csvExport';
import { memo, useState, useMemo } from 'react';

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  dualResult?: DualAnalysisResult | null;
  onExportToSheets: () => void;
  isExporting: boolean;
  category?: string;
  rangeType: 'circle' | 'driveTime' | 'both';
  rangeParams: {
    radius1?: number;
    radius2?: number;
    radius3?: number;
    time1?: number;
    time2?: number;
    time3?: number;
    speed?: number;
    travelMode?: string;
  };
}

// Simple Bar Chart Component
const BarChart = memo(({ data, colors }: { data: { label: string; value: number; color: string }[]; colors?: string[] }) => {
  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={item.label} className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="font-medium text-gray-700">{item.label}</span>
            <span className="font-bold text-gray-900">{item.value.toLocaleString()}</span>
          </div>
          <div className="h-8 bg-gray-100 rounded-lg overflow-hidden relative">
            <div
              className="h-full rounded-lg transition-all duration-500 ease-out flex items-center justify-end pr-3"
              style={{
                width: `${(item.value / maxValue) * 100}%`,
                background: item.color || `hsl(${210 + index * 30}, 70%, 50%)`
              }}
            >
              <span className="text-xs font-bold text-white drop-shadow">
                {((item.value / maxValue) * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});
BarChart.displayName = 'BarChart';

// Pie Chart Component using SVG
const PieChart = memo(({ data }: { data: { label: string; value: number; color: string }[] }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  const slices = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;
    currentAngle = endAngle;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = 50 + 40 * Math.cos(startRad);
    const y1 = 50 + 40 * Math.sin(startRad);
    const x2 = 50 + 40 * Math.cos(endRad);
    const y2 = 50 + 40 * Math.sin(endRad);

    const largeArc = angle > 180 ? 1 : 0;

    return {
      ...item,
      path: `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`,
      percentage
    };
  });

  return (
    <div className="flex items-center gap-6">
      <svg viewBox="0 0 100 100" className="w-48 h-48">
        {slices.map((slice, index) => (
          <g key={index}>
            <path
              d={slice.path}
              fill={slice.color}
              className="transition-all duration-300 hover:opacity-80"
            />
          </g>
        ))}
      </svg>
      <div className="space-y-2">
        {slices.map((slice, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded" style={{ background: slice.color }}></div>
            <span className="text-gray-700">{slice.label}</span>
            <span className="font-bold text-gray-900">{slice.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
});
PieChart.displayName = 'PieChart';

const ResultsDisplay = ({
  result,
  dualResult,
  onExportToSheets,
  isExporting,
  category = '施設',
  rangeType,
  rangeParams,
}: ResultsDisplayProps) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'demographics' | 'competitors'>('overview');
  const [selectedRange, setSelectedRange] = useState<'circle' | 'driveTime'>('circle');

  // 両方モードの場合、dualResultを使用、それ以外は result を使用
  const currentResult = dualResult
    ? (selectedRange === 'circle' ? {
        address: dualResult.address,
        coordinates: dualResult.coordinates,
        population: dualResult.circle.population,
        competitors: dualResult.circle.competitors,
      } : {
        address: dualResult.address,
        coordinates: dualResult.coordinates,
        population: dualResult.driveTime.population,
        competitors: dualResult.driveTime.competitors,
      })
    : result;

  if (!currentResult) return null;
  // 範囲の説明を生成
  const getRangeDescription = () => {
    if (rangeType === 'both') {
      if (dualResult) {
        if (selectedRange === 'circle') {
          return `円形: ${dualResult.circle.params.radius1}m / ${dualResult.circle.params.radius2}m / ${dualResult.circle.params.radius3}m`;
        } else {
          return `到達圏: ${dualResult.driveTime.params.time1}分 / ${dualResult.driveTime.params.time2}分 / ${dualResult.driveTime.params.time3}分 (${dualResult.driveTime.params.speed}km/h)`;
        }
      }
      return '';
    } else if (rangeType === 'circle') {
      return `円形: ${rangeParams.radius1}m / ${rangeParams.radius2}m / ${rangeParams.radius3}m`;
    } else {
      return `到達圏: ${rangeParams.time1}分 / ${rangeParams.time2}分 / ${rangeParams.time3}分 (${rangeParams.speed}km/h)`;
    }
  };

  const handleCSVExport = () => {
    const exportData = {
      basicInfo: {
        address: currentResult.address,
        latitude: currentResult.coordinates.lat,
        longitude: currentResult.coordinates.lng,
        category,
        rangeType: rangeType === 'both' ? selectedRange : rangeType,
        rangeDescription: getRangeDescription(),
      },
      population: currentResult.population,
      competitors: currentResult.competitors.map((c) => ({
        name: c.name,
        address: c.vicinity || '',
        distance: c.distance || 0,
        rating: c.rating,
        userRatingsTotal: c.user_ratings_total,
        placeId: c.place_id,
      })),
    };

    exportToCSV(exportData);
  };

  const handleRichReportExport = async () => {
    try {
      const exportData: any = {
        basicInfo: {
          address: currentResult.address,
          latitude: currentResult.coordinates.lat,
          longitude: currentResult.coordinates.lng,
          category,
          rangeType,
        },
      };

      // 両方モードの場合、両方のデータを送信
      if (rangeType === 'both' && dualResult) {
        exportData.circle = {
          rangeDescription: `円形: ${dualResult.circle.params.radius1}m / ${dualResult.circle.params.radius2}m / ${dualResult.circle.params.radius3}m`,
          rangeParams: dualResult.circle.params,
          population: dualResult.circle.population,
          competitors: dualResult.circle.competitors.map((c) => ({
            name: c.name,
            address: c.vicinity || '',
            distance: c.distance || 0,
            rating: c.rating,
            userRatingsTotal: c.user_ratings_total,
            placeId: c.place_id,
            url: c.url,
            area: c.area,
          })),
          rawData: dualResult.circle.population.rawData,
        };
        exportData.driveTime = {
          rangeDescription: `到達圏: ${dualResult.driveTime.params.time1}分 / ${dualResult.driveTime.params.time2}分 / ${dualResult.driveTime.params.time3}分 (${dualResult.driveTime.params.speed}km/h)`,
          rangeParams: dualResult.driveTime.params,
          population: dualResult.driveTime.population,
          competitors: dualResult.driveTime.competitors.map((c) => ({
            name: c.name,
            address: c.vicinity || '',
            distance: c.distance || 0,
            rating: c.rating,
            userRatingsTotal: c.user_ratings_total,
            placeId: c.place_id,
            url: c.url,
            area: c.area,
          })),
          rawData: dualResult.driveTime.population.rawData,
        };
      } else {
        // 通常モード
        exportData.rangeDescription = getRangeDescription();
        exportData.rangeParams = rangeParams;
        exportData.population = currentResult.population;
        exportData.competitors = currentResult.competitors.map((c) => ({
          name: c.name,
          address: c.vicinity || '',
          distance: c.distance || 0,
          rating: c.rating,
          userRatingsTotal: c.user_ratings_total,
          placeId: c.place_id,
          url: c.url,
          area: c.area,
        }));
        exportData.rawData = currentResult.population.rawData;
      }

      const response = await fetch('/api/export/richreport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportData),
      });

      if (!response.ok) {
        throw new Error('レポートの生成に失敗しました');
      }

      // Excelファイルをダウンロード
      const blob = await response.blob();

      // Content-Dispositionヘッダーからファイル名を取得
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `RichReport_${Date.now()}.xlsx`; // デフォルト

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename\*=UTF-8''(.+)|filename="(.+)"/);
        if (filenameMatch) {
          filename = decodeURIComponent(filenameMatch[1] || filenameMatch[2]);
        }
      }

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('RichReport export error:', error);
      alert('レポートの生成に失敗しました');
    }
  };

  // Prepare chart data
  const ageChartData = useMemo(() => {
    if (!currentResult.population.ageGroups) return [];
    return Object.entries(currentResult.population.ageGroups).map(([age, counts]) => ({
      label: age,
      value: counts.total,
      color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));
  }, [currentResult.population.ageGroups]);

  const genderChartData = useMemo(() => {
    if (!currentResult.population.ageGroups) return [];
    const totals = Object.values(currentResult.population.ageGroups).reduce(
      (acc, counts) => ({
        male: acc.male + counts.male,
        female: acc.female + counts.female,
      }),
      { male: 0, female: 0 }
    );
    return [
      { label: '男性', value: totals.male, color: '#3B82F6' },
      { label: '女性', value: totals.female, color: '#EC4899' },
    ];
  }, [currentResult.population.ageGroups]);

  const competitorsByArea = useMemo(() => [
    { label: '1次エリア', value: currentResult.competitors.filter(p => p.area === 1).length, color: '#3B82F6' },
    { label: '2次エリア', value: currentResult.competitors.filter(p => p.area === 2).length, color: '#10B981' },
    { label: '3次エリア', value: currentResult.competitors.filter(p => p.area === 3).length, color: '#F59E0B' },
  ], [currentResult.competitors]);

  return (
    <div className="space-y-6">
      {/* 両方モードの切り替えUI */}
      {rangeType === 'both' && dualResult && (
        <div className="bg-white p-4 rounded-lg shadow-md border-2 border-purple-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-purple-800">表示範囲の切り替え</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedRange('circle')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedRange === 'circle'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                円形範囲
              </button>
              <button
                onClick={() => setSelectedRange('driveTime')}
                className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                  selectedRange === 'driveTime'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                到達圏
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {selectedRange === 'circle'
              ? `円形: ${dualResult.circle.params.radius1}m / ${dualResult.circle.params.radius2}m / ${dualResult.circle.params.radius3}m`
              : `到達圏: ${dualResult.driveTime.params.time1}分 / ${dualResult.driveTime.params.time2}分 / ${dualResult.driveTime.params.time3}分 (${dualResult.driveTime.params.speed}km/h, ${dualResult.driveTime.params.travelMode === 'car' ? '車' : '徒歩'})`}
          </p>
        </div>
      )}

      {/* Income Data Card (if available) */}
      {(result?.incomeData || dualResult?.incomeData) && (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl border-2 border-orange-200 shadow-md">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-500 p-3 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">市区町村所得データ</h3>
                <p className="text-sm text-gray-600">
                  {(result?.incomeData || dualResult?.incomeData)?.prefectureName} {(result?.incomeData || dualResult?.incomeData)?.municipalityName}
                </p>
              </div>
            </div>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold">
              {(result?.incomeData || dualResult?.incomeData)?.dataYear}年度
            </span>
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <dt className="text-xs font-semibold text-gray-600 mb-1">納税義務者数</dt>
              <dd className="text-2xl font-bold text-gray-900">
                {(result?.incomeData || dualResult?.incomeData)?.taxpayerCount?.toLocaleString() || 'N/A'}
                {(result?.incomeData || dualResult?.incomeData)?.taxpayerCount && (
                  <span className="text-sm font-normal text-gray-600 ml-1">人</span>
                )}
              </dd>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <dt className="text-xs font-semibold text-gray-600 mb-1">総所得金額</dt>
              <dd className="text-2xl font-bold text-gray-900">
                {(result?.incomeData || dualResult?.incomeData)?.totalIncome
                  ? `${((result?.incomeData || dualResult?.incomeData)?.totalIncome! / 1000000).toFixed(1)}`
                  : 'N/A'}
                {(result?.incomeData || dualResult?.incomeData)?.totalIncome && (
                  <span className="text-sm font-normal text-gray-600 ml-1">億円</span>
                )}
              </dd>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <dt className="text-xs font-semibold text-gray-600 mb-1">一人当たり所得</dt>
              <dd className="text-2xl font-bold text-orange-600">
                {(result?.incomeData || dualResult?.incomeData)?.averageIncome?.toLocaleString() || 'N/A'}
                {(result?.incomeData || dualResult?.incomeData)?.averageIncome && (
                  <span className="text-sm font-normal text-gray-600 ml-1">千円</span>
                )}
              </dd>
            </div>
          </dl>
          <p className="text-xs text-gray-500 mt-3">
            ※出典: 総務省「市町村税課税状況等の調」
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Population Card */}
        <div className="bg-primary-600 p-6 rounded-lg shadow-md text-white transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-primary-100 text-sm font-medium mb-1">総人口</p>
              <p className="text-4xl font-bold">{currentResult.population.totalPopulation.toLocaleString()}</p>
              <p className="text-primary-100 text-xs mt-1">人</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Competitors Card */}
        <div className="bg-success-600 p-6 rounded-lg shadow-md text-white transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-success-100 text-sm font-medium mb-1">競合施設</p>
              <p className="text-4xl font-bold">{currentResult.competitors.length}</p>
              <p className="text-success-100 text-xs mt-1">件</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>

        {/* Category Card */}
        <div className="bg-gray-700 p-6 rounded-lg shadow-md text-white transition-all duration-200 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium mb-1">カテゴリ</p>
              <p className="text-2xl font-bold">{category}</p>
              <p className="text-gray-300 text-xs mt-1">{getRangeDescription()}</p>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="card overflow-hidden p-0">
        <div className="border-b border-gray-200">
          <nav className="flex" role="tablist" aria-label="分析結果タブ">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'overview'
                  ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              role="tab"
              aria-selected={activeTab === 'overview'}
              aria-controls="overview-panel"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                概要
              </div>
            </button>
            <button
              onClick={() => setActiveTab('demographics')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'demographics'
                  ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              role="tab"
              aria-selected={activeTab === 'demographics'}
              aria-controls="demographics-panel"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                人口統計
              </div>
            </button>
            <button
              onClick={() => setActiveTab('competitors')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === 'competitors'
                  ? 'bg-primary-50 text-primary-700 border-b-2 border-primary-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
              role="tab"
              aria-selected={activeTab === 'competitors'}
              aria-controls="competitors-panel"
            >
              <div className="flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                競合施設
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div id="overview-panel" role="tabpanel" aria-labelledby="overview-tab" className="space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  基本情報
                </h3>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-semibold text-gray-600 mb-1">住所</dt>
                    <dd className="text-base text-gray-900">{currentResult.address}</dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <dt className="text-sm font-semibold text-gray-600 mb-1">座標</dt>
                    <dd className="text-base text-gray-900 font-mono">
                      {currentResult.coordinates.lat.toFixed(6)}, {currentResult.coordinates.lng.toFixed(6)}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  エリア別競合施設分布
                </h3>
                <BarChart data={competitorsByArea} />
              </div>
            </div>
          )}

          {/* Demographics Tab */}
          {activeTab === 'demographics' && (
            <div id="demographics-panel" role="tabpanel" aria-labelledby="demographics-tab" className="space-y-6 animate-fade-in">
              <div className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  性別分布
                </h3>
                {genderChartData.length > 0 && <PieChart data={genderChartData} />}
              </div>

              {currentResult.population.ageGroups && (
                <div className="bg-white p-6 rounded-xl border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    年齢別人口
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            年齢層
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                            総数
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                            男性
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                            女性
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(currentResult.population.ageGroups).map(([age, counts], index) => (
                          <tr key={age} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{age}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-semibold">
                              {counts.total.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 text-right font-medium">
                              {counts.male.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600 text-right font-medium">
                              {counts.female.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Competitors Tab */}
          {activeTab === 'competitors' && (
            <div id="competitors-panel" role="tabpanel" aria-labelledby="competitors-tab" className="space-y-6 animate-fade-in">
              {[1, 2, 3].map((areaNum) => {
                const areaPlaces = currentResult.competitors.filter(p => p.area === areaNum);
                if (areaPlaces.length === 0) return null;

                const areaColors = {
                  1: {
                    bg: 'bg-blue-50',
                    border: 'border-blue-300',
                    text: 'text-blue-800',
                    gradient: 'from-blue-500 to-blue-600',
                    badgeBg: 'bg-blue-100',
                    badgeText: 'text-blue-700'
                  },
                  2: {
                    bg: 'bg-green-50',
                    border: 'border-green-300',
                    text: 'text-green-800',
                    gradient: 'from-green-500 to-green-600',
                    badgeBg: 'bg-green-100',
                    badgeText: 'text-green-700'
                  },
                  3: {
                    bg: 'bg-yellow-50',
                    border: 'border-yellow-300',
                    text: 'text-yellow-800',
                    gradient: 'from-yellow-500 to-yellow-600',
                    badgeBg: 'bg-yellow-100',
                    badgeText: 'text-yellow-700'
                  },
                };
                const colors = areaColors[areaNum as 1 | 2 | 3];

                return (
                  <div key={areaNum} className="bg-white p-6 rounded-xl border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold flex items-center gap-3">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r ${colors.gradient} text-white text-sm font-bold`}>
                          {areaNum}
                        </span>
                        <span className={colors.text}>{areaNum}次エリア</span>
                      </h4>
                      <span className={`${colors.badgeBg} ${colors.badgeText} px-4 py-2 rounded-full text-sm font-bold`}>
                        {areaPlaces.length}件
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className={`${colors.bg}`}>
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                              施設名
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                              距離
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                              評価
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                              レビュー数
                            </th>
                            <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">
                              リンク
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {areaPlaces.map((place, index) => (
                            <tr key={place.place_id} className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {place.name}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-900 text-right font-semibold">
                                {place.distance ? `${place.distance.toLocaleString()}m` : 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-sm text-right">
                                {place.rating ? (
                                  <div className="flex items-center justify-end gap-1">
                                    <span className="font-bold text-yellow-600">{place.rating}</span>
                                    <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">N/A</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600 text-right font-medium">
                                {place.user_ratings_total?.toLocaleString() || 'N/A'}
                              </td>
                              <td className="px-6 py-4 text-sm text-center">
                                {place.url && (
                                  <a
                                    href={place.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                                    aria-label={`${place.name}の地図を開く`}
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    地図
                                  </a>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={handleCSVExport}
          className="btn-secondary py-4 px-6 flex items-center justify-center gap-2"
          aria-label="CSVファイルをダウンロード"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          CSVダウンロード
        </button>
        <button
          onClick={handleRichReportExport}
          className="btn-primary py-4 px-6 flex items-center justify-center gap-2"
          aria-label="Excelレポートをダウンロード"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Excelレポート
        </button>
        <button
          onClick={onExportToSheets}
          disabled={isExporting}
          className={`py-4 px-6 flex items-center justify-center gap-2 ${
            isExporting
              ? 'btn-secondary opacity-60 cursor-not-allowed'
              : 'btn-secondary'
          }`}
          aria-label={isExporting ? 'エクスポート中です' : 'Googleスプレッドシートにエクスポート'}
        >
          {isExporting ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              エクスポート中...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              スプレッドシート
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default memo(ResultsDisplay);
