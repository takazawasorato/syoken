'use client';

import { useState, useCallback } from 'react';
import AnalysisForm from '@/components/AnalysisForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import { AnalysisResult, DualAnalysisResult } from '@/types';
import { getMockAnalysisResult, getMockDualAnalysisResult, isDevelopmentMode } from '@/lib/mockData';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [dualResult, setDualResult] = useState<DualAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [analysisParams, setAnalysisParams] = useState<{
    category: string;
    rangeType: 'circle' | 'driveTime' | 'both';
    radius1?: number;
    radius2?: number;
    radius3?: number;
    time1?: number;
    time2?: number;
    time3?: number;
    speed?: number;
    travelMode?: string;
  } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  const handleAnalysis = async (data: {
    address: string;
    category: string;
    rangeType: 'circle' | 'driveTime' | 'both';
    radius1?: number;
    radius2?: number;
    radius3?: number;
    time1?: number;
    time2?: number;
    time3?: number;
    speed?: number;
    travelMode?: string;
  }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setDualResult(null);
    setAnalysisParams({
      category: data.category,
      rangeType: data.rangeType,
      radius1: data.radius1,
      radius2: data.radius2,
      radius3: data.radius3,
      time1: data.time1,
      time2: data.time2,
      time3: data.time3,
      speed: data.speed,
      travelMode: data.travelMode,
    });

    try {
      // 開発モード: モックデータを使用
      if (isDevelopmentMode) {
        console.log('🔧 開発モード: モックデータを使用しています');
        showToast('モックデータを使用して分析を実行しています', 'info');
        // UIテスト用に少し遅延を追加
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // 範囲タイプに応じて適切なモックデータを設定
        if (data.rangeType === 'both') {
          // 両方モードの場合
          setDualResult(getMockDualAnalysisResult());
        } else {
          // 単一モード（circle または driveTime）の場合
          setResult(getMockAnalysisResult());
        }

        showToast('分析が完了しました', 'success');
        return;
      }

      // 本番モード: 実際のAPI呼び出し
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

      // 所得データを取得（エラーは無視して続行）
      let incomeData = null;
      try {
        const incomeResponse = await fetch('/api/income', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: data.address }),
        });
        if (incomeResponse.ok) {
          const incomeResult = await incomeResponse.json();
          incomeData = incomeResult.data;
        }
      } catch (error) {
        console.warn('所得データの取得に失敗しました:', error);
      }

      // 将来人口データを取得（エラーは無視して続行）
      let futurePopulationData = null;
      try {
        const futurePopResponse = await fetch('/api/future-population', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ geocodingResult: geocodingData }),
        });
        if (futurePopResponse.ok) {
          const futurePopResult = await futurePopResponse.json();
          futurePopulationData = futurePopResult.data;
        }
      } catch (error) {
        console.warn('将来人口データの取得に失敗しました:', error);
      }

      // 「両方」モードの場合、2回分析を実行
      if (data.rangeType === 'both') {
        // 円形範囲での分析
        const circleStatsPayload = {
          lat: geocodingData.lat,
          lng: geocodingData.lng,
          rangeType: 'circle' as const,
          radius1: data.radius1,
          radius2: data.radius2,
          radius3: data.radius3,
        };

        const circlePlacesPayload = {
          lat: geocodingData.lat,
          lng: geocodingData.lng,
          radiusKm: Math.max((data.radius1 || 0) / 1000, (data.radius2 || 0) / 1000, (data.radius3 || 0) / 1000),
          keyword: data.category,
          radius1: data.radius1,
          radius2: data.radius2,
          radius3: data.radius3,
        };

        // 到達圏での分析
        const driveTimeStatsPayload = {
          lat: geocodingData.lat,
          lng: geocodingData.lng,
          rangeType: 'driveTime' as const,
          time1: data.time1,
          time2: data.time2,
          time3: data.time3,
          speed: data.speed,
          travelMode: data.travelMode,
        };

        const driveTimePlacesPayload = {
          lat: geocodingData.lat,
          lng: geocodingData.lng,
          radiusKm: Math.max(
            ((data.time1 || 0) * (data.speed || 30)) / 60,
            ((data.time2 || 0) * (data.speed || 30)) / 60,
            ((data.time3 || 0) * (data.speed || 30)) / 60
          ),
          keyword: data.category,
          radius1: (data.time1 || 5) * (data.speed || 30) * 1000 / 60,
          radius2: (data.time2 || 10) * (data.speed || 30) * 1000 / 60,
          radius3: (data.time3 || 20) * (data.speed || 30) * 1000 / 60,
        };

        // 4つのAPIを並行して呼び出し
        const [circleStatsRes, circlePlacesRes, driveTimeStatsRes, driveTimePlacesRes] = await Promise.all([
          fetch('/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(circleStatsPayload),
          }),
          fetch('/api/places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(circlePlacesPayload),
          }),
          fetch('/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driveTimeStatsPayload),
          }),
          fetch('/api/places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(driveTimePlacesPayload),
          }),
        ]);

        if (!circleStatsRes.ok || !circlePlacesRes.ok || !driveTimeStatsRes.ok || !driveTimePlacesRes.ok) {
          throw new Error('データの取得に失敗しました');
        }

        const [circleStats, circlePlaces, driveTimeStats, driveTimePlaces] = await Promise.all([
          circleStatsRes.json(),
          circlePlacesRes.json(),
          driveTimeStatsRes.json(),
          driveTimePlacesRes.json(),
        ]);

        // 両方の結果を設定
        setDualResult({
          address: geocodingData.formatted_address,
          coordinates: {
            lat: geocodingData.lat,
            lng: geocodingData.lng,
          },
          incomeData: incomeData,
          futurePopulationData: futurePopulationData,
          circle: {
            population: circleStats,
            competitors: circlePlaces.results,
            params: {
              radius1: data.radius1 || 500,
              radius2: data.radius2 || 1000,
              radius3: data.radius3 || 2000,
            },
          },
          driveTime: {
            population: driveTimeStats,
            competitors: driveTimePlaces.results,
            params: {
              time1: data.time1 || 5,
              time2: data.time2 || 10,
              time3: data.time3 || 20,
              speed: data.speed || 30,
              travelMode: data.travelMode || 'car',
            },
          },
        });
      } else {
        // 通常モード（circle または driveTime）
        // 2. 人口統計データと競合施設を並行して取得
        const statsPayload: any = {
          lat: geocodingData.lat,
          lng: geocodingData.lng,
          rangeType: data.rangeType,
        };

        // 範囲タイプに応じてパラメータを追加
        if (data.rangeType === 'circle') {
          statsPayload.radius1 = data.radius1;
          statsPayload.radius2 = data.radius2;
          statsPayload.radius3 = data.radius3;
        } else {
          statsPayload.time1 = data.time1;
          statsPayload.time2 = data.time2;
          statsPayload.time3 = data.time3;
          statsPayload.speed = data.speed;
          statsPayload.travelMode = data.travelMode;
        }

        const [statsResponse, placesResponse] = await Promise.all([
          fetch('/api/stats', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(statsPayload),
          }),
          fetch('/api/places', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lat: geocodingData.lat,
              lng: geocodingData.lng,
              // Places APIは円形検索のみなので、最大の範囲（3次エリア）を使用
              radiusKm:
                data.rangeType === 'circle'
                  ? Math.max((data.radius1 || 0) / 1000, (data.radius2 || 0) / 1000, (data.radius3 || 0) / 1000)
                  : Math.max(
                      ((data.time1 || 0) * (data.speed || 30)) / 60,
                      ((data.time2 || 0) * (data.speed || 30)) / 60,
                      ((data.time3 || 0) * (data.speed || 30)) / 60
                    ),
              keyword: data.category,
              // エリア境界を渡す
              radius1: data.rangeType === 'circle' ? data.radius1 : (data.time1 || 5) * (data.speed || 30) * 1000 / 60,
              radius2: data.rangeType === 'circle' ? data.radius2 : (data.time2 || 10) * (data.speed || 30) * 1000 / 60,
              radius3: data.rangeType === 'circle' ? data.radius3 : (data.time3 || 20) * (data.speed || 30) * 1000 / 60,
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
          incomeData: incomeData,
          futurePopulationData: futurePopulationData,
        });
      }
      showToast('分析が完了しました', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '分析中にエラーが発生しました';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportToSheets = async () => {
    if (!result || !analysisParams) return;

    setIsExporting(true);
    try {
      // 範囲の説明を生成
      let rangeDescription = '';
      if (analysisParams.rangeType === 'circle') {
        rangeDescription = `円形: ${analysisParams.radius1}m / ${analysisParams.radius2}m / ${analysisParams.radius3}m`;
      } else {
        rangeDescription = `到達圏: ${analysisParams.time1}分 / ${analysisParams.time2}分 / ${analysisParams.time3}分 (${analysisParams.speed}km/h)`;
      }

      const exportData = {
        basicInfo: {
          address: result.address,
          latitude: result.coordinates.lat,
          longitude: result.coordinates.lng,
          category: analysisParams.category,
          rangeType: analysisParams.rangeType,
          rangeDescription: rangeDescription,
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

      showToast('Googleスプレッドシートへのエクスポートが完了しました', 'success');
    } catch (err) {
      const errorMessage = err instanceof Error
        ? err.message
        : 'スプレッドシートへのエクスポートに失敗しました';
      showToast(errorMessage, 'error');
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg transform transition-all duration-500 ease-out ${
              toast.type === 'success'
                ? 'bg-success-600 text-white'
                : toast.type === 'error'
                ? 'bg-error-600 text-white'
                : 'bg-info-600 text-white'
            } animate-slide-in-right`}
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {toast.type === 'success' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.type === 'error' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                {toast.type === 'info' && (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="font-medium">{toast.message}</p>
              <button
                onClick={() => setToast(null)}
                className="ml-4 flex-shrink-0 hover:opacity-75 transition-opacity"
                aria-label="通知を閉じる"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <header className="mb-10 text-center">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="bg-primary-600 p-3 rounded-lg shadow-md">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            商圏分析アプリ
          </h1>
          {isDevelopmentMode && (
            <div className="inline-flex items-center gap-2 mb-3 bg-warning-100 text-warning-800 px-4 py-2 rounded-lg text-sm font-medium border border-warning-200" role="status">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
              </svg>
              開発モード
            </div>
          )}
          <p className="text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            住所と施設カテゴリを入力して、周辺の人口統計と競合情報を分析します
          </p>
          {isDevelopmentMode && (
            <p className="text-warning-700 text-sm mt-2 font-medium">
              モックデータを使用しています（API呼び出しなし）
            </p>
          )}
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <AnalysisForm onSubmit={handleAnalysis} isLoading={isLoading} />
            </div>
          </div>

          <div className="lg:col-span-2">
            {/* Loading State with Skeleton */}
            {isLoading && (
              <div className="card">
                <div className="text-center">
                  <div className="relative inline-flex">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-primary-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-pulse h-8 w-8 bg-primary-100 rounded-full"></div>
                    </div>
                  </div>
                  <p className="mt-6 text-gray-700 font-semibold text-lg">分析中...</p>
                  <p className="mt-2 text-gray-500 text-sm">データを取得しています</p>

                  {/* Skeleton loader */}
                  <div className="mt-8 space-y-4 animate-pulse" role="status" aria-label="読み込み中">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mx-auto"></div>
                    <span className="sr-only">読み込み中...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-error-50 border-l-4 border-error-600 p-6 rounded-lg shadow-sm animate-fade-in" role="alert">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-error-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-base font-semibold text-error-900">エラーが発生しました</h3>
                    <p className="mt-2 text-sm text-error-700">{error}</p>
                    <button
                      onClick={() => setError(null)}
                      className="mt-4 text-sm font-medium text-error-700 hover:text-error-800 underline transition-colors"
                      aria-label="エラーメッセージを閉じる"
                    >
                      閉じる
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Results */}
            {(result || dualResult) && !isLoading && analysisParams && (
              <div className="animate-fade-in">
                <ResultsDisplay
                  result={result}
                  dualResult={dualResult}
                  onExportToSheets={handleExportToSheets}
                  isExporting={isExporting}
                  category={analysisParams.category}
                  rangeType={analysisParams.rangeType}
                  rangeParams={analysisParams}
                />
              </div>
            )}

            {/* Empty State */}
            {!result && !dualResult && !isLoading && !error && (
              <div className="card text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">分析を開始しましょう</h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  左のフォームから住所と施設カテゴリを選択して、商圏分析を開始してください
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
