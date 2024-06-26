# 토이 프로젝트 Wrtnrd의 프론트엔드
- `Wrtnrd`는 Write and read의 약자로 말 그대로 쓰고 읽는다는 의미

## 사용 기술과 사용 이유
### Next.js: 14.1.3
- 서버 컴포넌트가 기본인 환경과 app 라우팅에 대한 경험
### @tanstack/react-query: 5.28.4
- 많이 사용되는 데이터 페칭 라이브러리
- 단순한 페칭 넘어서 여러가지 편의 기능 제공
- `queryKey`를 사용해 편리하게 데이터 최신화 가능
- 무한 스크롤 구현이 비교적 간편([관련 블로그](https://literate-t.tistory.com/444))
### axios: 1.6.8
  - 많이 사용되는 데이터 페칭 라이브러리
  - `interceptor` 설정이 간편
### react-icons: 5.2.1
  - 편리한 `react` 전용 아이콘 사용
### react-toastify: 10.0.4
- 편리한 `toast` 사용
### recoil: 0.7.7
- 비교적 익숙한 상태 관리 라이브러리
- 공식적으로 유지보수가 중단되면 zotai, zustand 등으로 변경 가능
### formik: 2.4.5(입력 필드 관리 라이브러리)
- 입력 필드 검증 등의 편의 기능 제공

## 인증
- `JWT` 사용
  - 도메인이 같은 경우에는 쿠키 사용 가능 `HttpOnly`, `Secure`
  - 지금 배포 환경은 도메인이 다르기 때문에 `Authorization` 헤더에 `Bearer` 타입으로 토큰을 전달 
- 액세스 토큰이 만료되면 리프레시 토큰으로 재발급
  - 토큰 재발급 이후에 이전 요청을 이어서 할 수 있도록 자동화
  - 리프레시 토큰이 만료되었을 경우에는 강제 로그아웃을 진행
## TODO
- 배포
  - `Vercel`
- 관리자 모드(예정)
  - 게시물 삭제
  - 토큰 무효화
