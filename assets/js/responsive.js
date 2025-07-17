// 실제 기기 타입 감지 함수
function isActualMobileDevice() {
    const userAgent = navigator.userAgent.toLowerCase();
    const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 
        'blackberry', 'iemobile', 'opera mini'
    ];
    
    // 데스크탑/노트북 키워드 (이것들이 있으면 데스크탑으로 간주)
    const desktopKeywords = [
        'windows nt', 'macintosh', 'mac os x', 'linux', 'x11'
    ];
    
    // User Agent 기반 감지
    const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
    const isDesktopUA = desktopKeywords.some(keyword => userAgent.includes(keyword));
    
    // 데스크탑 OS가 감지되면 데스크탑으로 간주
    if (isDesktopUA && !isMobileUA) {
        return false;
    }
    
    // 명확한 모바일 기기라면 모바일로 간주
    if (isMobileUA) {
        return true;
    }
    
    // 터치 지원 여부
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // 화면 크기 기반 (매우 작은 화면만 모바일로 간주)
    const isVerySmallScreen = window.innerWidth < 768;
    
    // 터치가 있고 화면이 매우 작은 경우만 모바일로 간주
    // 노트북 터치스크린은 화면이 크므로 데스크탑으로 분류됨
    return hasTouch && isVerySmallScreen;
}

// 데스크탑/노트북 여부 확인
function isDesktopDevice() {
    // 맥북 강제 감지 (임시)
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('macintosh') || userAgent.includes('mac os x')) {
        console.log('맥북 감지됨 - 강제로 데스크탑 모드');
        return true;
    }
    
    return !isActualMobileDevice();
}

// 현재 활성화된 디바이스 추적
let currentDevice = 'desktop';

