'use client';

import { useState } from 'react';
import AnalysisForm from '@/components/AnalysisForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { AnalysisResult } from '@/types';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analysisParams, setAnalysisParams] = useState<{
    category: string;
    radiusKm: number;
  } | null>(null);

  const handleAnalysis = async (data: {
    address: string;
    category: string;
    radiusKm: number;
  }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setAnalysisParams({ category: data.category, radiusKm: data.radiusKm });

    try {
      // 1. 住所を緯度経度に変換
      const geocodingResponse = await fetch('/api/geocoding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: data.address }),
      });

      if (!geocodingResponse.ok) {
        const errorData = await geocodingResponse.json();
        throw new Error(errorData.error || '住所の変換に失敗しました');
      }

      const geocodingData = await geocodingResponse.json();

      // 2. 人口統計データと競合施設を並行して取得
      const [statsResponse, placesResponse] = await Promise.all([
        fetch('/api/stats', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: geocodingData.lat,
            lng: geocodingData.lng,
            radiusKm: data.radiusKm,
          }),
        }),
        fetch('/api/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            lat: geocodingData.lat,
            lng: geocodingData.lng,
            radiusKm: data.radiusKm,
            keyword: data.category,
          }),
        }),
      ]);

      if (!statsResponse.ok) {
        const errorData = await statsResponse.json();
        throw new Error(errorData.error || '人口統計データの取得に失敗しました');
      }

      if (!placesResponse.ok) {
        const errorData = await placesResponse.json();
        throw new Error(errorData.error || '施設情報の取得に失敗しました');
      }

      const statsData = await statsResponse.json();
      const placesData = await placesResponse.json();

      // 結果を設定
      setResult({
        address: geocodingData.formatted_address,
        coordinates: {
          lat: geocodingData.lat,
          lng: geocodingData.lng,
        },
        population: statsData,
        competitors: placesData.results,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析中にエラーが発生しました');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToSheets = async () => {
    if (!result || !analysisParams) return;

    setIsExporting(true);
    try {
      const exportData = {
        basicInfo: {
          address: result.address,
          latitude: result.coordinates.lat,
          longitude: result.coordinates.lng,
          category: analysisParams.category,
          radius: analysisParams.radiusKm,
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

      const response = await fetch('/api/export/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'エクスポートに失敗しました');
      }

      const data = await response.json();

      // スプレッドシートを新しいタブで開く
      if (data.spreadsheetUrl) {
        window.open(data.spreadsheetUrl, '_blank');
      }

      alert('Googleスプレッドシートへのエクスポートが完了しました');
    } catch (err) {
      alert(
        err instanceof Error
          ? err.message
          : 'スプレッドシートへのエクスポートに失敗しました'
      );
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">
            商圏分析アプリ
          </h1>
          <p className="text-center text-gray-600 mt-2">
            住所と施設カテゴリを入力して、周辺の人口統計と競合情報を分析します
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <AnalysisForm onSubmit={handleAnalysis} isLoading={isLoading} />
          </div>

          <div className="lg:col-span-2">
            {isLoading && (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">分析中...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
                <p className="font-medium">エラーが発生しました</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
            )}

            {result && !isLoading && (
              <ResultsDisplay
                result={result}
                onExportToSheets={handleExportToSheets}
                isExporting={isExporting}
              />
            )}

            {!result && !isLoading && !error && (
              <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
                <p>左のフォームから分析を開始してください</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
