# 세종말소리 · Sejong Speech Sounds

한국어 자음·모음의 조음(調音) 과정을 MRI 영상 등으로 탐구하는 **한국어 조음 음성학 연구 아카이브** 웹사이트입니다.  
Next.js 기반으로 구축되었으며, 다국어 UI·라이트/다크 테마·Sanity CMS 연동을 지원합니다.

## 기술 스택

- **프레임워크**: [Next.js](https://nextjs.org/) 14 (App Router)
- **UI**: React 18, [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **CMS**: [Sanity](https://www.sanity.io/) (`next-sanity`)
- **테마**: `next-themes`

## 로컬 개발

```bash
npm install
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

## 빌드

```bash
npm run build
npm start
```

## 환경 변수

Sanity 프로젝트를 연결하려면 저장소 루트에 `.env.local`을 만들고 `.env.example`을 참고해 값을 채웁니다.

```bash
cp .env.example .env.local
```

## 관리자 화면과 코드에서 같은 글 고치기

자음·모음 설명, 훈민정음 풀이, 홈 문구는 `src/data/text/*.json`에, 연구 소개는 `src/data/research-content.json`에만 있습니다.

- 관리자 화면에서 저장하면 사이트가 바로 바뀌고, 같은 글이 이 파일들에 `[cms-save]` 커밋으로 자동으로 들어갑니다. 이 커밋은 다시 빌드하지 않습니다.
- 코드로 고칠 때는 먼저 `git pull`을 합니다. 그러면 관리자 화면에서 고친 글부터 이어서 고치게 됩니다.
- 코드로 고쳐 푸시하면 배포된 뒤 사이트와 관리자 화면에도 그 글이 들어갑니다. 양쪽이 같은 글을 따로 고쳤으면 덮지 않고, 관리자 화면 위쪽에서 어느 쪽을 쓸지 고르게 합니다.
- 이 자동 커밋에는 Vercel 환경 변수 `GITHUB_CONTENT_TOKEN`(이 저장소 Contents 읽기·쓰기 권한)이 필요합니다.
- 토큰이 없거나 만료돼도 사이트와 관리자 화면 저장은 그대로 됩니다. 이때는 관리자 화면 위쪽에 "코드에 아직 안 들어간 글"이 보이고, 코드로 고치기 전에 `npm run pull-site-text`를 실행해 사이트의 현재 글을 코드 파일로 받아 온 뒤 커밋하고 고칩니다.

## 배포 (Vercel)

GitHub 저장소를 [Vercel](https://vercel.com/)에 연결하면 `main` 브랜치 푸시 시 자동 배포됩니다.  
프로젝트 설정에서 위 환경 변수(`NEXT_PUBLIC_SANITY_*` 등)를 동일하게 등록하세요.

## 라이선스

프로젝트 정책에 맞게 추후 명시 예정.
