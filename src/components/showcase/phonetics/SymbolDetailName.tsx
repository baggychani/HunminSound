import { JamoText } from '@/components/ui/JamoText'

/** "ㅂ (비읍)"처럼 자모 옆 괄호 이름만 한 단계 작게 */
export function SymbolDetailName({ name }: { name: string }) {
  const match = /^(.*?)(\s*\([^)]*\))\s*$/.exec(name)
  if (!match) return <JamoText text={name} />

  return (
    <>
      <JamoText text={match[1]} />
      {match[1] ? ' ' : null}
      <span className="text-[0.88em]">{match[2].trim()}</span>
    </>
  )
}
