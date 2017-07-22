import { getJsonPropertyDecorator, getPropertyDecorator, getJsonIgnoreDecorator, Constants } from "./ReflectHelper";

/**
 * Decorator names
 */
export const JSON_PROPERTY_DECORATOR_NAME = "JsonProperty";
// const JSON_IGNORE_DECORATOR_NAME = "JsonIgnore";
// const JSON_SERAIALIZE_DECORATOR_NAME = "JsonSerialize";
// const JSON_DESERAIALIZE_DECORATOR_NAME = "JsonDeserialize";



/**
 * Decorator metadata definition for JsonProperty
 */
export interface JsonPropertyDecoratorMetadata {
    name?: string, //name of the JSON property to map
    required?: boolean, //is this field required in the JSON object that is being deserialized
    access?: AccessType, //is this serializable and de-serializable
    type?: any //the type of Object that should be assigned to this property
    serializer?: any, //Serializer for the type
    deserializer?: any // deserializer for the type
}

export enum AccessType {
    READ_ONLY, WRITE_ONLY, BOTH
}

export interface Serializer{
    serialize(value: any): any;
}

export interface Deserializer{
    deserialize(value: any): any;
}

/**
 * JsonProperty Decorator function.
 */
export function JsonProperty(metadata?: JsonPropertyDecoratorMetadata | string): any {
    if (typeof metadata === 'string') {
        return getJsonPropertyDecorator({ name: metadata as string, required: false, access: AccessType.BOTH });
    } else {
        return getJsonPropertyDecorator(metadata);
    }
}

/**
 * Decorator for specifying cache key.
 * Used for Serializer/Deserializer caching.
 * 
 * @export
 * @param {string} key 
 * @returns 
 */
export function CacheKey(key: string): Function {
    return function (f: Function) {
        var functionName = "getJsonObjectMapperCacheKey";
        var functionImpl = new Function("return '" + key + "';");
        f[functionName] = functionImpl;
    }
}

/**
 * JsonIgnore Decorator function.
 */
export function JsonIgnore(): Function {
    return getJsonIgnoreDecorator();
}

/**
 * Json convertion error type.
 */
export function JsonConverstionError(message, json) {
    this.json = json;
    this.message = message;
    this.stack = (new Error()).stack;
}
JsonConverstionError.prototype = new Error; 
