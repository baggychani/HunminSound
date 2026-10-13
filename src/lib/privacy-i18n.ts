import type { Lang } from '@/lib/i18n'
import { PRIVACY } from '@/lib/privacy'

/** 문의 양식 개인정보 동의·처리방침 링크 문구 */
export type PrivacyMessages = {
  consentItems: string
  consentPurpose: string
  consentRetention: string
  consentOverseas: string
  consentRefuse: string
  consentAgree: string
  consentView: string
  consentRequired: string
  policyLink: string
}

const ko: PrivacyMessages = {
  consentItems: '수집 항목: 성함·이메일(필수), 소속(선택)',
  consentPurpose: '이용 목적: 문의 확인 및 답변',
  consentRetention: `보유 기간: ${PRIVACY.retention}`,
  consentOverseas: '국외 이전: 문의 내용은 미국에 있는 서버(Vercel, Google)를 거쳐 전달됩니다.',
  consentRefuse: '동의하지 않을 수 있으며, 이 경우 양식 대신 이메일이나 전화로 문의하실 수 있습니다.',
  consentAgree: '개인정보 수집·이용에 동의합니다. (필수)',
  consentView: '보기',
  consentRequired: '개인정보 수집·이용에 동의해 주세요.',
  policyLink: '개인정보 처리방침',
}

const en: PrivacyMessages = {
  consentItems: 'Data collected: name, email (required), affiliation (optional)',
  consentPurpose: 'Purpose: to review and reply to your inquiry',
  consentRetention: 'Retention: 1 year after the inquiry is resolved',
  consentOverseas: 'Overseas transfer: your message is delivered via servers in the United States (Vercel, Google).',
  consentRefuse: 'You may decline; in that case, please contact us by email or phone instead.',
  consentAgree: 'I agree to the collection and use of personal data. (required)',
  consentView: 'Details',
  consentRequired: 'Please agree to the collection and use of personal data.',
  policyLink: 'Privacy Policy',
}

const ja: PrivacyMessages = {
  consentItems: '収集項目：氏名・メール（必須）、所属（任意）',
  consentPurpose: '利用目的：お問い合わせの確認および回答',
  consentRetention: '保有期間：お問い合わせ対応完了後1年',
  consentOverseas: '国外移転：お問い合わせ内容は米国のサーバー（Vercel、Google）を経由して送信されます。',
  consentRefuse: '同意しないこともできます。その場合はメールまたはお電話でお問い合わせください。',
  consentAgree: '個人情報の収集・利用に同意します。（必須）',
  consentView: '詳細',
  consentRequired: '個人情報の収集・利用に同意してください。',
  policyLink: '個人情報処理方針',
}

const zh: PrivacyMessages = {
  consentItems: '收集项目：姓名、电子邮箱（必填），所属机构（选填）',
  consentPurpose: '使用目的：确认并答复您的咨询',
  consentRetention: '保存期限：咨询处理完毕后1年',
  consentOverseas: '跨境传输：咨询内容将经由位于美国的服务器（Vercel、Google）传送。',
  consentRefuse: '您可以不同意；如不同意，请通过电子邮件或电话咨询。',
  consentAgree: '我同意收集和使用个人信息。（必填）',
  consentView: '查看',
  consentRequired: '请同意收集和使用个人信息。',
  policyLink: '个人信息处理方针',
}

const fr: PrivacyMessages = {
  consentItems: 'Données collectées : nom, adresse électronique (obligatoire), affiliation (facultatif)',
  consentPurpose: 'Finalité : examiner le message et y répondre',
  consentRetention: 'Conservation : 1 an après le traitement de la demande',
  consentOverseas: 'Transfert à l’étranger : le message passe par des serveurs situés aux États-Unis (Vercel, Google).',
  consentRefuse: 'Vous pouvez refuser. Dans ce cas, écrivez-nous par courriel ou par téléphone.',
  consentAgree: 'J’accepte la collecte et l’utilisation de mes données personnelles. (obligatoire)',
  consentView: 'Voir',
  consentRequired: 'Veuillez accepter la collecte et l’utilisation des données personnelles.',
  policyLink: 'Politique de confidentialité',
}

