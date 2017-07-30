import { AccessType, CacheKey, JsonPropertyDecoratorMetadata, Serializer } from './DecoratorMetadata';
import { Constants, getCachedType, getJsonPropertyDecoratorMetadata, getKeyName, isSimpleType, METADATA_JSON_IGNORE_NAME, METADATA_JSON_PROPERTIES_NAME } from './ReflectHelper';

export interface SerializationStructure {
    id: string; /** id of the current structure */
    type: string; /** 'object' or 'array */
    instance: any; /** Object instance to serialize */
    values: Array<String>; /** Array of current current instance's key value pairs */
    parentIndex: number; /** Parent's index position in the stack */
    key: string; /** the parent object's key name for this object instance. Options as it is not required for arrays */
    visited: boolean; /** Indicates if this node has been visited or not */
}

export const SerializeArrayType = (parentStructure: SerializationStructure, instanceStructure: SerializationStructure, instanceIndex: number): Array<SerializationStructure> => {
    const furtherSerializationStructures: Object = {};
    const arrayInstance: Array<any> = instanceStructure.instance as Array<any>;
    instanceStructure.visited = true;
    arrayInstance.forEach((value: any) => {
        // tslint:disable-next-line:triple-equals
        if (value != undefined) {
            if (!isSimpleType(typeof value)) {
                const struct: SerializationStructure = {
                    id: uniqueId(),
                    type: Constants.OBJECT_TYPE,
                    instance: value,
                    parentIndex: instanceIndex,
                    values: [],
                    key: undefined,
                    visited: false
                };
                furtherSerializationStructures[struct.id] = struct;
            } else {
                instanceStructure.values.push(serializeFunctions[typeof value](undefined, value, serializers[typeof value]));
            }
        }
    });

    return createArrayOfSerializationStructures(furtherSerializationStructures);
};

const createArrayOfSerializationStructures = (serializationStructuresObject: Object) => {
    const serializationStructures: Array<SerializationStructure> = [];
    Object.keys(serializationStructuresObject).forEach((key: string) => {
        serializationStructures.push(serializationStructuresObject[key]);
    });
    return serializationStructures;
};

export const serializeObject = (key: string, instanceValuesStack: Array<String>): string => {
    // tslint:disable-next-line:triple-equals
    const json = (key != undefined ? `"${key}":` : '');
    return `${json}{${instanceValuesStack.join()}}`;
};

export const serializeArray = (key: string, instanceValuesStack: Array<String>): string => {
    // tslint:disable-next-line:triple-equals
    const json = (key != undefined ? `"${key}":` : '');
    return `${json}[${instanceValuesStack.join()}]`;
};

export const mergeObjectOrArrayValuesAndCopyToParents = (instanceStructure: SerializationStructure, parentStructure: SerializationStructure): void => {
    mergeObjectOrArrayValues(instanceStructure);
    parentStructure.values.push(instanceStructure.values.pop());
};

export const mergeObjectOrArrayValues = (instanceStructure: SerializationStructure): void => {
    let mergedValue: string;
    if (instanceStructure.type === Constants.OBJECT_TYPE) {
        mergedValue = serializeObject(instanceStructure.key, instanceStructure.values);
    } else {
        mergedValue = serializeArray(instanceStructure.key, instanceStructure.values);
    }
    instanceStructure.values = [];
    instanceStructure.values.push(mergedValue);
};

