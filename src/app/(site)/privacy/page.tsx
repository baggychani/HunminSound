import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { PRIVACY } from '@/lib/privacy'

export const metadata: Metadata = {
  title: '개인정보 처리방침',
  description: '세종말소리 누리집의 개인정보 처리방침입니다.',
}

function Article({ no, title, children }: { no: number; title: string; children: ReactNode }) {
  return (
    <section className="border-t border-hanji-border/60 py-8">
      <h2 className="font-serif text-[1.15rem] font-bold text-ink">
        제{no}조 {title}
      </h2>
      <div className="mt-4 space-y-3 break-keep font-sans text-[0.95rem] leading-[1.9] text-ink-soft [overflow-wrap:break-word]">
        {children}
      </div>
    </section>
  )
}

function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-1.5 ps-5 marker:text-ink-muted">{children}</ul>
}

const cell = 'border border-hanji-border/70 px-3 py-2 align-top'

export default function PrivacyPage() {
  const { org, officer, retention, effectiveDate } = PRIVACY

  return (
    <div className="site-container" lang="ko">
      <div className="max-w-3xl pb-24">
        <div className="border-b border-hanji-border pb-10 pt-16">
          <h1
            className="font-serif leading-tight tracking-tight text-ink"
            style={{ fontSize: 'clamp(2rem, 5.5vw, 3rem)' }}
          >
            개인정보 처리방침
          </h1>
          <p className="mt-6 break-keep font-sans text-[0.95rem] leading-[1.9] text-ink-soft">
            {org}(이하 ‘문화원’)은 세종말소리 누리집(https://www.sejongsound.org, 이하 ‘누리집’)을 운영하면서
            「개인정보 보호법」 제30조에 따라 정보주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게
            처리할 수 있도록 다음과 같이 개인정보 처리방침을 수립·공개합니다.
          </p>
        </div>

        <Article no={1} title="개인정보의 처리 목적">
          <p>
            누리집 ‘문의하기’ 양식으로 접수된 문의(연구 협력, 데이터 접근 요청, 학회·세미나, 대학원 진학, 일반 문의)를
            확인하고 답변하기 위해 개인정보를 처리합니다. 이 목적 외의 용도로는 이용하지 않으며, 목적이 바뀌는
            경우에는 「개인정보 보호법」 제18조에 따라 별도의 동의를 받습니다.
          </p>
        </Article>

        <Article no={2} title="처리하는 개인정보 항목">
          <List>
            <li>필수 항목: 성명, 이메일 주소</li>
            <li>선택 항목: 소속</li>
            <li>문의 유형과 문의 내용은 답변을 위해 받습니다. 문의 내용에는 주민등록번호 등 민감한 정보를 적지 말아 주십시오.</li>
            <li>
              서비스 운영 과정에서 접속 기록(IP 주소, 접속 일시, 브라우저 정보)이 호스팅 서비스의 로그에 일시적으로 남을 수
              있습니다. 문의 양식의 부정 이용(스팸)을 막기 위해 IP 주소를 서버 메모리에서 최대 1시간 동안 사용하며 따로
              저장하지 않습니다.
            </li>
          </List>
          <p>누리집은 회원 가입을 받지 않으며, 방문 분석 도구나 광고용 쿠키를 사용하지 않습니다.</p>
        </Article>

        <Article no={3} title="개인정보의 처리 및 보유 기간">
          <p>
            문의 양식으로 받은 개인정보는 누리집 서버에 저장하지 않고 문화원 이메일({officer.email})로 전달되며,{' '}
            {retention} 동안 보관한 뒤 파기합니다. 다만 다른 법령에 따라 보존할 필요가 있는 경우에는 해당 기간 동안
            보관합니다.
          </p>
        </Article>

        <Article no={4} title="개인정보의 제3자 제공">
          <p>
            문화원은 정보주체의 개인정보를 제1조의 목적 범위에서만 처리하며, 정보주체의 동의나 법률의 특별한 규정 등
            「개인정보 보호법」 제17조 및 제18조에 해당하는 경우를 제외하고는 제3자에게 제공하지 않습니다.
          </p>
        </Article>

        <Article no={5} title="개인정보 처리의 위탁 및 국외 이전">
          <p>
            문화원은 누리집 운영을 위해 다음과 같이 개인정보 처리 업무를 위탁하고 있으며, 수탁자의 서버가 국외에 있어
            개인정보가 국외로 이전됩니다.
          </p>
          <div className="-mx-1 overflow-x-auto px-1">
            <table className="w-full min-w-[36rem] border-collapse text-[0.85rem] leading-relaxed">
              <thead>
                <tr className="bg-hanji-border/20 text-ink">
                  <th className={cell}>수탁자(이전받는 자)</th>
                  <th className={cell}>위탁 업무</th>
                  <th className={cell}>이전 국가</th>
                  <th className={cell}>이전 항목</th>
                  <th className={cell}>이전 일시·방법</th>
                  <th className={cell}>보유·이용 기간</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className={cell}>Vercel Inc.</td>
                  <td className={cell}>누리집 호스팅, 문의 양식 전송 처리</td>
                  <td className={cell}>미국</td>
                  <td className={cell}>성명, 이메일, 소속, 문의 내용, 접속 기록</td>
                  <td className={cell}>문의 제출 시 네트워크로 전송</td>
                  <td className={cell}>전송 처리 후 저장하지 않음(접속 기록은 서비스 로그 보관 기간)</td>
                </tr>
                <tr>
                  <td className={cell}>Google LLC</td>
                  <td className={cell}>문의 내용 이메일 발송(Gmail)</td>
                  <td className={cell}>미국</td>
                  <td className={cell}>성명, 이메일, 소속, 문의 내용</td>
                  <td className={cell}>문의 제출 시 네트워크로 전송</td>
                  <td className={cell}>{retention}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            국외 이전을 원하지 않으시면 문의 양식 대신 이메일({officer.email})이나 전화({officer.phone})로 문의하실 수
            있습니다.
          </p>
        </Article>

        <Article no={6} title="개인정보의 파기 절차 및 방법">
          <p>
            보유 기간이 지나거나 처리 목적이 달성된 개인정보는 지체 없이 파기합니다. 전자적 파일 형태의 정보는 복구할 수
            없는 방법으로 삭제하고, 종이 문서는 분쇄하거나 소각합니다.
          </p>
        </Article>

        <Article no={7} title="정보주체의 권리·의무 및 행사 방법">
          <p>
            정보주체는 문화원에 대해 언제든지 개인정보 열람, 정정·삭제, 처리 정지 및 동의 철회를 요구할 수 있습니다. 이
            권리는 제10조의 연락처로 서면, 전화, 전자우편 등을 통해 행사할 수 있으며, 문화원은 지체 없이 조치합니다.
            법정대리인이나 위임을 받은 사람 등 대리인을 통해서도 행사할 수 있습니다.
          </p>
        </Article>

        <Article no={8} title="개인정보의 안전성 확보 조치">
          <List>
            <li>전송 구간 암호화: 누리집의 모든 통신은 HTTPS로 암호화합니다.</li>
            <li>저장 최소화: 문의 양식으로 받은 개인정보는 누리집 서버에 저장하지 않습니다.</li>
            <li>접근 권한 관리: 관리 기능은 인증된 관리자만 이용할 수 있습니다.</li>
            <li>부정 이용 방지: 자동 입력 방지 장치와 전송 횟수 제한을 둡니다.</li>
          </List>
        </Article>

        <Article no={9} title="개인정보 자동 수집 장치의 설치·운영 및 거부">
          <p>
            누리집은 방문자를 식별하거나 추적하는 쿠키를 사용하지 않습니다. 선택한 언어·화면 테마와 번역 결과를 다음
            방문 때 다시 쓰기 위해 브라우저 저장소(localStorage)에 저장하며, 이는 개인을 식별하는 정보가 아닙니다.
            브라우저 설정에서 사이트 데이터를 삭제하면 언제든지 지울 수 있습니다.
          </p>
        </Article>

        <Article no={10} title="개인정보 보호책임자">
          <p>
            문화원은 개인정보 처리에 관한 업무를 총괄하고, 관련 불만 처리와 피해 구제를 위해 아래와 같이 개인정보
            보호책임자를 지정하고 있습니다.
          </p>
          <List>
            <li>
              성명: {officer.name} ({officer.title})
            </li>
            <li>전화: {officer.phone}</li>
            <li>전자우편: {officer.email}</li>
          </List>
        </Article>

        <Article no={11} title="권익침해 구제 방법">
          <p>개인정보 침해에 대한 신고나 상담이 필요하시면 아래 기관에 문의하실 수 있습니다.</p>
          <List>
            <li>개인정보분쟁조정위원회: 1833-6972 (www.kopico.go.kr)</li>
            <li>개인정보침해신고센터: (국번 없이) 118 (privacy.kisa.or.kr)</li>
            <li>대검찰청: (국번 없이) 1301 (www.spo.go.kr)</li>
            <li>경찰청: (국번 없이) 182 (ecrm.police.go.kr)</li>
          </List>
        </Article>

        <Article no={12} title="개인정보 처리방침의 변경">
          <p>이 개인정보 처리방침은 {effectiveDate}부터 적용됩니다.</p>
        </Article>
      </div>
    </div>
  )
}
