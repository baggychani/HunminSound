/**
 * 관리자 비밀번호 해시 생성기.
 *
 *   node scripts/make-admin-hash.mjs "설정할비밀번호"
 *
 * 출력된 $2b$… 문자열을 .env.local 의 ADMIN_PASSWORD (또는 ADMIN_USERS 안 password)에
 * 그대로 넣으면 됩니다. 평문도 계속 쓸 수 있지만 해시를 권장합니다.
 */
import bcrypt from 'bcryptjs'

const password = process.argv[2]
if (!password) {
  console.error('사용법: node scripts/make-admin-hash.mjs "설정할비밀번호"')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)
console.log(hash)
