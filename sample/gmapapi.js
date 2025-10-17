// ▼▼▼▼▼ ここから設定項目 ▼▼▼▼▼

// 取得したAPIキーを設定
const GOOGLE_API_KEY = 'AIzaSyA2vCVtaoMyeXxWYONQUdh0W1gSJf5ywBI';
const ESTAT_APP_ID = '0ba79e2b921adf29427d2cfdb6b6c191eff8088b';
const JSTAT_APP_ID = 'SidVzLbK6nHKQHBTZ36K';
const JSTAT_USER_ID = 'soratimothy@outlook.jp';
/**
 * @fileoverview jSTAT MAP APIとGoogle Maps APIを使用して商圏分析を行うGoogle Apps Script
 *
 * @version 2.0
 * @author Gemini
 * @license Apache-2.0
 */

// ▼▼▼▼▼ 設定項目 ▼▼▼▼▼

// Google Geocoding API, Places APIのキー

// 操作するスプレッドシートとシート名
const SPREADSHEET = SpreadsheetApp.getActiveSpreadsheet();
const SETTING_SHEET = SPREADSHEET.getSheetByName('input');
let RESULT_SHEET = SPREADSHEET.getSheetByName('output');
if (!RESULT_SHEET) {
  RESULT_SHEET = SPREADSHEET.insertSheet('output');
}
// ★追加: jSTAT MAPの生データを書き出すシート
let JSTAT_DATA_SHEET = SPREADSHEET.getSheetByName('jstat_data');
if (!JSTAT_DATA_SHEET) {
  JSTAT_DATA_SHEET = SPREADSHEET.insertSheet('jstat_data');
}
// デバッグ用にログを出力するシート
const LOG_SHEET = SPREADSHEET.getSheetByName('log') || SPREADSHEET.insertSheet('log');

// ▲▲▲▲▲ ここまで設定項目 ▲▲▲▲▲

/**
 * ログをシートとエディタの両方に出力するカスタム関数
 * @param {string} message - ログに出力するメッセージ
 */
function customLog(message) {
  const timestamp = Utilities.formatDate(new Date(), 'JST', 'yyyy-MM-dd HH:mm:ss');
  const logMessage = `[${timestamp}] ${message}`;

  // エディタの実行ログに出力
  Logger.log(message);

  // ログシートの先頭行に追記
  if (LOG_SHEET) {
    LOG_SHEET.insertRowBefore(1).getRange(1, 1).setValue(logMessage);
  }
}

/**
 * スプレッドシートを開いたときにカスタムメニューを追加する関数
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('商圏分析')
    .addItem('分析を実行', 'executeMarketAnalysis')
    .addSeparator()
    .addItem('ログシートをクリア', 'clearLogSheet')
    .addToUi();
}

/**
 * ログシートをクリアする関数
 */
function clearLogSheet() {
  LOG_SHEET.clearContents();
  customLog('ログをクリアしました。');
}

/**
 * 分析を実行するメインの関数
 */
