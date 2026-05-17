# AI 에이전트 작업 주의사항 (Cursor / Sonnet)

> 이 프로젝트에서 AI가 자주 실수하는 패턴을 정리한 파일입니다.  
> 작업 시작 시 참조하여 동일한 실수를 반복하지 않도록 합니다.

---

## 1. 파일 인코딩 (가장 빈번한 문제)

### 핵심 규칙
- **모든 소스 파일(`.ts`, `.tsx`, `.json` 등)은 반드시 UTF-8 (BOM 없음)으로 저장**
- Vercel(Linux 빌드 서버)은 UTF-16 파일을 읽지 못하고 `stream did not contain valid UTF-8` 오류 발생

### 발생 원인
- Windows PowerShell의 `>` 리다이렉트 연산자는 기본적으로 **UTF-16 LE BOM** (`FF FE`)으로 파일 생성
- `Out-File`도 기본값이 UTF-16 (PowerShell 5.x 기준)
- VSCode에서 한글이 포함된 파일을 새로 저장하면 인코딩이 변경될 수 있음

### 올바른 파일 쓰기 방법 (PowerShell)
```powershell
# 잘못된 방법 (UTF-16 BOM 생성)
echo "content" > file.ts
"content" | Out-File file.ts

# 올바른 방법
[System.IO.File]::WriteAllText("file.ts", "content", [System.Text.Encoding]::UTF8)
Out-File -FilePath "file.ts" -Encoding UTF8NoBOM
```

### 인코딩 검증 방법
```powershell
$bytes = [System.IO.File]::ReadAllBytes("src\data\vowels.ts")
# UTF-16 LE BOM 확인: 첫 2바이트가 FF FE 면 문제
Write-Host "$($bytes[0].ToString('X2')) $($bytes[1].ToString('X2'))"

# UTF-8 유효성 검사
try {
    $utf8 = New-Object System.Text.UTF8Encoding $false, $true
    $utf8.GetString($bytes) | Out-Null
    Write-Host "UTF-8 OK"
} catch { Write-Host "NOT UTF-8" }
```

### 배포 전 일괄 검사 스크립트
```powershell
$files = Get-ChildItem src -Include "*.ts","*.tsx","*.json" -Recurse
foreach ($f in $files) {
    $b = [System.IO.File]::ReadAllBytes($f.FullName)
    if ($b[0] -eq 0xFF -and $b[1] -eq 0xFE) { Write-Host "UTF-16 BOM 문제: $($f.Name)" }
}
```

---

## 2. PowerShell 문법 주의사항

### `&&` 연산자 미지원 (PowerShell 5.x)
```powershell
# 잘못됨 - Windows PowerShell 5.x에서 오류 발생
cd project && npm run build

# 올바른 방법
cd project; npm run build
# 또는 (앞 명령 성공 시에만 실행)
cd project
if ($?) { npm run build }
```

> PowerShell 7+에서는 `&&` 지원. 이 프로젝트는 Windows PowerShell 5.x 환경.

### 출력 관련
```powershell
# 파일 내용 읽기 - cat, head, tail 사용 금지
# Read 도구 사용 (전용 도구가 있을 때는 Shell 대신 사용)

# git 출력이 깨질 수 있음 (PowerShell 콘솔 인코딩 문제)
# git show HEAD:path/to/file 결과에 ?? 표시 → 실제 파일 손상 의미 아님
# 반드시 바이트 레벨로 검증
```

### .bat 파일에 한글 절대 금지
- cmd.exe는 `chcp 65001` 실행 **이전에** 배치 파일 전체를 ANSI(CP949)로 파싱
- `chcp 65001`을 첫 줄에 넣어도 파일 자체의 한글은 이미 깨진 상태로 읽힘
- **bat 파일의 echo/rem/label 등 모든 텍스트는 반드시 ASCII만 사용**
- 한글 메시지가 필요하면 별도 `.ps1` 또는 `.txt` 파일로 분리하거나 PowerShell로 처리

