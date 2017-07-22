/// <reference path="../../typings/index.d.ts"/>
import "reflect-metadata";
import { JsonProperty, JsonPropertyDecoratorMetadata, AccessType } from "../main/DecoratorMetadata";
import { getJsonPropertyDecoratorMetadata } from "../main/ReflectHelper";

describe("Testing JsonProperty decorator", () => {
    it("Test without any paramter", () => {
        class testObject1 {
            @JsonProperty()
            field: string;
        }

        var instance = new testObject1();
        let jsonPropertyDecoratorMetadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(instance, "field");
        expect(jsonPropertyDecoratorMetadata == undefined).toBe(true);
    });
    it("Test with name", () => {
        class testObject2 {
            @JsonProperty("Test")
            field: String = undefined;
        }

        var instance = new testObject2();
        let jsonPropertyDecoratorMetadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(instance, "field");
        expect(jsonPropertyDecoratorMetadata.name).toBe("Test");
    });

    it("Test with parameters", () => {
        class testObject3 {
            @JsonProperty({ required: true, access: AccessType.READ_ONLY })
            field: String = undefined;
        }

        var instance = new testObject3();
        let jsonPropertyDecoratorMetadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(instance, "field");
        expect(jsonPropertyDecoratorMetadata.name == undefined).toBe(true);
        expect(jsonPropertyDecoratorMetadata.required).toBe(true);
        expect(jsonPropertyDecoratorMetadata.access).toBe(AccessType.READ_ONLY);
    });
});
