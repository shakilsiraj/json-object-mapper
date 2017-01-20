/**
 * Helper functions for JS reflections.
 */

import 'reflect-metadata';
import { JsonPropertyDecoratorMetadata, JSON_PROPERTY_DECORATOR_NAME } from './DecoratorMetadata';

/**
 * Returns the JsonProperty decorator metadata.
 */
export var getJsonPropertyDecoratorMetadata = (target: any, key: string): JsonPropertyDecoratorMetadata => {
    return Reflect.getMetadata(JSON_PROPERTY_DECORATOR_NAME, target, key);
}

/**
 * Returns the JsonProperty name (if any) associated with the object instance.
 * If any JsonProperty metadata found, it returns the key name as the name of the property.
 */
export var getKeyName = (target: any, key: string): string => {
    let metadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(target, key);
    if (metadata != undefined && metadata.name != undefined) {
        return metadata.name;
    } else {
        return key;
    }
}

/**
 * Returns the JsonPropertyDecoratorMetadata for the property
 */
export function getJsonPropertyDecorator(metadata: any) {
    return getPropertyDecorator(JSON_PROPERTY_DECORATOR_NAME, metadata);
}

export function getPropertyDecorator(metadataKey: string, metadata: any) {
    return Reflect.metadata(metadataKey, metadata);
}

/**
 * Checks to see if the specified type is a standard JS object type.
 */
export function isSimpleType(typeName: string): boolean {
    switch (typeName) {
        case Constants.STRING_TYPE: return true;
        case Constants.NUMBER_TYPE: return true;
        case Constants.BOOLEAN_TYPE: return true;
        case Constants.DATE_TYPE: return true;
        case Constants.STRING_TYPE_LOWERCASE: return true;
        case Constants.NUMBER_TYPE_LOWERCASE: return true;
        case Constants.BOOLEAN_TYPE_LOWERCASE: return true;
        case Constants.DATE_TYPE_LOWERCASE: return true;
        default: false;
    }
}

/**
 * Returns the the instance type name by looking at the constructor name.
 * Stupid IE does not have name property! Hence the hack.
 */
export function getTypeNameFromInstance(instance): string {
    return instance.toString().trim().split(/[\s\()]/g)[1];
}

function getType(instance: any, key: string): any {
    return Reflect.getMetadata('design:type', instance, key);
}

export function isArrayType(instance: any, key: string): boolean {
    return Array == getType(instance, key);
}

export function getTypeName(instance, key): string {
    let type = getType(instance, key);
    if (type != undefined) {
        return getTypeNameFromInstance(type);
    }
    return type;
}

export var Constants = {
    OBJECT_TYPE: "Object",
    OBJECT_TYPE_LOWERCASE: "object",
    STRING_TYPE: "String",
    STRING_TYPE_LOWERCASE: "string",
    NUMBER_TYPE: "Number",
    NUMBER_TYPE_LOWERCASE: "number",
    BOOLEAN_TYPE: "Boolean",
    BOOLEAN_TYPE_LOWERCASE: "boolean",
    DATE_TYPE: "Date",
    DATE_TYPE_LOWERCASE: "date",
    ARRAY_TYPE: "Array",
    ARRAY_TYPE_LOWERCASE: "array",
    FROM_ARRAY: "fromArray"
}

export var getCachedType = (type: any, cache: Object): any => {
    let typeName: string = getTypeNameFromInstance(type);
    if (!cache[typeName]) {
        cache[typeName] = new type();
    }
    return cache[typeName];
}