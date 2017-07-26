import "reflect-metadata";
import { JsonProperty, JsonPropertyDecoratorMetadata, AccessType, JsonIgnore, Serializer, Deserializer } from "../main/DecoratorMetadata";
import { ObjectMapper } from "../main/index";
import { a, b } from "./NameSpaces";
import { getOrCreateDeserializer } from "../main/DeserializationHelper";
import { getOrCreateSerializer, DateSerializer } from "../main/SerializationHelper";

describe('Testing deserialize functions', () => {

    it('Testing Class type with no annotations and 0 children', () => {
        class NameTypeWithoutAnnotations {
            firstName: string = undefined;
            lastName: string = undefined;
            middleName: string = undefined;

            public getFirstName(): string {
                return this.firstName;
            }
        }
        const nameTypeWithoutAnnotationsJson = { firstName: 'John', middleName: 'P', lastName: 'Doe' };

        const processedDto: NameTypeWithoutAnnotations = ObjectMapper.deserialize(NameTypeWithoutAnnotations, nameTypeWithoutAnnotationsJson);
        expect(processedDto.getFirstName()).toBe('John');
        expect(processedDto.middleName).toBe('P');
        expect(processedDto.lastName).toBe('Doe');

    });

    class Event {

    }

    class EventsArray {
        @JsonProperty({ type: Event })
        eventsArray: Event[] = undefined;
    }
});

describe('Testing serialize array function', () => {
    it('Testing array serialization', () => {
        class Event {
            id: number = undefined;
            location: string = undefined;
            constructor(id: number, location: string) {
                this.id = id;
                this.location = location;
            }
        }
        const eventsArray: Event[] = [
            new Event(1, 'Canberra'),
            new Event(2, 'Sydney'),
            new Event(3, 'Melbourne')
        ];

        const serializedString: String = ObjectMapper.serialize(eventsArray);
        expect(serializedString).toBe(`[{"id":1,"location":"Canberra"},{"id":2,"location":"Sydney"},{"id":3,"location":"Melbourne"}]`);

    });
});

