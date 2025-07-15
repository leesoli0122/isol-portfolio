// 현재 활성화된 디바이스 추적
let currentDevice = 'desktop';

// 디바이스 변경 함수
function setDevice(device, clickedButton) {
    const container = document.getElementById('mainContainer');
    const buttons = document.querySelectorAll('.preview-controls button');

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