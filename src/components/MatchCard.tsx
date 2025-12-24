import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import type { Match } from '../types';

interface MatchCardProps {
    match: Match;
}

const MatchCard: React.FC<MatchCardProps> = ({ match }) => {
    const matchDate = new Date(match.utcDate);
    const formattedDate = matchDate.toLocaleDateString('ko-KR', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
    const formattedTime = matchDate.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'FINISHED':
                return 'bg-gray-600 text-gray-200';
            case 'LIVE':
            case 'IN_PLAY':
                return 'bg-red-500 text-white animate-pulse';
            case 'SCHEDULED':
                return 'bg-blue-600 text-white';
            default:
                return 'bg-gray-700 text-gray-300';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'FINISHED':
                return 'Full Time';
            case 'LIVE':
            case 'IN_PLAY':
                return 'LIVE';
            case 'SCHEDULED':
                return 'Upcoming';
            case 'POSTPONED':
                return 'Postponed';
            case 'CANCELLED':
                return 'Cancelled';
            default:
                return status;
        }
    };

    return (
        <div className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-700 hover:border-gray-600">
            {/* Match Status Badge */}
            <div className="flex justify-between items-center px-4 py-2 bg-gray-900/50 border-b border-gray-700">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{formattedDate}</span>
                    <Clock className="w-4 h-4 ml-2" />
                    <span>{formattedTime}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(match.status)}`}>
                    {getStatusText(match.status)}
                </span>
            </div>

            {/* Main Match Info */}
            <div className="p-6">
                <div className="flex items-center justify-between gap-4">
                    {/* Home Team */}
                    <div className="flex-1 flex flex-col items-center gap-3">
                        <img
                            src={match.homeTeam.crest}
                            alt={match.homeTeam.name}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/64?text=Team';
                            }}
                        />
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white">{match.homeTeam.shortName}</h3>
                            <p className="text-xs text-gray-400">{match.homeTeam.tla}</p>
                        </div>
                    </div>

                    {/* Score */}
                    <div className="flex flex-col items-center gap-2">
                        {match.status === 'SCHEDULED' ? (
                            <div className="text-2xl font-bold text-gray-500">VS</div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="text-4xl font-bold text-white">
                                    {match.score.fullTime.home ?? '-'}
                                </div>
                                <div className="text-2xl font-bold text-gray-600">:</div>
                                <div className="text-4xl font-bold text-white">
                                    {match.score.fullTime.away ?? '-'}
                                </div>
                            </div>
                        )}
                        {match.status === 'FINISHED' && match.score.halfTime.home !== null && (
                            <div className="text-xs text-gray-500">
                                (HT: {match.score.halfTime.home} - {match.score.halfTime.away})
                            </div>
                        )}
                    </div>

                    {/* Away Team */}
                    <div className="flex-1 flex flex-col items-center gap-3">
                        <img
                            src={match.awayTeam.crest}
                            alt={match.awayTeam.name}
                            className="w-16 h-16 object-contain"
                            onError={(e) => {
                                e.currentTarget.src = 'https://via.placeholder.com/64?text=Team';
                            }}
                        />
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-white">{match.awayTeam.shortName}</h3>
                            <p className="text-xs text-gray-400">{match.awayTeam.tla}</p>
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-xs text-gray-500">
                    <span>Matchday {match.matchday}</span>
                    {match.score.winner && (
                        <span className="text-green-400 font-semibold">
                            Winner: {match.score.winner === 'HOME_TEAM' ? match.homeTeam.shortName : match.score.winner === 'AWAY_TEAM' ? match.awayTeam.shortName : 'Draw'}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchCard;
