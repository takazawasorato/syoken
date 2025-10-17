/**
 * @fileoverview jSTAT MAP APIから指定地点の人口構成データを取得し、スプレッドシートに書き出すスクリプト
 *
 * @version 1.0
 * @author Gemini
 * @license Apache-2.0
 */

// ▼▼▼▼▼ 設定項目 ▼▼▼▼▼

// jSTAT MAP APIのキーとユーザーID
const JSTAT_API_KEY = 'SidVzLbK6nHKQHBTZ36K'; // 取得したjSTAT MAPのAPIキーを設定
const JSTAT_USER_ID2 = 'soratimothy@outlook.jp'; // 取得したjSTAT MAPのユーザーIDを設定

// データを取得したい地点の緯度・経度
const TARGET_LATITUDE = 35.681236;  // 例: 東京駅
const TARGET_LONGITUDE = 139.767125; // 例: 東京駅

// --- 円（半径）分析の設定 ---
const SEARCH_RADII_KM = [0.5, 1, 2]; // 半径を3つまで配列で指定 (km)

// --- 到達圏（時間）分析の設定 ---
const DRIVE_TIME_MINUTES = [5, 10, 20]; // 到達時間を3つまで配列で指定 (分)
const CAR_SPEED_KMH = 30; // 車の時速 (km/h)

// --- 出力シート名 ---
const ALL_DATA_SHEET_NAME = 'jstat_all_data';
const AGE_SEX_PIVOT_SHEET_NAME = 'age_sex_population';
const INDUSTRY_PIVOT_SHEET_NAME = 'industry_employees';

// --- キャッシュファイル名 ---
const JSON_CACHE_CIRCLE_FILE_NAME = 'jstat_api_cache_circle.json';
const JSON_CACHE_DRIVETIME_FILE_NAME = 'jstat_api_cache_drivetime.json';

// ▲▲▲▲▲ ここまで設定項目 ▲▲▲▲▲


/**
 * スプレッドシートを開いたときにカスタムメニューを追加する関数
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  const menu = ui.createMenu('jSTAT MAP');

  // 円（半径）分析のサブメニュー
  const circleMenu = ui.createMenu('円（半径）分析');
  circleMenu.addItem('1. [円] APIデータ取得', 'fetchCircleData');
  circleMenu.addItem('2. [円] 全データを整形', 'formatAllCircleData');
  circleMenu.addItem('3. [円] 年齢・男女別人口を整形', 'formatAgeSexCircleData');
  circleMenu.addItem('4. [円] 産業別従業者数を整形', 'formatIndustryCircleData');
  menu.addSubMenu(circleMenu);

  // 到達圏（時間）分析のサブメニュー
  const driveTimeMenu = ui.createMenu('到達圏（時間）分析');
  driveTimeMenu.addItem('1. [到達圏] APIデータ取得', 'fetchDriveTimeData');
  driveTimeMenu.addItem('2. [到達圏] 全データを整形', 'formatAllDriveTimeData');
  driveTimeMenu.addItem('3. [到達圏] 年齢・男女別人口を整形', 'formatAgeSexDriveTimeData');
  driveTimeMenu.addItem('4. [到達圏] 産業別従業者数を整形', 'formatIndustryDriveTimeData');
  menu.addSubMenu(driveTimeMenu);
  
  menu.addToUi();
}

// --- メニュー実行用のラッパー関数群 ---
function fetchCircleData() { fetchAndCacheJstatData('circle'); }
function fetchDriveTimeData() { fetchAndCacheJstatData('drivetime'); }
function formatAllCircleData() { runFormatting('circle', ALL_DATA_SHEET_NAME, formatJstatData); }
function formatAllDriveTimeData() { runFormatting('drivetime', ALL_DATA_SHEET_NAME, formatJstatData); }
function formatAgeSexCircleData() { runFormatting('circle', AGE_SEX_PIVOT_SHEET_NAME, formatAgeSexPivotData); }
function formatAgeSexDriveTimeData() { runFormatting('drivetime', AGE_SEX_PIVOT_SHEET_NAME, formatAgeSexPivotData); }
function formatIndustryCircleData() { runFormatting('circle', INDUSTRY_PIVOT_SHEET_NAME, formatIndustryPivotData); }
function formatIndustryDriveTimeData() { runFormatting('drivetime', INDUSTRY_PIVOT_SHEET_NAME, formatIndustryPivotData); }


/**
 * [ステップ1] APIからデータを取得し、Google Driveにファイルとして保存する関数
 * @param {string} analysisType - 'circle' または 'drivetime'
 */
