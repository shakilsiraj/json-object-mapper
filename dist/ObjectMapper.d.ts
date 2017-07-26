
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
export declare function JsonProperty(metadata?: JsonPropertyDecoratorMetadata): any;

/**
 * Decorator for specifying cache key.
 * Used for Serializer/Deserializer caching.
 * 
 * @export
 * @param {string} key 
 * @returns 
 */
export function CacheKey(key: string): Function;

/**
 * JsonIgnore Decorator function.
 */
export declare function JsonIgnore(): any;

/**
 * Json convertion error type.
 */
export declare function JsonConverstionError(message: string, json: any): Error;

export declare namespace ObjectMapper {

    /**
     * Deserializes a Object type with the passed on JSON data.
     */
    export function deserialize<T>(type: { new (): T }, json: Object): T;

    /**
     * Deserializes an array of object types with the passed on JSON data.
     */
    export function deserializeArray<T>(type: { new (): T }, json: Object): T[];

    /**
     * Serializes an object instance to JSON string.
     */
    export function serialize(obj: any): String;
    
}

/**
 * Default Date serializer implementation.
 * 
 * @class DateSerializer
 * @implements {Serializer}
 */
export declare class DateSerializer implements Serializer {
    public serialize(value: Date): number;
}

