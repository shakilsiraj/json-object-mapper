import { JsonProperty } from '../main/DecoratorMetadata';
import { ObjectMapper } from '../main/index';
import { Constants, getTypeNameFromInstance } from '../main/ReflectHelper';
import { SerializationStructure, SerializeArrayType, serializeFunctions, SerializeObjectType, serializers } from '../main/SerializationHelper';

describe('Testing SerializationHelper methods', () => {

    it('Testing SerializeDateType', () => {
        expect(serializeFunctions[Constants.DATE_TYPE]('test', new Date('03/05/2016'), serializers[Constants.DATE_TYPE])).toBe(`"test":${(new Date('03/05/2016')).getTime()}`);
    });

    it('Testing SerializeStringType', () => {
        expect(serializeFunctions[Constants.STRING_TYPE]('test', 'testString', serializers[Constants.STRING_TYPE])).toBe(`"test":"testString"`);
    });

    it('Testing SerializeStringType with quotes', () => {
        expect(serializeFunctions[Constants.STRING_TYPE]('test', `testString 'with' "quotes"`, serializers[Constants.STRING_TYPE])).toBe(`"test":"testString 'with' \\"quotes\\""`);
    });

    it('Testing SerializeBooleanType', () => {
        expect(serializeFunctions[Constants.BOOLEAN_TYPE]('test', true, serializers[Constants.BOOLEAN_TYPE])).toBe(`"test":true`);
    });

    it('Testing SerializeNumberType', () => {
        expect(serializeFunctions[Constants.NUMBER_TYPE]('test', 10, serializers[Constants.NUMBER_TYPE])).toBe(`"test":10`);
    });

    it('Testing SerializeArrayType', () => {
        const struct: SerializationStructure = {
            id: undefined,
            type: Constants.ARRAY_TYPE,
            instance: ['67', '33', '23', '45'],
            parentIndex: 0,
            values: [],
            key: 'test',
            // dependsOn: new Array<String>()
            visited: false
        };
        const moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.ARRAY_TYPE](struct, struct, 0);
        expect(struct.values.join()).toBe('"67","33","23","45"');
        expect(moreFunction.length).toBe(0);
    });

    it('Testing SerializeObjectType - simple class', () => {
        class TestSerializeObjectTypeSimpleClass {
            id = '1000';
            name = 'Test';
        }
        const structSerializeObjectType: SerializationStructure = {
            id: undefined,
            type: Constants.OBJECT_TYPE,
            instance: new TestSerializeObjectTypeSimpleClass(),
            parentIndex: 0,
            values: [],
            key: 'test',
            // dependsOn: new Array<String>()
            visited: false
        };
        const moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.OBJECT_TYPE](structSerializeObjectType, structSerializeObjectType, 0);
        expect(structSerializeObjectType.values.join()).toBe('"id":"1000","name":"Test"');
        expect(moreFunction.length).toBe(0);
    });

    it('Testing SerializeObjectType - class with simple array', () => {
        class TestSerializeObjectTypeClassWithArray {
            id = '1000';
            name = 'Test';
            @JsonProperty({ type: String, name: 'idsArray' })
            array: string[] = ['67', '33', '23', '45'];
        }
        const structTestSerializeObjectTypeClassWithArray: SerializationStructure = {
            id: undefined,
            type: Constants.OBJECT_TYPE,
            instance: new TestSerializeObjectTypeClassWithArray(),
            parentIndex: 0,
            values: [],
            key: 'test',
            // dependsOn: new Array<String>()
            visited: false
        };

        const moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.OBJECT_TYPE](structTestSerializeObjectTypeClassWithArray, structTestSerializeObjectTypeClassWithArray, 0);
        expect(moreFunction.length).toBe(1);
        expect(moreFunction[0].key).toBe('idsArray');
        // expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithArray.dependsOn[0]);
        expect(structTestSerializeObjectTypeClassWithArray.values.join()).toBe('"id":"1000","name":"Test"');
    });

    it('Testing SerializeObjectType - class with another class', () => {
        class TestSerializeObjectTypeClassWithAnotherClass {
            id = '1000';
            name = 'Test';
            @JsonProperty({ type: SimpleClass })
            simpleClass: SimpleClass = new SimpleClass();
        }

        const structTestSerializeObjectTypeClassWithAnotherClass: SerializationStructure = {
            id: undefined,
            type: Constants.OBJECT_TYPE,
            instance: new TestSerializeObjectTypeClassWithAnotherClass(),
            parentIndex: 0,
            values: [],
            key: 'test',
            // dependsOn: new Array<String>()
            visited: false
        };

        const testInstance: TestSerializeObjectTypeClassWithAnotherClass = new TestSerializeObjectTypeClassWithAnotherClass();

        const moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.OBJECT_TYPE](structTestSerializeObjectTypeClassWithAnotherClass, structTestSerializeObjectTypeClassWithAnotherClass, 0);
        expect(moreFunction.length).toBe(1);
        expect(getTypeNameFromInstance(moreFunction[0].instance.constructor)).toBe('SimpleClass');
        // expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithAnotherClass.dependsOn[0]);
        expect(structTestSerializeObjectTypeClassWithAnotherClass.values.join()).toBe(`"id":"1000","name":"Test"`);
    });

    it('Testing SerializeObjectType - class with an array of classes', () => {
        class TestSerializeObjectTypeClassWithAnArrayOfClasses {
            id = '1000';
            name = 'Test';
            @JsonProperty({ type: SimpleClass })
            array: SimpleClass[] = [new SimpleClass(), new SimpleClass(), new SimpleClass()];
        }

        const instanceTestSerializeObjectTypeClassWithAnArrayOfClasses = new TestSerializeObjectTypeClassWithAnArrayOfClasses();

        const structTestSerializeObjectTypeClassWithAnArrayOfClasses: SerializationStructure = {
            id: undefined,
            type: Constants.OBJECT_TYPE,
            instance: instanceTestSerializeObjectTypeClassWithAnArrayOfClasses,
            parentIndex: 0,
            values: [],
            key: 'test',
            // dependsOn: new Array<String>()
            visited: false
        };

        const moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.OBJECT_TYPE](structTestSerializeObjectTypeClassWithAnArrayOfClasses, structTestSerializeObjectTypeClassWithAnArrayOfClasses, 0);
        expect(moreFunction.length).toBe(1);
        expect(moreFunction[0].type).toBe('Array');
        // expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithAnArrayOfClasses.dependsOn[0]);
        expect(moreFunction[0].instance).toBe(instanceTestSerializeObjectTypeClassWithAnArrayOfClasses.array);
    });
});

class SimpleClass {
    id: number = Math.random();
}
