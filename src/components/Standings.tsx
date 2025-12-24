import React from 'react';
import type { Standing } from '../types';

interface StandingsProps {
    standings: Standing[];
    loading: boolean;
}

const Standings: React.FC<StandingsProps> = ({ standings, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!standings || standings.length === 0) {
        return (
            <div className="text-center text-gray-400 py-12">
                순위표 데이터를 불러올 수 없습니다.
            </div>
        );
    }

    const getPositionColor = (position: number) => {
        if (position <= 4) return 'border-l-4 border-blue-500'; // Champions League
        if (position <= 6) return 'border-l-4 border-orange-500'; // Europa League
        if (position >= standings.length - 2) return 'border-l-4 border-red-500'; // Relegation
        return 'border-l-4 border-transparent';
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead className="bg-gray-800 text-gray-300 sticky top-0">
                    <tr>
                        <th className="px-3 py-2 text-left">순위</th>
                        <th className="px-3 py-2 text-left">팀</th>
                        <th className="px-2 py-2 text-center">경기</th>
                        <th className="px-2 py-2 text-center">승</th>
                        <th className="px-2 py-2 text-center">무</th>
                        <th className="px-2 py-2 text-center">패</th>
                        <th className="px-2 py-2 text-center">득실</th>
                        <th className="px-3 py-2 text-center font-bold">승점</th>
                    </tr>
                </thead>
                <tbody>
                    {standings.map((standing) => (
                        <tr
                            key={standing.team.id}
                            className={`border-b border-gray-700 hover:bg-gray-750 transition-colors ${getPositionColor(standing.position)}`}
                        >
                            <td className="px-3 py-3 text-gray-300 font-semibold">
                                {standing.position}
                            </td>
                            <td className="px-3 py-3">
                                <div className="flex items-center gap-2">
                                    {standing.team.crest && (
                                        <img
                                            src={standing.team.crest}
                                            alt={standing.team.shortName}
                                            className="w-6 h-6 object-contain"
                                        />
                                    )}
                                    <span className="text-white font-medium">
                                        {standing.team.shortName || standing.team.name}
                                    </span>
                                </div>
                            </td>
                            <td className="px-2 py-3 text-center text-gray-400">
                                {standing.playedGames}
                            </td>
                            <td className="px-2 py-3 text-center text-green-400">
                                {standing.won}
                            </td>
                            <td className="px-2 py-3 text-center text-yellow-400">
                                {standing.draw}
                            </td>
                            <td className="px-2 py-3 text-center text-red-400">
                                {standing.lost}
                            </td>
                            <td className="px-2 py-3 text-center text-gray-300">
                                <span className={standing.goalDifference > 0 ? 'text-green-400' : standing.goalDifference < 0 ? 'text-red-400' : ''}>
                                    {standing.goalDifference > 0 ? '+' : ''}{standing.goalDifference}
                                </span>
                            </td>
                            <td className="px-3 py-3 text-center text-white font-bold">
                                {standing.points}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-400">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span>챔피언스리그</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-500"></div>
                    <span>유로파리그</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span>강등권</span>
                </div>
            </div>
        </div>
    );
};

export default Standings;