const de: PrivacyMessages = {
  consentItems: 'Erhobene Daten: Name, E-Mail (erforderlich), Zugehörigkeit (freiwillig)',
  consentPurpose: 'Zweck: Prüfung und Beantwortung der Anfrage',
  consentRetention: 'Speicherung: 1 Jahr nach Abschluss der Anfrage',
  consentOverseas: 'Übermittlung ins Ausland: Die Nachricht läuft über Server in den Vereinigten Staaten (Vercel, Google).',
  consentRefuse: 'Sie können ablehnen. Schreiben Sie uns dann bitte per E-Mail oder rufen Sie an.',
  consentAgree: 'Ich willige in die Erhebung und Nutzung personenbezogener Daten ein. (erforderlich)',
  consentView: 'Ansehen',
  consentRequired: 'Bitte willigen Sie in die Erhebung und Nutzung personenbezogener Daten ein.',
  policyLink: 'Datenschutzerklärung',
}

const es: PrivacyMessages = {
  consentItems: 'Datos recogidos: nombre, correo (obligatorio), afiliación (opcional)',
  consentPurpose: 'Finalidad: revisar la consulta y responder',
  consentRetention: 'Conservación: 1 año después de resuelta la consulta',
  consentOverseas: 'Transferencia al extranjero: el mensaje pasa por servidores en Estados Unidos (Vercel, Google).',
  consentRefuse: 'Puede no aceptar. En ese caso, escriba por correo o llame por teléfono.',
  consentAgree: 'Acepto la recogida y el uso de datos personales. (obligatorio)',
  consentView: 'Ver',
  consentRequired: 'Acepte la recogida y el uso de datos personales.',
  policyLink: 'Política de privacidad',
}

const hi: PrivacyMessages = {
  consentItems: 'एकत्र जानकारी: नाम, ईमेल (अनिवार्य), संस्था (वैकल्पिक)',
  consentPurpose: 'उद्देश्य: पूछताछ देखना और उत्तर देना',
  consentRetention: 'रखने की अवधि: पूछताछ निपटने के बाद 1 वर्ष',
  consentOverseas: 'विदेश भेजना: संदेश संयुक्त राज्य के सर्वर (Vercel, Google) से जाता है।',
  consentRefuse: 'आप मना कर सकते हैं। तब ईमेल या फ़ोन से लिखें।',
  consentAgree: 'मैं व्यक्तिगत जानकारी के संग्रह और उपयोग के लिए सहमत हूँ। (अनिवार्य)',
  consentView: 'देखें',
  consentRequired: 'कृपया व्यक्तिगत जानकारी के संग्रह और उपयोग के लिए सहमति दें।',
  policyLink: 'गोपनीयता नीति',
}

const vi: PrivacyMessages = {
  consentItems: 'Dữ liệu thu thập: họ tên, email (bắt buộc), cơ quan (không bắt buộc)',
  consentPurpose: 'Mục đích: xem và trả lời thư hỏi',
  consentRetention: 'Thời gian lưu: 1 năm sau khi xử lý xong thư hỏi',
  consentOverseas: 'Chuyển ra nước ngoài: thư đi qua máy chủ tại Hoa Kỳ (Vercel, Google).',
  consentRefuse: 'Bạn có thể không đồng ý. Khi đó hãy gửi email hoặc gọi điện.',
  consentAgree: 'Tôi đồng ý việc thu thập và sử dụng dữ liệu cá nhân. (bắt buộc)',
  consentView: 'Xem',
  consentRequired: 'Vui lòng đồng ý việc thu thập và sử dụng dữ liệu cá nhân.',
  policyLink: 'Chính sách quyền riêng tư',
}

const ru: PrivacyMessages = {
  consentItems: 'Собираемые данные: имя, эл. почта (обязательно), организация (по желанию)',
  consentPurpose: 'Цель: рассмотреть обращение и ответить',
  consentRetention: 'Срок хранения: 1 год после завершения обращения',
  consentOverseas: 'Передача за рубеж: сообщение проходит через серверы в США (Vercel, Google).',
  consentRefuse: 'Можно отказаться. Тогда напишите по электронной почте или позвоните.',
  consentAgree: 'Я согласен на сбор и использование персональных данных. (обязательно)',
  consentView: 'Подробнее',
  consentRequired: 'Подтвердите согласие на сбор и использование персональных данных.',
  policyLink: 'Политика конфиденциальности',
}

