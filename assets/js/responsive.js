// 실제 기기 타입 감지 함수
// [D]: preview-controls로 버튼 클릭 시 해당 사이즈로 변경되는 기능을 사용하는데 모바일이나 태블릿 실제 화면에서는 main-container에 클래스 추가가 되지 않고, 기기 감지를 하지 못해 추가 된 함수이다.
function isActualMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = ['android', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 'opera mini'];

    // user agent 기반 감지
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));

    // 터치 지원 여부
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    // 화면 크기 기반(모바일/태블릿 범위)
    const isSmallScreen = window.innerWidth <= 1024;
    return isMobileUA || (hasTouch && isSmallScreen);
}

// 데스크탑/노트북 여부 확인
function isDesktopDevice() {
    return !isActualMobileDevice();
}

// 현재 활성화된 디바이스 추적
let currentDevice = 'desktop';

// 디바이스 변경 함수 - 20250717 업데이트
function setDevice(device, clickedButton) {
    // 실제 모바일/태블릿 기기에서는 previewr 모드를 적용하지 않음
    if (!isDesktopDevice()) {
        console.log('실제 모바일/태블릿 기기에서는 preview 모드가 비활성화됩니다.');
        return;
    }

    const container = document.getElementById('mainContainer');
    const buttons = document.querySelectorAll('.preview-controls button');

    if (!container) {
        console.error('mainContainer 요소를 찾을 수 없습니다.');
    }

    // 부드러운 전환 위해 살짝 scale down
    container.style.transform = 'scale(0.97)';
    
    // 100ms 후에 클래스 변경 → 부드럽게 바뀌는 느낌 줌
    setTimeout(() => {
        // 클래스 초기화
        container.className = 'main-container';
        container.classList.add(device + '-preview');

        // 버튼 활성화 상태 변경
        buttons.forEach(btn => btn.classList.remove('active'));
        if (clickedButton) clickedButton.classList.add('active');

        currentDevice = device;

        // 원래 크기로 복구
        container.style.transform = 'scale(1)';
    }, 100);
}

// 키보드 단축키 지원(데스크탑에서만)
document.addEventListener('keydown', function (e) {
    // 실제 모바일/태블릿 기기에서는 단축키 비활성화
    if (!isDesktopDevice()) return;

    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                setDevice('mobile', document.querySelectorAll('[data-device="mobile"]'));
                break;
            case '2':
                e.preventDefault();
                setDevice('tablet-portrait', document.querySelectorAll('[data-device="tablet-portrait"]'));
                break;
            case '3':
                e.preventDefault();
                setDevice('tablet', document.querySelectorAll('[data-device="tablet"]'));
                break;
            case '4':
                e.preventDefault();
                setDevice('desktop', document.querySelectorAll('[data-device="desktop"]'));
                break;
        }
    }
});

// 반응형 정보 표시
function showResponsiveInfo() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const deviceInfo = isDesktopDevice() ? 'Desktop/Laptop' : 'Mobile/Tablet';

    let responsiveBreakpoint = '';
    
    if (width < 768) {
        responsiveBreakpoint = 'Mobile';
    } else if (width < 1025) {
        responsiveBreakpoint = 'Tablet';
    } else {
        responsiveBreakpoint = 'Desktop';
    }
    
    console.log(`현재 화면: ${width}x${height}px (${responsiveBreakpoint}) - 실제 기기: ${deviceInfo}`);
}

// preview 컨트롤 버튼 표시/숨김
function togglePreviewControls() {
    const previewControls = document.querySelector('.preview-controls');

    if (previewControls) {
        if (isDesktopDevice()) {
            previewControls.style.display = 'block';
        } else {
            previewControls.style.display = 'none';
        }
    }
}

// 초기화 함수
function initializeDeviceControl() {
    showResponsiveInfo();
    togglePreviewControls();

    // 실제 모바일/태블릿 기기에서는 모든 preview 클래스 제거
    if (!isDesktopDevice()) {
        const container = document.getElementById('mainContainer');
        if (container) {
            container.className = 'main-container';
            console.log('실제 모바일/태블릿 기기 감지 - Preview 클래스 제거됨');
        }
    }
}

// 창 크기 변경 감지
window.addEventListener('resize', function () {
    showResponsiveInfo();
    togglePreviewControls();
});

// 방향 변경 감지 (모바일 전용)
window.addEventListener('orientationchange', function () {
    setTimeout(() => {
        showResponsiveInfo();
        togglePreviewControls();
    }, 100);
})

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeDeviceControl);

// 페이지가 완전히 로드된 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDeviceControl);
} else {
    initializeDeviceControl();
}