// 메인 JavaScript 파일 - 웹사이트 주요 기능 구현

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화 함수
function initializeApp() {
    setupHeaderInteractions();
    setupSmoothScrolling();
    setupCTAButton();
}

// 헤더 메뉴 상호작용 설정
function setupHeaderInteractions() {
    var navLinks = document.querySelectorAll('.nav-menu a');
    var loginBtn = document.querySelector('.login-btn');
    
    // 현재 페이지에 따라 활성 메뉴 설정
    var currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(function(link) {
        var linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
    
    // 네비게이션 링크 클릭 이벤트 (실제 페이지 이동)
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            var href = link.getAttribute('href');
            console.log('네비게이션 클릭: ' + href);
            
            // 링크가 유효한 경우 페이지 이동 (preventDefault 제거)
            if (href && href !== '#') {
                // 페이지 이동은 브라우저가 자동으로 처리
                return true;
            } else {
                e.preventDefault();
            }
        });
    });
    
    // 로그인 폼 처리 (로그인 페이지에서만)
    var loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            var email = document.getElementById('email').value;
            var password = document.getElementById('password').value;
            
            console.log('로그인 시도:', email);
            alert('로그인 기능은 현재 개발 중입니다.\n입력하신 정보: ' + email);
        });
    }
}

// 부드러운 스크롤 설정
function setupSmoothScrolling() {
    var links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var href = link.getAttribute('href');
            var targetId = href ? href.substring(1) : null;
            var targetElement = targetId ? document.getElementById(targetId) : null;
            
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
function setupCTAButton() {
    var ctaButton = document.querySelector('.cta-button');
    
    if (ctaButton) {
        ctaButton.addEventListener('click', function() {
            console.log('접속하기 버튼 클릭');
            // 스탬프 투어 페이지로 이동하는 로직 추가 예정
            alert('스탬프 투어 기능은 추후 구현 예정입니다.');
        });
    }
}

// 헤더 스크롤 효과 (스크롤 시 헤더 배경 변화)
window.addEventListener('scroll', function() {
    var header = document.querySelector('.header');
    var scrollPosition = window.scrollY;
    
    if (header) {
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
});