// 개발자 도구 콘솔에서 사용할 수 있는 디버깅 함수들

// 1. 모든 캐시 확인
window.showCache = () => {
    console.log('=== 📦 localStorage Cache ===');
    const keys = Object.keys(localStorage);
    const footballKeys = keys.filter(k => k.startsWith('football_'));

    footballKeys.forEach(key => {
        try {
            const data = JSON.parse(localStorage.getItem(key));
            const age = Math.floor((Date.now() - data.timestamp) / 1000);
            console.log(`\n🔑 ${key}`);
            console.log(`  Age: ${age}s`);
            console.log(`  Data:`, data.data);
        } catch (e) {
            console.error(`  Error parsing ${key}:`, e);
        }
    });

    console.log(`\n📊 Total cache entries: ${footballKeys.length}`);
};

// 2. 캐시 삭제
window.clearCache = () => {
    const keys = Object.keys(localStorage);
    const footballKeys = keys.filter(k => k.startsWith('football_'));
    footballKeys.forEach(key => localStorage.removeItem(key));
    console.log(`🗑️ Cleared ${footballKeys.length} cache entries`);
};

// 3. 특정 경기 상세 정보 확인
window.showMatchDetail = (matchId) => {
    const key = `football_detail_${matchId}`;
    const cached = localStorage.getItem(key);
    if (!cached) {
        console.log(`❌ No cache for match ID: ${matchId}`);
        return;
    }

    try {
        const { data, timestamp } = JSON.parse(cached);
        const age = Math.floor((Date.now() - timestamp) / 1000);
        console.log(`\n📋 Match Detail (ID: ${matchId}, Age: ${age}s)`);
        console.log('- Lineups:', data?.lineups?.length || 0);
        console.log('- Goals:', data?.goals?.length || 0);
        console.log('- Bookings:', data?.bookings?.length || 0);
        console.log('Full data:', data);
    } catch (e) {
        console.error('Error:', e);
    }
};

console.log('🔧 Debug functions loaded:');
console.log('  - showCache()        // 모든 캐시 확인');
console.log('  - clearCache()       // 캐시 삭제');
console.log('  - showMatchDetail(matchId) // 경기 상세 확인');
