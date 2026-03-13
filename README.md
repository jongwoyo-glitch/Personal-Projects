# NAI Prompt Builder

NovelAI 이미지 생성을 위한 올인원 프롬프트 빌더 & 이미지 에디터.  
단일 HTML 파일 기반, iPad / 데스크탑 브라우저에서 동작하며 GitHub Pages로 호스팅 가능.

---

## 배포 파일 구조

```
index.html           ← 메인 앱 (React + Babel, 단일 파일)
coi-serviceworker.js  ← COOP/COEP 활성화 (SharedArrayBuffer 지원)
webp_enc.js           ← libwebp Emscripten 글루 코드 (38KB)
webp_enc.wasm         ← libwebp WASM 바이너리 (275KB)
```

---

## 주요 기능

### 1. 프롬프트 빌더 (생성 페이지)

**캐릭터 시스템**
- 여러 캐릭터를 독립적으로 관리 (이름, 썸네일, 메모)
- 캐릭터별 프롬프트 컬럼 및 체크박스 조합
- 다중 캐릭터 동시 선택 — 프롬프트 자동 병합
- 베이스 프롬프트 (공통 긍정/부정) + 캐릭터별 프롬프트 분리

**프롬프트 편집**
- 컬럼(카테고리) 기반 프롬프트 정리
- 체크박스 토글로 프롬프트 조각 on/off
- 터치 리사이즈 가능한 텍스트 영역 (Mod / RTA 컴포넌트)
- 패널 폭 리사이저 — 탭으로 리사이즈 모드 진입 → 좌우 드래그 → 탭 또는 완료 버튼으로 해제

### 2. 이미지 생성

**지원 모드**
- **txt2img** — 텍스트 프롬프트만으로 생성
- **img2img** — Base Image + Strength/Noise 조절
- **Inpaint** — 마스크 영역만 재생성

**생성 파라미터**
- 모델: `nai-diffusion-4-5-full`, `nai-diffusion-4-5-curated`
- 해상도, 스텝, CFG Scale, 시드 (랜덤 / 고정)
- 샘플러: `k_euler_ancestral`, `k_euler`, `k_dpmpp_sde`
- SMEA / SMEA+Dyn
- `ucPreset` (기본 네거티브), `qualityToggle` (품질 접미사) 자동 적용
- Anlas 비용 실시간 추정 및 잔액 표시

**Vibe Transfer**
- 참조 이미지 다중 등록
- 이미지별 강도(reference_strength) 개별 조절

### 3. 인페인트 에디터

- 전체 화면 마스크 페인팅 UI
- 브러시/지우개 도구, 크기 조절
- 인페인트 전용 API 호출 (모델명 자동 `-inpainting` 접미사)
- 마스크 영역만 재생성 후 원본과 합성

### 4. 이미지 편집 캔버스 (풀스크린 에디터)

**레이아웃**: 상단 바(옵션+액션) + 왼쪽 도구 사이드바 + 레이어 패널 + 캔버스

#### 레이어 시스템
- 원본 이미지가 "🖼 원본" 소스 레이어로 편입 — 직접 편집 가능
- 추가 투명 레이어 자유 생성
- 레이어 순서 변경 (▲▼ 버튼) — 소스 레이어 아래에도 레이어 배치 가능
- 레이어 가시성 토글 (👁)
- 레이어 삭제 (소스 레이어 제외)
- 투명 영역은 체크보드 패턴으로 표시

#### 도구
| 도구 | 설명 |
|---|---|
| 🖌 브러시 | 색상·크기·불투명도 조절 가능 |
| 🧹 지우개 | 투명 처리 |
| 💧 스포이드 | 캔버스에서 색상 추출 |
| 🌫 블러 | 강도 조절 가능, 합성 이미지 기반 |
| 🪄 매직 원드 | BFS 플러드 필 선택 |

#### 매직 원드 상세
- 허용 범위 슬라이더 (0~255)
- 인접/전체 모드 토글
- 선택 영역 시각화: 비선택 영역 반투명 오버레이 + 흰색 경계선
- 🪣 채우기, ✕ 해제, ✅ 확정
- 선택 영역 활성 시 브러시/지우개/블러가 해당 영역으로 자동 클리핑

#### 투명 브러시
- 체크보드 패턴 "투명" 칸 선택 → `destination-out` 합성
- 소스 레이어에서 배경을 수동으로 투명 처리하는 용도

#### 색상 시스템
- HSV 색상환 (터치 드래그 지원)
- 10색 빠른 팔레트
- 투명 모드 전환

#### 단축키 시스템
- 각 도구에 커스텀 키보드 단축키 할당 가능
- 도구 버튼 왼쪽 `⋮` 영역 탭 → 키 입력 캡처 모달
- 충돌 감지, ESC 취소, DEL 해제
- localStorage 영속 저장

