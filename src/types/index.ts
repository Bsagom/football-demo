// Football Data API Types

// 팀 정보
export interface Team {
    id: number;
    name: string;
    shortName: string;
    tla: string; // Three Letter Abbreviation
    crest: string; // 팀 로고 URL
}

// 스코어 정보
export interface Score {
    winner: string | null; // HOME_TEAM, AWAY_TEAM, DRAW, null
    duration: string; // REGULAR, PENALTY_SHOOTOUT
    fullTime: {
        home: number | null;
        away: number | null;
    };
    halfTime: {
        home: number | null;
        away: number | null;
    };
}

// 경기 정보
export interface Match {
    id: number;
    utcDate: string;
    status: string; // SCHEDULED, LIVE, IN_PLAY, PAUSED, FINISHED, POSTPONED, SUSPENDED, CANCELLED
    matchday: number;
    stage: string;
    group: string | null;
    lastUpdated: string;
    competition?: {
        id: number;
        name: string;
        code: string;
    };
    homeTeam: Team;
    awayTeam: Team;
    score: Score;
    odds: {
        msg: string;
    };
    referees: Referee[];
}

// 심판 정보
export interface Referee {
    id: number;
    name: string;
    type: string; // REFEREE, ASSISTANT_REFEREE_N1, ASSISTANT_REFEREE_N2, FOURTH_OFFICIAL, VIDEO_ASSISTANT_REFEREE_N1
    nationality: string;
}

// 선수 정보
export interface Player {
    id: number;
    name: string;
    position: string; // Goalkeeper, Defence, Midfield, Offence
    dateOfBirth: string;
    nationality: string;
    shirtNumber: number | null;
}

// 라인업 정보
export interface Lineup {
    team: Team;
    coach: {
        id: number;
        name: string;
        nationality: string;
    };
    lineup: Player[];
    substitutes: Player[];
}

// 경기 상세 정보 (라인업 포함)
export interface MatchDetail extends Match {
    lineups?: Lineup[];
    goals?: Goal[];
    bookings?: Booking[];
    substitutions?: Substitution[];
}

// 골 정보
export interface Goal {
    minute: number;
    injuryTime: number | null;
    type: string; // REGULAR, OWN_GOAL, PENALTY
    team: Team;
    scorer: {
        id: number;
        name: string;
    };
    assist: {
        id: number;
        name: string;
    } | null;
    score: {
        home: number;
        away: number;
    };
}

// 경고/퇴장 정보
export interface Booking {
    minute: number;
    team: Team;
    player: {
        id: number;
        name: string;
    };
    card: string; // YELLOW_CARD, YELLOW_RED_CARD, RED_CARD
}

// 교체 정보
export interface Substitution {
    minute: number;
    team: Team;
    playerOut: {
        id: number;
        name: string;
    };
    playerIn: {
        id: number;
        name: string;
    };
}

// API 응답 타입
export interface MatchesResponse {
    filters: {
        season: string;
    };
    resultSet: {
        count: number;
        first: string;
        last: string;
        played: number;
    };
    matches: Match[];
}

export interface MatchDetailResponse {
    match: MatchDetail;
}
