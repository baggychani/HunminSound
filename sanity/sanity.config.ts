import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'

export default defineConfig({
  name: 'sejong-speech-sounds',
  title: '세종말소리 관리자',

  projectId,
  dataset,
  basePath: '/studio',

  plugins: [
    structureTool({
      title: '콘텐츠 관리',
      structure: (S) =>
        S.list()
          .title('세종말소리 콘텐츠')
          .items([
            S.listItem()
              .title('자음 목록')
              .child(
                S.documentList()
                  .title('자음')
                  .filter('_type == "consonant"'),
              ),
            S.listItem()
              .title('모음 목록')
              .child(
                S.documentList()
                  .title('모음')
                  .filter('_type == "vowel"'),
              ),
          ]),
    }),
    visionTool({ title: '데이터 탐색기' }),
  ],

  schema: {
    types: schemaTypes,
  },
})
