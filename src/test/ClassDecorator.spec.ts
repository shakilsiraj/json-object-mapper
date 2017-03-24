/// <reference path="../../typings/index.d.ts"/>
import { JsonProperty, JsonPropertyDecoratorMetadata, AccessType, Serializer, Deserializer } from "../main/DecoratorMetadata";
import { getOrCreateDeserializer, deserializers } from "../main/DeserializationHelper";
import { getOrCreateSerializer, serializers } from "../main/SerializationHelper";
import { CacheKey } from "../main/DecoratorMetadata";
describe("CacheKey Decororator tests", () => {

    it("Testing getJsonObjectMapperCacheKey()", () => {

        @CacheKey("TestCacheKey")
        class TestClassDecorator{
        }

        expect(TestClassDecorator["getJsonObjectMapperCacheKey"]).toBeDefined();
        expect(TestClassDecorator["getJsonObjectMapperCacheKey"]()).toBe("TestCacheKey");
    });

    it("Testing Serializer key names are properly used", () => {
        
        @CacheKey("TestSerailizerCacheKey")
        class TestSerailizer implements Serializer {
            serialize = (value: any): any => {

            }
        }

        let serializerInstance: TestSerailizer = getOrCreateSerializer(TestSerailizer);
        expect(serializers["TestSerailizerCacheKey"]).toBeDefined();
        expect(serializers["TestSerailizerCacheKey"]).toBe(serializerInstance);
    });

    it("Testing DeSerializer key names are properly used", () => {
        @CacheKey("TestDeserailizerCacheKey")
        class TestDeserializer implements Deserializer {
            deserialize = (value: any): any => {

            }
        }

        let deserializerInstance: TestDeserializer = getOrCreateDeserializer(TestDeserializer);
        expect(deserializers["TestDeserailizerCacheKey"]).toBeDefined();
        expect(deserializers["TestDeserailizerCacheKey"]).toBe(deserializerInstance);

    });

    it("Testing both Serializer and DeSerializer key names are properly used", () => {
        @CacheKey("TestSerializerDeserializerCacheKey")
        class TestSerializerDeserializer implements Serializer, Deserializer {
            deserialize = (value: any): any => {

            }
            serialize = (value: any): any => {

            }
        }

        let instance: TestSerializerDeserializer = getOrCreateDeserializer(TestSerializerDeserializer);
        expect(deserializers["TestSerializerDeserializerCacheKey"]).toBeDefined();
        expect(deserializers["TestSerializerDeserializerCacheKey"]).toBe(instance);

        instance = getOrCreateSerializer(TestSerializerDeserializer);
        expect(serializers["TestSerializerDeserializerCacheKey"]).toBeDefined();
        expect(serializers["TestSerializerDeserializerCacheKey"]).toBe(instance);

    });

});