// 메인 TypeScript 파일 - 웹사이트 주요 기능 구현

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// 앱 초기화 함수
function initializeApp(): void {
    setupHeaderInteractions();
    setupSmoothScrolling();
    setupCTAButton();
}

// 헤더 메뉴 상호작용 설정
function setupHeaderInteractions(): void {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const loginBtn = document.querySelector('.login-btn') as HTMLButtonElement;
    
    // 네비게이션 링크 클릭 이벤트
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            console.log(`네비게이션 클릭: ${href}`);
            
            // 활성 상태 관리
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // 로그인 버튼 클릭 이벤트
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            console.log('로그인 버튼 클릭');
            // 로그인 모달 또는 페이지로 이동하는 로직 추가 예정
            alert('로그인 기능은 추후 구현 예정입니다.');
        });
    }
}

// 부드러운 스크롤 설정
function setupSmoothScrolling(): void {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href')?.substring(1);
            const targetElement = targetId ? document.getElementById(targetId) : null;
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// CTA 버튼 기능 설정
function setupCTAButton(): void {
    const ctaButton = document.querySelector('.cta-button') as HTMLButtonElement;
    
    if (ctaButton) {
        ctaButton.addEventListener('click', () => {
            console.log('접속하기 버튼 클릭');
            // 스탬프 투어 페이지로 이동하는 로직 추가 예정
            alert('스탬프 투어 기능은 추후 구현 예정입니다.');
        });
    }
}

// 헤더 스크롤 효과 (스크롤 시 헤더 배경 변화)
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header') as HTMLElement;
    const scrollPosition = window.scrollY;
    
    if (header) {
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});

// 타입 정의 내보내기
export interface NavigationItem {
    name: string;
    href: string;
    isActive?: boolean;
}

export interface AppConfig {
    headerHeight: number;
    breakpoints: {
        mobile: number;
        tablet: number;
        desktop: number;
    };
}