// 디바이스 변경 함수 (개선된 버전)
function setDevice(device, clickedButton) {
    // 실제 모바일/태블릿 기기에서는 preview 모드를 적용하지 않음
    if (!isDesktopDevice()) {
        console.log('실제 모바일/태블릿 기기에서는 preview 모드가 비활성화됩니다.');
        return;
    }

    const container = document.getElementById('mainContainer');
    const buttons = document.querySelectorAll('.preview-controls button');

    if (!container) {
        console.error('mainContainer 요소를 찾을 수 없습니다.');
        return;
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

// 키보드 단축키 지원 (데스크탑에서만)
document.addEventListener('keydown', function(e) {
    // 실제 모바일/태블릿 기기에서는 단축키 비활성화
    if (!isDesktopDevice()) return;
    
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                setDevice('mobile', document.querySelector('[data-device="mobile"]'));
                break;
            case '2':
                e.preventDefault();
                setDevice('tablet-portrait', document.querySelector('[data-device="tablet-portrait"]'));
                break;
            case '3':
                e.preventDefault();
                setDevice('tablet', document.querySelector('[data-device="tablet"]'));
                break;
            case '4':
                e.preventDefault();
                setDevice('desktop', document.querySelector('[data-device="desktop"]'));
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

// Preview 컨트롤 버튼 표시/숨김
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
    console.log('초기화 시작...');
    console.log('User Agent:', navigator.userAgent);
    console.log('화면 크기:', window.innerWidth, 'x', window.innerHeight);
    console.log('터치 지원:', 'ontouchstart' in window || navigator.maxTouchPoints > 0);
    console.log('isDesktopDevice():', isDesktopDevice());
    
    showResponsiveInfo();
    togglePreviewControls();
    
    const container = document.getElementById('mainContainer');
    console.log('container 찾음:', container);
    
    if (!container) {
        console.error('mainContainer를 찾을 수 없습니다.');
        return;
    }
    
    if (isDesktopDevice()) {
        // 데스크탑에서는 기본적으로 desktop-preview 클래스 추가
        container.className = 'main-container desktop-preview';
        
        // 모든 버튼에서 active 제거
        document.querySelectorAll('.preview-controls button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 데스크탑 버튼을 여러 방법으로 찾기
        let desktopButton = null;
        
        // 1. data-device 속성으로 찾기
        desktopButton = document.querySelector('.preview-controls button[data-device="desktop"]');
        console.log('data-device로 찾은 버튼:', desktopButton);
        
        // 2. 텍스트 내용으로 찾기 (Desktop, 데스크탑, PC 등)
        if (!desktopButton) {
            const buttons = document.querySelectorAll('.preview-controls button');
            buttons.forEach(btn => {
                const text = btn.textContent.toLowerCase();
                if (text.includes('desktop') || text.includes('데스크탑') || text.includes('pc')) {
                    desktopButton = btn;
                    console.log('텍스트로 찾은 버튼:', desktopButton);
                }
            });
        }
        
        // 3. 마지막 버튼 (보통 데스크탑)
        if (!desktopButton) {
            desktopButton = document.querySelector('.preview-controls button:last-child');
            console.log('마지막 버튼으로 선택:', desktopButton);
        }
        
        if (desktopButton) {
            desktopButton.classList.add('active');
            console.log('데스크탑 버튼 활성화됨:', desktopButton.textContent);
        } else {
            console.error('데스크탑 버튼을 찾을 수 없습니다.');
        }
        
        currentDevice = 'desktop';
        console.log('데스크탑/노트북 기기 감지 - desktop-preview 클래스 추가됨');
        console.log('현재 container 클래스:', container.className);
    } else {
        // 실제 모바일/태블릿 기기에서는 모든 preview 클래스 제거
        container.className = 'main-container';
        console.log('실제 모바일/태블릿 기기 감지 - Preview 클래스 제거됨');
    }
}

// 창 크기 변경 감지
window.addEventListener('resize', function() {
    showResponsiveInfo();
    togglePreviewControls();
});

// 방향 변경 감지 (모바일 전용)
window.addEventListener('orientationchange', function() {
    setTimeout(() => {
        showResponsiveInfo();
        togglePreviewControls();
    }, 100);
});

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', initializeDeviceControl);

// 페이지가 완전히 로드된 후 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDeviceControl);
} else {
    // DOM이 이미 준비되었다면 약간의 지연 후 실행
    setTimeout(initializeDeviceControl, 10);
}

// 추가 안전장치: window.onload 이벤트에서도 실행
window.addEventListener('load', function() {
    // 이미 초기화되었는지 확인
    const container = document.getElementById('mainContainer');
    if (container && isDesktopDevice() && !container.classList.contains('desktop-preview')) {
        console.log('window.onload에서 재초기화 실행');
        initializeDeviceControl();
    }
});

// 추가 강제 초기화 (맥북 전용)
setTimeout(function() {
    const container = document.getElementById('mainContainer');
    if (container && isDesktopDevice() && !container.classList.contains('desktop-preview')) {
        console.log('1초 후 강제 초기화 실행');
        container.className = 'main-container desktop-preview';
        
        // 모든 버튼에서 active 제거
        document.querySelectorAll('.preview-controls button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // 데스크탑 버튼 찾기 및 활성화
        let desktopButton = document.querySelector('.preview-controls button[data-device="desktop"]');
        
        if (!desktopButton) {
            // 텍스트로 찾기
            const buttons = document.querySelectorAll('.preview-controls button');
            buttons.forEach(btn => {
                const text = btn.textContent.toLowerCase();
                if (text.includes('desktop') || text.includes('데스크탑') || text.includes('pc')) {
                    desktopButton = btn;
                }
            });
        }
        
        if (!desktopButton) {
            // 마지막 버튼
            desktopButton = document.querySelector('.preview-controls button:last-child');
        }
        
        if (desktopButton) {
            desktopButton.classList.add('active');
            console.log('강제 초기화 - 데스크탑 버튼 활성화:', desktopButton.textContent);
        }
        
        currentDevice = 'desktop';
        console.log('강제 초기화 완료 - desktop-preview 클래스 추가됨');
    }
}, 1000);