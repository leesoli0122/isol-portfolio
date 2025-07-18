// 스크롤 락
function lockScroll() {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';
}

function toggleSidebar() {
    const body = document.body;
    const hamburger = document.querySelector('.hamburger');
    const sidebar = document.querySelector('.sidebar');
    
    body.classList.toggle('sidebar-open');
    hamburger.classList.toggle('active');
    
    // 오버레이 클릭 시 사이드바 닫기
    if (body.classList.contains('sidebar-open')) {
        createOverlay();
    } else {
        removeOverlay();
    }
}

function createOverlay() {
    // 기존 오버레이 제거
    removeOverlay();
    
    // 현재 활성화된 프리뷰 컨테이너 찾기
    const mainContainer = document.querySelector('.main-container');
    if (!mainContainer) return;
    
    const previewTypes = [
        'mobile-preview',
        'tablet-preview', 
        'tablet-portrait-preview',
        'desktop-preview'
    ];
    
    let activePreview = null;
    let overlayContainer = mainContainer; // 기본값
    
    // 활성화된 프리뷰 컨테이너 찾기
    for (const previewType of previewTypes) {
        const preview = mainContainer.querySelector(`.${previewType}`);
        if (preview && isElementVisible(preview)) {
            activePreview = preview;
            overlayContainer = preview;
            break;
        }
    }
    
    // 오버레이 생성
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay active';
    overlay.onclick = closeSidebar;
    
    // 오버레이 스타일 설정
    overlay.style.position = 'absolute';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '98';
    overlay.style.pointerEvents = 'auto';
    
    // 상대적 위치 설정이 필요한 경우
    if (overlayContainer.style.position === '' || overlayContainer.style.position === 'static') {
        overlayContainer.style.position = 'relative';
    }
    
    overlayContainer.appendChild(overlay);
}

function removeOverlay() {
    const overlays = document.querySelectorAll('.sidebar-overlay');
    overlays.forEach(overlay => overlay.remove());
}

function isElementVisible(element) {
    if (!element) return false;
    
    const style = window.getComputedStyle(element);
    return style.display !== 'none' && 
           style.visibility !== 'hidden' && 
           style.opacity !== '0' &&
           element.offsetWidth > 0 && 
           element.offsetHeight > 0;
}

function closeSidebar() {
    const body = document.body;
    const hamburger = document.querySelector('.hamburger');
    
    body.classList.remove('sidebar-open');
    hamburger.classList.remove('active');
    
    removeOverlay();
}

// 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.addEventListener('click', toggleSidebar);
    }
    
    // ESC 키로 사이드바 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
            closeSidebar();
        }
    });
    
    // 윈도우 리사이즈 시 오버레이 재조정
    window.addEventListener('resize', function() {
        if (document.body.classList.contains('sidebar-open')) {
            createOverlay();
        }
    });
});