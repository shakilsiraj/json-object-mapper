import 'reflect-metadata';
import { AccessType, JsonProperty, JsonPropertyDecoratorMetadata } from '../main/DecoratorMetadata';
import { DeserializeArrayType, DeserializeComplexType, DeserializeDateType, DeserializeSimpleType } from '../main/DeserializationHelper';

describe('Testing Conversion functions', () => {
    it('Test DeserializeSimpleType case - String', () => {
        class TestObject5 {
            field: string = undefined;
        }

        const instance = new TestObject5();

        const jsonTest = {};
        jsonTest['name'] = 'Shakil';

        const moreFunctionsList = DeserializeSimpleType(instance, 'field', 'String', jsonTest, 'name');
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field).toBe('Shakil');
    });

    it('Test DeserializeSimpleType case - boolean', () => {
        class TestObject6 {
            field: boolean = undefined;
        }

        const instance = new TestObject6();

        const jsonTest = {};
        jsonTest['booleanType'] = true;

        const moreFunctionsList = DeserializeSimpleType(instance, 'field', 'Boolean', jsonTest, 'booleanType');
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field).toBe(true);
    });

    it('Test DeserializeSimpleType case - number', () => {
        class TestObject7 {
            field: number = undefined;
        }

        const instance = new TestObject7();

        const jsonTest = {};
        jsonTest['numberType'] = 12345;

        const moreFunctionsList = DeserializeSimpleType(instance, 'field', 'Number', jsonTest, 'numberType');
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field).toBe(12345);
    });

    it('Test DeserializeSimpleType case - date', () => {
        class TestObject8 {
            field: Date = undefined;
        }

        const instance = new TestObject8();

        const jsonTest = {};
        jsonTest['dateType'] = '05/08/2013';

        const moreFunctionsList = DeserializeDateType(instance, 'field', 'Date', jsonTest, 'dateType');
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field.getTime()).toBe((new Date('05/08/2013')).getTime());
    });

    it('Test DeserializeSimpleType case - UTC date', () => {
        class TestObject81 {
            field: Date = undefined;
        }

        const instance = new TestObject81();

        const jsonTest = {};
        jsonTest['dateType'] = 1333065600000;

        const moreFunctionsList = DeserializeDateType(instance, 'field', 'Date', jsonTest, 'dateType');
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field.getFullYear()).toBe(2012);
        expect(instance.field.getMonth()).toBe(2);
        expect(instance.field.getDate()).toBe(30);
    });

    it('Test DeserializeArrayType - simple type array ', () => {
        class TestObject9 {
            field: string[] = undefined;
        }

        const jsonArray = ['Test', 'Test1', 'Test2'];
        const json = { field: jsonArray };

        const testInstance = new TestObject9();

        const moreFunctionsList = DeserializeArrayType(testInstance, 'field', String, json, 'field');
        expect(moreFunctionsList.length).toBe(0);
        expect(testInstance.field.length).toBe(3);
    });

    it('Test DeserializeArrayType - complex type array ', () => {
        class Test1 {
            f: number = Math.random();
        }
        class TestObject10 {
            field: Test1[] = undefined;
        }

        const jsonArray = [new Test1(), new Test1(), new Test1()];
        const json = { objects: jsonArray };
        const testInstance = new TestObject10();

        const moreFunctionsList = DeserializeArrayType(testInstance, 'field', Test1, json, 'objects');
        expect(moreFunctionsList.length).toBe(3);
        expect(testInstance.field.length).toBe(3);
    });

    it('Test DeserializeArrayType - undefined array ', () => {
        class ComplexType {
            f: number = Math.random();
        }
        class TestObject10 {
            field1: ComplexType[];
            field2: string[];
        }

        const json = { 'objects': [] };
        const testInstance1 = new TestObject10();
        const testInstance2 = new TestObject10();

        const moreFunctionsList1 = DeserializeArrayType(testInstance1, 'field1', ComplexType, json, 'objects');
        const moreFunctionsList2 = DeserializeArrayType(testInstance1, 'field2', String, json, 'objects');
        const moreFunctionsList3 = DeserializeArrayType(testInstance2, 'field1', ComplexType, {}, 'objects');
        const moreFunctionsList4 = DeserializeArrayType(testInstance2, 'field2', String, {}, 'objects');

        expect(moreFunctionsList1.length).toBe(0);
        expect(moreFunctionsList2.length).toBe(0);
        expect(moreFunctionsList3.length).toBe(0);
        expect(moreFunctionsList4.length).toBe(0);
        expect(Array.isArray(testInstance1.field1)).toBe(true);
        expect(Array.isArray(testInstance1.field2)).toBe(true);
        expect(Array.isArray(testInstance2.field1)).toBe(true);
        expect(Array.isArray(testInstance2.field2)).toBe(true);
        expect(testInstance1.field1.length).toBe(0);
        expect(testInstance1.field2.length).toBe(0);
        expect(testInstance2.field1.length).toBe(0);
        expect(testInstance2.field2.length).toBe(0);
    });

    it('Test DeserializeComplexType - simple class ', () => {
        class DeserializeComplexTypeSimpleClassTest {
            @JsonProperty()
            firstname: string = undefined;
            @JsonProperty()
            lastname: string = undefined;
            middlename: string = undefined;
        }

        const json = { 'firstname': 'John', 'lastname': 'Doe', middlename: 'P' };
        const testInstance = new DeserializeComplexTypeSimpleClassTest();

        const moreFunctionsList = DeserializeComplexType(testInstance, undefined, DeserializeComplexTypeSimpleClassTest, json, undefined);
        expect(moreFunctionsList.length).toBe(0);
        expect(testInstance.firstname).toBe('John');
        expect(testInstance.lastname).toBe('Doe');
        expect(testInstance.middlename).toBe('P');
    });

    it('Test DeserializeComplexType - complex class ', () => {
        class DeserializeComplexTypeComplexClass {
            honorifics: string = undefined;
        }

        class DeserializeComplexTypeComplexClassTest {
            @JsonProperty()
            firstname: string = undefined;
            @JsonProperty()
            lastname: string = undefined;
            middlename: string = undefined;
            @JsonProperty({ type: DeserializeComplexTypeComplexClass })
            title: DeserializeComplexTypeComplexClass = undefined;
        }

        const json = { firstname: 'John', lastname: 'Doe', middlename: 'P', title: { honorifics: 'Mr' } };
        const testInstance = new DeserializeComplexTypeComplexClassTest();

        const moreFunctionsList = DeserializeComplexType(testInstance, undefined, DeserializeComplexTypeComplexClassTest, json, undefined);
        expect(moreFunctionsList.length).toBe(1);
        expect(testInstance.firstname).toBe('John');
        expect(testInstance.lastname).toBe('Doe');
        expect(testInstance.middlename).toBe('P');
    });

    it('Test DeserializeComplexType - complex array class ', () => {
        class ZipCodesObject {
            zip: string = undefined;
            name: string = undefined;
        }

        class DeserializeComplexTypeArrayTest {
            storeName: string = undefined;
            @JsonProperty({ type: ZipCodesObject })
            availableAt: ZipCodesObject[] = undefined;

        }

        const json = { storeName: 'PizzaHut', availableAt: [{ zip: '2000', name: 'Sydney' }, { zip: '1871', name: 'Liverpool' }, { zip: '2600', name: 'Canberra' }] };
        const testInstance = new DeserializeComplexTypeArrayTest();

        const moreFunctionsList = DeserializeComplexType(testInstance, undefined, DeserializeComplexTypeArrayTest, json, undefined);
        expect(moreFunctionsList.length).toBe(3);
        expect(testInstance.availableAt.length).toBe(3);
    });

    it('Test DeserializeComplexType - simple array class ', () => {
        class DeserializeComplexTypeArrayTest1 {
            @JsonProperty()
            storeName: string = undefined;

            @JsonProperty()
            availableAt: String[] = undefined;

        }

        const json = { storeName: 'PizzaHut', availableAt: ['2000', '3000', '4000', '5000'] };
        const testInstance = new DeserializeComplexTypeArrayTest1();

        const moreFunctionsList = DeserializeComplexType(testInstance, undefined, DeserializeComplexTypeArrayTest1, json, undefined);
        expect(moreFunctionsList.length).toBe(0);
        expect(testInstance.availableAt.length).toBe(4);
    });

    it('Test DeserializeComplexType - Date array class ', () => {
        class DeserializeComplexTypeDateArray {
            @JsonProperty({ type: Date })
            dates: Date[] = undefined;
        }

        const json = { dates: [(new Date('04/02/2008')).getTime(), (new Date('05/2/2008')).getTime(), (new Date('04/02/2009')).getTime()] };
        const testDateArrayInstance = new DeserializeComplexTypeDateArray();
        const moreFunctionsList = DeserializeComplexType(testDateArrayInstance, undefined, DeserializeComplexTypeDateArray, json, undefined);
        expect(moreFunctionsList.length).toBe(0);
        expect(testDateArrayInstance.dates[0].getTime()).toBe((new Date('04/02/2008')).getTime());
    });
});
