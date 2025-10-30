---
title: 'podong 블로그에 오신 것을 환영합니다'
date: 2025-10-30
tags: ['Welcome', 'Blog']
category: 'General'
description: 'podong 블로그 소개 및 사용 방법'
---

# podong 블로그에 오신 것을 환영합니다! 🎉

안녕하세요! **podong** 블로그에 오신 것을 환영합니다.

이 블로그는 GitHub Pages를 활용한 정적 블로그로, Vanilla JavaScript와 마크다운으로 운영됩니다.

## ✨ 주요 기능

### 1. 마크다운 지원
모든 게시글은 마크다운으로 작성되며, 자동으로 HTML로 변환됩니다.

### 2. 다크 모드
우측 상단의 🌙/☀️ 버튼을 클릭하여 다크/라이트 모드를 전환할 수 있습니다.

### 3. 태그 필터링
관심 있는 주제의 태그를 클릭하여 관련 게시글만 볼 수 있습니다.

### 4. 검색 기능
상단 검색창에서 제목, 태그, 내용으로 게시글을 검색할 수 있습니다.

### 5. 댓글 시스템
각 게시글 하단에서 GitHub Discussions를 활용한 댓글을 남길 수 있습니다.

## 🚀 기술 스택

- **HTML/CSS/JavaScript**: 순수 웹 기술
- **marked.js**: 마크다운 파싱
- **Prism.js**: 코드 하이라이팅
- **Giscus**: GitHub Discussions 기반 댓글
- **GitHub Actions**: 자동 배포

## 📝 코드 예시

JavaScript 코드도 깔끔하게 표시됩니다:

```javascript
// 간단한 인사 함수
function greet(name) {
  console.log(`안녕하세요, ${name}님!`);
}

greet('podong');
```

Python 코드도 지원합니다:

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print([fibonacci(i) for i in range(10)])
```

## 💡 게시글 작성 방법

1. `pages/` 폴더에 마크다운 파일 생성
2. Front Matter 작성 (제목, 날짜, 태그 등)
3. 내용 작성
4. Git push → 자동 배포!

Front Matter 예시:

```yaml
---
title: '게시글 제목'
date: 2025-10-30
tags: ['JavaScript', 'Web']
category: 'Development'
description: '게시글 설명'
---
```

## 📚 다양한 마크다운 문법

### 목록
- 순서 없는 목록
- 항목 2
  - 중첩된 항목
  - 또 다른 중첩 항목

### 순서 있는 목록
1. 첫 번째 항목
2. 두 번째 항목
3. 세 번째 항목

### 인용구
> 좋은 코드는 그 자체로 최고의 문서다.
> 
> — Steve McConnell

### 표
| 기능 | 지원 여부 |
|------|-----------|
| 마크다운 | ✅ |
| 다크모드 | ✅ |
| 댓글 | ✅ |
| 검색 | ✅ |

### 링크와 이미지
[GitHub](https://github.com)에서 코드를 확인하세요.

## 🎯 앞으로의 계획

- 더 많은 기술 글 작성
- 프로젝트 소개
- 개발 팁 공유
- 학습 노트

감사합니다! 즐거운 시간 되세요. 😊

