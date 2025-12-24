import React from 'react';
import type { Scorer } from '../types';
import { Trophy } from 'lucide-react';

interface TopScorersProps {
    scorers: Scorer[];
    loading: boolean;
    type: 'goals' | 'assists';
}

const TopScorers: React.FC<TopScorersProps> = ({ scorers, loading, type }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!scorers || scorers.length === 0) {
        return (
            <div className="text-center text-gray-400 py-12">
                {type === 'goals' ? '득점' : '어시스트'} 랭킹 데이터를 불러올 수 없습니다.
            </div>
        );
    }

    // 타입에 따라 정렬
    const sortedScorers = [...scorers].sort((a, b) => {
        if (type === 'goals') {
            return (b.goals || 0) - (a.goals || 0);
        } else {
            return (b.assists || 0) - (a.assists || 0);
        }
    }).filter(scorer => {
        // assists로 정렬할 때는 어시스트가 있는 선수만
        if (type === 'assists') {
            return (scorer.assists || 0) > 0;
        }
        return true;
    });

    const top10 = sortedScorers.slice(0, 10);

    return (
        <div className="space-y-3">
            {top10.map((scorer, index) => (
                <div
                    key={`${scorer.player.id}-${index}`}
                    className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        {/* 순위 */}
                        <div className="flex-shrink-0 w-8 text-center">
                            {index === 0 && (
                                <Trophy className="w-6 h-6 text-yellow-400 mx-auto" />
                            )}
                            {index === 1 && (
                                <Trophy className="w-6 h-6 text-gray-300 mx-auto" />
                            )}
                            {index === 2 && (
                                <Trophy className="w-6 h-6 text-orange-400 mx-auto" />
                            )}
                            {index > 2 && (
                                <span className="text-2xl font-bold text-gray-500">
                                    {index + 1}
                                </span>
                            )}
                        </div>

                        {/* 선수 정보 */}
                        <div className="flex-1">
                            <div className="text-white font-semibold text-lg">
                                {scorer.player.name}
                            </div>
                            <div className="text-gray-400 text-sm flex items-center gap-2">
                                <span>{scorer.team.shortName || scorer.team.name}</span>
                                {scorer.player.nationality && (
                                    <>
                                        <span>•</span>
                                        <span>{scorer.player.nationality}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* 통계 */}
                        <div className="flex-shrink-0 text-right">
                            {type === 'goals' ? (
                                <div>
                                    <div className="text-3xl font-bold text-blue-400">
                                        {scorer.goals || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">골</div>
                                    {(scorer.assists || 0) > 0 && (
                                        <div className="text-sm text-gray-400 mt-1">
                                            {scorer.assists} 어시스트
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <div className="text-3xl font-bold text-green-400">
                                        {scorer.assists || 0}
                                    </div>
                                    <div className="text-xs text-gray-500">어시스트</div>
                                    {(scorer.goals || 0) > 0 && (
                                        <div className="text-sm text-gray-400 mt-1">
                                            {scorer.goals} 골
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}

            {top10.length === 0 && (
                <div className="text-center text-gray-400 py-12">
                    데이터가 없습니다.
                </div>
            )}
        </div>
    );
};

export default TopScorers;
