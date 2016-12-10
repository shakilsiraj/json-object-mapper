/// <reference path="../../typings/index.d.ts"/>
import { JsonProperty } from "../main/DecoratorMetadata";
import { SerializeArrayType, SerializeObjectType, serializeFunctions, SerializationStructure } from "../main/SerializationHelper";

describe("Testing SerializationHelper methods", () => {

    it("Testing SerializeDateType", () => {
        expect(serializeFunctions['date']("test", new Date("03/05//2016"))).toBe('"test":' + (new Date("03/05//2016")).getTime());
    });
    it("Testing SerializeStringType", () => {
        expect(serializeFunctions['string']("test", "testString")).toBe('"test":"testString"');
    });
    it("Testing SerializeBooleanType", () => {
        expect(serializeFunctions['boolean']("test", true)).toBe('"test":true');
    });
    it("Testing SerializeNumberType", () => {
        expect(serializeFunctions['number']("test", 10)).toBe('"test":10');
    });
    it("Testing SerializeArrayType", () => {
        let struct: SerializationStructure = {
            id: undefined,
            type: 'array',
            instance: [10, 20, 30],
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            dependsOn: new Array<String>()
        }
        let moreFunction: Array<SerializationStructure> = serializeFunctions['array'](struct, struct, 0);
        expect(struct.values.join()).toBe('10,20,30');
        expect(moreFunction.length).toBe(0);
    });

    it("Testing SerializeObjectType - simple class", () => {
        class TestSerializeObjectTypeSimpleClass {
            id: string = "1000";
            name: string = "Test";
        }
        let structSerializeObjectType: SerializationStructure = {
            id: undefined,
            type: 'object',
            instance: new TestSerializeObjectTypeSimpleClass(),
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            dependsOn: new Array<String>()
        }
        let moreFunction: Array<SerializationStructure> = serializeFunctions['object'](structSerializeObjectType, structSerializeObjectType, 0);
        expect(structSerializeObjectType.values.join()).toBe('"id":"1000","name":"Test"');
        expect(moreFunction.length).toBe(0);
    });

    it("Testing SerializeObjectType - class with simple array", () => {
        class TestSerializeObjectTypeClassWithArray {
            id: string = "1000";
            name: string = "Test";
            @JsonProperty({ type: String, name: "idsArray" })
            array: string[] = ["10", "20", "30"];
        }
        let structTestSerializeObjectTypeClassWithArray: SerializationStructure = {
            id: undefined,
            type: 'object',
            instance: new TestSerializeObjectTypeClassWithArray(),
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            dependsOn: new Array<String>()
        }

        let moreFunction: Array<SerializationStructure> = serializeFunctions['object'](structTestSerializeObjectTypeClassWithArray, structTestSerializeObjectTypeClassWithArray, 0);
        expect(moreFunction.length).toBe(1);
        expect(moreFunction[0].key).toBe("idsArray");
        expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithArray.dependsOn[0]);
        expect(structTestSerializeObjectTypeClassWithArray.values.join()).toBe('"id":"1000","name":"Test"');
    });

    it("Testing SerializeObjectType - class with another class", () => {
        class TestSerializeObjectTypeClassWithAnotherClass {
            id: string = "1000";
            name: string = "Test";
            @JsonProperty({ type: simpleClass })
            simpleClass: simpleClass = new simpleClass();
        }

        let structTestSerializeObjectTypeClassWithAnotherClass: SerializationStructure = {
            id: undefined,
            type: 'object',
            instance: new TestSerializeObjectTypeClassWithAnotherClass(),
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            dependsOn: new Array<String>()
        }

        let testInstance: TestSerializeObjectTypeClassWithAnotherClass = new TestSerializeObjectTypeClassWithAnotherClass();

        let moreFunction: Array<SerializationStructure> = serializeFunctions['object'](structTestSerializeObjectTypeClassWithAnotherClass, structTestSerializeObjectTypeClassWithAnotherClass, 0);
        expect(moreFunction.length).toBe(1);
        expect(moreFunction[0].instance.constructor['name']).toBe("simpleClass");
        expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithAnotherClass.dependsOn[0]);
        expect(structTestSerializeObjectTypeClassWithAnotherClass.values.join()).toBe('"id":"1000","name":"Test"');
    });

    it("Testing SerializeObjectType - class with an array of classes", () => {
        class TestSerializeObjectTypeClassWithAnArrayOfClasses {
            id: string = "1000";
            name: string = "Test";
            @JsonProperty({ type: simpleClass })
            array: simpleClass[] = [new simpleClass(), new simpleClass(), new simpleClass()];
        }

        let instanceTestSerializeObjectTypeClassWithAnArrayOfClasses = new TestSerializeObjectTypeClassWithAnArrayOfClasses();

        let structTestSerializeObjectTypeClassWithAnArrayOfClasses: SerializationStructure = {
            id: undefined,
            type: 'object',
            instance: instanceTestSerializeObjectTypeClassWithAnArrayOfClasses,
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            dependsOn: new Array<String>()
        }

        let moreFunction: Array<SerializationStructure> = serializeFunctions['object'](structTestSerializeObjectTypeClassWithAnArrayOfClasses, structTestSerializeObjectTypeClassWithAnArrayOfClasses, 0);
        expect(moreFunction.length).toBe(1);
        expect(moreFunction[0].type).toBe("array");
        expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithAnArrayOfClasses.dependsOn[0]);
        expect(moreFunction[0].instance).toBe(instanceTestSerializeObjectTypeClassWithAnArrayOfClasses.array);
    });
});

class simpleClass {
    id: number = Math.random();
}