function executeMarketAnalysis() {
  customLog('---------- 分析開始 ----------');
  // 1. 設定シートから入力値を取得
  const address = SETTING_SHEET.getRange('B1').getValue();
  const radiusKm = SETTING_SHEET.getRange('B2').getValue();
  const keyword = SETTING_SHEET.getRange('B3').getValue();
  customLog(`入力値: 住所=${address}, 半径=${radiusKm}km, キーワード=${keyword}`);

  if (!address) {
    Browser.msgBox('住所が入力されていません。');
    customLog('エラー: 住所が未入力のため処理を中断しました。');
    return;
  }

  SpreadsheetApp.flush(); // UIに処理中であることを表示

  // 出力シートの見出し行を設定
  RESULT_SHEET.clearContents().appendRow(['施設名', '距離(m)', '評価', '評価数', 'GoogleマップURL']);
  customLog('出力用シートを初期化しました。');

  try {
    // 2. 住所を緯度経度に変換
    SETTING_SHEET.getRange('B5').setValue('緯度経度を取得中...');
    customLog('ステップ1: 住所を緯度経度に変換開始');
    const location = getCoordinatesFromAddress(address);
    if (!location) return;
    customLog(`緯度経度取得成功: lat=${location.lat}, lng=${location.lng}`);

    // 3. jSTAT MAPで人口データを取得
    SETTING_SHEET.getRange('B5').setValue('人口データを取得中...');
    customLog('ステップ2: jSTAT MAPで人口データを取得開始');
    const populationResult = getPopulationData(location.lat, location.lng, radiusKm);
    
    if (populationResult && populationResult.totalPopulation !== null) {
      SETTING_SHEET.getRange('B5').setValue(`${populationResult.totalPopulation} 人`);
      customLog(`人口データ取得成功: ${populationResult.totalPopulation} 人`);
      // ★追加: 詳細データをシートに書き出す
      writeDemographicData(populationResult);
    } else {
      SETTING_SHEET.getRange('B5').setValue('人口取得失敗');
    }

    // 4. Google Mapsで競合施設を取得
    SETTING_SHEET.getRange('B5').setValue('競合施設を検索中...');
    customLog('ステップ3: Google Mapsで競合施設を取得開始');
    const places = getCompetitorInfo(location.lat, location.lng, radiusKm, keyword);
    customLog(`競合施設の検索完了: ${places.length}件ヒット`);

    // 5. 取得した施設情報をスプレッドシートに書き込み
    if (places.length > 0) {
      customLog('ステップ4: スプレッドシートへの書き込み開始');
      const values = places.map(p => [
        p.name,
        p.distance, // 距離(m)
        p.rating,
        p.user_ratings_total,
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.name)}&query_place_id=${p.place_id}`
      ]);
      RESULT_SHEET.getRange(2, 1, values.length, values[0].length).setValues(values);
      customLog(`${values.length}件の施設情報をシートに出力しました。`);
    }

    SETTING_SHEET.getRange('B5').setValue('分析完了');
    Browser.msgBox('分析が完了しました。');
    customLog('---------- 分析正常終了 ----------');

  } catch (e) {
    const errorMessage = `エラーが発生しました: ${e.message}\nスタックトレース: ${e.stack}`;
    customLog(errorMessage);
    Browser.msgBox('エラーが発生しました。詳細はログシートまたは実行ログを確認してください。');
    SETTING_SHEET.getRange('B5').setValue('エラー');
  }
}

/**
 * [関数1] 住所から緯度経度を取得 (Geocoding API)
 * @param {string} address - 住所
 * @return {object|null} - 緯度経度オブジェクト {lat, lng} or null
 */
function getCoordinatesFromAddress(address) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_API_KEY}&language=ja`;
  customLog(`Geocoding APIリクエストURL: ${url}`);

  try {
    const response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
    const responseText = response.getContentText();
    const json = JSON.parse(responseText);

    if (json.status !== 'OK') {
      throw new Error(`Geocoding API Error: ${json.status} - ${json.error_message || responseText}`);
    }

    if (!json.results || json.results.length === 0) {
      throw new Error('Geocoding API Error: 該当する結果が見つかりませんでした。');
    }

    return json.results[0].geometry.location;

  } catch (e) {
    customLog(`[ERROR] getCoordinatesFromAddress: ${e.message}`);
    Browser.msgBox(`住所を緯度経度に変換できませんでした。\nエラー: ${e.message}`);
    return null;
  }
}

/**
 * [関数2] 指定した座標周辺の人口を取得 (jSTAT MAP API)
 * @param {number} lat - 緯度
 * @param {number} lng - 経度
 * @param {number} radiusKm - 検索半径 (km)
 * @return {object|null} - 人口データオブジェクト or 取得失敗時にnull
 * jstat.jsのコードを使用
 * /

/**
 * [関数3] 指定した座標周辺の施設情報を取得 (Places API)
 * @param {number} lat - 中心の緯度
 * @param {number} lng - 中心の経度
 * @param {number} radiusKm - 検索半径 (km)
 * @param {string} keyword - 検索キーワード
 * @return {Array} - 整形済みの施設情報の配列
 */
function getCompetitorInfo(lat, lng, radiusKm, keyword) {
  const radiusM = radiusKm * 1000;
  let allResults = [];
  let nextPageToken = null;

  for (let i = 0; i < 3; i++) {
    let url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusM}&keyword=${encodeURIComponent(keyword)}&language=ja&key=${GOOGLE_API_KEY}`;
    
    if (nextPageToken) {
      url += `&pagetoken=${nextPageToken}`;
      customLog('次のページのデータを取得します...');
      Utilities.sleep(2000); // 連続リクエストを避けるための待機
    }
    customLog(`Places APIリクエストURL (Page ${i+1}): ${url}`);

    try {
      const response = UrlFetchApp.fetch(url, { 'muteHttpExceptions': true });
      const json = JSON.parse(response.getContentText());
      
      if (json.status !== 'OK' && json.status !== 'ZERO_RESULTS') {
        throw new Error(`Places API Error: ${json.status} - ${json.error_message || ''}`);
      }
      
      if (json.results) {
        allResults = allResults.concat(json.results);
      }
      
      nextPageToken = json.next_page_token;
      if (!nextPageToken) {
        customLog('全てのページのデータを取得しました。');
        break;
      }

    } catch (e) {
      customLog(`[ERROR] getCompetitorInfo: ${e.message}`);
      Browser.msgBox('Google Mapsからの施設情報取得に失敗しました。');
      return [];
    }
  }

  // 取得した全データに対して、距離計算とデータ整形を行う
  customLog(`${allResults.length}件の施設データを処理します。`);
  const processedResults = allResults.map(place => {
    const placeLat = place.geometry.location.lat;
    const placeLng = place.geometry.location.lng;
    const distance = calculateDistance(lat, lng, placeLat, placeLng);

    return {
      name: place.name || 'N/A',
      distance: distance,
      rating: place.rating || 'N/A',
      user_ratings_total: place.user_ratings_total || 0,
      place_id: place.place_id
    };
  });
  
  return processedResults;
}

/**
 * 2点間の緯度経度から距離を計算（ヒュベニの公式）
 * @param {number} lat1 - 地点1の緯度
 * @param {number} lng1 - 地点1の経度
 * @param {number} lat2 - 地点2の緯度
 * @param {number} lng2 - 地点2の経度
 * @return {number} - 距離(m)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  function toRad(deg) {
    return deg * Math.PI / 180;
  }

  const R = 6378137; // 赤道半径
  const e = 0.0818191910428; // 第一離心率

  const radLat1 = toRad(lat1);
  const radLon1 = toRad(lng1);
  const radLat2 = toRad(lat2);
  const radLon2 = toRad(lng2);

  const dLat = radLat1 - radLat2;
  const dLon = radLon1 - radLon2;

  const p = (radLat1 + radLat2) / 2;
  const w = Math.sqrt(1 - e * e * Math.sin(p) * Math.sin(p));
  const m = R * (1 - e * e) / (w * w * w);
  const n = R / w;

  const d = Math.sqrt(Math.pow(m * dLat, 2) + Math.pow(n * Math.cos(p) * dLon, 2));

  return Math.round(d);
}
