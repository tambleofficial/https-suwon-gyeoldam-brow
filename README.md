# 결담 브로우 — 수원눈썹문신 홈페이지

GitHub 저장소와 Cloudflare Pages로 배포하는 정적 HTML 홈페이지입니다. 업체명은 임의로 정한 **결담 브로우**, 위치는 **수원역 인근**, 상담 전화는 **010-8142-1319**입니다.

## 가장 먼저 설정할 것

1. 실제 사용할 HTTPS 주소: `site.config.json`의 `siteUrl` 또는 Cloudflare 환경변수 `SITE_URL`.
2. 네이버가 발급한 소유확인 코드: `site.config.json`의 `naverVerification` 또는 환경변수 `NAVER_SITE_VERIFICATION`.
3. 실제 영업 시작 전 상세 주소와 운영 정보: 현재는 제공된 범위대로 수원역 인근과 전화 상담만 안내합니다. 구체적인 영업시간·가격·후기는 임의로 넣지 않았습니다.

기본 주소는 `https://suwon-gyeoldam-brow.pages.dev`입니다. 이 프로젝트 이름이 사용 가능하다는 의미는 아닙니다. Cloudflare에서 실제 발급한 주소나 연결한 도메인으로 반드시 변경하세요. 환경변수가 설정되면 설정 파일보다 우선합니다.

## GitHub → Cloudflare Pages 배포

1. ZIP을 풀고 새 GitHub 저장소에 **`suwon-gyeoldam-brow` 폴더 안의 내용**을 업로드합니다. 저장소 최상위에 `package.json`, `index.html`, `assets`, `scripts`가 있도록 합니다.
2. Cloudflare의 Workers & Pages에서 Pages 프로젝트를 생성하고 해당 GitHub 저장소를 연결합니다.
3. 다음 빌드 설정을 사용합니다.

| 설정 | 값 |
|---|---|
| Framework preset | None |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | 비워둠 — 저장소 최상위 사용 |
| Production branch | 실제 사용하는 브랜치, 보통 `main` |

4. 빌드 환경변수 `SITE_URL`에 최종 주소를 넣습니다. 예: `https://실제프로젝트.pages.dev` 또는 `https://실제도메인.kr`. 경로나 쿼리 없이 도메인만 입력합니다.
5. 배포합니다. 처음 배포한 뒤 주소를 확인해야 한다면 환경변수를 수정하고 다시 배포합니다. 이후 GitHub의 운영 브랜치에 변경 내용을 올리면 연결된 Pages가 다시 빌드합니다.

빌드는 외부 npm 패키지 없이 Node.js 20 이상에서 실행됩니다. 원본 저장소 안에 미리 생성된 HTML도 있지만, Cloudflare에는 빌드가 생성한 **`dist`만** 배포합니다. 도메인 변경 시 canonical·OG·구조화 데이터·사이트맵·RSS·robots 주소가 함께 바뀝니다.

## 네이버 서치어드바이저 등록

