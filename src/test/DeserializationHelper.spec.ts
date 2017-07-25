import "reflect-metadata";
import { DeserializeSimpleType, DeserializeArrayType, DeserializeDateType, DeserializeComplexType } from "../main/DeserializationHelper";
import { JsonProperty, JsonPropertyDecoratorMetadata, AccessType } from "../main/DecoratorMetadata";

describe("Testing Conversion functions", () => {
    it("Test DeserializeSimpleType case - String", () => {
        class testObject5 {
            field: string = undefined;
        }

        var instance = new testObject5();

        var jsonTest = new Object();
        jsonTest['name'] = 'Shakil';


        var moreFunctionsList = DeserializeSimpleType(instance, "field", "String", jsonTest, "name");
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field).toBe('Shakil');
    });

    it("Test DeserializeSimpleType case - boolean", () => {
        class testObject6 {
            field: boolean = undefined;
        }

        var instance = new testObject6();

        var jsonTest = new Object();
        jsonTest['booleanType'] = true;


        var moreFunctionsList = DeserializeSimpleType(instance, "field", "Boolean", jsonTest, "booleanType");
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field).toBe(true);
    });

    it("Test DeserializeSimpleType case - number", () => {
        class testObject7 {
            field: number = undefined;
        }

        var instance = new testObject7();

        var jsonTest = new Object();
        jsonTest['numberType'] = 12345;


        var moreFunctionsList = DeserializeSimpleType(instance, "field", "Number", jsonTest, "numberType");
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field).toBe(12345);
    });
    it("Test DeserializeSimpleType case - date", () => {
        class testObject8 {
            field: Date = undefined;
        }

        var instance = new testObject8();

        var jsonTest = new Object();
        jsonTest['dateType'] = '05/08/2013';


        var moreFunctionsList = DeserializeDateType(instance, "field", "Date", jsonTest, "dateType");
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field.getTime()).toBe((new Date('05/08/2013')).getTime());
    });
    it("Test DeserializeSimpleType case - UTC date", () => {
        class testObject81 {
            field: Date = undefined;
        }

        var instance = new testObject81();

        var jsonTest = new Object();
        jsonTest['dateType'] = 1333065600000;


        var moreFunctionsList = DeserializeDateType(instance, "field", "Date", jsonTest, "dateType");
        expect(moreFunctionsList.length).toBe(0);
        expect(instance.field.getFullYear()).toBe(2012);
        expect(instance.field.getMonth()).toBe(2);
        expect(instance.field.getDate()).toBe(30);
    });
    it("Test DeserializeArrayType - simple type array ", () => {
        class testObject9 {
            field: string[] = undefined;
        }

        var jsonArray = ["Test", "Test1", "Test2"];
        var json = { field: jsonArray };

        var testInstance = new testObject9();

        var moreFunctionsList = DeserializeArrayType(testInstance, "field", String, json, 'field');
        expect(moreFunctionsList.length).toBe(0);
        expect(testInstance.field.length).toBe(3);
    });
    it("Test DeserializeArrayType - complex type array ", () => {
        class test1 {
            f: number = Math.random();
        }
        class testObject10 {
            field: test1[] = undefined;
        }

        var jsonArray = [new test1(), new test1(), new test1()];
        var json = { objects: jsonArray }
        var testInstance = new testObject10();

        var moreFunctionsList = DeserializeArrayType(testInstance, "field", test1, json, "objects");
        expect(moreFunctionsList.length).toBe(3);
        expect(testInstance.field.length).toBe(3);
    });

    it("Test DeserializeArrayType - undefined array ", () => {
        class ComplexType {
            f: number = Math.random();
        }
        class testObject10 {
            field1: ComplexType[];
            field2: string[];
        }

        var json = { 'objects': [] }
        var testInstance1 = new testObject10();
        var testInstance2 = new testObject10();

        var moreFunctionsList1 = DeserializeArrayType(testInstance1, "field1", ComplexType, json, "objects");
        var moreFunctionsList2 = DeserializeArrayType(testInstance1, "field2", String, json, "objects");
        var moreFunctionsList3 = DeserializeArrayType(testInstance2, "field1", ComplexType, {}, "objects");
        var moreFunctionsList4 = DeserializeArrayType(testInstance2, "field2", String, {}, "objects");

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

    it("Test DeserializeComplexType - simple class ", () => {
        class DeserializeComplexTypeSimpleClassTest {
            @JsonProperty()
            firstname: string = undefined;
            @JsonProperty()
            lastname: string = undefined;
            middlename: string = undefined;
        }


        var json = { 'firstname': 'John', 'lastname': 'Doe', middlename: 'P' };
        var testInstance = new DeserializeComplexTypeSimpleClassTest();

        var moreFunctionsList = DeserializeComplexType(testInstance, undefined, DeserializeComplexTypeSimpleClassTest, json, undefined);
        expect(moreFunctionsList.length).toBe(0);
        expect(testInstance.firstname).toBe('John');
        expect(testInstance.lastname).toBe('Doe');
        expect(testInstance.middlename).toBe('P');
    });

    it("Test DeserializeComplexType - complex class ", () => {
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


        var json = { firstname: 'John', lastname: 'Doe', middlename: 'P', title: { honorifics: 'Mr' } };
        var testInstance = new DeserializeComplexTypeComplexClassTest();

        var moreFunctionsList = DeserializeComplexType(testInstance, undefined, DeserializeComplexTypeComplexClassTest, json, undefined);
        expect(moreFunctionsList.length).toBe(1);
        expect(testInstance.firstname).toBe('John');
        expect(testInstance.lastname).toBe('Doe');
        expect(testInstance.middlename).toBe('P');
    });

    it("Test DeserializeComplexType - complex array class ", () => {
        class ZipCodesObject {
            zip: string = undefined;
            name: string = undefined;
        }

        class DeserializeComplexTypeArrayTest {
            storeName: string = undefined;
            @JsonProperty({ type: ZipCodesObject })
            availableAt: ZipCodesObject[] = undefined;

        }


        var json = { storeName: 'PizzaHut', availableAt: [{ zip: '2000', name: 'Sydney' }, { zip: '1871', name: 'Liverpool' }, { zip: '2600', name: 'Canberra' }] };
        var testInstance = new DeserializeComplexTypeArrayTest();

        var moreFunctionsList = DeserializeComplexType(testInstance, undefined, DeserializeComplexTypeArrayTest, json, undefined);
        expect(moreFunctionsList.length).toBe(3);
        expect(testInstance.availableAt.length).toBe(3);
    });

    it("Test DeserializeComplexType - simple array class ", () => {

        class DeserializeComplexTypeArrayTest1 {
            @JsonProperty()
            storeName: string = undefined;

            @JsonProperty()
            availableAt: String[] = undefined;

        }


        var json = { storeName: 'PizzaHut', availableAt: ['2000', '3000', '4000', '5000'] };
        var testInstance = new DeserializeComplexTypeArrayTest1();

        var moreFunctionsList = DeserializeComplexType(testInstance, undefined, DeserializeComplexTypeArrayTest1, json, undefined);
        expect(moreFunctionsList.length).toBe(0);
        expect(testInstance.availableAt.length).toBe(4);
    });


    it("Test DeserializeComplexType - Date array class ", () => {
        class DeserializeComplexTypeDateArray {
            @JsonProperty({ type: Date })
            dates: Date[] = undefined;
        }

        var json = { dates: [(new Date('04/02/2008')).getTime(), (new Date('05/2/2008')).getTime(), (new Date('04/02/2009')).getTime()] };
        var testDateArrayInstance = new DeserializeComplexTypeDateArray();
        var moreFunctionsList = DeserializeComplexType(testDateArrayInstance, undefined, DeserializeComplexTypeDateArray, json, undefined);
        expect(moreFunctionsList.length).toBe(0);
        expect(testDateArrayInstance.dates[0].getTime()).toBe((new Date('04/02/2008')).getTime());
    });

    
});
