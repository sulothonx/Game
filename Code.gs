/**
 * ==============================================================================
 * เกมผจญภัย 2D: "ภารกิจพิชิตโลกคอมพิวเตอร์" (สำหรับนักเรียน ป.1)
 * สคริปต์ Google Apps Script สำหรับเชื่อมต่อและบันทึกคะแนนลง Google Sheets
 * Spreadsheet ID: 1yyufWLMZqIjgzNo_dYt57JlR0VMo2sgUj0goMekqUiw
 * ==============================================================================
 */

// รหัสสเปรดชีตเป้าหมาย
const SPREADSHEET_ID = "1yyufWLMZqIjgzNo_dYt57JlR0VMo2sgUj0goMekqUiw";
// ชื่อแผ่นงานสำหรับบันทึกคะแนน
const SHEET_NAME = "GameScores";

/**
 * ฟังก์ชันรับคำขอ POST จากตัวเกม
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  // รอล็อคไม่เกิน 30 วินาที เพื่อป้องกันการบันทึกข้อมูลชนกัน
  try {
    lock.waitLock(30000);
  } catch (err) {
    return createJsonResponse({
      status: "error",
      message: "เซิร์ฟเวอร์กำลังประมวลผลคำขออื่นอยู่ กรุณาลองใหม่อีกครั้ง"
    });
  }

  try {
    let data;
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    } else if (e && e.parameter) {
      data = e.parameter;
    } else {
      throw new Error("ไม่พบข้อมูลที่ส่งมา (No payload provided)");
    }

    // ดึง Spreadsheet หรือเปิดด้วย ID
    let ss;
    if (SPREADSHEET_ID && SPREADSHEET_ID !== "YOUR_SPREADSHEET_ID_HERE") {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } else {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    }

    if (!ss) {
      throw new Error("ไม่สามารถเปิด Google Spreadsheet ได้ กรุณาตรวจสอบสิทธิ์และ Spreadsheet ID");
    }

    // ตรวจสอบหรือสร้างชีต GameScores
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      initSheetHeader(sheet);
    } else {
      // ตรวจสอบว่ามีหัวตารางหรือยัง
      if (sheet.getLastRow() === 0) {
        initSheetHeader(sheet);
      }
    }

    // เตรียมข้อมูลแถวใหม่
    // หัวข้อ: วันที่–เวลา, ชื่อ–นามสกุล, ชั้น, เลขที่, คะแนน, จำนวนข้อถูก, ระดับผลการเรียนรู้, สถานะการเล่น
    const timestamp = data.timestamp || Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss");
    const fullName = data.fullName || "-";
    const studentClass = data.studentClass || "-";
    const studentNo = data.studentNo || "-";
    const score = Number(data.score) || 0;
    const correctCount = Number(data.correctCount) || 0;
    const evaluationLevel = data.evaluationLevel || calculateEvaluationLevel(score);
    const playStatus = data.playStatus || "เล่นจบเกม (Completed)";

    const newRow = [
      timestamp,
      fullName,
      studentClass,
      studentNo,
      score,
      correctCount,
      evaluationLevel,
      playStatus
    ];

    sheet.appendRow(newRow);

    // จัดรูปแบบแถวล่าสุดให้อ่านง่ายและสวยงาม
    const lastRowIndex = sheet.getLastRow();
    const rowRange = sheet.getRange(lastRowIndex, 1, 1, newRow.length);
    rowRange.setFontFamily("Sarabun");
    rowRange.setFontSize(11);
    rowRange.setVerticalAlignment("middle");
    
    // จัดกึ่งกลางสำหรับคอลัมน์ วันที่, ชั้น, เลขที่, คะแนน, จำนวนข้อ, สถานะ
    sheet.getRange(lastRowIndex, 1).setHorizontalAlignment("center");
    sheet.getRange(lastRowIndex, 3, 1, 6).setHorizontalAlignment("center");

    return createJsonResponse({
      status: "success",
      message: "บันทึกผลการเรียนรู้สำเร็จเรียบร้อยแล้ว!",
      row: lastRowIndex,
      data: {
        timestamp: timestamp,
        fullName: fullName,
        score: score,
        evaluationLevel: evaluationLevel
      }
    });

  } catch (error) {
    return createJsonResponse({
      status: "error",
      message: "เกิดข้อผิดพลาดในการบันทึก: " + error.toString()
    });
  } finally {
    lock.releaseLock();
  }
}

/**
 * ฟังก์ชันรับคำขอ GET สำหรับทดสอบการเชื่อมต่อ
 */
function doGet(e) {
  return createJsonResponse({
    status: "online",
    message: "Google Apps Script สำหรับเกม 'ภารกิจพิชิตโลกคอมพิวเตอร์' พร้อมทำงานแล้ว!",
    spreadsheetId: SPREADSHEET_ID,
    sheetName: SHEET_NAME,
    serverTime: Utilities.formatDate(new Date(), "Asia/Bangkok", "dd/MM/yyyy HH:mm:ss")
  });
}

/**
 * ฟังก์ชันสร้างหัวตารางและจัดสไตล์
 */
function initSheetHeader(sheet) {
  const headers = [
    "วันที่–เวลา",
    "ชื่อ–นามสกุล",
    "ชั้น",
    "เลขที่",
    "คะแนน (เต็ม 100)",
    "จำนวนข้อถูก (จาก 5 ข้อ)",
    "ระดับผลการเรียนรู้",
    "สถานะการเล่น"
  ];

  sheet.appendRow(headers);

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground("#3b82f6"); // สีน้ำเงินสดใส
  headerRange.setFontColor("#ffffff");
  headerRange.setFontWeight("bold");
  headerRange.setFontFamily("Sarabun");
  headerRange.setFontSize(12);
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");

  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  // ปรับความกว้างคอลัมน์โดยประมาณ
  sheet.setColumnWidth(1, 160); // วันที่-เวลา
  sheet.setColumnWidth(2, 200); // ชื่อ-นามสกุล
  sheet.setColumnWidth(3, 90);  // ชั้น
  sheet.setColumnWidth(4, 80);  // เลขที่
  sheet.setColumnWidth(5, 130); // คะแนน
  sheet.setColumnWidth(6, 170); // จำนวนข้อถูก
  sheet.setColumnWidth(7, 160); // ระดับผลการเรียนรู้
  sheet.setColumnWidth(8, 170); // สถานะการเล่น
}

/**
 * คำนวณระดับผลการเรียนรู้ตามเกณฑ์คะแนนสำหรับเด็ก ป.1
 */
function calculateEvaluationLevel(score) {
  if (score >= 90) return "🌟 ยอดเยี่ยม (Excellent)";
  if (score >= 80) return "🥇 ดีมาก (Very Good)";
  if (score >= 60) return "🥈 ดี (Good)";
  return "🥉 ผ่านเกณฑ์ (Pass)";
}

/**
 * สร้าง HTTP Response ในรูปแบบ JSON พร้อมรองรับ CORS
 */
function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
