/// <reference path="../../typings/index.d.ts"/>
import { JsonProperty } from "../main/DecoratorMetadata";
import { SerializeArrayType, SerializeObjectType, serializeFunctions, serializers, SerializationStructure } from "../main/SerializationHelper";
import { getTypeNameFromInstance, Constants } from "../main/ReflectHelper";

describe("Testing SerializationHelper methods", () => {

    it("Testing SerializeDateType", () => {
        expect(serializeFunctions[Constants.DATE_TYPE]("test", new Date("03/05/2016"), serializers[Constants.DATE_TYPE])).toBe('"test":' + (new Date("03/05/2016")).getTime());
    });
    it("Testing SerializeStringType", () => {
        expect(serializeFunctions[Constants.STRING_TYPE]("test", "testString", serializers[Constants.STRING_TYPE])).toBe('"test":"testString"');
    });
    it("Testing SerializeBooleanType", () => {
        expect(serializeFunctions[Constants.BOOLEAN_TYPE]("test", true, serializers[Constants.BOOLEAN_TYPE])).toBe('"test":true');
    });
    it("Testing SerializeNumberType", () => {
        expect(serializeFunctions[Constants.NUMBER_TYPE]("test", 10, serializers[Constants.NUMBER_TYPE])).toBe('"test":10');
    });
    it("Testing SerializeArrayType", () => {
        let struct: SerializationStructure = {
            id: undefined,
            type: Constants.ARRAY_TYPE,
            instance: [10, 20, 30],
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            // dependsOn: new Array<String>()
            visited: false
        }
        let moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.ARRAY_TYPE](struct, struct, 0);
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
            type: Constants.OBJECT_TYPE,
            instance: new TestSerializeObjectTypeSimpleClass(),
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            // dependsOn: new Array<String>()
            visited : false
        }
        let moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.OBJECT_TYPE](structSerializeObjectType, structSerializeObjectType, 0);
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
            type: Constants.OBJECT_TYPE,
            instance: new TestSerializeObjectTypeClassWithArray(),
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            // dependsOn: new Array<String>()
            visited : false
        }

        let moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.OBJECT_TYPE](structTestSerializeObjectTypeClassWithArray, structTestSerializeObjectTypeClassWithArray, 0);
        expect(moreFunction.length).toBe(1);
        expect(moreFunction[0].key).toBe("idsArray");
        // expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithArray.dependsOn[0]);
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
            type: Constants.OBJECT_TYPE,
            instance: new TestSerializeObjectTypeClassWithAnotherClass(),
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            // dependsOn: new Array<String>()
            visited: false
        }

        let testInstance: TestSerializeObjectTypeClassWithAnotherClass = new TestSerializeObjectTypeClassWithAnotherClass();

        let moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.OBJECT_TYPE](structTestSerializeObjectTypeClassWithAnotherClass, structTestSerializeObjectTypeClassWithAnotherClass, 0);
        expect(moreFunction.length).toBe(1);
        expect(getTypeNameFromInstance(moreFunction[0].instance.constructor)).toBe("simpleClass");
        // expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithAnotherClass.dependsOn[0]);
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
            type: Constants.OBJECT_TYPE,
            instance: instanceTestSerializeObjectTypeClassWithAnArrayOfClasses,
            parentIndex: 0,
            values: new Array<String>(),
            key: 'test',
            // dependsOn: new Array<String>()
            visited: false
        }

        let moreFunction: Array<SerializationStructure> = serializeFunctions[Constants.OBJECT_TYPE](structTestSerializeObjectTypeClassWithAnArrayOfClasses, structTestSerializeObjectTypeClassWithAnArrayOfClasses, 0);
        expect(moreFunction.length).toBe(1);
        expect(moreFunction[0].type).toBe("Array");
        // expect(moreFunction[0].id).toBe(structTestSerializeObjectTypeClassWithAnArrayOfClasses.dependsOn[0]);
        expect(moreFunction[0].instance).toBe(instanceTestSerializeObjectTypeClassWithAnArrayOfClasses.array);
    });
});

class simpleClass {
    id: number = Math.random();
}