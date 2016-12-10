
import { isArrayType, isSimpleType, getTypeNameFromInstance, getTypeName, getKeyName } from "./ReflectHelper";

export interface SerializationStructure {
    id: string, /** id of the current structure */
    type: string, /** 'object' or 'array */
    instance: any, /** Object instance to serialize */
    values: Array<String>, /** Array of current current instance's key value pairs */
    parentIndex: number, /** Parent's index position in the stack */
    key: string, /** the parent object's key name for this object instance. Options as it is not required for arrays */
    dependsOn: Array<String> /** List of more structure ids which needs to be finished before this object can be fully serialized */
}

export var SerializeArrayType = (parentStructure: SerializationStructure, instanceStructure: SerializationStructure, instanceIndex: number): Array<SerializationStructure> => {
    let furtherSerializationStructures: Object = new Object();
    let arrayInstance: Array<any> = instanceStructure.instance as Array<any>;
    arrayInstance.forEach((value: any) => {
        if (value != undefined) {
            if (!isSimpleType(typeof value)) {
                let struct: SerializationStructure = {
                    id: uniqueId(),
                    type: 'object',
                    instance: value,
                    parentIndex: instanceIndex,
                    values: new Array<String>(),
                    key: undefined,
                    dependsOn: new Array<String>()
                };
                parentStructure.dependsOn.push(struct.id);
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

export var mergeObjectOrArrayValues = (instanceStructure: SerializationStructure): void => {
    let mergedValue: string;
    if (instanceStructure.type === 'object') {
        mergedValue = serializeObject(instanceStructure.key, instanceStructure.values);
    } else {
        mergedValue = serializeArray(instanceStructure.key, instanceStructure.values);
    }
    instanceStructure.values = [];
    instanceStructure.values.push(mergedValue);
}

export var SerializeObjectType = (parentStructure: SerializationStructure, instanceStructure: SerializationStructure, instanceIndex: number): Array<SerializationStructure> => {
    let furtherSerializationStructures: Object = new Object();
    Object.keys(instanceStructure.instance).forEach((key: string) => {
        let keyInstance = instanceStructure.instance[key];
        if (keyInstance != undefined) {
            if (isArrayType(instanceStructure.instance, key)) {
                let struct: SerializationStructure = {
                    id: uniqueId(),
                    type: 'array',
                    instance: keyInstance,
                    parentIndex: instanceIndex,
                    values: new Array<String>(),
                    key: getKeyName(instanceStructure.instance, key),
                    dependsOn: new Array<String>()
                };
                parentStructure.dependsOn.push(struct.id);
                furtherSerializationStructures[struct.id] = struct;
            } else if (!isSimpleType(typeof keyInstance)) {
                let struct: SerializationStructure = {
                    id: uniqueId(),
                    type: 'object',
                    instance: keyInstance,
                    parentIndex: instanceIndex,
                    values: new Array<String>(),
                    key: getKeyName(instanceStructure.instance, key),
                    dependsOn: new Array<String>()
                };
                parentStructure.dependsOn.push(struct.id);
                furtherSerializationStructures[struct.id] = struct;
            } else {
                parentStructure.values.push(serializeFunctions[typeof keyInstance](getKeyName(instanceStructure.instance, key), keyInstance));
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
serializeFunctions['string'] = SerializeStringType;
serializeFunctions['number'] = SerializeAnyType;
serializeFunctions['boolean'] = SerializeAnyType;
serializeFunctions['date'] = SerializeDateType;
serializeFunctions['array'] = SerializeArrayType;
serializeFunctions['object'] = SerializeObjectType;


var uniqueId = (): string => {
    return Math.random() + "-" + Date.now();
}

