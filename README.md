# modern-web-project

# Me airy - 파주 출판단지 스탬프 투어

파주 출판단지를 테마로 한 웹 애플리케이션입니다.

## 프로젝트 구조

```
PajuDacon/
├── public/
│   └── index.html          # 메인 HTML 파일
├── src/
│   ├── assets/
│   │   ├── styles/
│   │   │   ├── reset.css           # CSS 리셋
│   │   │   ├── utilities.css       # 유틸리티 클래스
│   │   │   ├── components.css      # 컴포넌트 스타일
│   │   │   └── main.css           # 메인 스타일
│   │   ├── scripts/
│   │   │   ├── main.js            # 메인 JavaScript
│   │   │   └── main.ts            # 메인 TypeScript
│   │   ├── images/                # 이미지 리소스
│   │   ├── icons/                 # 아이콘 리소스
│   │   └── fonts/                 # 폰트 리소스
│   ├── components/                # 재사용 컴포넌트
│   └── pages/                     # 페이지별 파일
├── package.json
├── tsconfig.json
└── README.md
```

## 현재 구현된 기능

### 1. 상단 헤더 메뉴
- ✅ 배경색: #FFFFFF
- ✅ 좌측 로고: "Me airy" 
- ✅ 메뉴: HOME, 추천코스, 추억앨범, 스토리북
- ✅ 우측 LOGIN 버튼
- ✅ 스크롤 시 헤더 효과
- ✅ 반응형 디자인

### 2. 메인 섹션
- ✅ 배경 그라데이션 (임시 - 이미지 대체 예정)
- ✅ 30% 불투명 검은 오버레이
- ✅ 히어로 콘텐츠 ("파주 출판단지로 떠나는 여행")
- ✅ CTA 버튼 ("접속하기")

### 3. 상호작용 기능
- ✅ 네비게이션 메뉴 클릭 효과
- ✅ 부드러운 스크롤
- ✅ 버튼 호버 효과
- ✅ 활성 메뉴 표시

## 사용 방법

1. 브라우저에서 `public/index.html` 파일을 엽니다.
2. 또는 라이브 서버를 사용하여 로컬 개발 서버에서 실행합니다.

## 향후 개발 계획

- [ ] 실제 배경 이미지 적용
- [ ] 추천코스 페이지 구현
- [ ] 추억앨범 페이지 구현
- [ ] 스토리북 페이지 구현
- [ ] 로그인 기능 구현
- [ ] 스탬프 투어 기능 구현
- [ ] 모바일 최적화
- [ ] 접근성 개선

## 기술 스택

- HTML5
- CSS3 (Flexbox, Grid)
- JavaScript (ES6+)
- TypeScript (향후 개발용)

## 브라우저 지원

- Chrome (최신 버전)
- Firefox (최신 버전)
- Safari (최신 버전)
- Edge (최신 버전) It aims to provide a structured and modular approach to web development.

## Project Structure

- **src/**: Contains the source code for the application.
  - **assets/**: Holds styles and scripts.
    - **styles/**: Contains CSS files for styling the application.
      - `main.css`: Main styles for layout and design.
      - `reset.css`: CSS reset styles for consistent rendering across browsers.
    - **scripts/**: Contains TypeScript files for application logic.
      - `main.ts`: Main TypeScript file for core functionality.
      - **types/**: Contains TypeScript types and interfaces.
        - `index.ts`: Exports types and interfaces used throughout the application.
  - **components/**: Contains reusable components for the application.
    - `index.ts`: Exports components for modular development.
  - **pages/**: Contains HTML files for the application.
    - `index.html`: Main HTML file serving as the entry point.

- **public/**: Contains public-facing files.
  - `index.html`: Public HTML file, serving as a template or fallback.

- **package.json**: Configuration file for npm, listing dependencies and scripts.

- **tsconfig.json**: TypeScript configuration file specifying compiler options.

- **.gitignore**: Specifies files and directories to be ignored by Git.

## Getting Started

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd modern-web-project
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.