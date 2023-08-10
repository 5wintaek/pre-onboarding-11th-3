# 원티드 프론트엔드 인턴쉽 과제

<br/>

## 프로젝트 소개

> 특정 [github 레포지토리](https://github.com/facebook/react/issues?q=is%3Aissue+is%3Aopen+sort%3Acomments-desc)의 이슈 목록과 상세 내용을 확인하는 웹 사이트 구축

## 프로젝트 기간

2023.7.11 ~ 2023.7.14 (4일)

## 실행방법

```bash
$ npm install
$ process.env.REACT_APP_GIT_ISSUE_ACCESS_TOKEN="<개인Token>"
$ npm run start
```

## 전체 구동 화면

![Alt text](preonboarding-3.gif)

## 기술스택

![react](https://img.shields.io/badge/react-18.2.0-61DAFB?logo=react)
![emotion](https://img.shields.io/badge/emotion-11.11.1-F43059?logo=emotion)
![reactrouter](https://img.shields.io/badge/react--router--dom-6.14.1-CA4245?logo=reactrouter)
![axios](https://img.shields.io/badge/axios-1.4.0-5A29E4?logo=axios)
![eslint](https://img.shields.io/badge/eslint-8.44.0-A100FF?logo=eslint)
![prettier](https://img.shields.io/badge/prettier-3.0.0-F7B93E?logo=prettier)
![reactMarkdown](https://img.shields.io/badge/react--markdown-8.0.6-00A98F?logo=reactMarkdown)

## 폴더구조

📦src
┣ 📂Pages
┃ ┣ 📜DetailPage.jsx
┃ ┣ 📜ErrorPage.jsx
┃ ┗ 📜MainPage.jsx
┣ 📂app
┃ ┗ 📜App.jsx
┣ 📂assets
┣ 📂components
┣ 📂Header
┣ 📂IssueDetail
┣ 📂IssueList
┣ 📂IssueListAd
┣ 📂IssueListItem
┣ 📂LoadingScreen
┣ 📂ScrollObserver
┣ 📂context
┃ ┗ 📜GithubContext.jsx
┣ 📂hooks
┣ 📂utils
┣ 📂Pages
┗ 📜index.jsx

---

## 기능소개

### API 처리

- fetch 요청 처리 함수를 유틸함수로 분리, 중복되는 부분 최소화

```js
export const getIssueList = async (perPage, Page) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repo}/issues?per_page=${perPage}&page=${Page}&sort=comments`, // per_page = Query parameters
      {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
};

export const getIssue = async (issueNumber) => {
  try {
    const response = await axios.get(
      `https://api.github.com/repos/${repoOwner}/${repo}/issues/${issueNumber}`,
      {
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(String(error));
  }
};
```

### Context API

- GithubContext 안에 이슈 리스트, 이슈 디테일, 로딩부분을 다룸
- fetch 함수에서도 같이 다루듯 한번에 다룰 수 있다는것이 장점
- 로딩로직을 root에서 뿌려줌으로써 로딩을 편리하게 관리할 수 있음

### 이슈 목록 구현

- 구분하기 용이하게 리스트와 리스트 아이템, 디테일을 따로 관리함
- 리스트 아이템 하나로 리스트와 Detail 부분을 렌더링

### 인피니티 스크롤 구현

- Intersection Observer 를 사용하여 분리하기 편하게 useInfiniteScroll 훅을 생성하여 관리
- 화면에 특성 요소가 보일 때 setIntersecting 함수를 호출하여 intersecting 상태를 업데이트를 함
- 함수 내부에서 생성하는 IntersectionObserver 인스턴스는 컴포넌트가 렌더링될 떄마다 새로 생성되지 않도록 해야 함. 이를 위해 useCallback을 사용하여 함수를 메모이제이션하고 동일한 인스턴스를 재사용하기 위해 사용함
- useEffect 훅은 컴포넌트가 마운트되거나 target 이 변경될 떄마다 작동한다. 여기서 IntersectionObserver를 설정하고 대상 요소를 감시한다. Observe 메서드를 사용하여 대상 요소의 가시성 변화를 감지하게 된다.

```js
import { useState, useEffect, useCallback, useRef } from 'react';

const useInfiniteScroll = (target) => {
  const [intersecting, setIntersecting] = useState(false);
  const observerRef = useRef(null);

  const getObserver = useCallback(() => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) =>
        setIntersecting(entries.some((entry) => entry.isIntersecting))
      );
    }
    return observerRef.current;
  }, []);

  useEffect(() => {
    const observer = getObserver();

    if (target.current) {
      observer.observe(target.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [getObserver, target]);

  return intersecting;
};

export default useInfiniteScroll;
```

### 광고 이미지 출력

- ListAD 컴포넌트 분리
- 후에 작업하기 쉽게 isMultipleOfFive 라는 유틸함수 생성하여 관리

```js
const isMultipleOfFive = (index) => index % 4 === 0;
```

### 데이터 요청 중 로딩

- LoadingScrenn 컴포넌트를 만들어 사용하기 용이하게 관리
- GithubContext 에서 뿌려주기 때문에 최상위 위치에서 뿌려줌으로써 모든 데이터 관리

### 에러 화면 구현

- ErrorPage 컴포넌트 생성 후 에러 메시지 구현
- fetchError 를 뱉을 경우 ErrorPage 렌더링
