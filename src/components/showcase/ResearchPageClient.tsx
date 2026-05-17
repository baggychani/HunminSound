'use client'

import { motion } from 'framer-motion'
import { useLang } from '@/contexts/LanguageContext'
import { getMessages } from '@/lib/i18n'

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  }),
}

function SectionTitle({ id, muted, children }: { id: string; muted?: boolean; children: React.ReactNode }) {
  return (
    <h2
      id={id}
      className={`font-serif tracking-tight leading-snug ${
        muted ? 'text-lg text-ink-muted sm:text-xl' : 'text-2xl text-ink sm:text-[1.65rem]'
      }`}
    >
      {children}
    </h2>
  )
}

function BlockLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 font-sans text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink-muted/50">
      {children}
    </p>
  )
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 font-serif text-[0.9rem] font-medium text-ink/70">
      {children}
    </p>
  )
}

function BodyText({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-sans text-[0.875rem] leading-[1.9] text-ink-soft">
      {children}
    </p>
  )
}

function AchievementItem({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="font-sans text-[0.875rem] font-semibold text-ink">{title}</p>
      <p className="font-sans text-[0.875rem] leading-relaxed text-ink-soft">{children}</p>
    </div>
  )
}

function BulletItem({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3 font-sans text-[0.875rem] leading-relaxed text-ink-soft">
      <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-gold/60" />
      <span>
        {label && <span className="font-semibold text-ink">{label}: </span>}
        {children}
      </span>
    </div>
  )
}

function Divider() {
  return <div className="border-t border-hanji-border/50" />
}

