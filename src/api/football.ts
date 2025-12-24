import type { MatchesResponse, MatchDetailResponse } from '../types';

// Vercel 서버리스 함수 프록시 사용
const API_BASE_URL = '/api';
const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;

// API 헤더 설정
const getHeaders = () => ({
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json',
});

/**
 * 특정 대회의 경기 일정 조회
 * @param competitionCode - 대회 코드 (예: PL - Premier League, CL - Champions League)
 * @param season - 시즌 (예: 2024)
 * @returns 경기 일정 목록
 */
export const getMatches = async (
    competitionCode: string = 'PL',
    season?: number
): Promise<MatchesResponse> => {
    try {
        let url = `${API_BASE_URL}/competitions/${competitionCode}/matches`;

        if (season) {
            url += `?season=${season}`;
        }

        console.log('🔑 API Key:', API_KEY ? `${API_KEY.substring(0, 8)}...` : 'MISSING');
        console.log('🌐 Request URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        console.log('📡 Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data: MatchesResponse = await response.json();
        console.log('✅ Data received:', data);
        return data;
    } catch (error) {
        console.error('❌ Failed to fetch matches:', error);
        throw error;
    }
};

/**
 * 특정 경기의 상세 정보 조회 (라인업 포함)
 * @param matchId - 경기 ID
 * @returns 경기 상세 정보
 */
export const getMatchDetail = async (
    matchId: number
): Promise<MatchDetailResponse> => {
    try {
        const url = `${API_BASE_URL}/matches/${matchId}`;

        console.log('🌐 Request URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        console.log('📡 Response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ API Error Response:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data: MatchDetailResponse = await response.json();
        console.log('✅ Match detail received:', data);
        return data;
    } catch (error) {
        console.error('❌ Failed to fetch match detail:', error);
        throw error;
    }
};

/**
 * 특정 팀의 경기 일정 조회
 * @param teamId - 팀 ID
 * @param status - 경기 상태 필터 (SCHEDULED, LIVE, FINISHED)
 * @returns 팀의 경기 일정
 */
export const getTeamMatches = async (
    teamId: number,
    status?: string
): Promise<MatchesResponse> => {
    try {
        let url = `${API_BASE_URL}/teams/${teamId}/matches`;

        if (status) {
            url += `?status=${status}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data: MatchesResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch team matches:', error);
        throw error;
    }
};

/**
 * 오늘의 경기 조회
 * @returns 오늘의 경기 목록
 */
export const getTodayMatches = async (): Promise<MatchesResponse> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const url = `${API_BASE_URL}/matches?date=${today}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data: MatchesResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch today matches:', error);
        throw error;
    }
};
