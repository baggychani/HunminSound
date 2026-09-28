/**
 * 개인정보 처리방침·문의 양식 동의 문구가 함께 쓰는 사실값.
 * 기관·책임자·보유기간이 바뀌면 여기만 고치면 처리방침 면과 동의 문구에 같이 반영된다.
 */
export const PRIVACY = {
  /** 개인정보처리자(운영 기관) */
  org: '세종국어문화원',
  officer: {
    name: '김슬옹',
    title: '세종국어문화원 원장',
    phone: '02-969-8851',
    email: 'sejong@sejongkorea.org',
  },
  /** 문의 메일 보관 기간 */
  retention: '문의 처리 완료 후 1년',
  effectiveDate: '2026년 9월 28일',
} as const