function fetchAndCacheJstatData(analysisType) {
  if (JSTAT_API_KEY === 'YOUR_JSTAT_API_KEY' || JSTAT_USER_ID === 'YOUR_JSTAT_USER_ID') {
    Browser.msgBox('エラー: スクリプトの冒頭にある JSTAT_API_KEY と JSTAT_USER_ID を設定してください。');
    return;
  }
  
  try {
    SpreadsheetApp.getActiveSpreadsheet().toast(`jSTAT MAP APIから${analysisType === 'circle' ? '円（半径）' : '到達圏'}データを取得しています...`, '処理中', -1);

    const url = 'https://jstatmap.e-stat.go.jp/statmap/api/1.00';
    const params = {
      'category': 'richReport', 'func': 'getSummary', 'userid': JSTAT_USER_ID,
      'key': JSTAT_API_KEY, 'lat': TARGET_LATITUDE, 'lng': TARGET_LONGITUDE,
      'output': 'json'
    };

    let cacheFileName;
    if (analysisType === 'circle') {
      params.rangeType = 'circle';
      params.radius = SEARCH_RADII_KM.map(km => km * 1000).join(',');
      cacheFileName = JSON_CACHE_CIRCLE_FILE_NAME;
    } else { // drivetime
      // ★★★★★ 修正点: API仕様書に基づきパラメータ名を修正 ★★★★★
      params.rangeType = 'driveTime';
      params.travelMode = 'car'; // travelMode を追加
      params.time = DRIVE_TIME_MINUTES.join(','); // 'range' を 'time' に変更
      params.speed = CAR_SPEED_KMH; // 'carSpeed' を 'speed' に変更
      cacheFileName = JSON_CACHE_DRIVETIME_FILE_NAME;
    }

    const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
    const requestUrl = `${url}?${queryString}`;
    
    const response = UrlFetchApp.fetch(requestUrl, { 'muteHttpExceptions': true });
    const responseText = response.getContentText();
    if (!responseText) throw new Error('APIから空の応答がありました。');
    
    const json = JSON.parse(responseText);
    if (!json.GET_SUMMARY || !json.GET_SUMMARY.RESULT || json.GET_SUMMARY.RESULT.STATUS !== 0) {
      throw new Error(`APIエラー: ${json.GET_SUMMARY.RESULT.ERROR_MSG || '予期しない形式の応答がありました。'}`);
    }

    const files = DriveApp.getFilesByName(cacheFileName);
    if (files.hasNext()) {
      files.next().setContent(responseText);
    } else {
      DriveApp.createFile(cacheFileName, responseText, MimeType.PLAIN_TEXT);
    }
    
    SpreadsheetApp.getActiveSpreadsheet().toast(`データ取得成功。Google Driveに「${cacheFileName}」を保存しました。`, '完了', 10);

  } catch (e) {
    Logger.log(`エラーが発生しました: ${e.stack}`);
    Browser.msgBox(`APIからのデータ取得中にエラーが発生しました。\n\nエラー内容: ${e.message}`);
  }
}


/**
 * 整形処理の共通実行部分
 * @param {string} analysisType - 'circle' または 'drivetime'
 * @param {string} sheetName - 出力先のシート名
 * @param {Function} formattingFunction - 使用する整形関数
 */
function runFormatting(analysisType, sheetName, formattingFunction) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    const cacheFileName = analysisType === 'circle' ? JSON_CACHE_CIRCLE_FILE_NAME : JSON_CACHE_DRIVETIME_FILE_NAME;
    const files = DriveApp.getFilesByName(cacheFileName);
    
    if (!files.hasNext()) {
      Browser.msgBox(`キャッシュファイル「${cacheFileName}」が見つかりません。先に「1. APIデータ取得」を実行してください。`);
      return;
    }
    
    const jsonFile = files.next();
    const jsonText = jsonFile.getBlob().getDataAsString();
    const json = JSON.parse(jsonText);
    
    let outputSheet = ss.getSheetByName(sheetName);
    if (!outputSheet) {
      outputSheet = ss.insertSheet(sheetName);
    }
    outputSheet.clear();

    SpreadsheetApp.getActiveSpreadsheet().toast('JSONデータを整形・出力しています...', '処理中', -1);
    
    const resultData = formattingFunction(json);
    
    if (!resultData || resultData.length <= 1) {
      outputSheet.getRange(1, 1).setValue('整形できるデータがありませんでした。');
      SpreadsheetApp.getActiveSpreadsheet().toast('データが見つかりませんでした。', '警告', 10);
      return;
    }

    if (formattingFunction === formatJstatData) {
      writeDataToSheet(outputSheet, resultData);
    } else {
      writeDataToPivotSheet(outputSheet, resultData);
    }

    SpreadsheetApp.getActiveSpreadsheet().toast('データの整形・出力が完了しました。', '完了', 5);

  } catch (e) {
    Logger.log(`エラーが発生しました: ${e.stack}`);
    const sheet = ss.getSheetByName(sheetName) || ss.insertSheet(sheetName);
    sheet.clear().getRange(1, 1, 2, 1).setValues([['エラー'], [e.message]]);
    Browser.msgBox(`整形処理中にエラーが発生しました。詳細は「${sheetName}」シートとログを確認してください。`);
  }
}