1. 실제 운영 도메인으로 [서치어드바이저](https://searchadvisor.naver.com/)에 사이트를 추가합니다.
2. 소유확인 방식은 다음 둘 중 하나를 선택합니다.
   - **HTML 태그 방식:** 네이버가 제공한 `<meta name="naver-site-verification" content="발급코드">`의 `content` 값만 `NAVER_SITE_VERIFICATION`에 입력하고 다시 배포합니다. 설정 파일의 `naverVerification`에 넣어도 됩니다.
   - **HTML 파일 방식:** 네이버에서 받은 `naver발급값.html`을 이름과 내용 그대로 저장소 최상위에 넣고 배포합니다. 빌드가 `dist` 최상위로 복사합니다. 임의로 만든 파일은 소유확인에 사용할 수 없습니다.
3. 운영 홈페이지의 소스에서 확인 태그를 확인하거나, 받은 HTML 파일의 URL을 열어 확인한 후 네이버에서 소유확인을 완료합니다.
4. 사이트맵 제출: `https://실제도메인/sitemap.xml`
5. RSS 제출: `https://실제도메인/rss.xml`
6. robots.txt 검사와 웹페이지 수집 요청을 확인합니다. `NAVER-URLS.txt`에는 생성된 전체 페이지의 URL이 들어 있습니다.

소유확인 코드는 사이트별로 네이버가 발급하므로 완성 ZIP에 유효한 코드를 미리 넣을 수 없습니다. 필요한 파일과 코드 입력·복사 절차는 준비되어 있습니다.

## 메인 캐러셀과 SEO 구조

- 메인 앞부분의 **눈썹 디자인 카드 6개**는 최초 HTML에 이미지·제목·상세 링크가 들어 있습니다. 데스크톱에서는 6개를 함께 표시하고, 좁은 화면에서는 가로 스크롤과 이전/다음 버튼으로 탐색합니다.
- 홈에 `ItemList` 1개를 넣었습니다. 6개 `ListItem`의 `name`, `image`, `url`, `position`은 화면 카드 및 독립 상세페이지와 일치합니다. 이미지 URL과 페이지 URL은 최종 도메인의 절대 주소입니다.
- 메인 1개, 상단 메뉴 상세 5개, 프로그램 상세 6개로 **검색 가능한 페이지 12개**를 제공합니다. 메뉴별 이미지, 서로 다른 제목·설명, canonical, OG, H1과 본문이 있습니다.
- `BeautySalon`, `WebSite`, `WebPage`, 하위 페이지의 `BreadcrumbList`를 구성했습니다. 알 수 없는 상세 주소·평점·실제 고객 후기·시술 실적은 만들지 않았습니다.
- `robots.txt`, `sitemap.xml`, 본문이 포함된 `rss.xml`, 실제 없는 URL을 위한 `404.html`, Cloudflare `_headers`, `_redirects`를 포함합니다. 모든 요청을 홈으로 보내는 SPA 우회 규칙은 없습니다.
- 이미지 9종을 직접 생성하고 의미에 맞는 JPG 파일명을 지정했습니다. 화면에는 같은 이미지의 WebP를 우선 사용하고 JPG를 대체 이미지로 제공합니다. 항목마다 별도 이미지와 `alt`가 있으며 대표 이미지는 우선 로딩합니다.

**홈페이지 안의 카드 캐러셀은 구현되어 있습니다. 네이버 검색 결과의 캐러셀은 검색 시스템이 판단하므로 등록이나 구조화 데이터만으로 노출을 보장할 수 없습니다.** 도메인 설정, 소유확인, 수집·색인 확인을 순서대로 진행하세요.

AI 이미지는 디자인·공간 분위기의 예시입니다. 실제 고객의 시술 결과나 실제 매장 촬영 사진이 아닙니다. 영업 사진이 준비되면 해당 항목에 맞는 본인 소유 원본으로 교체하고 동일한 파일명과 연결 관계를 유지할 수 있습니다.

## 페이지 구성

| 경로 | 내용 |
|---|---|
| `/` | 메인, 디자인 캐러셀, 소개, 상담 흐름, FAQ |
| `/brand/` | 결담의 기준 |
| `/design/` | 눈썹 디자인 |
| `/gallery/` | 디자인 갤러리 |
| `/guide/` | 이용 가이드 |
| `/contact/` | 상담·오시는 길 |
| `/services/natural-brow/` | 자연눈썹 |
| `/services/combo-brow/` | 콤보눈썹 |
| `/services/men-brow/` | 남자눈썹 |
| `/services/powder-brow/` | 파우더눈썹 |
| `/services/retouch/` | 리터치 |
| `/services/residual-consultation/` | 잔흔 디자인 상담 |

## 수정·미리보기·점검

```bash
npm run build
npm run check
python3 -m http.server 8080 --directory dist
```

브라우저에서 `http://localhost:8080`을 엽니다. HTML을 더블클릭하면 `/assets/`와 페이지 경로가 정상 동작하지 않으므로 웹 서버로 확인하세요.

주요 수정 파일은 `scripts/content.mjs`(프로그램·메뉴 내용), `scripts/generate.mjs`(페이지 본문·HTML 구조), `assets/site.css`, `assets/site.js`, `site.config.json`입니다. HTML을 직접 고치면 다음 빌드에서 덮어쓰므로 생성 원본을 수정합니다. `npm run refresh`는 저장소에 들어 있는 미리 생성된 HTML도 갱신합니다.

전화번호는 설정 파일에서 변경할 수 있습니다. 업체명을 바꾸려면 설정뿐 아니라 생성 원본의 브랜드 문구도 함께 수정하세요. `docs/image-prompts.json`에는 생성 이미지별 프롬프트와 크기가 기록되어 있습니다.

참고 공식 문서: [네이버 SEO 가이드](https://searchadvisor.naver.com/guide), [네이버 콘텐츠 마크업](https://searchadvisor.naver.com/guide/structured-data-carousel), [Cloudflare 정적 HTML 배포](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/).

## 확인된 범위

12개 페이지의 고유 제목·설명·canonical, 내부 링크 359개, 이미지 참조 50개, 홈의 단일 ItemList와 6개 카드 일치, 도메인·소유확인 코드 변경 반영, XML 문법 및 이미지 파일 무결성 검사를 통과했습니다. 실제 브라우저 렌더링과 모바일 터치 조작은 이 제작 환경에서 실행되지 않았습니다. 배포 후 PC·휴대폰에서 메인 카드 탐색, 메뉴 열기, 전화 버튼, FAQ, 각 상세페이지의 이미지와 가로 넘침을 확인하세요.
