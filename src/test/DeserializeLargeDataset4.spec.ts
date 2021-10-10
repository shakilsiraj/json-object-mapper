import 'reflect-metadata';
import { JsonIgnore } from '../../dist/ObjectMapper';
import { JsonProperty } from '../main/DecoratorMetadata';
import { ObjectMapper } from '../main/index';

describe('Testing nested object', () => {
    it('Test deserialize', () => {
        const league = ObjectMapper.deserialize(League, json);
        
        // Check data
        expect(league).toBeDefined();
        expect(league.name).toBe('English Premier League 2016/17');
        expect(json.rounds.length).toBe(league.rounds.length);
        expect(league.rounds.length).toBe(1);
        expect(league.rounds[0].name).toBe('Matchday 1');
        
        expect(league.rounds[0].matches.length).toBe(2);
        
        expect(league.rounds[0].matches[0].date.getTime()).toBe(new Date('2016-08-13').getTime());
        expect(league.rounds[0].matches[0].score1).toBe(2);
        expect(league.rounds[0].matches[0].score2).toBeUndefined();
        expect(league.rounds[0].matches[0].team1).toBeDefined();
        expect(league.rounds[0].matches[0].team1.key).toBe('hull');
        expect(league.rounds[0].matches[0].team1.name).toBe('Hull City');
        expect(league.rounds[0].matches[0].team1.code).toBe('HUL');
        expect(league.rounds[0].matches[0].team2).toBeDefined();
        expect(league.rounds[0].matches[0].team2.key).toBe('leicester');
        expect(league.rounds[0].matches[0].team2.name).toBe('Leicester City');
        expect(league.rounds[0].matches[0].team2.code).toBe('LEI');

        expect(league.rounds[0].matches[1].date.getTime()).toBe(new Date('2016-08-14').getTime());
        expect(league.rounds[0].matches[1].score1).toBe(0);
        expect(league.rounds[0].matches[1].score2).toBeUndefined();
        expect(league.rounds[0].matches[1].team1).toBeDefined();
        expect(league.rounds[0].matches[1].team1.key).toBe('burnley');
        expect(league.rounds[0].matches[1].team1.name).toBe('Burnley');
        expect(league.rounds[0].matches[1].team1.code).toBe('BUR');
        expect(league.rounds[0].matches[1].team2).toBeDefined();
        expect(league.rounds[0].matches[1].team2.key).toBe('swansea');
        expect(league.rounds[0].matches[1].team2.name).toBe('Swansea');
        expect(league.rounds[0].matches[1].team2.code).toBe('SWA');
    });
});

class Team {
    key: String = undefined;
    name: String = undefined;
    code: String = undefined;
}

class Match {
    @JsonProperty({ type: Date })
    date: Date = undefined;
    @JsonProperty({ type: Team })
    team1: Team = undefined;
    @JsonProperty({ type: Team })
    team2: Team = undefined;
    @JsonProperty()
    score1: number = undefined;
    @JsonIgnore()
    score2: number = undefined;
}

class Round {
    name: string = undefined;
    @JsonProperty({ type: Match })
    matches: Match[] = undefined;
}

class League {
    name: String = undefined;
    @JsonProperty({ type: Round })
    rounds: Round[] = undefined;
}

/** Gathered from OpenFootball https://raw.githubusercontent.com/openfootball/football.json/master/2016-17/en.1.json */
const json = {
    'name': 'English Premier League 2016/17',
    'rounds': [
        {
            'name': 'Matchday 1',
            'matches': [
                {
                    'date': '2016-08-13',
                    'team1': {
                        'key': 'hull',
                        'name': 'Hull City',
                        'code': 'HUL'
                    },
                    'team2': {
                        'key': 'leicester',
                        'name': 'Leicester City',
                        'code': 'LEI'
                    },
                    'score1': 2,
                    'score2': 1
                },
                {
                    'date': '2016-08-14',
                    'team1': {
                        'key': 'burnley',
                        'name': 'Burnley',
                        'code': 'BUR'
                    },
                    'team2': {
                        'key': 'swansea',
                        'name': 'Swansea',
                        'code': 'SWA'
                    },
                    'score1': 0,
                    'score2': 1
                }
            ]
        }
    ]
};
