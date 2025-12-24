import React from 'react';
import { User } from 'lucide-react';
import type { Player } from '../types';

interface PlayerPositionProps {
    player: Player;
    position: { x: number; y: number };
}

const PlayerPosition: React.FC<PlayerPositionProps> = ({ player, position }) => {
    return (
        <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${position.x}%`, top: `${position.y}%` }}
        >
            <div className="flex flex-col items-center gap-1">
                {/* Player Avatar */}
                <div className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center border-2 border-blue-500 shadow-lg">
                    <User className="w-6 h-6 text-blue-600" />
                </div>
                {/* Player Name & Number */}
                <div className="bg-black/70 px-2 py-1 rounded text-xs font-semibold text-white whitespace-nowrap shadow-lg">
                    <div className="text-center">{player.shirtNumber}</div>
                    <div className="text-center text-[10px]">{player.name.split(' ').pop()}</div>
                </div>
            </div>
        </div>
    );
};

interface PitchViewProps {
    homeLineup: Player[];
    awayLineup: Player[];
    homeTeamName: string;
    awayTeamName: string;
}

// 포메이션에 따른 선수 위치 계산 (4-3-3 기준)
const getPlayerPositions = (lineup: Player[], isHome: boolean): { x: number; y: number }[] => {
    const positions: { x: number; y: number }[] = [];

    // 포지션별로 선수 분류
    const goalkeepers = lineup.filter(p => p.position === 'Goalkeeper');
    const defenders = lineup.filter(p => p.position === 'Defence');
    const midfielders = lineup.filter(p => p.position === 'Midfield');
    const forwards = lineup.filter(p => p.position === 'Offence');

    const yOffset = isHome ? 0 : 0;
    const yDirection = isHome ? 1 : -1;

    // Goalkeeper
    goalkeepers.forEach(() => {
        positions.push({ x: 50, y: isHome ? 90 : 10 });
    });

    // Defenders (4명 가정)
    defenders.forEach((_, idx) => {
        const spacing = 70 / (defenders.length + 1);
        positions.push({
            x: 15 + spacing * (idx + 1),
            y: isHome ? 75 : 25
        });
    });

    // Midfielders (3명 가정)
    midfielders.forEach((_, idx) => {
        const spacing = 60 / (midfielders.length + 1);
        positions.push({
            x: 20 + spacing * (idx + 1),
            y: isHome ? 55 : 45
        });
    });

    // Forwards (3명 가정)
    forwards.forEach((_, idx) => {
        const spacing = 60 / (forwards.length + 1);
        positions.push({
            x: 20 + spacing * (idx + 1),
            y: isHome ? 35 : 65
        });
    });

    return positions;
};

const PitchView: React.FC<PitchViewProps> = ({
    homeLineup,
    awayLineup,
    homeTeamName,
    awayTeamName
}) => {
    const homePositions = getPlayerPositions(homeLineup, true);
    const awayPositions = getPlayerPositions(awayLineup, false);

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Team Names */}
            <div className="flex justify-between mb-4 px-4">
                <div className="text-lg font-bold text-white">{homeTeamName}</div>
                <div className="text-lg font-bold text-white">{awayTeamName}</div>
            </div>

            {/* Football Pitch */}
            <div className="relative w-full aspect-[2/3] bg-gradient-to-b from-green-600 to-green-700 rounded-lg shadow-2xl overflow-hidden">
                {/* Pitch Lines */}
                <div className="absolute inset-0">
                    {/* Center Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 transform -translate-y-1/2"></div>

                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 w-32 h-32 border-2 border-white/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

                    {/* Center Spot */}
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/60 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

                    {/* Penalty Areas - Home */}
                    <div className="absolute bottom-0 left-1/4 right-1/4 h-20 border-2 border-white/40 border-b-0"></div>
                    <div className="absolute bottom-0 left-1/3 right-1/3 h-12 border-2 border-white/40 border-b-0"></div>

                    {/* Penalty Areas - Away */}
                    <div className="absolute top-0 left-1/4 right-1/4 h-20 border-2 border-white/40 border-t-0"></div>
                    <div className="absolute top-0 left-1/3 right-1/3 h-12 border-2 border-white/40 border-t-0"></div>

                    {/* Grass Stripes Effect */}
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute left-0 right-0 h-[10%] bg-green-600/20"
                            style={{ top: `${i * 20}%` }}
                        ></div>
                    ))}
                </div>

                {/* Home Team Players */}
                {homeLineup.map((player, idx) => (
                    <PlayerPosition
                        key={`home-${player.id}`}
                        player={player}
                        position={homePositions[idx]}
                    />
                ))}

                {/* Away Team Players */}
                {awayLineup.map((player, idx) => (
                    <div key={`away-${player.id}`}>
                        <PlayerPosition
                            player={player}
                            position={awayPositions[idx]}
                        />
                    </div>
                ))}
            </div>

            {/* Formation Labels */}
            <div className="flex justify-between mt-4 px-4 text-sm text-gray-400">
                <div>Formation: 4-3-3</div>
                <div>Formation: 4-3-3</div>
            </div>
        </div>
    );
};

export default PitchView;
