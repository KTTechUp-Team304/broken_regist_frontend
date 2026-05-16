# broken_regist_frontend

수강신청 기반 취약점 학습용 Next.js 프론트엔드입니다.  
백엔드 API와 연동해 학생·교수·관리자 화면을 제공합니다.

## 1) 팀원 온보딩: 사전 설치

- `Node.js` 20+ (LTS 권장)
- **Yarn** (패키지 매니저 — 이 저장소는 `npm`이 아닌 **Yarn**으로 의존성·스크립트를 실행합니다)
- [broken_regist_backend](../broken_regist_backend/README.md) 로컬 실행 환경 (PostgreSQL + NestJS)

> 백엔드는 `npm`을 사용할 수 있습니다. 프론트만 Yarn 기준으로 맞춰 주세요.  
> `npm install` / `npm run` 대신 `yarn` / `yarn <script>`를 사용하세요.

## 2) 빠른 시작

백엔드가 **포트 4000**에서 떠 있어야 합니다. (`broken_regist_backend` 기본값)

```bash
# 1) 의존성 설치
yarn install

# 2) 개발 서버 실행
yarn dev
```

- 프론트: [http://localhost:3000](http://localhost:3000)
- API 요청: 브라우저에서는 `/api/*` → `http://localhost:4000/api/*` 로 프록시 (`next.config.mjs` rewrites)

### 백엔드와 함께 실행할 때

```bash
# 터미널 1 — 백엔드 (broken_regist_backend)
npm run start:dev

# 터미널 2 — 프론트 (broken_regist_frontend)
yarn dev
```

백엔드 Swagger: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

## 3) 주요 화면

| 경로                        | 설명                        | 대상          |
| --------------------------- | --------------------------- | ------------- |
| `/login`                    | 로그인                      | 공개          |
| `/register`                 | 회원가입 (`student`만 생성) | 공개          |
| `/dashboard`                | 내 수강 현황                | 로그인 사용자 |
| `/course`                   | 강의 목록                   | 로그인 사용자 |
| `/course/[courseId]`        | 강의 상세·수강신청          | 로그인 사용자 |
| `/course/[courseId]/files`  | 강의 자료                   | 로그인 사용자 |
| `/admin`                    | 관리자 대시보드             | `admin`       |
| `/admin/courses`            | 강의 관리                   | `admin`       |
| `/admin/courses/[courseId]` | 강의 수정                   | `admin`       |
| `/admin/users`              | 사용자 관리                 | `admin`       |

- 루트(`/`)는 `/dashboard`로 리다이렉트됩니다.
- `admin` 역할로 로그인하면 `/admin`으로, 그 외 역할은 `/dashboard`로 이동합니다.

## 4) 인증·API 연동

- **Access Token**: `localStorage`의 `accessToken`에 저장, `authFetch`가 `Authorization: Bearer` 헤더로 전송합니다.
- **Refresh Token**: HttpOnly 쿠키로 백엔드가 관리하며, `/api/auth/refresh`로 access token을 재발급합니다.
- **세션**: JWT 만료 시각 기준으로 사이드바 타이머·가드가 동작합니다. 수동 연장은 `SessionTimer`에서 refresh API를 호출합니다.
- **가드**: `AuthGuard`가 `/login`, `/register`를 제외한 경로에서 로그인·유효 토큰을 확인합니다.

API 클라이언트는 `src/commons/api/`에 모듈별로 분리되어 있습니다.

| 파일             | 역할                                    |
| ---------------- | --------------------------------------- |
| `auth-api.ts`    | 로그인·회원가입·`/auth/me`·수강 목록 등 |
| `courses-api.ts` | 강의 목록·상세·수강신청·취소            |
| `admin-api.ts`   | 관리자 대시보드·강의·사용자 API         |
| `auth-fetch.ts`  | Bearer 헤더·refresh 공통 fetch          |

백엔드 API 스펙·취약점 시나리오는 [`broken_regist_backend/docs`](../broken_regist_backend/docs/)를 참고하세요.

- `api-list.txt` — API 목록·역할
- `api-docs.txt` — 요청/응답·공격 시나리오
- `api-docs-for-fe.txt` — 프론트 연동 요약

## 5) 테스트 계정 (백엔드 시드)

교수·관리자·강의 데이터는 백엔드 DB 시드가 필요합니다. 자세한 적용 방법은 [백엔드 README § 목데이터](../broken_regist_backend/README.md#3-목데이터시드)를 따르세요.

| username                                | role      | 비밀번호(평문) |
| --------------------------------------- | --------- | -------------- |
| 교수명(`리누즈 토발즈, 앨런 튜링, ...`) | professor | `prof123`      |
| `admin`                                 | admin     | `admin123`     |

학생 계정은 `/register`에서 직접 가입하거나, 백엔드 문서의 테스트 절차를 사용합니다.

## 6) 프로젝트 구조

```
src/
├── app/                    # App Router 페이지·레이아웃
│   ├── (auth)/             # login, register
│   ├── (main)/             # dashboard, course (학생·교수 공통 셸)
│   └── (admin)/            # admin 영역
├── commons/
│   ├── api/                # 백엔드 REST 클라이언트
│   ├── auth/               # 토큰·공개 경로 유틸
│   └── providers/          # AuthContext, React Query
└── components/             # 화면별 UI (login, courses, dashboard, admin …)
```

- UI 스타일: CSS Modules (`*.module.css`)
- 데이터 페칭: TanStack React Query (`commons/providers/react-query`)
- 아이콘: `lucide-react`

## 7) 자주 쓰는 명령어

`package.json` 스크립트는 모두 **Yarn**으로 실행합니다 (`yarn <script>` = `npm run <script>`와 동일).

```bash
yarn install  # 의존성 설치 (최초·패키지 변경 후)
yarn dev      # 개발 서버 (포트 3000)
yarn build    # 프로덕션 빌드
yarn start    # 빌드 결과 실행
yarn lint     # ESLint (Next.js)
```

## 8) 설정 참고

### API 프록시

`next.config.mjs`에서 `/api`를 백엔드로 넘깁니다. 백엔드 포트를 바꾼 경우 destination URL을 함께 수정하세요.

```js
destination: 'http://localhost:4000/api/:path*',
```

### 환경 변수

현재 프론트는 별도 `.env` 없이 상대 경로 `/api`와 rewrites만 사용합니다. 배포 시 백엔드 URL이 달라지면 rewrites 또는 reverse proxy 설정을 맞춰 주세요.

## 9) 관련 저장소

- 백엔드: [`broken_regist_backend`](../broken_regist_backend/)
- VA-MCP 등 에이전트 도구: 상위 모노레포/워크스페이스 구성에 따름
