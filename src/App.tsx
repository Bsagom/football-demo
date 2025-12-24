import { useState, useEffect, useRef } from 'react';
import MatchCard from './components/MatchCard';
import LeagueSelector from './components/LeagueSelector';
import Standings from './components/Standings';
import TopScorers from './components/TopScorers';
import LoadingSpinner from './components/LoadingSpinner';
import { getMatches, getMatchDetail } from './api/football';
import { getStandings, getScorers } from './api/statistics';
import type { Match, MatchDetail, Standing, Scorer } from './types';
import { ChevronLeft, ChevronRight, Calendar, BarChart3, Trophy, Target } from 'lucide-react';

function App() {
    const dateInputRef = useRef<HTMLInputElement>(null);

    // League and Date
    const [selectedLeague, setSelectedLeague] = useState('PL'); // Premier League default
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Dashboard Tab (for player stats only)
    const [selectedTab, setSelectedTab] = useState<'scorers' | 'assists'>('scorers');

    // Matches
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);
    const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);
    const [showMatchDetail, setShowMatchDetail] = useState(false);

    // Statistics
    const [standings, setStandings] = useState<Standing[]>([]);
    const [scorers, setScorers] = useState<Scorer[]>([]);

    // Loading states
    const [loadingMatches, setLoadingMatches] = useState(false);
    const [loadingStats, setLoadingStats] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    // 리그 변경 시 경기 목록 및 통계 로드
    useEffect(() => {
        fetchMatches();
        fetchStatistics();
    }, [selectedLeague, selectedDate]);

    // 경기 목록 가져오기
    const fetchMatches = async () => {
        setLoadingMatches(true);
        setMatches([]);
        setSelectedMatch(null);
        setMatchDetail(null);
        setShowMatchDetail(false);

        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const cacheKey = `football_matches_${selectedLeague}_${dateStr}`;

            // 캐시 확인
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const age = Date.now() - timestamp;

                    if (age < 5 * 60 * 1000) {
                        console.log(`✅ Using cached matches (age: ${Math.floor(age / 1000)}s)`);
                        setMatches(data);
                        setLoadingMatches(false);
                        return;
                    }
                } catch (e) {
                    console.warn('Cache parse error:', e);
                }
            }

            // API 호출
            const response = await getMatches(selectedLeague);

            if (response.matches && response.matches.length > 0) {
                const filteredMatches = response.matches.filter(match => {
                    const matchDate = new Date(match.utcDate).toISOString().split('T')[0];
                    return matchDate === dateStr;
                });

                if (filteredMatches.length > 0) {
                    localStorage.setItem(cacheKey, JSON.stringify({
                        data: filteredMatches,
                        timestamp: Date.now()
                    }));
                }

                setMatches(filteredMatches);
            }
        } catch (err: any) {
            console.error('Error fetching matches:', err);
        } finally {
            setLoadingMatches(false);
        }
    };

    // 통계 데이터 가져오기 (순위표, 득점 랭킹)
    const fetchStatistics = async () => {
        setLoadingStats(true);

        try {
            const standingsCacheKey = `football_standings_${selectedLeague}`;
            const scorersCacheKey = `football_scorers_${selectedLeague}`;

            // 순위표 캐시 확인
            let standingsData: Standing[] = [];
            const cachedStandings = localStorage.getItem(standingsCacheKey);
            if (cachedStandings) {
                try {
                    const { data, timestamp } = JSON.parse(cachedStandings);
                    const age = Date.now() - timestamp;

                    if (age < 15 * 60 * 1000) { // 15분 캐시
                        console.log(`✅ Using cached standings (age: ${Math.floor(age / 1000)}s)`);
                        standingsData = data;
                    }
                } catch (e) { }
            }

            // 득점 랭킹 캐시 확인
            let scorersData: Scorer[] = [];
            const cachedScorers = localStorage.getItem(scorersCacheKey);
            if (cachedScorers) {
                try {
                    const { data, timestamp } = JSON.parse(cachedScorers);
                    const age = Date.now() - timestamp;

                    if (age < 15 * 60 * 1000) { // 15분 캐시
                        console.log(`✅ Using cached scorers (age: ${Math.floor(age / 1000)}s)`);
                        scorersData = data;
                    }
                } catch (e) { }
            }

            // 캐시가 없으면 API 호출
            if (standingsData.length === 0) {
                const standingsResponse = await getStandings(selectedLeague);
                standingsData = standingsResponse.standings[0]?.table || [];
                localStorage.setItem(standingsCacheKey, JSON.stringify({
                    data: standingsData,
                    timestamp: Date.now()
                }));
            }

            if (scorersData.length === 0) {
                const scorersResponse = await getScorers(selectedLeague);
                scorersData = scorersResponse.scorers || [];
                localStorage.setItem(scorersCacheKey, JSON.stringify({
                    data: scorersData,
                    timestamp: Date.now()
                }));
            }

            setStandings(standingsData);
            setScorers(scorersData);
        } catch (err) {
            console.error('Error fetching statistics:', err);
        } finally {
            setLoadingStats(false);
        }
    };

    // 경기 상세 정보 가져오기
    const fetchMatchDetail = async (matchId: number) => {
        setLoadingDetail(true);

        try {
            const cacheKey = `football_detail_${matchId}`;
            const cachedData = localStorage.getItem(cacheKey);

            if (cachedData) {
                try {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const age = Date.now() - timestamp;

                    if (age < 5 * 60 * 1000) {
                        console.log(`✅ Using cached detail (age: ${Math.floor(age / 1000)}s)`);
                        setMatchDetail(data);
                        setLoadingDetail(false);
                        return;
                    }
                } catch (e) { }
            }

            const response = await getMatchDetail(matchId);
            const matchData = response.match || response;

            if (matchData && matchData.id) {
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: matchData,
                    timestamp: Date.now()
                }));
                setMatchDetail(matchData as MatchDetail);
            }
        } catch (err) {
            console.error('Error fetching match detail:', err);
        } finally {
            setLoadingDetail(false);
        }
    };

    // 경기 선택 핸들러
    const handleMatchClick = (match: Match) => {
        setSelectedMatch(match);
        setShowMatchDetail(true);
        fetchMatchDetail(match.id);
    };

    // 날짜 네비게이션
    const handlePreviousDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const handleToday = () => {
        setSelectedDate(new Date());
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newDate = new Date(e.target.value + 'T00:00:00');
        setSelectedDate(newDate);
    };

    const handleOpenCalendar = () => {
        dateInputRef.current?.showPicker?.();
    };

    const formatDateKorean = (date: Date) => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${days[date.getDay()]})`;
    };

    return (
        <div className="min-h-screen bg-gray-900 py-4 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <header className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-white mb-2">⚽ Football Match Viewer</h1>
                    <p className="text-gray-400 text-sm">리그 통계 & 경기 일정</p>
                </header>

                {/* League Selector */}
                <div className="max-w-md mx-auto mb-4">
                    <LeagueSelector selectedLeague={selectedLeague} onLeagueChange={setSelectedLeague} />
                </div>

                {/* Date Navigator */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <button onClick={handlePreviousDay}
                        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="relative">
                        <input
                            ref={dateInputRef}
                            type="date"
                            value={selectedDate.toISOString().split('T')[0]}
                            onChange={handleDateChange}
                            className="absolute opacity-0 w-0 h-0"
                            max="2099-12-31"
                        />
                        <div
                            onClick={handleOpenCalendar}
                            className="flex items-center gap-2 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span className="text-white text-sm font-medium">{formatDateKorean(selectedDate)}</span>
                        </div>
                    </div>

                    <button onClick={handleNextDay}
                        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                    <button onClick={handleToday}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium">
                        오늘
                    </button>
                </div>

                {/* Main Layout: Dashboard + Matches */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Dashboard (Left - 70%) */}
                    <div className="lg:col-span-2">
                        {/* Tabs */}
                        <div className="flex gap-2 mb-4">
                            <button
                                onClick={() => setSelectedTab('standings')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${selectedTab === 'standings'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                <BarChart3 className="w-5 h-5" />
                                <span>순위표</span>
                            </button>
                            <button
                                onClick={() => setSelectedTab('scorers')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${selectedTab === 'scorers'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                <Trophy className="w-5 h-5" />
                                <span>득점 랭킹</span>
                            </button>
                            <button
                                onClick={() => setSelectedTab('assists')}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-colors ${selectedTab === 'assists'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                <Target className="w-5 h-5" />
                                <span>어시스트 랭킹</span>
                            </button>
                        </div>

                        {/* Dashboard Content */}
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 min-h-[600px] max-h-[700px] overflow-y-auto">
                            {loadingStats ? (
                                <LoadingSpinner message="통계 로딩 중..." />
                            ) : (
                                <>
                                    {selectedTab === 'standings' && (
                                        <Standings standings={standings} loading={false} />
                                    )}
                                    {selectedTab === 'scorers' && (
                                        <TopScorers scorers={scorers} loading={false} type="goals" />
                                    )}
                                    {selectedTab === 'assists' && (
                                        <TopScorers scorers={scorers} loading={false} type="assists" />
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Match Schedule (Right - 30%) */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-blue-400" />
                                경기 일정
                            </h3>

                            {loadingMatches ? (
                                <LoadingSpinner message="경기 로딩 중..." />
                            ) : matches.length === 0 ? (
                                <div className="text-center text-gray-400 py-8 text-sm">
                                    📅<br />
                                    경기 일정 없음
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[650px] overflow-y-auto">
                                    {matches.map((match) => (
                                        <div
                                            key={match.id}
                                            onClick={() => handleMatchClick(match)}
                                            className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedMatch?.id === match.id
                                                ? 'bg-blue-900/30 border-blue-500'
                                                : 'bg-gray-700 border-gray-600 hover:border-gray-500'
                                                }`}
                                        >
                                            <div className="text-xs text-gray-400 mb-2">
                                                {new Date(match.utcDate).toLocaleTimeString('ko-KR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-white font-medium truncate">
                                                        {match.homeTeam.shortName}
                                                    </span>
                                                    <span className="text-blue-400 font-bold ml-2">
                                                        {match.score.fullTime.home ?? '-'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-white font-medium truncate">
                                                        {match.awayTeam.shortName}
                                                    </span>
                                                    <span className="text-blue-400 font-bold ml-2">
                                                        {match.score.fullTime.away ?? '-'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-xs text-gray-500 mt-2">
                                                {match.status === 'FINISHED' && '종료'}
                                                {match.status === 'LIVE' && '🔴 LIVE'}
                                                {match.status === 'SCHEDULED' && '예정'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Match Detail Modal/Section (if needed) */}
                {showMatchDetail && selectedMatch && (
                    <div className="mt-6 bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <button
                            onClick={() => setShowMatchDetail(false)}
                            className="text-gray-400 hover:text-white mb-4"
                        >
                            ✕ 닫기
                        </button>
                        <MatchCard match={selectedMatch} />
                        {loadingDetail && <LoadingSpinner message="상세 정보 로딩 중..." />}
                        {/* Match detail rendering can be added here */}
                    </div>
                )}

                <footer className="mt-8 text-center text-gray-500 text-xs">
                    <p>Data from Football-Data.org API</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
