import { JsonPropertyDecoratorMetadata, AccessType, Serializer, CacheKey } from "./DecoratorMetadata";
import { isArrayType, isSimpleType, getCachedType, getTypeNameFromInstance, getJsonPropertyDecoratorMetadata, getTypeName, getKeyName, Constants } from "./ReflectHelper";

export interface SerializationStructure {
    id: string, /** id of the current structure */
    type: string, /** 'object' or 'array */
    instance: any, /** Object instance to serialize */
    values: Array<String>, /** Array of current current instance's key value pairs */
    parentIndex: number, /** Parent's index position in the stack */
    key: string, /** the parent object's key name for this object instance. Options as it is not required for arrays */
    visited: boolean /** Indicates if this node has been visited or not */
}

export var SerializeArrayType = (parentStructure: SerializationStructure, instanceStructure: SerializationStructure, instanceIndex: number): Array<SerializationStructure> => {
    let furtherSerializationStructures: Object = new Object();
    let arrayInstance: Array<any> = instanceStructure.instance as Array<any>;
    instanceStructure.visited = true;
    arrayInstance.forEach((value: any) => {
        if (value != undefined) {
            if (!isSimpleType(typeof value)) {
                let struct: SerializationStructure = {
                    id: uniqueId(),
                    type: Constants.OBJECT_TYPE,
                    instance: value,
                    parentIndex: instanceIndex,
                    values: new Array<String>(),
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
}

var createArrayOfSerializationStructures = (serializationStructuresObject: Object) => {
    let serializationStructures: Array<SerializationStructure> = new Array<SerializationStructure>();
    Object.keys(serializationStructuresObject).forEach((key: string) => {
        serializationStructures.push(serializationStructuresObject[key]);
    })
    return serializationStructures;
}

export var serializeObject = (key: string, instanceValuesStack: Array<String>): string => {
    return (key != undefined ? '"' + key + '":' : '') + '{' + instanceValuesStack.join() + '}';
}

export var serializeArray = (key: string, instanceValuesStack: Array<String>): string => {
    return (key != undefined ? '"' + key + '":' : '') + '[' + instanceValuesStack.join() + ']';
}

export var mergeObjectOrArrayValuesAndCopyToParents = (instanceStructure: SerializationStructure, parentStructure: SerializationStructure): void => {
    mergeObjectOrArrayValues(instanceStructure);
    parentStructure.values.push(instanceStructure.values.pop());
}

export var mergeObjectOrArrayValues = (instanceStructure: SerializationStructure): void => {
    let mergedValue: string;
    if (instanceStructure.type === Constants.OBJECT_TYPE) {
        mergedValue = serializeObject(instanceStructure.key, instanceStructure.values);
    } else {
        mergedValue = serializeArray(instanceStructure.key, instanceStructure.values);
    }
    instanceStructure.values = [];
    instanceStructure.values.push(mergedValue);
}

export var SerializeObjectType = (parentStructure: SerializationStructure, instanceStructure: SerializationStructure, instanceIndex: number): Array<SerializationStructure> => {
    let furtherSerializationStructures: Object = new Object();
    instanceStructure.visited = true;
    Object.keys(instanceStructure.instance).forEach((key: string) => {
        let keyInstance = instanceStructure.instance[key];
        if (keyInstance != undefined) {
            let metadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(instanceStructure.instance, key);
            if (metadata != undefined && AccessType.READ_ONLY == metadata.access) {
                //SKIP
            } else if (metadata != undefined && metadata.serializer != undefined) {
                let serializer: Serializer = getOrCreateSerializer(metadata.serializer);
                instanceStructure.values.push(serializeFunctions[Constants.STRING_TYPE](getKeyName(instanceStructure.instance, key), keyInstance, serializer));
            } else {
                if (keyInstance instanceof Array) {
                    let struct: SerializationStructure = {
                        id: uniqueId(),
                        type: Constants.ARRAY_TYPE,
                        instance: keyInstance,
                        parentIndex: instanceIndex,
                        values: new Array<String>(),
                        key: getKeyName(instanceStructure.instance, key),
                        visited: false
                    };
                    furtherSerializationStructures[struct.id] = struct;
                } else if (!isSimpleType(typeof keyInstance)) {
                    let struct: SerializationStructure = {
                        id: uniqueId(),
                        type: Constants.OBJECT_TYPE,
                        instance: keyInstance,
                        parentIndex: instanceIndex,
                        values: new Array<String>(),
                        key: getKeyName(instanceStructure.instance, key),
                        visited: false
                    };
                    furtherSerializationStructures[struct.id] = struct;
                } else {
                    let serializer: Serializer = serializers[typeof keyInstance];
                    instanceStructure.values.push(serializeFunctions[typeof keyInstance](getKeyName(instanceStructure.instance, key), keyInstance, serializer));
                }
            }

        }


    });

    return createArrayOfSerializationStructures(furtherSerializationStructures);
}

/**
 * Serialize any type with key value pairs
 */
var SerializeSimpleType = (key: string, instance: any, serializer: Serializer): string => {
    let value: any = serializer.serialize(instance);
    if (key != undefined) {
        return '"' + key + '":' + value;
    } else {
        return value;
    }
}

@CacheKey("DateSerializer")
export class DateSerializer implements Serializer {
    serialize = (value: Date): number => {
        return value.getTime();
    }
}
@CacheKey("StringSerializer")
class StringSerializer implements Serializer {
    serialize = (value: string): string => {
        return '"' + value + '"';
    }
}
@CacheKey("NumberSerializer")
class NumberSerializer implements Serializer {
    serialize = (value: number): number => {
        return value;
    }
}
@CacheKey("BooleanSerializer")
class BooleanSerializer implements Serializer {
    serialize = (value: boolean): boolean => {
        return value;
    }
}

/**
 * Object to cache serializers
 */
export var serializers = new Object();
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
export var getOrCreateSerializer = (type: any): any => {
    return getCachedType(type, serializers);
}

export var serializeFunctions = [];
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


var uniqueId = (): string => {
    return Math.random() + "-" + Date.now();
}

