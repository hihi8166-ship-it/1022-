# 탤런트뱅크 화면 재현 과제

`index.html`을 브라우저에서 열거나 VS Code Live Server로 실행하세요.
로컬 서버가 필요하면 다음 명령을 사용할 수 있습니다.

```powershell
python -m http.server 5500
```

브라우저에서 `http://localhost:5500`을 엽니다.

- 메인 화면과 전문가 검색, 프로젝트, 임원 구독제, 성공사례, 인재추천, 세미나 화면은 원본의 공개 HTML·스타일·이미지를 기준으로 구성했습니다.
- 목록에 연결된 공개 상세 페이지와 로그인·회원가입·문의·FAQ·공지 화면도 로컬 파일로 연결했습니다.
- `css/style.css`는 원본 공통 스타일, `css/pages.css`는 원본 하위 화면 스타일입니다. 추가 이미지·폰트·화면별 스타일은 `assets/mirror/`에 있습니다.
- `local-adapter.js`는 원본 화면 코드의 목록 요청을 수집된 공개 데이터로 처리합니다. `local-site.js`는 로컬 검색과 페이지 연결을 보완합니다.
- 원본 서버와 연결한 서비스가 아닙니다. 로그인, 회원가입, 상담 접수, 계약·결제 등 서버 작업을 실제로 처리하지 않습니다. 목록 데이터는 수집 당시의 공개 화면 기준입니다.
- 과제용 로컬 재현입니다. 원본 사이트는 <https://www.talentbank.co.kr/>입니다.

검증 결과와 비교 화면은 `verification/rebuilt/`에 있습니다.
Edge 검증 스크립트는 `verify_site.py`, 동작 검사는 `verify_workflows.py`입니다.
검증 도구는 `.qa-tools/`의 Playwright를 사용하며, 작업 중 설치한 이 폴더는 Git에서 제외됩니다.
