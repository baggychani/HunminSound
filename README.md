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

## 배포 (Vercel)

GitHub 저장소를 [Vercel](https://vercel.com/)에 연결하면 `main` 브랜치 푸시 시 자동 배포됩니다.  
프로젝트 설정에서 위 환경 변수(`NEXT_PUBLIC_SANITY_*` 등)를 동일하게 등록하세요.

## 라이선스

프로젝트 정책에 맞게 추후 명시 예정.