describe('Testing deserialize array function', () => {

    it('Testing array serialization 1', () => {

        class Event {
            id: number = undefined;
            location: string = undefined;
        }

        const json = JSON.parse('[{"id":1,"location":"Canberra"},{"id":2,"location":"Sydney"},{"id":3,"location":"Melbourne"}]');

        const eventsArray: Event[] = ObjectMapper.deserializeArray(Event, json);
        expect(eventsArray.length > 0);
        expect(eventsArray[0].id).toBe(1);
        expect(eventsArray[0].location).toBe('Canberra');
        expect(eventsArray[1].id).toBe(2);
        expect(eventsArray[1].location).toBe('Sydney');
        expect(eventsArray[2].id).toBe(3);
        expect(eventsArray[2].location).toBe('Melbourne');

    });

    it('Testing array serialization 2', () => {
        class Friend {
            id: number = undefined;
            name: string = undefined;
            uuid: string = undefined;
            age: number = undefined;
            email: string = undefined;
            gender: string = undefined;
        }

        const json = [
            {
                id: 0,
                name: 'Kim Hernandez',
                uuid: '5a8f55ea-f667-489a-b29f-13e1e6594963',
                age: 20,
                email: 'kimhernandez@comverges.com',
                gender: 'female'
            },
            {
                id: 1,
                name: 'Sophie Hudson',
                uuid: 'c61d5c41-e807-4ff1-ae88-19eeb5429411',
                age: 33,
                email: 'sophiehudson@comverges.com',
                gender: 'female'
            },
            {
                id: 2,
                name: 'Rowland Gates',
                uuid: '6ce0a1bd-c955-4fb7-a89a-f9cca038de5e',
                age: 26,
                email: 'rowlandgates@comverges.com',
                gender: 'male'
            },
            {
                id: 3,
                name: 'Madeline Ewing',
                uuid: '678fa258-2481-4457-965d-5d8571cb59cc',
                age: 25,
                email: 'madelineewing@comverges.com',
                gender: 'female'
            },
            {
                id: 4,
                name: 'Stevens Ryan',
                uuid: '8b67b198-7eb9-4bb6-a317-315a22c89c1d',
                age: 40,
                email: 'stevensryan@comverges.com',
                gender: 'male'
            },
            {
                id: 5,
                name: 'Malone Chang',
                uuid: '2859f03b-a648-478f-bfd9-f913993dfe74',
                age: 34,
                email: 'malonechang@comverges.com',
                gender: 'male'
            },
            {
                id: 6,
                name: 'Arlene Small',
                uuid: 'bb3a9e09-4748-47a5-8a9c-ad1c51a43399',
                age: 39,
                email: 'arlenesmall@comverges.com',
                gender: 'female'
            },
            {
                id: 7,
                name: 'Josefa Blackburn',
                uuid: 'f858dbd4-f4f3-4f0e-9601-854c31fb73bb',
                age: 40,
                email: 'josefablackburn@comverges.com',
                gender: 'female'
            },
            {
                id: 8,
                name: 'Dorothea Lopez',
                uuid: 'ddce2735-8aa0-4aca-8b6a-42f42bedcc73',
                age: 22,
                email: 'dorothealopez@comverges.com',
                gender: 'female'
            },
            {
                id: 9,
                name: 'Cecile Soto',
                uuid: '1fab793a-a691-4185-ba36-8023d961cee7',
                age: 40,
                email: 'cecilesoto@comverges.com',
                gender: 'female'
            },
            {
                id: 10,
                name: 'Barrett Pope',
                uuid: '7a4ceca2-95a4-4894-987a-69c86b98a313',
                age: 33,
                email: 'barrettpope@comverges.com',
                gender: 'male'
            },
            {
                id: 11,
                name: 'Eliza Torres',
                uuid: 'f24351ff-ee2f-4483-b525-fd7cef62d56c',
                age: 39,
                email: 'elizatorres@comverges.com',
                gender: 'female'
            },
            {
                id: 12,
                name: 'Baxter Cannon',
                uuid: 'ba1d7536-637f-412b-a2ba-0eab28c1b156',
                age: 29,
                email: 'baxtercannon@comverges.com',
                gender: 'male'
            },
            {
                id: 13,
                name: 'Greene Martin',
                uuid: '80d4aa47-3e13-4f77-835d-97f030188488',
                age: 33,
                email: 'greenemartin@comverges.com',
                gender: 'male'
            },
            {
                id: 14,
                name: 'Mckinney Lowe',
                uuid: '6852df51-efb3-4fdc-baed-4cd90a97fb39',
                age: 22,
                email: 'mckinneylowe@comverges.com',
                gender: 'male'
            },
            {
                id: 15,
                name: 'Chambers Sloan',
                uuid: 'f1e7a0c0-7620-40a6-84cd-b5578b20cad5',
                age: 26,
                email: 'chamberssloan@comverges.com',
                gender: 'male'
            },
            {
                id: 16,
                name: 'Lynne Gillespie',
                uuid: '1d6465a1-2881-4a58-96a8-2e5ccfddfbf4',
                age: 33,
                email: 'lynnegillespie@comverges.com',
                gender: 'female'
            },
            {
                id: 17,
                name: 'Fern York',
                uuid: '34e25ab4-e268-468f-bb16-e8a2390fbd72',
                age: 34,
                email: 'fernyork@comverges.com',
                gender: 'female'
            },
            {
                id: 18,
                name: 'Diaz Shelton',
                uuid: '896c2c51-a8af-4c42-b069-13d4437a97f3',
                age: 30,
                email: 'diazshelton@comverges.com',
                gender: 'male'
            },
            {
                id: 19,
                name: 'Carol Lindsay',
                uuid: '4809bba6-4986-4501-9bc5-0437f22d1e2e',
                age: 26,
                email: 'carollindsay@comverges.com',
                gender: 'female'
            },
            {
                id: 20,
                name: 'Eugenia Day',
                uuid: '36e116d2-2d99-4052-a957-9b9a7e75d84f',
                age: 38,
                email: 'eugeniaday@comverges.com',
                gender: 'female'
            },
            {
                id: 21,
                name: 'Marsha Bradford',
                uuid: 'e57a3802-1173-452c-ace6-d60bf13b7b88',
                age: 35,
                email: 'marshabradford@comverges.com',
                gender: 'female'
            },
            {
                id: 22,
                name: 'Avila Saunders',
                uuid: '161919ec-65aa-4875-b7f6-68c684a2f57a',
                age: 40,
                email: 'avilasaunders@comverges.com',
                gender: 'male'
            },
            {
                id: 23,
                name: 'Hartman Herman',
                uuid: 'b71a026e-7909-4105-af1a-3d314821edba',
                age: 20,
                email: 'hartmanherman@comverges.com',
                gender: 'male'
            },
            {
                id: 24,
                name: 'Yolanda Rodriguez',
                uuid: '21ec9746-7c04-42b9-a492-ced69e5203c9',
                age: 29,
                email: 'yolandarodriguez@comverges.com',
                gender: 'female'
            },
            {
                id: 25,
                name: 'Head Nichols',
                uuid: 'a514f653-c0ac-4028-921e-43bd3c32c14c',
                age: 20,
                email: 'headnichols@comverges.com',
                gender: 'male'
            },
            {
                id: 26,
                name: 'Albert Gardner',
                uuid: 'a962a277-81fc-425a-b320-e676d957ab06',
                age: 24,
                email: 'albertgardner@comverges.com',
                gender: 'male'
            },
            {
                id: 27,
                name: 'Claudine Wells',
                uuid: '4d9d781b-0215-47fa-8c24-720058c2bbec',
                age: 21,
                email: 'claudinewells@comverges.com',
                gender: 'female'
            },
            {
                id: 28,
                name: 'Addie Long',
                uuid: '16712b38-99e9-487b-be88-dd9f31206360',
                age: 33,
                email: 'addielong@comverges.com',
                gender: 'female'
            },
            {
                id: 29,
                name: 'Deidre Puckett',
                uuid: 'f3cf9b5b-f7b6-46cc-8a75-57634c6bf3f8',
                age: 34,
                email: 'deidrepuckett@comverges.com',
                gender: 'female'
            }
        ];

        const friends: Friend[] = ObjectMapper.deserializeArray(Friend, json);
        expect(friends.length).toBe(30);

        expect(friends[15].name).toBe('Chambers Sloan');
        expect(friends[29].email).toBe('deidrepuckett@comverges.com');
        expect(friends[25].uuid).toBe('a514f653-c0ac-4028-921e-43bd3c32c14c');
        expect(friends[18].gender).toBe('male');
    });
});

