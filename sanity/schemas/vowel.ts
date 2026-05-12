import { defineField, defineType } from 'sanity'

export const vowel = defineType({
  name: 'vowel',
  title: '모음',
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
      description: '예시: "ㅏ (아)" — 기호와 발음 이름을 함께 적어주세요.',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required().error('문서 제목은 필수입니다.'),
    }),
    defineField({
      name: 'symbol',
      title: '음소 기호',
      description: '모음 기호 하나만 입력하세요. 예: ㅏ',
      type: 'string',
      group: 'basic',
      validation: (Rule) => Rule.required().max(2),
    }),
    defineField({
      name: 'category',
      title: '모음 종류',
      description: '단모음 또는 이중모음을 선택하세요.',
      type: 'string',
      group: 'basic',
      options: {
        list: [
          { title: '단모음 (Monophthong)', value: '단모음' },
          { title: '이중모음 (Diphthong)', value: '이중모음' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: '조음 설명 (한국어)',
      description: '모음의 조음 위치, 혀 높낮이, 전후 위치, 원순성 등을 설명해주세요.',
      type: 'text',
      rows: 5,
      group: 'basic',
    }),

    // ── 영상 파일 ──────────────────────────────────────────────────
    defineField({
      name: 'animationFileName',
      title: '조음 애니메이션 파일명',
      description:
        '애니메이션 영상 파일명을 입력하세요. 예: "ㅏ.mp4" — 파일은 /videos/vowels/animation/ 폴더에 넣어주세요.',
      type: 'string',
      group: 'media',
    }),
    defineField({
      name: 'mriFileName',
      title: 'MRI 영상 파일명',
      description:
        'MRI 영상 파일명을 입력하세요. 예: "ㅏ.mp4" — 파일은 /videos/vowels/mri/ 폴더에 넣어주세요.',
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
