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
    if (metadata != undefined) {
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
        case 'string': return true;
        case 'number': return true;
        case 'boolean': return true;
        case 'date': return true;
        default: false;
    }
}

/**
 * Returns the the instance type name by looking at the constructor name.
 */
export function getTypeNameFromInstance(instance): string {
    var type = Object.getOwnPropertyDescriptor(instance, 'name')
    if (type && type.value) {
        return type.value.toLowerCase();
    } else {
        return undefined;
    }
    // return instance.constructor['name'].toLowerCase();
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
        return type.name.toLowerCase();
    }
    return type;
}