export const SerializeObjectType = (parentStructure: SerializationStructure, instanceStructure: SerializationStructure, instanceIndex: number): Array<SerializationStructure> => {
    const furtherSerializationStructures: Object = {};
    instanceStructure.visited = true;
    let objectKeys: string[] = Object.keys(instanceStructure.instance);
    objectKeys = objectKeys.concat((Reflect.getMetadata(METADATA_JSON_PROPERTIES_NAME, instanceStructure.instance) || []).filter((item: string) => {
        if (instanceStructure.instance.constructor.prototype.hasOwnProperty(item) && Object.getOwnPropertyDescriptor(instanceStructure.instance.constructor.prototype, item).get === undefined) {
            // Property does not have getter
            return false;
        }
        return objectKeys.indexOf(item) < 0;
    }));
    objectKeys = objectKeys.filter((item: string) => {
        return !Reflect.hasMetadata(METADATA_JSON_IGNORE_NAME, instanceStructure.instance, item);
    });
    objectKeys.forEach((key: string) => {
        const keyInstance = instanceStructure.instance[key];
        if (keyInstance !== undefined) {
            const metadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(instanceStructure.instance, key);
            // tslint:disable-next-line:triple-equals
            if (metadata != undefined && AccessType.READ_ONLY === metadata.access) {
                // SKIP
                // tslint:disable-next-line:triple-equals
            } else if (metadata != undefined && metadata.serializer != undefined) {
                const serializer: Serializer = getOrCreateSerializer(metadata.serializer);
                instanceStructure.values.push(serializeFunctions[Constants.STRING_TYPE](getKeyName(instanceStructure.instance, key), keyInstance, serializer));
            } else {
                if (keyInstance instanceof Array) {
                    const struct: SerializationStructure = {
                        id: uniqueId(),
                        type: Constants.ARRAY_TYPE,
                        instance: keyInstance,
                        parentIndex: instanceIndex,
                        values: [],
                        key: getKeyName(instanceStructure.instance, key),
                        visited: false
                    };
                    furtherSerializationStructures[struct.id] = struct;
                } else if (!isSimpleType(typeof keyInstance)) {
                    const struct: SerializationStructure = {
                        id: uniqueId(),
                        type: Constants.OBJECT_TYPE,
                        instance: keyInstance,
                        parentIndex: instanceIndex,
                        values: [],
                        key: getKeyName(instanceStructure.instance, key),
                        visited: false
                    };
                    furtherSerializationStructures[struct.id] = struct;
                } else {
                    const serializer: Serializer = serializers[typeof keyInstance];
                    instanceStructure.values.push(serializeFunctions[typeof keyInstance](getKeyName(instanceStructure.instance, key), keyInstance, serializer));
                }
            }

        }
    });

    return createArrayOfSerializationStructures(furtherSerializationStructures);
};

/**
 * Serialize any type with key value pairs
 */
const SerializeSimpleType = (key: string, instance: any, serializer: Serializer): string => {
    const value: any = serializer.serialize(instance);
    // tslint:disable-next-line:triple-equals
    if (key != undefined) {
        return `"${key}":${value}`;
    } else {
        return value;
    }
};

@CacheKey('DateSerializer')
export class DateSerializer implements Serializer {
    serialize = (value: Date): number => {
        return value.getTime();
    }
}

@CacheKey('StringSerializer')
class StringSerializer implements Serializer {
    serialize = (value: string): string => {
        return JSON.stringify(value);
    }
}

@CacheKey('NumberSerializer')
class NumberSerializer implements Serializer {
    serialize = (value: number): number => {
        return value;
    }
}

@CacheKey('BooleanSerializer')
class BooleanSerializer implements Serializer {
    serialize = (value: boolean): boolean => {
        return value;
    }
}

/**
 * Object to cache serializers
 */
export const serializers = {};
serializers[Constants.STRING_TYPE] = new StringSerializer();
serializers[Constants.NUMBER_TYPE] = new NumberSerializer();
serializers[Constants.DATE_TYPE] = new DateSerializer();
serializers[Constants.BOOLEAN_TYPE] = new BooleanSerializer();
serializers[Constants.STRING_TYPE_LOWERCASE] = serializers[Constants.STRING_TYPE];
serializers[Constants.NUMBER_TYPE_LOWERCASE] = serializers[Constants.NUMBER_TYPE];
serializers[Constants.DATE_TYPE_LOWERCASE] = serializers[Constants.DATE_TYPE];
serializers[Constants.BOOLEAN_TYPE_LOWERCASE] = serializers[Constants.BOOLEAN_TYPE];

/**
 * Checks to see if the serializer already exists or not.
 * If not, creates a new one and caches it, returns the
 * cached instance otherwise.
 */
export const getOrCreateSerializer = (type: any): any => {
    return getCachedType(type, serializers);
};

export const serializeFunctions = [];
serializeFunctions[Constants.STRING_TYPE] = SerializeSimpleType;
serializeFunctions[Constants.NUMBER_TYPE] = SerializeSimpleType;
serializeFunctions[Constants.BOOLEAN_TYPE] = SerializeSimpleType;
serializeFunctions[Constants.DATE_TYPE] = SerializeSimpleType;
serializeFunctions[Constants.ARRAY_TYPE] = SerializeArrayType;
serializeFunctions[Constants.OBJECT_TYPE] = SerializeObjectType;
serializeFunctions[Constants.STRING_TYPE_LOWERCASE] = SerializeSimpleType;
serializeFunctions[Constants.NUMBER_TYPE_LOWERCASE] = SerializeSimpleType;
serializeFunctions[Constants.BOOLEAN_TYPE_LOWERCASE] = SerializeSimpleType;
serializeFunctions[Constants.DATE_TYPE_LOWERCASE] = SerializeSimpleType;
serializeFunctions[Constants.ARRAY_TYPE_LOWERCASE] = SerializeArrayType;
serializeFunctions[Constants.OBJECT_TYPE_LOWERCASE] = SerializeObjectType;

const uniqueId = (): string => {
    return `${Math.random()}-${Date.now()}`;
};
