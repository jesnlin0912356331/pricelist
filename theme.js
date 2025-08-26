
// theme.js

// 頁面載入時，先套用使用者設定 or 系統偏好
(function () {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    // 如果有儲存設定，套用
    document.body.classList.toggle("dark-mode", savedTheme === "dark");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    // 如果沒有設定 → 跟隨系統
    document.body.classList.add("dark-mode");
    localStorage.setItem("theme", "dark");
  } else {
    localStorage.setItem("theme", "light");
  }
})();

// ✅ 提供按鈕手動切換
function toggleTheme() {
  const isDark = document.body.classList.toggle("dark-mode");
  localStorage.setItem("theme", isDark ? "dark" : "light");
}
