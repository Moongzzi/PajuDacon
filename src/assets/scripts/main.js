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
    setupContentSelector();
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
            var link = ctaButton.getAttribute('data-link');
            if (link) {
                console.log('버튼 클릭 - 페이지 이동:', link);
                window.location.href = link;
            }
        });
    }
}

// 콘텐츠 선택 기능 설정
function setupContentSelector() {
    var contentCards = document.querySelectorAll('.content-card');
    var heroTitle = document.getElementById('hero-title');
    var heroSubtitle = document.getElementById('hero-subtitle');
    var heroButton = document.getElementById('hero-button');
    
    // 콘텐츠 데이터 정의
    var contentData = {
        '1': {
            title: '파주 출판단지로<br>떠나는 여행',
            subtitle: '파주 출판단지 스탬프 투어 코스',
            buttonText: '접속하기 ▶',
            link: 'courses.html'
        },
        '2': {
            title: '가족 연인과 함께<br>기록하는 MEMORY',
            subtitle: '나만의 추억앨범 만들기',
            buttonText: '접속하기 ▶',
            link: 'album.html'
        },
        '3': {
            title: '우리 이야기를 담는<br>특별한 STORY',
            subtitle: '내가 만드는 DIY 동화 스토리북',
            buttonText: '접속하기 ▶',
            link: 'storybook.html'
        }
    };
    
    // 콘텐츠 업데이트 함수
    function updateContent(contentNumber) {
        var data = contentData[contentNumber];
        if (data && heroTitle && heroSubtitle && heroButton) {
            // 텍스트 페이드 아웃 효과
            heroTitle.style.opacity = '0';
            heroSubtitle.style.opacity = '0';
            heroButton.style.opacity = '0';
            
            setTimeout(function() {
                // 텍스트 내용 업데이트
                heroTitle.innerHTML = data.title;
                heroSubtitle.textContent = data.subtitle;
                if (heroButton) {
                    heroButton.setAttribute('data-link', data.link);
                    heroButton.textContent = data.buttonText;
                }
                
                // 페이드 인 효과
                heroTitle.style.opacity = '1';
                heroSubtitle.style.opacity = '1';
                if (heroButton) {
                    heroButton.style.opacity = '1';
                }
            }, 250);
        }
    }
    
    // 카드 위치 업데이트 함수
    function updateCardPositions(activeContentNumber) {
        var cards = Array.from(contentCards);
        var activeCard = null;
        var otherCards = [];
        
        // 활성 카드와 나머지 카드 분리
        cards.forEach(function(card) {
            if (card.getAttribute('data-content') === activeContentNumber) {
                activeCard = card;
            } else {
                otherCards.push(card);
            }
        });
        
        // 활성 카드 설정
        if (activeCard) {
            activeCard.style.zIndex = '10';
            activeCard.style.transform = 'translateX(0) translateY(0) scale(1.02)';
        }
        
        // 나머지 카드들 위치 설정
        otherCards.forEach(function(card, index) {
            card.style.zIndex = String(3 - index);
            var offsetX = 6 * (index + 1);
            var scale = Math.max(0.85, 0.95 - index * 0.04);
            card.style.transform = 'translateX(' + offsetX + 'vw) translateY(0) scale(' + scale + ')';
        });
    }
    
    // 카드 선택 함수
    function selectCard(selectedCard) {
        // 모든 카드에서 active 클래스 제거
        contentCards.forEach(function(card) {
            card.classList.remove('active');
        });
        
        // 선택된 카드에 active 클래스 추가
        selectedCard.classList.add('active');
        
        // 카드 위치 업데이트
        var contentNumber = selectedCard.getAttribute('data-content');
        updateCardPositions(contentNumber);
        
        // 콘텐츠 업데이트
        updateContent(contentNumber);
        
        console.log('콘텐츠 선택:', contentNumber);
    }
    
    // 각 카드에 클릭 이벤트 추가
    contentCards.forEach(function(card) {
        card.addEventListener('click', function() {
            selectCard(card);
        });
        
        // 호버 효과를 위한 이벤트
        card.addEventListener('mouseenter', function() {
            if (!card.classList.contains('active')) {
                var currentTransform = card.style.transform;
                // 현재 transform에서 Y값만 -0.94vh로 조정 (-10px을 vh로 변환)
                var newTransform = currentTransform.replace(/translateY\([^)]*\)/, 'translateY(-0.94vh)');
                card.style.transform = newTransform;
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!card.classList.contains('active')) {
                // 현재 활성 카드 기준으로 위치 재설정
                var activeCard = document.querySelector('.content-card.active');
                if (activeCard) {
                    var activeContentNumber = activeCard.getAttribute('data-content');
                    updateCardPositions(activeContentNumber);
                }
            }
        });
    });
    
    // 초기 설정
    function initializeCards() {
        // 초기 카드 위치 설정 (1번이 기본 활성)
        updateCardPositions('1');
        
        // 초기 콘텐츠 설정
        var activeCard = document.querySelector('.content-card.active');
        if (activeCard) {
            var contentNumber = activeCard.getAttribute('data-content');
            updateContent(contentNumber);
        }
    }
    
    // 초기화 실행
    initializeCards();
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
