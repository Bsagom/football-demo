import { useState, useEffect, useRef } from 'react';
import PitchView from './components/PitchView';
import MatchCard from './components/MatchCard';
import LeagueSelector from './components/LeagueSelector';
import LoadingSpinner from './components/LoadingSpinner';
import { getMatches, getMatchDetail } from './api/football';
import type { Match, MatchDetail } from './types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

function App() {
    const dateInputRef = useRef<HTMLInputElement>(null);

    const [selectedLeague, setSelectedLeague] = useState('CL');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [matches, setMatches] = useState<Match[]>([]);
    const [currentMatchIndex, setCurrentMatchIndex] = useState(0);
    const [matchDetail, setMatchDetail] = useState<MatchDetail | null>(null);
    const [showLineup, setShowLineup] = useState(false);

    const [loadingMatches, setLoadingMatches] = useState(false);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => {
        fetchMatches();
    }, [selectedLeague, selectedDate]);

    useEffect(() => {
        setShowLineup(false);
        setMatchDetail(null);
    }, [currentMatchIndex]);

    const fetchMatches = async () => {
        setLoadingMatches(true);
        setMatches([]);
        setCurrentMatchIndex(0);
        setMatchDetail(null);
        setShowLineup(false);

        try {
            const dateStr = selectedDate.toISOString().split('T')[0];
            const cacheKey = `football_matches_${selectedLeague}_${dateStr}`;

            // 1. 캐시 확인
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const age = Date.now() - timestamp;
                    const ageInSeconds = Math.floor(age / 1000);

                    // 5분(300초) 이내면 캐시 사용
                    if (age < 5 * 60 * 1000) {
                        console.log(`✅ Using cached data (age: ${ageInSeconds}s)`);
                        setMatches(data);
                        setLoadingMatches(false);
                        return;
                    } else {
                        console.log(`⏰ Cache expired (age: ${ageInSeconds}s), fetching new data`);
                    }
                } catch (e) {
                    console.warn('Cache parse error:', e);
                }
            }

            // 2. API 호출
            console.log(`📡 Fetching from API: ${selectedLeague} - ${dateStr}`);
            const response = await getMatches(selectedLeague);

            if (response.matches && response.matches.length > 0) {
                const filteredMatches = response.matches.filter(match => {
                    const matchDate = new Date(match.utcDate).toISOString().split('T')[0];
                    return matchDate === dateStr;
                });

                // 3. 캐시 저장
                if (filteredMatches.length > 0) {
                    localStorage.setItem(cacheKey, JSON.stringify({
                        data: filteredMatches,
                        timestamp: Date.now()
                    }));
                    console.log(`💾 Cached ${filteredMatches.length} matches`);
                }

                setMatches(filteredMatches);
            }
        } catch (err: any) {
            console.error('Error:', err);

            // 429 에러 (요청 제한) 처리
            if (err.message && err.message.includes('429')) {
                const waitMatch = err.message.match(/Wait (\d+) seconds/);
                const waitTime = waitMatch ? waitMatch[1] : '60';
                setMatches([]);
                // 429 에러는 조용히 처리하고 사용자에게 안내만 표시
                console.warn(`⏳ API 요청 제한. ${waitTime}초 후 다시 시도하세요.`);
            } else {
                setMatches([]);
            }
        } finally {
            setLoadingMatches(false);
        }
    };

    const fetchMatchDetail = async (matchId: number) => {
        setLoadingDetail(true);
        console.log('🔍 Starting to fetch match detail for ID:', matchId);

        try {
            const cacheKey = `football_detail_${matchId}`;

            // 1. 캐시 확인
            const cachedData = localStorage.getItem(cacheKey);
            if (cachedData) {
                try {
                    const { data, timestamp } = JSON.parse(cachedData);
                    const age = Date.now() - timestamp;
                    const ageInSeconds = Math.floor(age / 1000);

                    if (age < 5 * 60 * 1000) {
                        console.log(`✅ Using cached detail (age: ${ageInSeconds}s)`);
                        console.log('📋 Cached match data:', data);
                        console.log('- Has lineups?', data?.lineups?.length || 0);
                        console.log('- Has goals?', data?.goals?.length || 0);
                        console.log('- Has bookings?', data?.bookings?.length || 0);
                        setMatchDetail(data);
                        setLoadingDetail(false);
                        return;
                    }
                } catch (e) {
                    console.warn('Cache parse error:', e);
                }
            }

            // 2. API 호출
            console.log('📞 Calling getMatchDetail API...');
            const response = await getMatchDetail(matchId);
            console.log('✅ Match detail API response:', response);

            const matchData = response.match || response;
            console.log('📋 Match detail data:', matchData);

            if (matchData && matchData.id) {
                console.log('✅ Setting match detail state');
                console.log('- Has lineups?', matchData.lineups?.length || 0);
                console.log('- Has goals?', matchData.goals?.length || 0);
                console.log('- Has bookings?', matchData.bookings?.length || 0);

                // 3. 캐시 저장
                localStorage.setItem(cacheKey, JSON.stringify({
                    data: matchData,
                    timestamp: Date.now()
                }));
                console.log(`💾 Cached match detail for ID: ${matchId}`);

                setMatchDetail(matchData as MatchDetail);
            } else {
                console.warn('⚠️ No match data in response');
                setMatchDetail(null);
            }
        } catch (err) {
            console.error('❌ Error fetching match detail:', err);
            console.error('❌ Error details:', JSON.stringify(err, null, 2));
            setMatchDetail(null);
        } finally {
            console.log('✅ Setting loadingDetail to false');
            setLoadingDetail(false);
        }
    };

    const handleCardClick = () => {
        console.log('🖱️ Card clicked!');
        console.log('- showLineup:', showLineup);
        console.log('- matchDetail:', matchDetail ? 'exists' : 'null');
        console.log('- currentMatch:', matches[currentMatchIndex]?.id);

        if (!showLineup && !matchDetail && matches[currentMatchIndex]) {
            console.log('💫 Fetching match detail...');
            fetchMatchDetail(matches[currentMatchIndex].id);
        }

        console.log('🔄 Toggling showLineup:', !showLineup);
        setShowLineup(!showLineup);
    };

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

    const currentMatch = matches[currentMatchIndex];

    return (
        <div className="min-h-screen bg-gray-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2">⚽ Football Match Viewer</h1>
                    <p className="text-gray-400">실시간 경기 일정 및 라인업</p>
                </header>

                <div className="max-w-md mx-auto mb-6">
                    <LeagueSelector selectedLeague={selectedLeague} onLeagueChange={setSelectedLeague} />
                </div>

                <div className="flex items-center justify-center gap-4 mb-8">
                    <button onClick={handlePreviousDay}
                        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    {/* Date Display with Hidden Input */}
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
                            className="flex items-center gap-3 bg-gray-800 px-6 py-3 rounded-lg border border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
                        >
                            <Calendar className="w-5 h-5 text-blue-400" />
                            <span className="text-white font-semibold">{formatDateKorean(selectedDate)}</span>
                        </div>
                    </div>

                    <button onClick={handleNextDay}
                        className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white transition-colors">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                    <button onClick={handleToday}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors text-sm font-medium">
                        오늘
                    </button>
                </div>

                {loadingMatches && <LoadingSpinner message="경기 목록을 불러오는 중..." />}

                {!loadingMatches && matches.length === 0 && (
                    <div className="bg-gray-800 rounded-lg p-12 text-center border border-gray-700">
                        <div className="text-6xl mb-4">📅</div>
                        <h3 className="text-xl font-bold text-white mb-2">경기 일정 없음</h3>
                        <p className="text-gray-400">
                            {formatDateKorean(selectedDate)} 날짜에 {selectedLeague} 리그의 경기가 없습니다.
                        </p>
                        <p className="text-gray-500 text-sm mt-2">
                            다른 날짜나 리그를 선택해주세요.
                        </p>
                        <div className="mt-6 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                                ⏳ <strong>참고:</strong> 무료 API는 분당 10회 제한이 있습니다.
                            </p>
                            <p className="text-yellow-500/70 text-xs mt-1">
                                너무 빠르게 변경하면 잠시 기다려야 할 수 있습니다.
                            </p>
                        </div>
                    </div>
                )}

                {!loadingMatches && matches.length > 0 && currentMatch && (
                    <div className="space-y-6">
                        <div className="text-center">
                            <p className="text-gray-400 text-sm">{currentMatchIndex + 1} / {matches.length} 경기</p>
                        </div>

                        <div className="flex items-center justify-center gap-4">
                            <button onClick={() => setCurrentMatchIndex(Math.max(0, currentMatchIndex - 1))}
                                disabled={currentMatchIndex === 0}
                                className={`p-3 rounded-full ${currentMatchIndex === 0 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                <ChevronLeft className="w-6 h-6" />
                            </button>

                            <div className="flex-1 max-w-2xl cursor-pointer hover:scale-105 transition-transform" onClick={handleCardClick}>
                                <MatchCard match={currentMatch} />
                                <p className="text-center text-gray-400 text-sm mt-2">
                                    {showLineup ? '▲ 클릭하여 숨기기' : '▼ 클릭하여 상세 정보 보기'}
                                </p>
                            </div>

                            <button onClick={() => setCurrentMatchIndex(Math.min(matches.length - 1, currentMatchIndex + 1))}
                                disabled={currentMatchIndex === matches.length - 1}
                                className={`p-3 rounded-full ${currentMatchIndex === matches.length - 1 ? 'bg-gray-800 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>

                        {showLineup && (
                            <>
                                {loadingDetail && <LoadingSpinner message="경기 상세 정보를 불러오는 중..." />}

                                {!loadingDetail && matchDetail && (
                                    <div className="space-y-8">
                                        {matchDetail.lineups && matchDetail.lineups.length >= 2 && (
                                            <div>
                                                <h2 className="text-2xl font-bold text-white mb-6 text-center">팀 라인업</h2>
                                                <PitchView
                                                    homeLineup={matchDetail.lineups[0]?.lineup || []}
                                                    awayLineup={matchDetail.lineups[1]?.lineup || []}
                                                    homeTeamName={matchDetail.homeTeam.name}
                                                    awayTeamName={matchDetail.awayTeam.name}
                                                />
                                            </div>
                                        )}

                                        {(!matchDetail.lineups || matchDetail.lineups.length < 2) && (
                                            <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
                                                <p className="text-gray-400">이 경기의 라인업 정보가 아직 제공되지 않습니다.</p>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {matchDetail.goals && matchDetail.goals.length > 0 && (
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-4">⚽ 골</h3>
                                                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-4">
                                                        {matchDetail.goals.map((goal, idx) => (
                                                            <div key={idx} className="border-b border-gray-700 last:border-0 pb-3 last:pb-0">
                                                                <div className="flex items-center gap-3 mb-1">
                                                                    <span className="text-gray-400 font-mono text-sm">{goal.minute}'</span>
                                                                    <span className="text-white font-bold">{goal.scorer.name}</span>
                                                                    <span className="ml-auto text-blue-400 font-bold">
                                                                        {goal.score.home} - {goal.score.away}
                                                                    </span>
                                                                </div>
                                                                {goal.assist && (
                                                                    <div className="text-gray-400 text-sm ml-12">
                                                                        어시스트: <span className="text-gray-300">{goal.assist.name}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {matchDetail.bookings && matchDetail.bookings.length > 0 && (
                                                <div>
                                                    <h3 className="text-xl font-bold text-white mb-4">🟨 경고/퇴장</h3>
                                                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 space-y-3">
                                                        {matchDetail.bookings.map((booking, idx) => (
                                                            <div key={idx} className="flex items-center gap-3">
                                                                <span className="text-gray-400 font-mono text-sm">{booking.minute}'</span>
                                                                <div className={`w-4 h-6 rounded ${booking.card === 'YELLOW_CARD' ? 'bg-yellow-400' : 'bg-red-600'}`}></div>
                                                                <span className="text-white">{booking.player.name}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                <footer className="mt-16 text-center text-gray-500 text-sm">
                    <p>Data from Football-Data.org API</p>
                </footer>
            </div>
        </div>
    );
}

export default App;