describe('Testing serialize functions', () => {
    it('Testing Class type with no annotations and 0 children', () => {

        const SimpleClassJson = {
            firstName: 'John',
            middleName: 'P',
            lastName: 'Doe'
        };

        const stringrified: String = ObjectMapper.serialize(SimpleClassJson);
        // console.log(JSON.stringify(SimpleClassJson));
        expect(stringrified).toBe(`{"firstName":"John","middleName":"P","lastName":"Doe"}`);

    });

    it('Testing Class type with no annotations and an array', () => {

        class SimpleClass {
            firstName = 'John';
            middleName = 'P';
            lastName = 'Doe';
            @JsonProperty({ type: String, name: 'AKA' })
            knownAs: String[] = ['John', 'Doe', 'JohnDoe', 'JohnPDoe'];
            @JsonProperty({ type: Date, name: 'dateOfBirth', serializer: DateSerializer })
            dob: Date = new Date(1483142400000); // Sat Dec 31, 2016
        }

        const intance: SimpleClass = new SimpleClass();

        const stringrified: String = ObjectMapper.serialize(intance);
        expect(stringrified).toBe(`{"firstName":"John","middleName":"P","lastName":"Doe","dateOfBirth":1483142400000,"AKA":["John","Doe","JohnDoe","JohnPDoe"]}`);

    });

    it('Test all simple type properties', () => {
        class SimpleRoster {
            private name: String = undefined;
            private worksOnWeekend: Boolean = undefined;
            private numberOfHours: Number = undefined;
            @JsonProperty({ type: Date })
            private systemDate: Date = undefined;

            public isAvailableToday(): Boolean {
                if (this.systemDate.getDay() % 6 === 0 && this.worksOnWeekend === false) {
                    return false;
                }
                return true;
            }

        }
        const json = {
            name: 'John Doe',
            worksOnWeekend: false,
            numberOfHours: 8,
            systemDate: 1483142400000 // Sat Dec 31, 2016
        };

        const testInstance: SimpleRoster = ObjectMapper.deserialize(SimpleRoster, json);
        expect(testInstance.isAvailableToday()).toBeFalsy();
    });
});

describe('Testing NameSpaces', () => {
    it('Test 1', () => {

        const random1 = Math.random();
        const random2 = Date.now();

        const json = {
            c: 'This is a test',
            d: {
                f: random1,
                t: random2
            }
        };

        const testInstance = ObjectMapper.deserialize(b.NamespaceBClass, json);
        expect(testInstance.d.f).toBe(random1);
        expect(testInstance.d.t).toBe(random2);
    });
});

