/** TSX 파서와 % 문자 충돌을 피하기 위한 헬퍼 */
export function toPercent(value: number): string {
  return `${value}\u0025`
}