#### 줌/팬
- 마우스 휠 줌, 터치 핀치 줌
- 드래그 팬 (2-finger 터치)

#### 내보내기
- 편집 결과 → Base Image로 설정 (img2img 워크플로우)
- 편집 결과 → 미리보기로 설정
- PNG / WebP 직접 저장

### 5. 배경 제거

**로컬 AI 처리** (브라우저 내, 서버 불필요)
- `@imgly/background-removal` ONNX 모델 사용
- 진행률 표시

**모드**
- 전체 이미지 배경 제거
- 선택적 제거: 마스크 페인팅 → 마스크 영역만 배경 제거
- 역방향 모드: 페인팅한 영역만 보존, 나머지 배경 제거

### 6. 후처리 페이지 (히스토리)

- 생성 이미지 자동 저장 (IndexedDB 기반)
- 타임스탬프 기반 정렬
- 개별 이미지: 편집 열기, Base Image 설정, PNG/WebP 저장, 삭제
- 전체 히스토리 ZIP 다운로드

### 7. 파일 저장 시스템

플랫폼별 최적 저장 방식 자동 선택:

| 환경 | 방식 |
|---|---|
| iPad / iOS | `navigator.share()` → 네이티브 공유 시트 ("파일에 저장") |
| 데스크탑 Chrome | `showSaveFilePicker()` → OS 파일 저장 다이얼로그 |
| 기타 | `<a download>` 클릭 폴백 |

### 8. WebP 인코딩 (WASM)

iPad Safari는 `canvas.toBlob("image/webp")`를 지원하지 않으므로 libwebp WASM 인코더 사용:

- `webp_enc.js`를 fetch → 런타임에 ESM 구문 패치 → `<script>` 태그로 주입
- `webp_enc.wasm`을 fetch → ArrayBuffer로 팩토리에 직접 주입
- 네이티브 WebP 지원 브라우저에서는 WASM 불필요 (자동 폴백)

### 9. 데이터 관리

| 데이터 | 저장소 | 키 |
|---|---|---|
| 앱 설정·캐릭터·프롬프트 | localStorage | `nai-pb-v4` |
| 생성 이미지 | IndexedDB | `nai-pb-images` |
| 편집 단축키 | localStorage | `nai_edit_shortcuts` |
| img2img Strength/Noise | localStorage | `nai-pb-i2i-str`, `nai-pb-i2i-noise` |

설정 전체를 JSON으로 내보내기/가져오기 가능.

---

## iPad 최적화

이 앱은 iPad + Apple Pencil 환경을 1순위로 최적화:

- `viewport-fit=cover` + `env(safe-area-inset-*)` — 노치/홈바 대응
- `apple-mobile-web-app-capable` — 홈 화면 추가 시 풀스크린 앱
- `touch-action: none` — 브라우저 제스처 경쟁 방지
- `overscroll-behavior: none` + scroll kill listener — Safari 바운스 스크롤 방지
- `@media(hover:hover)` — Apple Pencil hover 이벤트 필터링
- Pointer Events API — mouse/touch/pencil 통합 입력 처리
- 패널 리사이저: 탭 → 모드 진입 → 전체 화면 오버레이 드래그 (얇은 경계선 직접 드래그 불가 문제 해결)
- 색상환 터치 드래그: `touchAction:"none"` + `preventDefault()`
- 최소 터치 타겟 44px 이상 준수

---

## 기술 스택

| 구성 | 내용 |
|---|---|
| 프레임워크 | React 18 (CDN) + Babel Standalone (브라우저 내 JSX 변환) |
| 스타일 | 인라인 스타일 (CSS-in-JS) |
| 이미지 생성 | NovelAI Image Generation API v3 |
| 배경 제거 | @imgly/background-removal (ONNX, 브라우저 내) |
| WebP 인코딩 | @jsquash/webp WASM (libwebp) |
| 데이터 저장 | localStorage + IndexedDB |
| 파일 저장 | Web Share API / File System Access API / `<a download>` |
| ZIP | JSZip |
| 폰트 | Noto Sans KR + JetBrains Mono (Google Fonts CDN) |
| COOP/COEP | coi-serviceworker.js |

---

## 사용법

1. GitHub Pages 또는 로컬 서버에 4개 파일 배포
2. NovelAI API 토큰을 설정에 입력
3. 캐릭터 생성 → 프롬프트 작성 → 생성 버튼
4. 생성된 이미지를 편집 캔버스에서 후처리
5. PNG/WebP로 저장

---

## 라이선스

이 프로젝트는 개인 사용 목적으로 제작되었습니다.  
WebP 인코더(`webp_enc.js`, `webp_enc.wasm`)는 [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0) (Google libwebp)에 따릅니다.  
배경 제거 모듈은 [@imgly/background-removal](https://github.com/nicbarker/imgly-background-removal-js) 라이선스를 따릅니다.
