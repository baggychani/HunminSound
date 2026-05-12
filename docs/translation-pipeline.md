# 번역·다국어 처리 개요 (Gemini·외부 검토용)

## 1) UI 문자열 (메뉴, 버튼, 푸터 등)

- **소스**: `src/lib/i18n.ts`  
- **방식**: `ko`, `en`, `zh`, `ja`, `fr`, `de`, `es`, `hi`, `vi`, `ru`, `ar` 객체에 키별로 **직접 번역문을 하드코딩**.  
- **사용**: `getMessages(lang)` → 컴포넌트에서 `m.xxx` 로 표시.  
- **자동 API 없음** — 문구 수정은 이 파일만 편집하면 됩니다.

---

## 2) 자음·모음 **설명** (긴 단락)

### 데이터 소스

| 경로 | 역할 |
|------|------|
| `src/data/consonants.ts` | 로컬 자음 배열, 필드 `description`(한국어 기본) |
| `src/data/vowels.ts` | 로컬 모음 배열, 동일 |
| Sanity CMS (연동 시) | `description`, `description_en` 등 필드 가능 — 타입은 `src/types/index.ts` 참고 |

### 표시 우선순위 (`getDescription`)

`src/lib/i18n.ts` 의 `getDescription(item, lang)`:

1. `lang === 'ko'` → 항상 `item.description` (한국어).  
2. 그 외 언어 → `item[`description_${lang}`]` (`description_en`, `description_vi`, …) 가 비어 있지 않으면 그 문자열 사용 (수동 번역·CMS).  
3. 없으면 **한국어 `description`을 그대로 보여 주고** `isFallback: true` (외국어 UI인데 한글만 있는 상태).

### 자동(기계) 번역 레이어 — `TranslatedDescription`

`src/components/showcase/TranslatedDescription.tsx` 가 **자음/모음 상세** 아래 단락을 담당합니다.

1. `getDescription`으로 CMS/필드 번역이 있으면 그걸 씀.  
2. 없고(`isFallback`) 한국어 원문이 있으면, 캐시 키 `buildMtKey(itemId, lang, item.description)` 생성.  
3. **번들 히트**: `src/data/mt-cache.json` 의 `entries[key]` 에 있으면 그 문자열 사용.  
4. **브라우저**: `localStorage` 키 `sejong-mt:v1:` + 위와 동일한 key.  
5. 둘 다 없으면 `POST /api/translate` 호출.

**한국어 원문이 바뀌면** `hashKoSource` 때문에 키가 바뀌어, 예전 번들/로컬 캐시는 자동으로 안 맞을 수 있습니다. 새 문장으로 다시 돌리려면 `mt-cache.json` 갱신 또는 로컬스토리지 비우기가 필요할 수 있습니다.

### API 라우트

- **`src/app/api/translate/route.ts`**  
  - `ko` → 대상 언어로 **MyMemory** 공개 API (`api.mymemory.translated.net`) GET 호출.  
  - 긴 글은 420자 단위로 잘라 순차 요청(청크 사이 200ms 지연).  
  - `itemId`가 있으면 먼저 `mt-cache.json` 번들 조회 후, 있으면 API 호출 생략.

### 번들 캐시 유틸

- **`src/lib/mtCache.ts`**: `hashKoSource`, `buildMtKey`, `getBundledMachineTranslation`  
- **`src/data/mt-cache.json`**: `{ "version": …, "entries": { "<key>": "번역문" } }` 형태.

### 차트에서의 사용처

- `src/components/showcase/ConsonantChart.tsx` — `<TranslatedDescription item={…} lang={…} />`  
- `src/components/showcase/VowelChart.tsx` — 동일.

---

## 3) 관련 파일 목록 (번역·설명 경로)

| 파일 | 내용 |
|------|------|
| `src/lib/i18n.ts` | UI 메시지, `getDescription`, `Lang` 타입 |
| `src/lib/mtCache.ts` | 기계번역 키·번들 조회 |
| `src/data/mt-cache.json` | 빌드에 포함되는 번역 캐시 |
| `src/data/consonants.ts` | 자음 한글 `description` (앱 기본) |
| `src/data/vowels.ts` | 모음 한글 `description` |
| `src/types/index.ts` | `description_en`, `description_zh`, … 선택 필드 |
| `src/app/api/translate/route.ts` | MyMemory 프록시 |
| `src/components/showcase/TranslatedDescription.tsx` | 설명 단락 + 캐시 + fetch |
| `src/components/showcase/ConsonantChart.tsx` | 자음 UI |
| `src/components/showcase/VowelChart.tsx` | 모음 UI |
| `docs/draft-consonant-descriptions-ko-2026.md` | 자음 한글 초안(예시 문장 버전, 앱 미적용) |
| `docs/legacy-consonant-descriptions.md` | 앱과 동일한 레거시 자음 설명 정리 |

---

## 4) 정리

- **UI**: 전부 `i18n.ts` 수동.  
- **긴 설명**: 한글은 `consonants.ts` / `vowels.ts`(또는 CMS). 외국어는 (1) 필드에 수동 입력 또는 (2) `mt-cache.json` + MyMemory 자동.  
- **품질 개선**: 수동 필드(`description_xx`)를 늘리거나, `mt-cache.json`을 사람이 고쳐 넣거나, MyMemory 대신 다른 엔진으로 `route.ts`만 교체하는 식으로 확장 가능합니다.
