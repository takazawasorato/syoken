'use client';

import { AnalysisResult } from '@/types';
import { exportToCSV } from '@/lib/csvExport';

interface ResultsDisplayProps {
  result: AnalysisResult;
  onExportToSheets: () => void;
  isExporting: boolean;
}

export default function ResultsDisplay({
  result,
  onExportToSheets,
  isExporting,
}: ResultsDisplayProps) {
  const handleCSVExport = () => {
    const exportData = {
      basicInfo: {
        address: result.address,
        latitude: result.coordinates.lat,
        longitude: result.coordinates.lng,
        category: '施設', // この値は親コンポーネントから渡す必要があります
        radius: 1, // この値も親コンポーネントから渡す必要があります
      },
      population: result.population,
      competitors: result.competitors.map((c) => ({
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

  return (
    <div className="space-y-6">
      {/* 基本情報 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">基本情報</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">住所</dt>
            <dd className="text-base text-gray-900">{result.address}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">座標</dt>
            <dd className="text-base text-gray-900">
              {result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}
            </dd>
          </div>
        </dl>
      </div>

      {/* 人口統計 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">人口統計</h3>
        <div className="mb-4">
          <span className="text-sm font-medium text-gray-500">総人口</span>
          <p className="text-3xl font-bold text-blue-600">
            {result.population.totalPopulation.toLocaleString()} 人
          </p>
        </div>

        {result.population.ageGroups && (
          <div className="mt-6">
            <h4 className="text-lg font-semibold text-gray-700 mb-3">年齢別人口</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                      年齢層
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      総数
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      男性
                    </th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                      女性
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(result.population.ageGroups).map(([age, counts]) => (
                    <tr key={age}>
                      <td className="px-4 py-2 text-sm text-gray-900">{age}</td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {counts.total.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
                        {counts.male.toLocaleString()}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900 text-right">
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

      {/* 競合施設 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          競合施設 ({result.competitors.length}件)
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                  施設名
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  距離(m)
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  評価
                </th>
                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                  レビュー数
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {result.competitors.slice(0, 20).map((place) => (
                <tr key={place.place_id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm text-gray-900">{place.name}</td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {place.distance?.toLocaleString() || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {place.rating || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900 text-right">
                    {place.user_ratings_total?.toLocaleString() || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* エクスポートボタン */}
      <div className="flex gap-4">
        <button
          onClick={handleCSVExport}
          className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 transition-colors font-medium"
        >
          CSVでダウンロード
        </button>
        <button
          onClick={onExportToSheets}
          disabled={isExporting}
          className="flex-1 bg-purple-600 text-white py-3 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isExporting ? 'エクスポート中...' : 'Googleスプレッドシートへ出力'}
        </button>
      </div>
    </div>
  );
}
