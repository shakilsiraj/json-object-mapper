/// <reference path="../../typings/index.d.ts"/>
import { JsonProperty, JsonPropertyDecoratorMetadata, AccessType } from "../main/DecoratorMetadata";
import { ObjectMapper } from "../main/index";

describe("Testing deserialize functions", () => {

    it("Testing Class type with no annotations and 0 children", () => {
        class NameTypeWithoutAnnotations {
            firstName: string = undefined;
            lastName: string = undefined;
            middleName: string = undefined;

            public getFirstName(): string {
                return this.firstName;
            }
        }
        var nameTypeWithoutAnnotationsJson = { firstName: 'John', middleName: 'P', lastName: 'Doe' };

        var processedDto: NameTypeWithoutAnnotations = ObjectMapper.deserialize(NameTypeWithoutAnnotations, nameTypeWithoutAnnotationsJson);
        expect(processedDto.getFirstName()).toBe('John');
        expect(processedDto.middleName).toBe('P');
        expect(processedDto.lastName).toBe('Doe');

    });

});


describe("Testing serialize functions", () => {
    it("Testing Class type with no annotations and 0 children", () => {

        var SimpleClassJson = {
            firstName: "John",
            middleName: "P",
            lastName: "Doe"
        };

        let stringrified: String = ObjectMapper.serialize(SimpleClassJson);
        expect(stringrified).toBe('{"firstName":"John","middleName":"P","lastName":"Doe"}');

    });

    it("Testing Class type with no annotations and an array", () => {

        class SimpleClass {
            firstName: string = "John";
            middleName: string = "P";
            lastName: string = "Doe";
            @JsonProperty({ type: String, name: "AKA" })
            knownAs: String[] = ["John", "Doe", "JohnDoe", "JohnPDoe"]
        };

        let intance: SimpleClass = new SimpleClass();

        let stringrified: String = ObjectMapper.serialize(intance);
        expect(stringrified).toBe('{"firstName":"John","middleName":"P","lastName":"Doe","AKA":["John","Doe","JohnDoe","JohnPDoe"]}');

    });
});