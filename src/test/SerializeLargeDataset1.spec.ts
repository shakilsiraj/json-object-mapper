import 'reflect-metadata';
import { JsonProperty } from '../main/DecoratorMetadata';
import { ObjectMapper } from '../main/index';

describe('Testing serialization of large datasets', () => {

    class NodeWith1Children {
        uuid: String = createUUID();
    }
    class NodeWith2Children {
        @JsonProperty('UUID')
        uuid: String = createUUID();
        @JsonProperty({ type: NodeWith1Children })
        childNode: NodeWith1Children = new NodeWith1Children();
    }
    class NodeWith3Children {
        uuid: String = createUUID();
        random: Number = Math.random();
        @JsonProperty({ type: NodeWith2Children })
        childNodes: Array<NodeWith2Children> = [];
        constructor() {
            for (let i = 0; i < 300; i++) {
                this.childNodes.push(new NodeWith2Children());
            }
        }
    }

    let testInstance: NodeWith3Children;

    beforeEach(() => {
        testInstance = new NodeWith3Children();
    });

    it('Testing serialize method', () => {
        const serializedWithObjectMapper: String = ObjectMapper.serialize(testInstance);
        expect(serializedWithObjectMapper.length > 0).toBeTruthy();
    });

    it('Testing with JSON.parse(String) method', () => {
        const serializedWithObjectMapper: String = ObjectMapper.serialize(testInstance);
        const verifyInstance: Object = JSON.parse(serializedWithObjectMapper.toString());
        expect(verifyInstance['uuid']).toBe(testInstance.uuid);
        expect(verifyInstance['random']).toBe(testInstance.random);
        expect(verifyInstance['childNodes'].length).toBe(300);
    });

    it(`Testing @JsonProperty('UUID') count`, () => {
        const serializedWithObjectMapper: String = ObjectMapper.serialize(testInstance);
        expect((serializedWithObjectMapper.match(/UUID/g) || []).length).toBe(300);
    });
});

/**
 * http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
 */
const createUUID = () => {
    // http://www.ietf.org/rfc/rfc4122.txt
    const s = [];
    const hexDigits = '0123456789abcdef';
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = '4';  // bits 12-15 of the time_hi_and_version field to 0010
    // tslint:disable-next-line:no-bitwise
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = '-';

    const uuid = s.join('');
    return uuid;
};
