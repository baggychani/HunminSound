import cAr from './phoneme/c.ar.json'
import cDe from './phoneme/c.de.json'
import cEn from './phoneme/c.en.json'
import cEs from './phoneme/c.es.json'
import cFr from './phoneme/c.fr.json'
import cHi from './phoneme/c.hi.json'
import cId from './phoneme/c.id.json'
import cJa from './phoneme/c.ja.json'
import cRu from './phoneme/c.ru.json'
import cTh from './phoneme/c.th.json'
import cTr from './phoneme/c.tr.json'
import cVi from './phoneme/c.vi.json'
import cZh from './phoneme/c.zh.json'
import vAr from './phoneme/v.ar.json'
import vDe from './phoneme/v.de.json'
import vEn from './phoneme/v.en.json'
import vEs from './phoneme/v.es.json'
import vFr from './phoneme/v.fr.json'
import vHi from './phoneme/v.hi.json'
import vId from './phoneme/v.id.json'
import vJa from './phoneme/v.ja.json'
import vRu from './phoneme/v.ru.json'
import vTh from './phoneme/v.th.json'
import vTr from './phoneme/v.tr.json'
import vVi from './phoneme/v.vi.json'
import vZh from './phoneme/v.zh.json'

type Map = Record<string, string>

export const consonantI18n: Record<string, Map> = {
  en: cEn, zh: cZh, ja: cJa, fr: cFr, de: cDe, es: cEs, hi: cHi,
  vi: cVi, ru: cRu, ar: cAr, tr: cTr, id: cId, th: cTh,
}

export const vowelI18n: Record<string, Map> = {
  en: vEn, zh: vZh, ja: vJa, fr: vFr, de: vDe, es: vEs, hi: vHi,
  vi: vVi, ru: vRu, ar: vAr, tr: vTr, id: vId, th: vTh,
}
