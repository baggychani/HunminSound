import pAr from './hunmin/p.ar.json'
import pDe from './hunmin/p.de.json'
import pEs from './hunmin/p.es.json'
import pFr from './hunmin/p.fr.json'
import pHi from './hunmin/p.hi.json'
import pId from './hunmin/p.id.json'
import pJa from './hunmin/p.ja.json'
import pRu from './hunmin/p.ru.json'
import pTh from './hunmin/p.th.json'
import pTr from './hunmin/p.tr.json'
import pVi from './hunmin/p.vi.json'
import pZh from './hunmin/p.zh.json'

export const hunminPassageI18n: Record<string, Record<string, string>> = {
  zh: pZh,
  ja: pJa,
  fr: pFr,
  de: pDe,
  es: pEs,
  hi: pHi,
  vi: pVi,
  ru: pRu,
  ar: pAr,
  tr: pTr,
  id: pId,
  th: pTh,
}
