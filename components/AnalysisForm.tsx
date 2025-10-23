'use client';

import { useState, memo } from 'react';

interface AnalysisFormProps {
  onSubmit: (data: {
    address: string;
    category: string;
    rangeType: 'circle' | 'driveTime';
    // Circle parameters
    radius1?: number;
    radius2?: number;
    radius3?: number;
    // DriveTime parameters
    time1?: number;
    time2?: number;
    time3?: number;
    speed?: number;
    travelMode?: string;
  }) => void;
  isLoading: boolean;
}

const AnalysisForm = ({ onSubmit, isLoading }: AnalysisFormProps) => {
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('ジム');
  const [rangeType, setRangeType] = useState<'circle' | 'driveTime'>('circle');
  const [addressError, setAddressError] = useState('');
  const [isFocused, setIsFocused] = useState<string | null>(null);

  // Circle parameters (単位: メートル)
  const [radius1, setRadius1] = useState(500);
  const [radius2, setRadius2] = useState(1000);
  const [radius3, setRadius3] = useState(2000);

  // DriveTime parameters
  const [time1, setTime1] = useState(5);
  const [time2, setTime2] = useState(10);
  const [time3, setTime3] = useState(20);
  const [speed, setSpeed] = useState(30);
  const [travelMode, setTravelMode] = useState('car');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate address
    if (!address.trim()) {
      setAddressError('住所を入力してください');
      return;
    }

    setAddressError('');

    const data = {
      address,
      category,
      rangeType,
      ...(rangeType === 'circle'
        ? { radius1, radius2, radius3 }
        : { time1, time2, time3, speed, travelMode }),
    };

    onSubmit(data);
  };

  const categoryOptions = [
    { value: 'ジム', icon: '🏋️', label: 'ジム' },
    { value: 'フィットネスクラブ', icon: '💪', label: 'フィットネスクラブ' },
    { value: 'コンビニ', icon: '🏪', label: 'コンビニ' },
    { value: 'カフェ', icon: '☕', label: 'カフェ' },
    { value: 'レストラン', icon: '🍽️', label: 'レストラン' },
    { value: '美容院', icon: '💇', label: '美容院' },
    { value: '歯科医院', icon: '🦷', label: '歯科医院' },
    { value: '薬局', icon: '💊', label: '薬局' },
  ];

  return (
    <form
      onSubmit={handleSubmit}
      className="card space-y-6"
      aria-label="商圏分析フォーム"
    >
      <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
        <div className="p-2 bg-primary-600 rounded-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">商圏分析</h2>
      </div>

      {/* Address Input */}
      <div className="space-y-2">
        <label
          htmlFor="address"
          className="block text-sm font-semibold text-gray-700"
        >
          住所 <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (addressError) setAddressError('');
            }}
            onFocus={() => setIsFocused('address')}
            onBlur={() => setIsFocused(null)}
            placeholder="例: 東京都渋谷区道玄坂1-1-1"
            required
            aria-invalid={addressError ? 'true' : 'false'}
            aria-describedby={addressError ? 'address-error' : undefined}
            className={`pl-10 pr-4 ${addressError ? 'input-field border-error-500' : 'input-field'}`}
          />
        </div>
        {addressError && (
          <p id="address-error" className="text-sm text-error-600 flex items-center gap-1 animate-fade-in" role="alert">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {addressError}
          </p>
        )}
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          正確な住所を入力すると、より精度の高い分析ができます
        </p>
      </div>

      {/* Category Select */}
      <div className="space-y-2">
        <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
          施設カテゴリ <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onFocus={() => setIsFocused('category')}
            onBlur={() => setIsFocused(null)}
            className="input-field appearance-none cursor-pointer"
            aria-label="施設カテゴリを選択"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.icon} {option.label}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* Range Type Toggle */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          範囲タイプ <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="範囲タイプ">
          <label
            className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              rangeType === 'circle'
                ? 'border-primary-500 bg-primary-50 shadow-sm ring-2 ring-primary-200'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              value="circle"
              checked={rangeType === 'circle'}
              onChange={(e) => setRangeType(e.target.value as 'circle')}
              className="sr-only"
              aria-label="円形範囲"
            />
            <div className="text-center">
              <svg className={`w-6 h-6 mx-auto mb-2 ${rangeType === 'circle' ? 'text-primary-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-sm font-medium ${rangeType === 'circle' ? 'text-primary-700' : 'text-gray-700'}`}>
                円形範囲
              </span>
            </div>
            {rangeType === 'circle' && (
              <div className="absolute top-2 right-2">
                <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
          <label
            className={`relative flex items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
              rangeType === 'driveTime'
                ? 'border-success-500 bg-success-50 shadow-sm ring-2 ring-success-200'
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50'
            }`}
          >
            <input
              type="radio"
              value="driveTime"
              checked={rangeType === 'driveTime'}
              onChange={(e) => setRangeType(e.target.value as 'driveTime')}
              className="sr-only"
              aria-label="到達圏（車）"
            />
            <div className="text-center">
              <svg className={`w-6 h-6 mx-auto mb-2 ${rangeType === 'driveTime' ? 'text-success-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className={`text-sm font-medium ${rangeType === 'driveTime' ? 'text-success-700' : 'text-gray-700'}`}>
                到達圏
              </span>
            </div>
            {rangeType === 'driveTime' && (
              <div className="absolute top-2 right-2">
                <svg className="w-5 h-5 text-success-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </label>
        </div>
      </div>

      {/* Range Settings */}
      {rangeType === 'circle' ? (
        <div className="space-y-5 p-6 bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl border border-blue-200 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <h3 className="font-bold text-blue-900 text-base">円形範囲設定</h3>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="radius1" className="text-sm font-medium text-blue-900">
                1次エリア半径
              </label>
              <span className="text-lg font-bold text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                {radius1}m
              </span>
            </div>
            <input
              id="radius1"
              type="range"
              min="100"
              max="1000"
              step="100"
              value={radius1}
              onChange={(e) => setRadius1(parseInt(e.target.value))}
              aria-label="1次エリア半径"
              aria-valuemin={100}
              aria-valuemax={1000}
              aria-valuenow={radius1}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
              style={{
                background: `linear-gradient(to right, rgb(37 99 235) 0%, rgb(37 99 235) ${((radius1 - 100) / 900) * 100}%, rgb(191 219 254) ${((radius1 - 100) / 900) * 100}%, rgb(191 219 254) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-blue-700 font-medium mt-1">
              <span>100m</span>
              <span>1000m</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="radius2" className="text-sm font-medium text-blue-900">
                2次エリア半径
              </label>
              <span className="text-lg font-bold text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                {radius2}m
              </span>
            </div>
            <input
              id="radius2"
              type="range"
              min="500"
              max="2000"
              step="100"
              value={radius2}
              onChange={(e) => setRadius2(parseInt(e.target.value))}
              aria-label="2次エリア半径"
              aria-valuemin={500}
              aria-valuemax={2000}
              aria-valuenow={radius2}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
              style={{
                background: `linear-gradient(to right, rgb(37 99 235) 0%, rgb(37 99 235) ${((radius2 - 500) / 1500) * 100}%, rgb(191 219 254) ${((radius2 - 500) / 1500) * 100}%, rgb(191 219 254) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-blue-700 font-medium mt-1">
              <span>500m</span>
              <span>2000m</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="radius3" className="text-sm font-medium text-blue-900">
                3次エリア半径
              </label>
              <span className="text-lg font-bold text-blue-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                {radius3}m
              </span>
            </div>
            <input
              id="radius3"
              type="range"
              min="1000"
              max="5000"
              step="100"
              value={radius3}
              onChange={(e) => setRadius3(parseInt(e.target.value))}
              aria-label="3次エリア半径"
              aria-valuemin={1000}
              aria-valuemax={5000}
              aria-valuenow={radius3}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-700 transition-all"
              style={{
                background: `linear-gradient(to right, rgb(37 99 235) 0%, rgb(37 99 235) ${((radius3 - 1000) / 4000) * 100}%, rgb(191 219 254) ${((radius3 - 1000) / 4000) * 100}%, rgb(191 219 254) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-blue-700 font-medium mt-1">
              <span>1000m</span>
              <span>5000m</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5 p-6 bg-gradient-to-br from-green-50 to-green-100/50 rounded-xl border border-green-200 transition-all duration-300">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-bold text-green-900 text-base">到達圏設定</h3>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="time1" className="text-sm font-medium text-green-900">
                1次エリア到達時間
              </label>
              <span className="text-lg font-bold text-green-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                {time1}分
              </span>
            </div>
            <input
              id="time1"
              type="range"
              min="1"
              max="10"
              step="1"
              value={time1}
              onChange={(e) => setTime1(parseInt(e.target.value))}
              aria-label="1次エリア到達時間"
              aria-valuemin={1}
              aria-valuemax={10}
              aria-valuenow={time1}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600 hover:accent-green-700 transition-all"
              style={{
                background: `linear-gradient(to right, rgb(22 163 74) 0%, rgb(22 163 74) ${((time1 - 1) / 9) * 100}%, rgb(187 247 208) ${((time1 - 1) / 9) * 100}%, rgb(187 247 208) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-green-700 font-medium mt-1">
              <span>1分</span>
              <span>10分</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="time2" className="text-sm font-medium text-green-900">
                2次エリア到達時間
              </label>
              <span className="text-lg font-bold text-green-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                {time2}分
              </span>
            </div>
            <input
              id="time2"
              type="range"
              min="5"
              max="20"
              step="1"
              value={time2}
              onChange={(e) => setTime2(parseInt(e.target.value))}
              aria-label="2次エリア到達時間"
              aria-valuemin={5}
              aria-valuemax={20}
              aria-valuenow={time2}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600 hover:accent-green-700 transition-all"
              style={{
                background: `linear-gradient(to right, rgb(22 163 74) 0%, rgb(22 163 74) ${((time2 - 5) / 15) * 100}%, rgb(187 247 208) ${((time2 - 5) / 15) * 100}%, rgb(187 247 208) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-green-700 font-medium mt-1">
              <span>5分</span>
              <span>20分</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="time3" className="text-sm font-medium text-green-900">
                3次エリア到達時間
              </label>
              <span className="text-lg font-bold text-green-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                {time3}分
              </span>
            </div>
            <input
              id="time3"
              type="range"
              min="10"
              max="40"
              step="1"
              value={time3}
              onChange={(e) => setTime3(parseInt(e.target.value))}
              aria-label="3次エリア到達時間"
              aria-valuemin={10}
              aria-valuemax={40}
              aria-valuenow={time3}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600 hover:accent-green-700 transition-all"
              style={{
                background: `linear-gradient(to right, rgb(22 163 74) 0%, rgb(22 163 74) ${((time3 - 10) / 30) * 100}%, rgb(187 247 208) ${((time3 - 10) / 30) * 100}%, rgb(187 247 208) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-green-700 font-medium mt-1">
              <span>10分</span>
              <span>40分</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="speed" className="text-sm font-medium text-green-900">
                平均時速
              </label>
              <span className="text-lg font-bold text-green-600 bg-white px-3 py-1 rounded-lg shadow-sm">
                {speed}km/h
              </span>
            </div>
            <input
              id="speed"
              type="range"
              min="20"
              max="60"
              step="5"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              aria-label="平均時速"
              aria-valuemin={20}
              aria-valuemax={60}
              aria-valuenow={speed}
              className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600 hover:accent-green-700 transition-all"
              style={{
                background: `linear-gradient(to right, rgb(22 163 74) 0%, rgb(22 163 74) ${((speed - 20) / 40) * 100}%, rgb(187 247 208) ${((speed - 20) / 40) * 100}%, rgb(187 247 208) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-green-700 font-medium mt-1">
              <span>20km/h</span>
              <span>60km/h</span>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="travelMode" className="block text-sm font-medium text-green-900">
              移動手段
            </label>
            <div className="relative">
              <select
                id="travelMode"
                value={travelMode}
                onChange={(e) => setTravelMode(e.target.value)}
                className="w-full px-4 py-3 border-2 border-green-200 rounded-lg transition-all duration-200 appearance-none cursor-pointer bg-white hover:border-green-300 focus:border-green-500 focus:ring-4 focus:ring-green-100 outline-none"
                aria-label="移動手段を選択"
              >
                <option value="car">車</option>
                <option value="walk">徒歩</option>
                <option value="bike">自転車</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="h-5 w-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-lg font-semibold text-base transition-all duration-200 ${
          isLoading
            ? 'btn-primary opacity-60 cursor-not-allowed'
            : 'btn-primary'
        }`}
        aria-label={isLoading ? '分析中です' : '分析を開始'}
      >
        <div className="flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>分析中...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>分析を開始</span>
            </>
          )}
        </div>
      </button>
    </form>
  );
};

export default memo(AnalysisForm);
