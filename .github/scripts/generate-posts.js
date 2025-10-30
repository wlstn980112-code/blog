const fs = require('fs');
const path = require('path');

const postsDir = 'pages';
const outputFile = 'posts.json';

console.log('[generate-posts] 시작...');

if (!fs.existsSync(postsDir)) {
  console.log('[generate-posts] pages 디렉토리가 없습니다. 빈 posts.json을 생성합니다.');
  fs.writeFileSync(outputFile, JSON.stringify([], null, 2));
  process.exit(0);
}

const files = fs
  .readdirSync(postsDir)
  .filter((file) => file.endsWith('.md'))
  .sort((a, b) => b.localeCompare(a));

console.log(`[generate-posts] ${files.length}개의 마크다운 파일 발견`);

const posts = files.map((filename) => {
  const filePath = path.join(postsDir, filename);
  const content = fs.readFileSync(filePath, 'utf8');

  console.log(`[generate-posts] 처리 중: ${filename}`);

  // Front Matter 파싱
  const frontMatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  let metadata = {};
  let postContent = content;

  if (frontMatterMatch) {
    const frontMatter = frontMatterMatch[1];
    postContent = frontMatterMatch[2];

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
  }

  // 발췌문 생성 (첫 200자)
  const excerpt = postContent
    .replace(/```[\s\S]*?```/g, '') // 코드 블록 제거
    .replace(/#{1,6}\s+/g, '') // 헤더 마커 제거 (# ## ### 등)
    .replace(/!\[.*?\]\(.*?\)/g, '') // 이미지 제거
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // 링크는 텍스트만 남기기
    .replace(/\*\*([^*]+)\*\*/g, '$1') // 볼드 마커 제거, 텍스트 유지
    .replace(/\*([^*]+)\*/g, '$1') // 이탤릭 마커 제거, 텍스트 유지
    .replace(/`([^`]+)`/g, '$1') // 인라인 코드 마커 제거, 텍스트 유지
    .replace(/^\s*[-*+]\s+/gm, '') // 불릿 리스트 마커 제거
    .replace(/^\s*\d+\.\s+/gm, '') // 숫자 리스트 마커 제거 (1. 2. 3. 등)
    .replace(/[\r\n]+/g, ' ') // 줄바꿈을 공백으로
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로
    .trim()
    .substring(0, 200)
    .trim();

  return {
    file: filename,
    title: metadata.title || filename.replace('.md', ''),
    date: metadata.date || new Date().toISOString().split('T')[0],
    tags: Array.isArray(metadata.tags) ? metadata.tags : [],
    category: metadata.category || '',
    description: metadata.description || '',
    excerpt: excerpt + (excerpt.length === 200 ? '...' : ''),
  };
});

// 날짜순 정렬 (최신순)
posts.sort((a, b) => new Date(b.date) - new Date(a.date));

fs.writeFileSync(outputFile, JSON.stringify(posts, null, 2));
console.log(`[generate-posts] posts.json 생성 완료: ${posts.length}개 게시글`);

