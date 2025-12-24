import type { StandingsResponse, ScorersResponse } from '../types';

const API_BASE_URL = '/api';
const API_KEY = import.meta.env.VITE_FOOTBALL_API_KEY;

const getHeaders = () => ({
    'X-Auth-Token': API_KEY,
    'Content-Type': 'application/json',
});

/**
 * 리그 순위표 조회
 */
export const getStandings = async (competitionCode: string): Promise<StandingsResponse> => {
    try {
        const url = `${API_BASE_URL}/competitions/${competitionCode}/standings`;
        console.log('🏆 Fetching standings:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        console.log('📡 Standings response:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Standings error:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data: StandingsResponse = await response.json();
        console.log('✅ Standings data received');
        return data;
    } catch (error) {
        console.error('❌ Failed to fetch standings:', error);
        throw error;
    }
};

/**
 * 득점 랭킹 조회 (어시스트 포함)
 */
export const getScorers = async (competitionCode: string): Promise<ScorersResponse> => {
    try {
        const url = `${API_BASE_URL}/competitions/${competitionCode}/scorers`;
        console.log('⚽ Fetching scorers:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: getHeaders(),
        });

        console.log('📡 Scorers response:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('❌ Scorers error:', errorText);
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data: ScorersResponse = await response.json();
        console.log('✅ Scorers data received:', data.scorers?.length || 0, 'players');
        return data;
    } catch (error) {
        console.error('❌ Failed to fetch scorers:', error);
        throw error;
    }
};
