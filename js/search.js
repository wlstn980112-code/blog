// 검색 기능

(function () {
  const searchInput = document.getElementById('search-input');

  if (!searchInput) {
    return;
  }

  // 디바운스 함수 (과도한 검색 방지)
  function debounce(func, delay) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), delay);
    };
  }

  // 검색 처리
  function handleSearch() {
    const searchTerm = searchInput.value.trim();
    console.log(`[Search] 검색어 입력: "${searchTerm}"`);

    // app.js의 filterPosts 함수 호출
    if (window.filterPosts) {
      window.filterPosts(searchTerm);
    }
  }

  // 검색 입력 이벤트 (디바운스 적용)
  searchInput.addEventListener('input', debounce(handleSearch, 300));

  // 엔터키로 즉시 검색
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  });

  console.log('[Search] 검색 기능 초기화 완료');
})();

