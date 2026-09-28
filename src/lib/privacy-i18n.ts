import type { Lang } from '@/lib/i18n'
import { PRIVACY } from '@/lib/privacy'

/** 문의 양식 개인정보 동의·처리방침 링크 문구 — 없는 언어는 영어로 */
export type PrivacyMessages = {
  consentTitle: string
  consentItems: string
  consentPurpose: string
  consentRetention: string
  consentOverseas: string
  consentRefuse: string
  consentAgree: string
  consentRequired: string
  policyLink: string
}

const ko: PrivacyMessages = {
  consentTitle: '개인정보 수집·이용 동의 (필수)',
  consentItems: '수집 항목: 성함·이메일(필수), 소속(선택)',
  consentPurpose: '이용 목적: 문의 확인 및 답변',
  consentRetention: `보유 기간: ${PRIVACY.retention}`,
  consentOverseas: '국외 이전: 문의 내용은 미국에 있는 서버(Vercel, Google)를 거쳐 전달됩니다.',
  consentRefuse: '동의하지 않을 수 있으며, 이 경우 양식 대신 이메일이나 전화로 문의하실 수 있습니다.',
  consentAgree: '위 내용에 동의합니다.',
  consentRequired: '개인정보 수집·이용에 동의해 주세요.',
  policyLink: '개인정보 처리방침',
}

const en: PrivacyMessages = {
  consentTitle: 'Consent to collection and use of personal data (required)',
  consentItems: 'Data collected: name, email (required), affiliation (optional)',
  consentPurpose: 'Purpose: to review and reply to your inquiry',
  consentRetention: 'Retention: 1 year after the inquiry is resolved',
  consentOverseas: 'Overseas transfer: your message is delivered via servers in the United States (Vercel, Google).',
  consentRefuse: 'You may decline; in that case, please contact us by email or phone instead.',
  consentAgree: 'I agree to the above.',
  consentRequired: 'Please agree to the collection and use of personal data.',
  policyLink: 'Privacy Policy',
}

const ja: PrivacyMessages = {
  consentTitle: '個人情報の収集・利用への同意（必須）',
  consentItems: '収集項目：氏名・メール（必須）、所属（任意）',
  consentPurpose: '利用目的：お問い合わせの確認および回答',
  consentRetention: '保有期間：お問い合わせ対応完了後1年',
  consentOverseas: '国外移転：お問い合わせ内容は米国のサーバー（Vercel、Google）を経由して送信されます。',
  consentRefuse: '同意しないこともできます。その場合はメールまたはお電話でお問い合わせください。',
  consentAgree: '上記の内容に同意します。',
  consentRequired: '個人情報の収集・利用に同意してください。',
  policyLink: '個人情報処理方針',
}

const zh: PrivacyMessages = {
  consentTitle: '同意收集和使用个人信息（必填）',
  consentItems: '收集项目：姓名、电子邮箱（必填），所属机构（选填）',
  consentPurpose: '使用目的：确认并答复您的咨询',
  consentRetention: '保存期限：咨询处理完毕后1年',
  consentOverseas: '跨境传输：咨询内容将经由位于美国的服务器（Vercel、Google）传送。',
  consentRefuse: '您可以不同意；如不同意，请通过电子邮件或电话咨询。',
  consentAgree: '我同意上述内容。',
  consentRequired: '请同意收集和使用个人信息。',
  policyLink: '个人信息处理方针',
}

const BY_LANG: Partial<Record<Lang, PrivacyMessages>> = { ko, en, ja, zh }

export function getPrivacyMessages(lang: Lang): PrivacyMessages {
  return BY_LANG[lang] ?? en
}