/**
 * [整形処理A] JSONオブジェクトを受け取り、【全データ】をテーブル形式で返す
 */
function formatJstatData(json) {
  if (!json.GET_SUMMARY.DATASET_INF || json.GET_SUMMARY.DATASET_INF.length === 0) return [];
  const tableInf = json.GET_SUMMARY.DATASET_INF[0].TABLE_INF;
  if (!tableInf) throw new Error('統計テーブルが見つかりません。');

  const formattedTables = [];
  tableInf.forEach(table => {
    const targetValues = table.DATA_INF.VALUE;
    if (!targetValues || targetValues.length === 0) return;
    const classMappings = {};
    table.CLASS_INF.CLASS_OBJ.forEach(classObj => {
      const catId = classObj['@id'];
      const codeToName = {};
      if (classObj.CLASS) {
        classObj.CLASS.forEach(item => { codeToName[item['@code']] = item['@name']; });
      }
      classMappings[catId] = { map: codeToName };
    });
    const displayClassObjs = table.CLASS_INF.CLASS_OBJ;
    const headerRow = displayClassObjs.map(c => c['@name']);
    headerRow.push('値', '単位');
    const dataRows = [];
    targetValues.forEach(value => {
      const row = [];
      displayClassObjs.forEach(classObj => {
        const catId = classObj['@id'];
        const code = value[`@${catId}`];
        const name = classMappings[catId].map[code] || code;
        row.push(name);
      });
      row.push(parseInt(value.$, 10));
      row.push(value['@unit'] || '');
      dataRows.push(row);
    });
    formattedTables.push({
      title: table.TITLE.replace(/TABLE\d+\s/, ''),
      headers: headerRow,
      rows: dataRows
    });
  });
  return formattedTables;
}

/**
 * [整形処理B] JSONから【年齢・男女別データ】をピボット形式で返す
 */
function formatAgeSexPivotData(json) {
  if (!json.GET_SUMMARY.DATASET_INF || json.GET_SUMMARY.DATASET_INF.length === 0) return [];
  const tableInf = json.GET_SUMMARY.DATASET_INF[0].TABLE_INF;
  const targetTable = tableInf.find(t => t.TITLE && t.TITLE.includes('年齢') && t.TITLE.includes('男女'));
  if (!targetTable) return []; 
    
  const { classMappings, areaCatId, ageCatId, sexCatId } = getClassifications(targetTable);
  const pivotData = {};

  targetTable.DATA_INF.VALUE.forEach(value => {
    const areaName = classMappings[areaCatId].map[value[`@${areaCatId}`]];
    const ageName = classMappings[ageCatId].map[value[`@${ageCatId}`]];
    const sexName = classMappings[sexCatId].map[value[`@${sexCatId}`]];
    if (!areaName || !ageName || !sexName) return;

    if (!pivotData[areaName]) pivotData[areaName] = {};
    if (!pivotData[areaName][ageName]) pivotData[areaName][ageName] = {};
    pivotData[areaName][ageName][sexName] = parseInt(value.$, 10);
  });

  const header = ['集計範囲', '年齢（5歳階級）', '男女計', '男', '女'];
  const outputRows = [header];
  const sortedAreaNames = getSortedNames(classMappings[areaCatId].map);
  const sortedAgeNames = getSortedNames(classMappings[ageCatId].map);

  sortedAreaNames.forEach(areaName => {
    sortedAgeNames.forEach(ageName => {
      if (pivotData[areaName] && pivotData[areaName][ageName]) {
        const d = pivotData[areaName][ageName];
        outputRows.push([areaName, ageName, d['男女計'] || 0, d['男'] || 0, d['女'] || 0]);
      }
    });
  });
  return outputRows;
}

/**
 * [整形処理C] JSONから【産業別従業者数データ】をピボット形式で返す
 */
