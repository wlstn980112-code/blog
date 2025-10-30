// 테마 관리 (다크/라이트 모드)

(function () {
  const THEME_KEY = 'blog-theme';
  const themeToggle = document.getElementById('theme-toggle');
  const themeIcon = themeToggle?.querySelector('.theme-icon');

  // 저장된 테마 로드 또는 시스템 설정 사용
  function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // 시스템 다크모드 설정 확인
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  // 테마 적용
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    localStorage.setItem(THEME_KEY, theme);
    console.log(`[Theme] 테마 변경: ${theme}`);
  }

  // 테마 토글
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
  }

  // 초기 테마 적용
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);

  // 토글 버튼 이벤트 리스너
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // 시스템 테마 변경 감지
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      // 사용자가 수동으로 설정한 테마가 없을 때만 시스템 설정 따르기
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
})();

