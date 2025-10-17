'use client';

import { useState } from 'react';

interface AnalysisFormProps {
  onSubmit: (data: { address: string; category: string; radiusKm: number }) => void;
  isLoading: boolean;
}

export default function AnalysisForm({ onSubmit, isLoading }: AnalysisFormProps) {
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('ジム');
  const [radiusKm, setRadiusKm] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ address, category, radiusKm });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800">商圏分析</h2>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
          住所
        </label>
        <input
          id="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="例: 東京都渋谷区道玄坂1-1-1"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          施設カテゴリ
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="ジム">ジム</option>
          <option value="フィットネスクラブ">フィットネスクラブ</option>
          <option value="コンビニ">コンビニ</option>
          <option value="カフェ">カフェ</option>
          <option value="レストラン">レストラン</option>
          <option value="美容院">美容院</option>
          <option value="歯科医院">歯科医院</option>
          <option value="薬局">薬局</option>
        </select>
      </div>

      <div>
        <label htmlFor="radius" className="block text-sm font-medium text-gray-700 mb-2">
          検索半径 (km): {radiusKm}
        </label>
        <input
          id="radius"
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={radiusKm}
          onChange={(e) => setRadiusKm(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.5km</span>
          <span>5km</span>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {isLoading ? '分析中...' : '分析を開始'}
      </button>
    </form>
  );
}