```bat
:: 잘못됨 - UTF-8로 저장해도 cmd가 깨트림
echo  Node.js가 설치되어 있지 않습니다.

:: 올바름
echo  Node.js is not installed. Please visit https://nodejs.org/
```

### Heredoc 문법 미지원
```powershell
# 잘못됨 - PowerShell에서 heredoc 미지원
git commit -m "$(cat <<'EOF'
메시지
EOF
)"

# 올바른 방법 - 임시 파일 사용
$msg = "커밋 메시지"
[System.IO.File]::WriteAllText("C:\Temp\msg.txt", $msg, [System.Text.Encoding]::UTF8)
git commit -F "C:\Temp\msg.txt"
```

### `>` 리다이렉트 파일 인코딩 문제
```powershell
# git cat-file 출력을 파일로 저장할 때
git cat-file blob HEAD:src/data/vowels.ts > temp.ts  # UTF-16 BOM 추가됨!

# 올바른 방법
git cat-file blob HEAD:src/data/vowels.ts | Set-Content temp.ts -Encoding UTF8
```

---

## 3. Git 커밋 관련 주의사항

### 인코딩 변경이 감지되지 않는 경우
- `git status`가 clean이어도 실제 git blob이 UTF-16일 수 있음
- **반드시 `git cat-file -s <hash>` 로 blob 크기 확인**
- 한국어 텍스트: UTF-8 크기 < UTF-16 크기 (BOM 포함)
- 비교: `(Get-Item file.ts).Length` vs `git cat-file -s $(git ls-files -s file.ts | cut -d' ' -f2)`

### `.gitattributes` 영향
- 이 프로젝트: `* text=auto eol=lf` 설정됨
- UTF-16 BOM 파일은 바이너리로 감지될 수 있어 줄바꿈 변환 미적용

---

## 4. 기존 파일 덮어쓰기 주의

### 파일이 로컬에 없어도 git에 있을 수 있음
- `Get-ChildItem`으로 파일이 없어 보여도, `git ls-files` 또는 `git log -- 파일경로` 로 git 이력 먼저 확인
- 로컬에 없는 파일을 새로 만들기 전에 항상 git 이력 조회 필수
```powershell
# 파일이 git에 있는지 확인
git log --oneline -- 파일명.ps1

# 이전 커밋에서 내용 확인
git show <커밋해시>:파일명.ps1
```
- 특히 `.ps1`, `.bat`, `.sh` 등 실행 스크립트는 정교한 로직(PID 관리, 프로세스 트리 종료 등)이 있을 수 있으므로 함부로 단순화 버전으로 교체 금지

---

## 5. Next.js / Vercel 배포 주의사항

### 인코딩 오류 메시지
```
Error: Failed to read source code from /vercel/path0/src/data/vowels.ts
Caused by: stream did not contain valid UTF-8
```
→ 해당 파일이 UTF-16 또는 다른 인코딩으로 저장된 것. 로컬에서 UTF-8로 재저장 후 재커밋.

### 데이터 파일 위치
- `src/data/*.ts` - 인코딩에 민감한 한글 텍스트 포함 파일들
- 이 파일들 수정 후에는 항상 인코딩 검증 필수

---

## 6. 작업 시작 체크리스트

한글 텍스트가 포함된 파일을 수정할 때:
- [ ] 파일 저장 후 바이트 레벨 인코딩 확인 (UTF-8, BOM 없음)
- [ ] PowerShell `>` 리다이렉트 대신 `[System.IO.File]::WriteAllText` 사용
- [ ] git commit 전 `src/data/` 파일들 인코딩 일괄 검사
- [ ] PowerShell 명령어에서 `&&` 대신 `;` 사용

---

## 7. 이 프로젝트 환경 정보
- OS: Windows 10 (PowerShell 5.x)
- 프레임워크: Next.js 14 + TypeScript
- 배포: Vercel (Linux 환경, UTF-8 필수)
- 저장소: `github.com/baggychani/HunminSound`
- 한글 데이터 파일: `src/data/vowels.ts`, `src/data/consonants.ts` 등
