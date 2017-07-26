import { AccessType, JsonProperty, JsonPropertyDecoratorMetadata } from '../main/DecoratorMetadata';
import { getJsonPropertyDecoratorMetadata } from '../main/ReflectHelper';

describe('Testing JsonProperty decorator', () => {
    it('Test without any paramter', () => {
        class TestObject1 {
            @JsonProperty()
            field: string;
        }

        const instance = new TestObject1();
        const jsonPropertyDecoratorMetadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(instance, 'field');
        expect(jsonPropertyDecoratorMetadata === undefined).toBe(true);
    });
    it('Test with name', () => {
        class TestObject2 {
            @JsonProperty('Test')
            field: String = undefined;
        }

        const instance = new TestObject2();
        const jsonPropertyDecoratorMetadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(instance, 'field');
        expect(jsonPropertyDecoratorMetadata.name).toBe('Test');
    });

    it('Test with parameters', () => {
        class TestObject3 {
            @JsonProperty({ required: true, access: AccessType.READ_ONLY })
            field: String = undefined;
        }

        const instance = new TestObject3();
        const jsonPropertyDecoratorMetadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(instance, 'field');
        expect(jsonPropertyDecoratorMetadata.name === undefined).toBe(true);
        expect(jsonPropertyDecoratorMetadata.required).toBe(true);
        expect(jsonPropertyDecoratorMetadata.access).toBe(AccessType.READ_ONLY);
    });
});
