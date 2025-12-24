// 캐시 유틸리티 함수

const CACHE_DURATION = 5 * 60 * 1000; // 5분 (밀리초)

interface CacheData<T> {
    data: T;
    timestamp: number;
}

/**
 * localStorage에 데이터 저장 (타임스탬프 포함)
 */
export const setCache = <T>(key: string, data: T): void => {
    try {
        const cacheData: CacheData<T> = {
            data,
            timestamp: Date.now(),
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
        console.log(`💾 Cached data for key: ${key}`);
    } catch (error) {
        console.warn('Failed to save to cache:', error);
    }
};

/**
 * localStorage에서 데이터 가져오기 (만료 확인)
 */
export const getCache = <T>(key: string): T | null => {
    try {
        const cached = localStorage.getItem(key);
        if (!cached) {
            console.log(`📭 No cache found for key: ${key}`);
            return null;
        }

        const cacheData: CacheData<T> = JSON.parse(cached);
        const age = Date.now() - cacheData.timestamp;
        const ageInSeconds = Math.floor(age / 1000);

        if (age > CACHE_DURATION) {
            console.log(`⏰ Cache expired for key: ${key} (age: ${ageInSeconds}s)`);
            localStorage.removeItem(key);
            return null;
        }

        console.log(`✅ Using cached data for key: ${key} (age: ${ageInSeconds}s)`);
        return cacheData.data;
    } catch (error) {
        console.warn('Failed to read from cache:', error);
        return null;
    }
};

/**
 * 캐시 키 생성 (리그 + 날짜)
 */
export const generateCacheKey = (prefix: string, league: string, date: string): string => {
    return `${prefix}_${league}_${date}`;
};

/**
 * 모든 캐시 삭제
 */
export const clearAllCache = (): void => {
    const keys = Object.keys(localStorage);
    const cacheKeys = keys.filter(key => key.startsWith('football_'));
    cacheKeys.forEach(key => localStorage.removeItem(key));
    console.log(`🗑️ Cleared ${cacheKeys.length} cache entries`);
};
