// 메인 애플리케이션 로직 - 게시글 목록, 필터링

(function () {
  let allPosts = [];
  let currentTag = 'all';

  const postsContainer = document.getElementById('posts-container');
  const tagFilter = document.getElementById('tag-filter');

  // posts.json 로딩
  async function loadPosts() {
    try {
      console.log('[App] posts.json 로딩 시작...');
      const response = await fetch('posts.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      allPosts = await response.json();
      console.log(`[App] ${allPosts.length}개의 게시글을 로드했습니다.`);

      renderTagFilter();
      renderPosts(allPosts);
    } catch (error) {
      console.error('[App] 게시글 로딩 실패:', error);
      postsContainer.innerHTML = `<p class="error">게시글을 불러오는데 실패했습니다. (${error.message})</p>`;
    }
  }

  // 태그 필터 렌더링
  function renderTagFilter() {
    const allTags = new Set();
    allPosts.forEach((post) => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach((tag) => allTags.add(tag));
      }
    });

    // '전체' 버튼은 이미 HTML에 있으므로 태그만 추가
    const sortedTags = Array.from(allTags).sort();
    sortedTags.forEach((tag) => {
      const button = document.createElement('button');
      button.className = 'tag-btn';
      button.textContent = tag;
      button.dataset.tag = tag;
      button.addEventListener('click', () => filterByTag(tag));
      tagFilter.appendChild(button);
    });

    // '전체' 버튼 이벤트 리스너 추가
    const allButton = tagFilter.querySelector('[data-tag="all"]');
    if (allButton) {
      allButton.addEventListener('click', () => filterByTag('all'));
    }

    console.log(`[App] ${sortedTags.length}개의 태그를 렌더링했습니다.`);
  }

  // 태그 필터링
  function filterByTag(tag) {
    console.log(`[App] 태그 필터링: ${tag}`);
    currentTag = tag;

    // 활성 태그 버튼 업데이트
    const buttons = tagFilter.querySelectorAll('.tag-btn');
    buttons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tag === tag);
    });

    // 게시글 필터링
    const filtered =
      tag === 'all'
        ? allPosts
        : allPosts.filter((post) => post.tags && post.tags.includes(tag));

    renderPosts(filtered);
  }

  // 게시글 목록 렌더링
  function renderPosts(posts) {
    if (!posts || posts.length === 0) {
      postsContainer.innerHTML = '<p class="loading">게시글이 없습니다.</p>';
      return;
    }

    postsContainer.innerHTML = posts
      .map(
        (post) => `
      <article class="post-item">
        <h2 class="post-title">
          <a href="post.html?post=${encodeURIComponent(post.file)}">${
          post.title
        }</a>
        </h2>
        <div class="post-info">
          <span class="post-date">${post.date}</span>
          ${
            post.category
              ? `<span class="post-category">${post.category}</span>`
              : ''
          }
        </div>
        ${
          post.description
            ? `<p class="post-description">${post.description}</p>`
            : ''
        }
        ${post.excerpt ? `<p class="post-excerpt">${post.excerpt}</p>` : ''}
        ${
          post.tags && post.tags.length > 0
            ? `
          <div class="post-tags">
            ${post.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
          </div>
        `
            : ''
        }
      </article>
    `,
      )
      .join('');

    console.log(`[App] ${posts.length}개의 게시글을 렌더링했습니다.`);
  }

  // 검색 통합 (search.js에서 호출)
  window.filterPosts = function (searchTerm) {
    console.log(`[App] 검색 필터링: "${searchTerm}"`);
    const term = searchTerm.toLowerCase();

    let filtered = allPosts;

    // 태그 필터 적용
    if (currentTag !== 'all') {
      filtered = filtered.filter(
        (post) => post.tags && post.tags.includes(currentTag),
      );
    }

    // 검색어 필터 적용
    if (term) {
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(term) ||
          (post.description &&
            post.description.toLowerCase().includes(term)) ||
          (post.excerpt && post.excerpt.toLowerCase().includes(term)) ||
          (post.tags && post.tags.some((tag) => tag.toLowerCase().includes(term))),
      );
    }

    renderPosts(filtered);
  };

  // 페이지 로드 시 실행
  loadPosts();
})();