const ar: PrivacyMessages = {
  consentItems: 'البيانات المجمّعة: الاسم والبريد (إلزامي)، والجهة (اختياري)',
  consentPurpose: 'الغرض: مراجعة الاستفسار والرد عليه',
  consentRetention: 'مدة الحفظ: سنة واحدة بعد الانتهاء من الاستفسار',
  consentOverseas: 'النقل إلى الخارج: تمر الرسالة عبر خوادم في الولايات المتحدة (Vercel وGoogle).',
  consentRefuse: 'يمكنكم الرفض. في هذه الحالة راسلونا بالبريد أو بالهاتف.',
  consentAgree: 'أوافق على جمع البيانات الشخصية واستخدامها. (إلزامي)',
  consentView: 'عرض',
  consentRequired: 'يُرجى الموافقة على جمع البيانات الشخصية واستخدامها.',
  policyLink: 'سياسة الخصوصية',
}

const tr: PrivacyMessages = {
  consentItems: 'Toplanan veriler: ad, e-posta (zorunlu), kurum (isteğe bağlı)',
  consentPurpose: 'Amaç: iletiyi incelemek ve yanıtlamak',
  consentRetention: 'Saklama: ileti sonuçlandıktan sonra 1 yıl',
  consentOverseas: 'Yurt dışına aktarım: ileti Amerika Birleşik Devletleri’ndeki sunuculardan geçer (Vercel, Google).',
  consentRefuse: 'Reddedebilirsiniz. Bu durumda e-posta veya telefon kullanın.',
  consentAgree: 'Kişisel verilerin toplanmasını ve kullanılmasını kabul ediyorum. (zorunlu)',
  consentView: 'Gör',
  consentRequired: 'Kişisel verilerin toplanmasını ve kullanılmasını kabul edin.',
  policyLink: 'Gizlilik ilkesi',
}

const id: PrivacyMessages = {
  consentItems: 'Data yang dikumpulkan: nama, email (wajib), afiliasi (tidak wajib)',
  consentPurpose: 'Tujuan: meninjau pesan dan membalasnya',
  consentRetention: 'Penyimpanan: 1 tahun setelah pertanyaan selesai ditangani',
  consentOverseas: 'Transfer ke luar negeri: pesan melewati server di Amerika Serikat (Vercel, Google).',
  consentRefuse: 'Anda dapat menolak. Dalam hal itu, kirim email atau telepon.',
  consentAgree: 'Saya setuju atas pengumpulan dan penggunaan data pribadi. (wajib)',
  consentView: 'Lihat',
  consentRequired: 'Setujui pengumpulan dan penggunaan data pribadi.',
  policyLink: 'Kebijakan privasi',
}

const th: PrivacyMessages = {
  consentItems: 'ข้อมูลที่เก็บ: ชื่อ อีเมล (จำเป็น) สังกัด (ไม่จำเป็น)',
  consentPurpose: 'วัตถุประสงค์: ตรวจข้อความและตอบกลับ',
  consentRetention: 'ระยะเวลาเก็บ: 1 ปีหลังจากจัดการคำถามเสร็จ',
  consentOverseas: 'ส่งออกนอกประเทศ: ข้อความผ่านเซิร์ฟเวอร์ในสหรัฐอเมริกา (Vercel, Google)',
  consentRefuse: 'ท่านปฏิเสธได้ ในกรณีนั้นให้ติดต่อทางอีเมลหรือโทรศัพท์',
  consentAgree: 'ข้าพเจ้ายินยอมให้เก็บและใช้ข้อมูลส่วนบุคคล (จำเป็น)',
  consentView: 'ดู',
  consentRequired: 'โปรดยินยอมให้เก็บและใช้ข้อมูลส่วนบุคคล',
  policyLink: 'นโยบายความเป็นส่วนตัว',
}

const BY_LANG: Record<Lang, PrivacyMessages> = {
  ko, en, zh, ja, fr, de, es, hi, vi, ru, ar, tr, id, th,
}

export function getPrivacyMessages(lang: Lang): PrivacyMessages {
  return BY_LANG[lang]
}
