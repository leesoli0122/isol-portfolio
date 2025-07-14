// 현재 활성화된 디바이스 추적
let currentDevice = 'desktop';

// 디바이스 변경 함수
function setDevice(device) {
    const container = document.getElementById('mainContainer');
    const buttons = document.querySelectorAll('.preview-controls button');
    
    // 기존 클래스 제거
    container.className = 'main-container';
    
    // 새로운 클래스 추가
    container.classList.add(device + '-preview');
    
    // 버튼 활성화 상태 변경
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    currentDevice = device;
    
    // 디바이스 변경 애니메이션
    container.style.transform = 'scale(0.95)';
    setTimeout(() => {
        container.style.transform = 'scale(1)';
    }, 150);
}

// 키보드 단축키 지원
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch(e.key) {
            case '1':
                e.preventDefault();
                setDevice('mobile');
                break;
            case '2':
                e.preventDefault();
                setDevice('tablet-portrait');
                break;
            case '3':
                e.preventDefault();
                setDevice('tablet');
                break;
            case '4':
                e.preventDefault();
                setDevice('desktop');
                break;
        }
    }
});

// 반응형 정보 표시
function showResponsiveInfo() {
    const width = window.innerWidth;
    let deviceType = '';
    
    if (width < 768) {
        deviceType = 'Mobile';
    } else if (width < 1025) {
        deviceType = 'Tablet';
    } else {
        deviceType = 'Desktop';
    }
    
    console.log(`현재 화면: ${width}px (${deviceType})`);
}

// 창 크기 변경 감지
window.addEventListener('resize', showResponsiveInfo);

// 초기 정보 표시
showResponsiveInfo();