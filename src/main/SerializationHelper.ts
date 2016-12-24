
import { isArrayType, isSimpleType, getTypeNameFromInstance, getTypeName, getKeyName, Constants } from "./ReflectHelper";

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
                instanceStructure.values.push(serializeFunctions[typeof value](undefined, value));
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
                instanceStructure.values.push(serializeFunctions[typeof keyInstance](getKeyName(instanceStructure.instance, key), keyInstance));
            }
        }


    });

    return createArrayOfSerializationStructures(furtherSerializationStructures);
}

/**
 * Serialize any type with key value pairs
 */
var SerializeAnyType = (key: string, instance: any): string => {
    if (key != undefined) {
        return '"' + key + '":' + instance;
    } else {
        return instance;
    }
}

var SerializeStringType = (key: string, instance: string): string => {
    return SerializeAnyType(key, '"' + instance + '"');
}

var SerializeDateType = (key: string, instance: Date): string => {
    return SerializeAnyType(key, instance.getTime());
}

export var serializeFunctions = [];
serializeFunctions[Constants.STRING_TYPE] = SerializeStringType;
serializeFunctions[Constants.NUMBER_TYPE] = SerializeAnyType;
serializeFunctions[Constants.BOOLEAN_TYPE] = SerializeAnyType;
serializeFunctions[Constants.DATE_TYPE] = SerializeDateType;
serializeFunctions[Constants.ARRAY_TYPE] = SerializeArrayType;
serializeFunctions[Constants.OBJECT_TYPE] = SerializeObjectType;
serializeFunctions[Constants.STRING_TYPE_LOWERCASE] = SerializeStringType;
serializeFunctions[Constants.NUMBER_TYPE_LOWERCASE] = SerializeAnyType;
serializeFunctions[Constants.BOOLEAN_TYPE_LOWERCASE] = SerializeAnyType;
serializeFunctions[Constants.DATE_TYPE_LOWERCASE] = SerializeDateType;
serializeFunctions[Constants.ARRAY_TYPE_LOWERCASE] = SerializeArrayType;
serializeFunctions[Constants.OBJECT_TYPE_LOWERCASE] = SerializeObjectType;


var uniqueId = (): string => {
    return Math.random() + "-" + Date.now();
}

