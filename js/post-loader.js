// 게시글 로더 - 마크다운 파싱 및 Giscus 댓글

(function () {
  const postContent = document.getElementById('post-content');
  const postMeta = document.getElementById('post-meta');
  const pageTitle = document.getElementById('page-title');

  // URL 파라미터에서 게시글 파일명 추출
  function getPostFile() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post');
  }

  // Front Matter 파싱
  function parseFrontMatter(content) {
    const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontMatterMatch) {
      return { metadata: {}, content: content };
    }

    const frontMatter = frontMatterMatch[1];
    const postContent = frontMatterMatch[2];
    const metadata = {};

    // Front Matter 라인 파싱
    const lines = frontMatter.split('\n');
    lines.forEach((line) => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // 따옴표 제거
        if (
          (value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))
        ) {
          value = value.slice(1, -1);
        }

        // 배열 파싱 (tags)
        if (key === 'tags' && value.startsWith('[') && value.endsWith(']')) {
          try {
            value = JSON.parse(value);
          } catch {
            value = value
              .slice(1, -1)
              .split(',')
              .map((tag) => tag.trim().replace(/^['"]|['"]$/g, ''));
          }
        }

        metadata[key] = value;
      }
    });

    return { metadata, content: postContent };
  }

  // 게시글 메타데이터 렌더링
  function renderMetadata(metadata) {
    const title = metadata.title || '제목 없음';
    const date = metadata.date || '';
    const category = metadata.category || '';
    const tags = metadata.tags || [];

    // 페이지 제목 업데이트
    pageTitle.textContent = `${title} - podong`;

    postMeta.innerHTML = `
      <h1>${title}</h1>
      <div class="post-info">
        ${date ? `<span class="post-date">${date}</span>` : ''}
        ${category ? `<span class="post-category">${category}</span>` : ''}
      </div>
      ${
        tags.length > 0
          ? `
        <div class="post-tags">
          ${tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}
        </div>
      `
          : ''
      }
    `;

    console.log('[PostLoader] 메타데이터 렌더링 완료:', metadata);
  }

  // 게시글 로딩
  async function loadPost() {
    const postFile = getPostFile();

    if (!postFile) {
      postMeta.innerHTML = '<p class="error">게시글을 찾을 수 없습니다.</p>';
      postContent.innerHTML = '';
      return;
    }

    try {
      console.log(`[PostLoader] 게시글 로딩 시작: ${postFile}`);

      const response = await fetch(`pages/${postFile}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const markdown = await response.text();
      console.log('[PostLoader] 마크다운 파일 로드 완료');

      // Front Matter 파싱
      const { metadata, content } = parseFrontMatter(markdown);

      // 메타데이터 렌더링
      renderMetadata(metadata);

      // 마크다운 → HTML 변환
      if (typeof marked === 'undefined') {
        throw new Error('marked.js가 로드되지 않았습니다.');
      }

      // marked 설정
      marked.setOptions({
        breaks: true,
        gfm: true,
      });

      const html = marked.parse(content);
      postContent.innerHTML = html;

      console.log('[PostLoader] 마크다운 파싱 완료');

      // Prism.js 코드 하이라이팅 적용
      if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
        console.log('[PostLoader] 코드 하이라이팅 적용 완료');
      }

      // Giscus 댓글 로드
      loadGiscus();
    } catch (error) {
      console.error('[PostLoader] 게시글 로딩 실패:', error);
      postMeta.innerHTML = '<p class="error">게시글을 불러오는데 실패했습니다.</p>';
      postContent.innerHTML = `<p class="error">오류: ${error.message}</p>`;
    }
  }

  // Giscus 댓글 시스템 로드
  function loadGiscus() {
    console.log('[PostLoader] Giscus 댓글 시스템 로딩...');

    const giscusContainer = document.querySelector('.giscus');
    if (!giscusContainer) {
      console.warn('[PostLoader] Giscus 컨테이너를 찾을 수 없습니다.');
      return;
    }

    // Giscus 스크립트 생성
    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'wlstn980112-code/wlstn980112-code.github.io');
    script.setAttribute('data-repo-id', 'YOUR_REPO_ID'); // 실제 값은 https://giscus.app/ko 에서 설정
    script.setAttribute('data-category', 'General');
    script.setAttribute('data-category-id', 'YOUR_CATEGORY_ID'); // 실제 값은 https://giscus.app/ko 에서 설정
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'ko');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    giscusContainer.appendChild(script);
    console.log('[PostLoader] Giscus 스크립트 로드 완료');
  }

  // 페이지 로드 시 실행
  if (postContent && postMeta) {
    loadPost();
  }
})();

