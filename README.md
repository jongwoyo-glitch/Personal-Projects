# NAI Prompt Builder

NovelAI 이미지 생성을 위한 프롬프트 빌더 & 에디터

## 기능

- 🎨 **프롬프트 빌더**: 베이스 + 캐릭터별 프롬프트 관리 (접기/펼치기, 토큰 카운트)
- 👥 **멀티캐릭터**: V4.5 캐릭터 분리 지원
- 🖼 **img2img**: 외부 이미지 업로드 또는 생성 이미지를 Base Image로 활용
- ✏️ **이미지 편집 캔버스**: 브러시/지우개/스포이드/블러/배경제거 + 레이어 시스템
- 🖌 **인페인트**: 마스크 페인팅 + NAI 인페인트 API
- 🎭 **바이브 트랜스퍼**: 캐릭터별 참조 이미지
- 📋 **생성 히스토리**: 썸네일 + 메타데이터 자동 저장
- 🔲 **배경 제거**: NAI Director Tools API
- 📱 **iPad 최적화**: 터치, 핀치줌, 제스처 지원

## 사용법

### GitHub Pages (권장)
1. 이 레포지토리를 Fork
2. Settings → Pages → Source: `main` branch, `/ (root)` → Save
3. `https://your-username.github.io/nai-prompt-builder/` 접속

### 로컬 서버
```bash
node serve.js
# http://localhost:3000 접속
```

### 직접 열기
`index.html`을 브라우저에서 직접 열어도 기본 기능은 작동합니다.  
(배경 제거 등 일부 기능은 로컬 서버 또는 GitHub Pages 필요)

## 파일 구조

```
index.html            - 메인 앱 (단일 파일)
coi-serviceworker.js  - SharedArrayBuffer 헤더 주입 (GitHub Pages용)
serve.js              - 로컬 개발 서버
```

## 설정

1. NovelAI에서 **Persistent API Token** 발급 (User Settings → Account)
2. 앱의 ⚙ 설정에서 API 토큰 입력
3. 모델/해상도/샘플러 등 설정

## 단축키 (편집 캔버스)

| 단축키 | 기능 |
|--------|------|
| `Ctrl+Z` / `Cmd+Z` | 실행 취소 |
| `[` / `]` | 브러시 크기 ±3 |
| `Shift+[` / `]` | 브러시 크기 ±10 |
| `Ctrl+Alt+드래그` | 브러시 크기 조절 (클립스튜디오 방식) |
| 우클릭 | 스포이드 (색상 추출) |
| `Cmd/Ctrl+클릭` | 스포이드 |
| 두 손가락 탭 | 실행 취소 (iPad) |
| 핀치 줌 | 캔버스 확대/축소 (iPad) |
| 마우스 휠 | 캔버스 확대/축소 |

## 라이선스

개인 사용 목적. NovelAI API 사용 시 [NovelAI 이용약관](https://novelai.net/terms) 준수.