function formatIndustryPivotData(json) {
  if (!json.GET_SUMMARY.DATASET_INF || json.GET_SUMMARY.DATASET_INF.length === 0) return [];
  const tableInf = json.GET_SUMMARY.DATASET_INF[0].TABLE_INF;
  // 産業別データが含まれるテーブルを探す（経済センサスなど）
  const targetTable = tableInf.find(t => t.TITLE && t.TITLE.includes('産業別'));
  if (!targetTable) return [];

  const { classMappings, areaCatId, industryCatId, itemCatId } = getClassifications(targetTable);
  const pivotData = {};

  targetTable.DATA_INF.VALUE.forEach(value => {
    const areaName = classMappings[areaCatId].map[value[`@${areaCatId}`]];
    const industryName = classMappings[industryCatId].map[value[`@${industryCatId}`]];
    const itemName = classMappings[itemCatId].map[value[`@${itemCatId}`]];
    if (!areaName || !industryName || !itemName) return;

    if (!pivotData[areaName]) pivotData[areaName] = {};
    if (!pivotData[areaName][industryName]) pivotData[areaName][industryName] = {};
    pivotData[areaName][industryName][itemName] = parseInt(value.$, 10);
  });

  const header = ['集計範囲', '産業分類', '事業所数', '従業者数'];
  const outputRows = [header];
  const sortedAreaNames = getSortedNames(classMappings[areaCatId].map);
  const sortedIndustryNames = getSortedNames(classMappings[industryCatId].map);

  sortedAreaNames.forEach(areaName => {
    sortedIndustryNames.forEach(industryName => {
      if (pivotData[areaName] && pivotData[areaName][industryName]) {
        const d = pivotData[areaName][industryName];
        // APIの項目名に合わせる
        outputRows.push([areaName, industryName, d['事業所数'] || 0, d['従業者数'] || 0]);
      }
    });
  });
  return outputRows;
}

// --- ヘルパー関数群 ---

/**
 * テーブル定義から分類IDとマッピング情報を抽出する
 * @param {Object} table - JSON内の単一のTABLE_INFオブジェクト
 * @return {Object} - 各種IDとマッピング情報を含むオブジェクト
 */
function getClassifications(table) {
  const classMappings = {};
  const result = {};
  table.CLASS_INF.CLASS_OBJ.forEach(c => {
    const catId = c['@id'], catName = c['@name'];
    if (catName.includes('年齢')) result.ageCatId = catId;
    if (catName.includes('男女')) result.sexCatId = catId;
    if (catName.includes('集計範囲')) result.areaCatId = catId;
    if (catName.includes('産業')) result.industryCatId = catId;
    if (catName.includes('項目')) result.itemCatId = catId; // for industry

    const codeToName = {};
    if (c.CLASS) {
      c.CLASS.forEach(item => {
        if (catName.includes('集計範囲')) {
          if (item['@radius']) codeToName[item['@code']] = `${item['@name']} (${item['@radius']}m)`;
          else if (item['@range']) codeToName[item['@code']] = `${item['@name']} (${item['@range']}分)`;
          else codeToName[item['@code']] = item['@name'];
        } else {
          codeToName[item['@code']] = item['@name'];
        }
      });
    }
    classMappings[catId] = { map: codeToName };
  });
  result.classMappings = classMappings;
  return result;
}

/**
 * マッピング辞書からソートされた名称の配列を返す
 * @param {Object} map - code-to-nameのマッピングオブジェクト
 * @return {Array<string>} - ソートされた名称の配列
 */
function getSortedNames(map) {
  return Object.keys(map).sort().map(code => map[code]);
}

/**
 * [書き出し処理A] 全データをテーブル形式で書き出す
 */
function writeDataToSheet(sheet, tables) {
  let currentRow = 1;
  tables.forEach(table => {
    if (!table.headers || table.headers.length === 0 || table.rows.length === 0) return;
    const tableWidth = table.headers.length;
    sheet.getRange(currentRow, 1, 1, tableWidth).merge().setValue(table.title).setFontWeight('bold').setHorizontalAlignment('center');
    currentRow++;
    sheet.getRange(currentRow, 1, 1, tableWidth).setValues([table.headers]).setFontWeight('bold');
    currentRow++;
    sheet.getRange(currentRow, 1, table.rows.length, tableWidth).setValues(table.rows);
    currentRow += table.rows.length + 1;
  });
  if (sheet.getMaxColumns() > 0) sheet.autoResizeColumns(1, sheet.getMaxColumns());
}

/**
 * [書き出し処理B] ピボット形式のデータを書き出す
 */
function writeDataToPivotSheet(sheet, data) {
  sheet.getRange(1, 1, data.length, data[0].length).setValues(data);
  sheet.getRange(1, 1, 1, data[0].length).setFontWeight('bold');
  sheet.autoResizeColumns(1, data[0].length);
}