describe('Misc tests', () => {
    it('Tesing Dto with functions', () => {
        class Roster {
            private name: string = undefined;
            private worksOnWeekend = false;
            private today: Date = new Date();
            public isAvailable(date: Date): boolean {
                if (date.getDay() % 6 === 0 && this.worksOnWeekend === false) {
                    return false;
                }
                return true;
            }
            public isAvailableToday(): boolean {
                return this.isAvailable(this.today);
            }
        }

        const json = {
            'name': 'John Doe',
            'worksOnWeekend': false
        };

        const testInstance: Roster = ObjectMapper.deserialize(Roster, json);
        expect(testInstance.isAvailable(new Date('2016-12-17'))).toBeFalsy();
        expect(testInstance.isAvailable(new Date('2016-12-16'))).toBeTruthy();
        expect(testInstance.isAvailableToday()).toBe(((new Date()).getDay() % 6 === 0) ? false : true);
    });

    it('Testing enum ', () => {

        class DaysEnumSerializerDeserializer implements Deserializer, Serializer {
            deserialize = (value: string): Days => {
                return Days[value];
            }
            serialize = (value: Days): string => {
                return `"${Days[value]}"`;
            }
        }

        enum Days {
            Sun, Mon, Tues, Wed, Thurs, Fri, Sat
        }

        class Workday {
            @JsonProperty({ type: Days, deserializer: DaysEnumSerializerDeserializer, serializer: DaysEnumSerializerDeserializer })
            today: Days = undefined;
        }

        const json = { 'today': 'Tues' };

        const testInstance: Workday = ObjectMapper.deserialize(Workday, json);
        expect(testInstance.today === Days.Tues).toBeTruthy();
        testInstance.today = Days.Fri;
        const serialized: String = ObjectMapper.serialize(testInstance);
        expect(serialized).toBe(`{"today":"Fri"}`);
    });

    it('Testing AccessType.READ_ONLY', () => {

        class SimpleClass {
            firstName = 'John';
            middleName = 'P';
            lastName = 'Doe';
            @JsonProperty({ type: String, name: 'AKA', access: AccessType.READ_ONLY })
            knownAs: String[] = ['John', 'Doe', 'JohnDoe', 'JohnPDoe'];
        }

        const intance: SimpleClass = new SimpleClass();

        const stringrified: String = ObjectMapper.serialize(intance);
        expect(stringrified).toBe(`{"firstName":"John","middleName":"P","lastName":"Doe"}`);

    });

    it('Testing AccessType.WRITE_ONLY', () => {
        class Roster {
            @JsonProperty({ access: AccessType.WRITE_ONLY })
            private name: string = undefined;
            private worksOnWeekend = false;
            private today: Date = new Date();
            public isAvailable(date: Date): boolean {
                if (date.getDay() % 6 === 0 && this.worksOnWeekend === false) {
                    return false;
                }
                return true;
            }
            public isAvailableToday(): boolean {
                return this.isAvailable(this.today);
            }
            public getName(): String {
                return this.name;
            }
        }

        const json = {
            name: 'John Doe',
            worksOnWeekend: false
        };

        const testInstance: Roster = ObjectMapper.deserialize(Roster, json);
        expect(testInstance.getName()).toBeUndefined();
    });

    it('Testing deserializer and serializer instances', () => {

        class TestSerailizer implements Serializer {
            serialize = (value: any): any => {

            }
        }

        const instance1: TestSerailizer = getOrCreateSerializer(TestSerailizer);
        const instance2: TestSerailizer = getOrCreateSerializer(TestSerailizer);
        expect(instance1).toBe(instance2);

        class TestDeserializer implements Deserializer {
            deserialize = (value: any): any => {

            }
        }

        const instance3: TestDeserializer = getOrCreateDeserializer(TestDeserializer);
        const instance4: TestDeserializer = getOrCreateDeserializer(TestDeserializer);
        expect(instance3).toBe(instance4);
    });
});

describe('Testing JsonIgnore decorator', () => {
    it("Testing JsonIgnore serialization", () => {
        class Event {
            @JsonProperty()
            id: number;
            @JsonProperty()
            location: string;
            @JsonIgnore()
            state: string;

            constructor(id: number, location: string, state: string) {
                this.id = id;
                this.location = location;
                this.state = state;
            }
        }

        let serializedString: String = ObjectMapper.serialize(new Event(1, "Canberra", "new"));
        expect(serializedString).toBe('{"id":1,"location":"Canberra"}');
    });

    it("Testing JsonIgnore deserialization", () => {
        class Event {
            @JsonProperty()
            id: number = undefined;
            @JsonProperty()
            location: string = undefined;
            @JsonIgnore()
            state: string = 'old';
        }

        let json = {
            'id': '1',
            'location' : 'Canberra',
            'state': 'new'
        };

        let testInstance: Event = ObjectMapper.deserialize(Event, json);
        expect(testInstance.location).toBe('Canberra');
        expect(testInstance.state).toBe('old');
    });
});
