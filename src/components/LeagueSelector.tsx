import React from 'react';

interface Competition {
    code: string;
    name: string;
}

interface LeagueSelectorProps {
    selectedLeague: string;
    onLeagueChange: (leagueCode: string) => void;
}

// 유럽 5대리그 + 챔피언스리그 (무료 플랜으로 접근 가능)
const COMPETITIONS: Competition[] = [
    { code: 'CL', name: '🏆 UEFA Champions League' },
    { code: 'PL', name: '🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League' },
    { code: 'PD', name: '🇪🇸 La Liga' },
    { code: 'BL1', name: '🇩🇪 Bundesliga' },
    { code: 'SA', name: '🇮🇹 Serie A' },
    { code: 'FL1', name: '🇫🇷 Ligue 1' },
];

const LeagueSelector: React.FC<LeagueSelectorProps> = ({ selectedLeague, onLeagueChange }) => {
    return (
        <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-300 mb-3">
                리그 선택
            </label>
            <select
                value={selectedLeague}
                onChange={(e) => onLeagueChange(e.target.value)}
                className="w-full md:w-auto px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
                {COMPETITIONS.map((comp) => (
                    <option key={comp.code} value={comp.code}>
                        {comp.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default LeagueSelector;