function InfoTable() {
  const rows = [
    { label: '과제번호', value: 'NRF-2023S1A5A2A21086078' },
    { label: '사업명', value: '한국연구재단 글로벌인문사회융합연구지원사업(연구그룹형)' },
    { label: '연구과제명 (국문)', value: '훈민정음 제자 원리의 융복합적 실증 및 응용' },
    { label: '연구과제명 (영문)', value: 'A Convergence Demonstration and Application of the Principles of the Creation of Hunminjeongeum Characters' },
    { label: '총 연구기간', value: '2023. 6. 1. ~ 2026. 5. 31. (3년)' },
    { label: '연구 유형', value: '융복합연구(인문학 + 의학 + 공학)' },
  ]
  return (
    <table className="w-full border-collapse font-sans text-[0.875rem]">
      <tbody>
        {rows.map((row) => (
          <tr key={row.label} className="border-b border-hanji-border/60 last:border-0">
            <td className="py-3 pr-8 align-top whitespace-nowrap text-ink-muted/65 font-medium w-48">{row.label}</td>
            <td className="py-3 text-ink leading-relaxed">{row.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function TeamTable() {
  const members = [
    { role: '연구책임자', name: '김슬옹', affiliation: '세종국어문화원', task: '연구 총괄 · 훈민정음학 분석', field: '훈민정음학' },
    { role: '공동연구원', name: '최홍식', affiliation: '(사)세종대왕기념사업회', task: 'MRI 영상분석 · 음성의학적 검증', field: '음성의학' },
    { role: '공동연구원', name: '이호영', affiliation: '서울대학교 인문대학 언어학과', task: '음성학적 분석 · 다국어 비교 연구', field: '음성학' },
    { role: '공동연구원', name: '김진아', affiliation: '연세대학교 의과대학 영상의학교실', task: 'MRI 촬영 프로토콜 · 영상 획득 및 분석', field: '영상의학' },
    { role: '일반연구원', name: '이정민', affiliation: '천지인발성연구소', task: 'MRI 데이터 측정 · 영상 분석', field: '언어병리학' },
    { role: '일반연구원', name: '이승수', affiliation: '연세대학교 대학원 언어병리협동과정', task: '상형도 일러스트 · 영상 시각화', field: '언어병리학 / 일러스트' },
    { role: '일반연구원', name: '이호현', affiliation: '—', task: '표준상형도 제작 · 첨가도 그림 · 영상 분석/시각화', field: '음성공학' },
    { role: '팀', name: '윤국진, 정병인, 오창균 외', affiliation: '—', task: 'AI 파이프라인 개발 · 2D 애니메이션 생성 · 웹 데모 시스템 구현', field: '음성공학 · AI/웹 개발' },
  ]
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-sans text-[0.875rem]">
        <thead>
          <tr className="border-b border-ink/15">
            <th className="pb-3 pr-6 text-left font-medium text-ink-muted/60 whitespace-nowrap">구분</th>
            <th className="pb-3 pr-6 text-left font-medium text-ink-muted/60 whitespace-nowrap">성명</th>
            <th className="pb-3 pr-6 text-left font-medium text-ink-muted/60">소속</th>
            <th className="pb-3 pr-6 text-left font-medium text-ink-muted/60">역할</th>
            <th className="pb-3 text-left font-medium text-ink-muted/60 whitespace-nowrap">전공 분야</th>
          </tr>
        </thead>
        <tbody>
          {members.map((mem, i) => (
            <tr key={i} className="border-b border-hanji-border/60 last:border-0">
              <td className="py-3 pr-6 align-top whitespace-nowrap text-ink-muted/65">{mem.role}</td>
              <td className="py-3 pr-6 align-top whitespace-nowrap font-semibold text-ink">{mem.name}</td>
              <td className="py-3 pr-6 align-top text-ink-muted/75 leading-relaxed">{mem.affiliation}</td>
              <td className="py-3 pr-6 align-top text-ink-soft leading-relaxed">{mem.task}</td>
              <td className="py-3 align-top text-ink-muted/75 whitespace-nowrap">{mem.field}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function MethodTable() {
  const rows = [
    {
      field: '인문학',
      role: '음성학과 성운학의 이론적 틀을 바탕으로 해례본의 제자 원리 재해석',
      methods: ['해례본 문헌 분석', '조음음성학 이론 적용', '다국어 비교 연구'],
    },
    {
      field: '의학',
      role: '영상의학 기법, 특히 실시간 MRI 촬영 기술을 활용하여 발음 기관의 실제 움직임 포착',
      methods: ['3T MRI 촬영', '광섬유 마이크 동시 녹음', '3D Slicer 정량 분석', 'Praat 포먼트 분석'],
    },
    {
      field: '공학',
      role: '음성공학 기술을 적용하여 분석 결과를 시각적으로 구현',
      methods: ['LSTM 기반 AI 모델', 'Optical Flow 애니메이션', '웹 기반 데모 시스템'],
    },
  ]
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse font-sans text-[0.875rem]">
        <thead>
          <tr className="border-b border-ink/15">
            <th className="pb-3 pr-8 text-left font-medium text-ink-muted/60 w-20">분야</th>
            <th className="pb-3 pr-8 text-left font-medium text-ink-muted/60">역할</th>
            <th className="pb-3 text-left font-medium text-ink-muted/60">주요 방법</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.field} className="border-b border-hanji-border/60 last:border-0">
              <td className="py-4 pr-8 align-top font-semibold text-ink">{row.field}</td>
              <td className="py-4 pr-8 align-top text-ink-soft leading-relaxed">{row.role}</td>
              <td className="py-4 align-top">
                <ul className="space-y-1.5">
                  {row.methods.map((method) => (
                    <li key={method} className="text-ink-muted/75 leading-relaxed">{method}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ResearchPageClient() {
  const { lang } = useLang()
  const m = getMessages(lang)

  return (
    <>
      <div className="pt-16 pb-12 mb-14 sm:mb-16">
        <h1 className="font-serif text-[2.1rem] leading-tight tracking-tight text-ink sm:text-4xl mb-3">
          {m.research}
        </h1>
        <p className="font-sans text-sm leading-relaxed text-ink-muted max-w-2xl">
          {m.researchPageDesc}
        </p>
      </div>

      <div className="space-y-20 pb-28 sm:space-y-24 sm:pb-36">

        {/* 연구 동기 */}
        <motion.section custom={0} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
          <div className="mb-10">
            <SectionTitle id="section-motivation">연구 동기</SectionTitle>
          </div>
          <div className="space-y-5">
            <BodyText>
              세계 여러 나라에서 많은 문자들이 사용되고 있지만, 만든 사람과 만들어진 때와 만든 목적이 알려져 있는 문자는 우리나라의 &apos;훈민정음(한글)&apos;이 유일하다. 1443년 세종대왕이 창제하고 1446년 해례본을 통해 그 제작 원리를 상세히 설명한 훈민정음은 &apos;소리과학&apos;에 바탕을 둔 문자이다.
            </BodyText>
            <BodyText>
              그러나 훈민정음 해례본 제자해에서 &ldquo;정음 28자는 각각 그 모양을 본떠서 만들었다(正音二十八字各象其形而制之)&rdquo;라고 밝히고 있음에도 불구하고, 이 &apos;상형(象形, 꼴본뜸)&apos;의 실체를 과학적으로 실증한 연구는 그동안 경도에 그친 평면 그림 수준에 머물러 왔다. X-ray는 혀 근육을 시각화하는 데 어려움이 있어 모음 연구에 국한되었고, MRI는 혀의 모양을 정밀하게 관찰할 수 있는 장비이지만 국내에서는 조음 동작 연구에 적합하게 세팅한 적이 없었다.
            </BodyText>
            <BodyText>
              이 연구는 성운학자, 음성학자, 음성의학자, 음성공학자의 융합연구를 통해, MRI를 조음 동작 연구에 맞게 세팅해서 정밀하고 선명한 MR 영상을 얻고, 이를 통해 훈민정음 자모음의 제자 원리를 과학적으로 검증하고자 시작되었다.
            </BodyText>
          </div>
        </motion.section>

        {/* 연구 목표 */}
        <motion.section custom={1} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
          <div className="mb-10">
            <SectionTitle id="section-goals">연구 목표</SectionTitle>
          </div>
          <div className="space-y-12">
            <div>
              <BlockLabel>최종 목표</BlockLabel>
              <BodyText>
                훈민정음 해례본에 근거한 기본 28자의 발음 과정을 정밀한 MR 영상으로 구현하고, 이를 융복합 관점에서 15세기 훈민정음 해례본의 제자 원리와 발음을 검증하며, MR 영상을 이용한 한국어 발음과 한글 교육 응용 프로그램을 개발하는 것을 목적으로 한다.
              </BodyText>
            </div>
            <div>
              <BlockLabel>세부 목표</BlockLabel>
              <div className="space-y-4">
                <BulletItem label="상형(象形)의 실체 실증">해례본에 기술된 &apos;상형&apos;의 실체를 실증적인 MRI 영상으로 구현하여, 세종의 훈민정음 창제 의도와 원리, 가치를 과학적으로 입증</BulletItem>
                <BulletItem label="기존 인문학의 미진한 내용 규명">언어학과 음운학 등 기존 인문학에서 규명하지 못한 조음 위치·발음 방법의 실체를 의학적 데이터로 규명</BulletItem>
                <BulletItem label="교육용 콘텐츠 구축">15세기 자음과 모음의 발음 움직임을 MRI 영상과 AI 애니메이션으로 구현하여 교육용 콘텐츠로 활용</BulletItem>
                <BulletItem label="한류 한국어 시대의 교육용 활용">영상 콘텐츠를 한국어 발음 교육, 교과서 개정, 문화 콘텐츠 등 다양한 용도로 활용</BulletItem>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 연구 개요 */}
        <motion.section custom={2} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
          <div className="mb-10">
            <SectionTitle id="section-overview">연구 개요</SectionTitle>
          </div>
          <div className="space-y-14">

            <div>
              <BlockLabel>연구 방법</BlockLabel>
              <p className="mb-6 font-sans text-[0.875rem] leading-relaxed text-ink-soft">
                인문학, 의학, 공학의 세 분야를 아우르는 융복합적 연구 체계를 구축하였다.
              </p>
              <MethodTable />
            </div>

            <Divider />

            <div>
              <BlockLabel>연구 규모</BlockLabel>
              <div className="space-y-3.5">
                <BulletItem label="피험자">총 73명 — 제주 방언 화자 15명(70–80대), 서울 방언 화자 51명(10–40대), 중국어 화자 7명(20–50대)</BulletItem>
                <BulletItem label="MRI 촬영">3T 전신 MR 스캐너(인제니아 엘리션, 필립스) + 32채널 dS-헤드 코일, 비등방성 공간 해상도 2.6×2.6×10mm³</BulletItem>
                <BulletItem label="음성 녹음">광섬유 마이크 FOMRI-III+(Optoacoustic Ltd.) — MRI 환경에서 동시 녹음</BulletItem>
                <BulletItem label="분석 도구">3D Slicer(성도 길이·면적), Praat 6.4.25(포먼트), Adobe Audition(소음 제거)</BulletItem>
              </div>
            </div>

            <Divider />

            <div>
              <BlockLabel>주요 성과</BlockLabel>
              <div className="space-y-10">

                <div>
                  <GroupLabel>모음 체계</GroupLabel>
                  <div className="space-y-6">
                    <AchievementItem title="천지인(·, ㅡ, ㅣ)">
                      /·/ 발음 시 혀가 수축(舌縮)되며 구강 앞쪽에 둥근 공명강이 형성되는 것을 MRI로 확인. &apos;하늘(天)의 둥근 모양을 본떴&apos;라는 기술이 물리적 형태를 묘사한 것임을 증명
                    </AchievementItem>
                    <AchievementItem title="초출자 (ㅗ, ㅏ, ㅜ, ㅓ)">
                      천지인 조음 특성의 결합으로 실현. 4명 화자의 성도 길이·면적·포먼트 측정치로 합성 원리 검증
                    </AchievementItem>
                    <AchievementItem title="재출자 (ㅛ, ㅑ, ㅠ, ㅕ)">
                      /ㅣ/에서 출발하여 목표 단모음으로 이동하는 순차적 조음을 실시간 MRI로 포착. &apos;ㅣ에서 일어난다(起於ㅣ)&apos; 원리의 실증
                    </AchievementItem>
                  </div>
                </div>

                <div>
                  <GroupLabel>자음 체계</GroupLabel>
                  <div className="space-y-6">
                    <AchievementItem title="ㄱ류 자음 조음 위치 재정립">
                      실제 조음 위치가 경구개–연구개 이행 부위임을 MRI로 확인 → &apos;구개파열자음&apos;으로 재분류 제안
                    </AchievementItem>
                    <AchievementItem title="한국어 치조음 특성">
                      혀끝이 치조보다 앞쪽 윗니에 접촉하는 &apos;치-치조음&apos; 경향 확인. /ㄹ/에서 권설음 변이형 발견
                    </AchievementItem>
                    <AchievementItem title="ㆁ(꼭지이응) 독창적 상형 규명">
                      ㅇ에 획 추가가 아니라, 비강으로 소리가 향하는 비자음 고유 특성의 상형임을 MRI와 공기역학검사로 입증
                    </AchievementItem>
                    <AchievementItem title="다국어 비교">
                      한국어·영어·중국어·독일어 치조음 MRI 비교 연구 수행
                    </AchievementItem>
                  </div>
                </div>

                <div>
                  <GroupLabel>기술 개발</GroupLabel>
                  <div className="space-y-6">
                    <AchievementItem title="AI 파이프라인">
                      음성 입력 → Mel-spectrogram → LSTM 모델로 MR 영상 생성 → Optical Flow 기반 2D 애니메이션 변환의 종단간(End-to-End) 파이프라인 개발
                    </AchievementItem>
                    <AchievementItem title="웹 데모 시스템">
                      사용자 음성 입력 → 발음기관 애니메이션 실시간 생성 웹 페이지 구현
                    </AchievementItem>
                    <AchievementItem title="MRI 기반 표준상형도">
                      혀 위치에 글자를 중첩한 표준상형도 및 첨가도 제작
                    </AchievementItem>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </motion.section>

        {/* 연구의 의의 */}
        <motion.section custom={3} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
          <div className="mb-10">
            <SectionTitle id="section-significance">연구의 의의</SectionTitle>
          </div>
          <div className="space-y-5">
            <BodyText>
              이 연구는 훈민정음의 제자 원리가 단순히 음양오행이나 천지인과 같은 동양 철학적 상징 체계에 기반한 것이 아니라, 인체의 해부학적 구조와 발음 시 나타나는 생리학적 움직임을 정밀하게 관찰하고 이를 글자의 형태에 반영한 결과임을 현대 의학 기술을 통해 명확히 증명하였다. 훈민정음이 철학적 문자인 동시에 실용적 과학 문자로서의 성격을 함께 갖추고 있음을 입증하는 것이다.
            </BodyText>
            <BodyText>
              특히 성별과 연령에 따른 생리적 차이에도 불구하고 모든 대상자에서 훈민정음 제자 원리와 일치하는 조음 양상이 관찰된 점은, 훈민정음의 제자 원리가 보편적 음성학 원리에 기반하였음을 시사한다.
            </BodyText>
          </div>
        </motion.section>

        {/* 연구진 소개 */}
        <motion.section custom={4} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
          <div className="mb-10">
            <SectionTitle id="section-team" muted>{m.researchSec1}</SectionTitle>
          </div>
          <TeamTable />
        </motion.section>

        {/* 과제 정보 */}
        <motion.section custom={5} variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-50px' }}>
          <div className="mb-10">
            <SectionTitle id="section-nrf" muted>{m.researchSec3}</SectionTitle>
          </div>
          <InfoTable />
        </motion.section>

      </div>
    </>
  )
}