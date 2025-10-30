---
title: 'JavaScript 비동기 프로그래밍 완벽 가이드'
date: 2025-10-29
tags: ['JavaScript', 'Async', 'Promise']
category: 'Development'
description: 'JavaScript의 비동기 처리 방법을 콜백부터 async/await까지 자세히 알아봅니다'
---

# JavaScript 비동기 프로그래밍 완벽 가이드

JavaScript에서 비동기 프로그래밍은 필수적인 개념입니다. 이 글에서는 콜백부터 Promise, async/await까지 단계별로 알아보겠습니다.

## 🤔 왜 비동기가 필요한가?

JavaScript는 **싱글 스레드** 언어입니다. 즉, 한 번에 하나의 작업만 처리할 수 있습니다.

만약 서버에서 데이터를 가져오는 작업이 있다면?

```javascript
// ❌ 동기 방식 (가상 코드)
const data = fetchDataFromServer(); // 3초 걸림
console.log(data);
console.log('다음 작업'); // 3초 후에 실행됨
```

이렇게 되면 데이터를 받는 동안 **화면이 멈춰버립니다**. 사용자 경험에 치명적이죠.

## 📌 1단계: 콜백 함수

초기 JavaScript의 비동기 처리 방법입니다.

```javascript
function fetchData(callback) {
  setTimeout(() => {
    const data = { name: 'podong', role: 'developer' };
    callback(data);
  }, 1000);
}

fetchData((data) => {
  console.log(data);
});
```

### 콜백 지옥 (Callback Hell)

하지만 비동기 작업이 중첩되면 문제가 생깁니다:

```javascript
fetchUser((user) => {
  fetchPosts(user.id, (posts) => {
    fetchComments(posts[0].id, (comments) => {
      console.log(comments);
      // 😱 점점 깊어지는 중첩...
    });
  });
});
```

## ⭐ 2단계: Promise

ES6에서 도입된 Promise는 콜백 지옥을 해결합니다.

```javascript
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true;
      
      if (success) {
        resolve({ name: 'podong', role: 'developer' });
      } else {
        reject(new Error('Failed to fetch data'));
      }
    }, 1000);
  });
}

// 사용법
fetchData()
  .then((data) => {
    console.log('✅ Success:', data);
    return data.name;
  })
  .then((name) => {
    console.log('Name:', name);
  })
  .catch((error) => {
    console.error('❌ Error:', error);
  })
  .finally(() => {
    console.log('🏁 Complete');
  });
```

### Promise 체이닝

```javascript
fetchUser()
  .then((user) => fetchPosts(user.id))
  .then((posts) => fetchComments(posts[0].id))
  .then((comments) => console.log(comments))
  .catch((error) => console.error(error));
```

훨씬 읽기 쉬워졌습니다!

## 🚀 3단계: async/await

ES2017의 async/await는 비동기 코드를 동기 코드처럼 작성할 수 있게 해줍니다.

```javascript
async function getData() {
  try {
    const data = await fetchData();
    console.log('✅ Success:', data);
    
    const name = data.name;
    console.log('Name:', name);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    console.log('🏁 Complete');
  }
}

getData();
```

### 병렬 처리

여러 비동기 작업을 동시에 실행하려면?

```javascript
async function fetchAllData() {
  try {
    // 순차 실행 (느림)
    const user = await fetchUser();
    const posts = await fetchPosts();
    
    // 병렬 실행 (빠름) ⚡
    const [user2, posts2] = await Promise.all([
      fetchUser(),
      fetchPosts()
    ]);
    
    console.log('Done!');
  } catch (error) {
    console.error(error);
  }
}
```

## 💡 실전 예제: API 호출

```javascript
// GitHub API에서 사용자 정보 가져오기
async function getGitHubUser(username) {
  try {
    console.log(`🔍 Fetching data for ${username}...`);
    
    const response = await fetch(
      `https://api.github.com/users/${username}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('✅ User data:', {
      name: data.name,
      repos: data.public_repos,
      followers: data.followers
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  }
}

// 사용
getGitHubUser('wlstn980112-code');
```

## 🎯 Promise 유틸리티 메서드

### Promise.all()
모든 Promise가 완료될 때까지 대기 (하나라도 실패하면 전체 실패)

```javascript
const promises = [
  fetch('/api/users'),
  fetch('/api/posts'),
  fetch('/api/comments')
];

const results = await Promise.all(promises);
```

### Promise.race()
가장 빠른 Promise의 결과를 반환

```javascript
const fastest = await Promise.race([
  fetchFromServer1(),
  fetchFromServer2(),
  fetchFromServer3()
]);
```

### Promise.allSettled()
모든 Promise의 결과를 반환 (성공/실패 여부 무관)

```javascript
const results = await Promise.allSettled([
  fetchData1(),
  fetchData2(),
  fetchData3()
]);

results.forEach((result) => {
  if (result.status === 'fulfilled') {
    console.log('✅', result.value);
  } else {
    console.log('❌', result.reason);
  }
});
```

## 📚 정리

| 방법 | 장점 | 단점 |
|------|------|------|
| 콜백 | 간단함 | 콜백 지옥 |
| Promise | 체이닝 가능 | 문법이 길어질 수 있음 |
| async/await | 읽기 쉬움 | 에러 처리에 try-catch 필요 |

## 🎓 베스트 프랙티스

1. **async/await 사용하기**: 가장 최신이고 읽기 쉬운 방법
2. **에러 처리 필수**: try-catch로 항상 에러 처리
3. **병렬 처리 고려**: 독립적인 작업은 Promise.all() 사용
4. **타임아웃 설정**: 무한 대기 방지

```javascript
async function fetchWithTimeout(url, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }
    throw error;
  }
}
```

## 🔗 참고 자료

- [MDN: Promise](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- [MDN: async function](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Statements/async_function)
- [JavaScript.info: 프라미스와 async/await](https://ko.javascript.info/async)

비동기 프로그래밍을 마스터하면 JavaScript 실력이 한 단계 올라갑니다. 계속 연습하세요! 💪

