import { getJsonPropertyDecorator, getPropertyDecorator, Constants } from "./ReflectHelper";

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
    name?: string,
    required?: boolean,
    access?: AccessType,
    type?: any
}

export enum AccessType {
    READ_ONLY, WRITE_ONLY, BOTH
}

/**
 * JsonProperty Decorator function.
 */
export function JsonProperty(metadata?: JsonPropertyDecoratorMetadata): any {
    if (typeof metadata === 'string') {
        return getJsonPropertyDecorator({ name: metadata as string, required: false, access: AccessType.BOTH });
    } else {
        return getJsonPropertyDecorator(metadata);
    }
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