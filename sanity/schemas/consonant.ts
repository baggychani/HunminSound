import { defineField, defineType } from 'sanity'

export const consonant = defineType({
  name: 'consonant',
  title: '자음',
  type: 'document',

  groups: [
    { name: 'basic', title: '기본 정보', default: true },
    { name: 'media', title: '영상 파일' },
    { name: 'i18n', title: '다국어 설명' },
  ],

  fields: [
    // ── 기본 정보 ──────────────────────────────────────────────────
    defineField({
      name: 'name',
      title: '문서 제목',
      description: '예시: "ㄱ (기역)" — 기호와 이름을 함께 적어주세요.',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required().error('문서 제목은 필수입니다.'),
    }),
    defineField({
      name: 'symbol',
      title: '음소 기호',
      description: '자음 기호 하나만 입력하세요. 예: ㄱ',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required().max(2),
    }),
    defineField({
      name: 'category',
      title: '조음 방법 (계열)',
      description: '해당 자음의 조음 방법을 선택하세요.',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: '파열음 (Plosive)', value: '파열음' },
          { title: '마찰음 (Fricative)', value: '마찰음' },
          { title: '파찰음 (Affricate)', value: '파찰음' },
          { title: '비음 (Nasal)', value: '비음' },
          { title: '유음 (Liquid)', value: '유음' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'articulationGroup',
      title: '조음 위치',
      description: '시각적 그룹화에 사용됩니다. 예: 양순, 치조, 연구개, 성문, 치조경구개',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: '양순 (Bilabial)', value: '양순' },
          { title: '치조 (Alveolar)', value: '치조' },
          { title: '치조경구개 (Alveolo-palatal)', value: '치조경구개' },
          { title: '연구개 (Velar)', value: '연구개' },
          { title: '성문 (Glottal)', value: '성문' },
        ],
      },
    }),
    defineField({
      name: 'description',
      title: '조음 설명 (한국어)',
      description: '조음 위치, 방법, 음성학적 특징을 상세히 설명해주세요. (한국어 기본 설명)',
      type: 'text',
      rows: 5,
      group: 'basic',
    }),

    // ── 영상 파일 ──────────────────────────────────────────────────
    defineField({
      name: 'animationFileName',
      title: '조음 애니메이션 파일명',
      description:
        '애니메이션 영상 파일명을 입력하세요. 예: "ㄱ.mp4" — 파일은 /videos/consonants/animation/ 폴더에 넣어주세요.',
      type: 'string',
      group: 'media',
    }),
    defineField({
      name: 'mriFileName',
      title: 'MRI 영상 파일명',
      description:
        'MRI 영상 파일명을 입력하세요. 예: "ㄱ.mp4" — 파일은 /videos/consonants/mri/ 폴더에 넣어주세요.',
      type: 'string',
      group: 'media',
    }),

    // ── 다국어 설명 ────────────────────────────────────────────────
    defineField({
      name: 'description_en',
      title: '조음 설명 (영어 · English)',
      description: '비워두면 한국어 설명이 대신 표시됩니다.',
      type: 'text',
      rows: 4,
      group: 'i18n',
    }),
    defineField({
      name: 'description_zh',
      title: '조음 설명 (중국어 · 中文)',
      description: '비워두면 한국어 설명이 대신 표시됩니다.',
      type: 'text',
      rows: 4,
      group: 'i18n',
    }),
    defineField({
      name: 'description_ja',
      title: '조음 설명 (일본어 · 日本語)',
      description: '비워두면 한국어 설명이 대신 표시됩니다.',
      type: 'text',
      rows: 4,
      group: 'i18n',
    }),
    defineField({
      name: 'description_fr',
      title: '조음 설명 (프랑스어 · Français)',
      description: '비워두면 한국어 설명이 대신 표시됩니다.',
      type: 'text',
      rows: 4,
      group: 'i18n',
    }),
    defineField({
      name: 'description_hi',
      title: '조음 설명 (힌디어 · हिन्दी)',
      description: '비워두면 한국어 설명이 대신 표시됩니다.',
      type: 'text',
      rows: 4,
      group: 'i18n',
    }),
  ],

  preview: {
    select: { title: 'name', subtitle: 'category' },
    prepare({ title, subtitle }) {
      return { title: title ?? '(제목 없음)', subtitle: subtitle ?? '' }
    },
  },
})
