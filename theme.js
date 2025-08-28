// ============================================================
// theme.js
// 深/淺色主題切換與初始化
// ------------------------------------------------------------
// 用途：
// 1) 在頁面載入時，先依「使用者先前選擇」或「系統偏好」套用深/淺色主題
// 2) 對外提供 toggleTheme() 供按鈕或程式碼手動切換主題
//
// 前置條件（建議樣式結構）：
// - CSS 以 .dark-mode 掛在 <body> 時覆蓋變數或色彩，例如：
//   body.dark-mode { --bg: #121212; --text: #f5f5f5; ... }
// - 頁面中任意元素的顏色/背景/邊框等，使用 var(--*) 參照主題變數
//
// 儲存行為：
// - localStorage 中以 key "theme" 儲存字串 "dark" 或 "light"
// - 若使用者沒有先前選擇，會檢查系統偏好 prefers-color-scheme
//
// 注意事項：
// - 為減少「切換閃爍」（FOUC），建議在 <head> 內盡早載入此檔
// - 本檔僅在載入當下偵測系統偏好；若系統偏好在載入後改變，不會自動跟隨（可延伸監聽 media query）
// ============================================================


// ------------------------------------------------------------
// 立即執行函式（IIFE）
// 目的：在 JS 檔一載入就立即執行初始化邏輯，避免等待 DOMContentLoaded 造成閃爍
// ------------------------------------------------------------
(function () {
  // 從 localStorage 讀取使用者先前選擇的主題（"dark" 或 "light"）
  // 若尚未選擇過，getItem 會回傳 null
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    // [情境 A] 使用者曾經選過主題 → 直接尊重該選擇
    //
    // 使用 classList.toggle( className, forceBoolean ) 的第二個參數「強制模式」，
    // 當為 true 時確保 class 存在；false 則確保 class 被移除
    // 這裡等價於：
    //   if (savedTheme === "dark") body.classList.add("dark-mode");
    //   else body.classList.remove("dark-mode");
    document.body.classList.toggle("dark-mode", savedTheme === "dark");

  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // [情境 B] 尚無使用者設定 → 檢查系統偏好
    // 若系統偏好為深色主題，預設啟用深色，並將選擇寫入 localStorage
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");

  } else {
    // [情境 C] 尚無使用者設定且系統偏好為淺色 → 明確寫入 "light"
    // 之後可供下次載入時快速判斷，避免再次檢查系統偏好
    localStorage.setItem("theme", "light");
  }

  // 補充說明（非必要）：
  // - 若需跨分頁同步主題，可監聽 window 的 "storage" 事件（見下方延伸參考）
})();


// ------------------------------------------------------------
// toggleTheme()
// 目的：提供按鈕或程式手動切換主題
// 用法：<button onclick="toggleTheme()">切換主題</button>
// 回寫：將新狀態寫入 localStorage（"dark" 或 "light"）
// 備註：此函式會切換 body 上的 .dark-mode class
// ------------------------------------------------------------
function toggleTheme() {
  // classList.toggle()（無第二參數）：若當前沒有該 class → 新增；反之移除
  const isDark = document.body.classList.toggle("dark-mode");

  // 同步將最新主題狀態寫入 localStorage
  // isDark 為 true → "dark"；false → "light"
  localStorage.setItem("theme", isDark ? "dark" : "light");
}


// ------------------------------------------------------------
// 【延伸參考：跨分頁同步（可選擇性加入）】
// 若你希望 A 分頁切換主題後，B 分頁也能立即跟著改變，可使用以下範例：
//
// window.addEventListener("storage", (e) => {
//   if (e.key === "theme") {
//     document.body.classList.toggle("dark-mode", e.newValue === "dark");
//   }
// });
//
// 注意：上述監聽需在所有分頁都載入本腳本才會生效。
// ------------------------------------------------------------
