import { JsonConverstionError, JsonPropertyDecoratorMetadata, AccessType } from "./DecoratorMetadata";
import { isSimpleType, getTypeName, getTypeNameFromInstance, getJsonPropertyDecoratorMetadata, isArrayType } from "./ReflectHelper";

var SimpleTypeCoverter = (value: any, type: string): any => {
    return type === 'date' ? new Date(value) : value;
}

/**
 * Deserializes a standard js object type(string, number and boolean) from json. 
 */
export var DeserializeSimpleType = (instance: Object, instanceKey: string, type: any, json: any, jsonKey: string) => {
    try {
        instance[instanceKey] = json[jsonKey];
        return [];
    } catch (e) {
        throw new JsonConverstionError("Property '" + instanceKey + "' of " + instance.constructor["name"] + " does not match datatype of " + jsonKey, json);
    }
}

/**
 * Deserializes a standard js Date object type from json. 
 */
export var DeserializeDateType = (instance: Object, instanceKey: string, type: any, json: any, jsonKey: string): Array<ConversionFunctionStructure> => {
    try {
        instance[instanceKey] = new Date(json[jsonKey]);
        return [];
    } catch (e) {
        throw new JsonConverstionError("Property '" + instanceKey + "' of " + instance.constructor["name"] + " does not match datatype of " + jsonKey, json);
    }
}

/** 
 * Deserializes a JS array type from json.
 */
export var DeserializeArrayType = (instance: Object, instanceKey: string, type: any, json: Object, jsonKey: string): Array<ConversionFunctionStructure> => {
    let jsonArraySize = json[jsonKey].length;
    let conversionFunctionsList = new Array<ConversionFunctionStructure>();
    if (jsonArraySize > 0) {
        let arrayInstance = [];
        instance[instanceKey] = arrayInstance;
        for (var i = 0; i < jsonArraySize; i++) {
            let typeName = getTypeNameFromInstance(type);
            if (!isSimpleType(typeName)) {
                let typeInstance = new type();
                conversionFunctionsList.push({ functionName: 'object', instance: typeInstance, json: json[jsonKey][i] });
                arrayInstance.push(typeInstance);
            } else {
                arrayInstance.push(conversionFunctions['fromArray'](json[jsonKey][i], typeName));
            }
        }
    }
    return conversionFunctionsList;
}

/**
 * Deserializes a js object type from json. 
 */
export var DeserializeComplexType = (instance: Object, instanceKey: string, type: any, json: any, jsonKey: string): Array<ConversionFunctionStructure> => {
    let conversionFunctionsList = new Array<ConversionFunctionStructure>();

    let objectInstance;
    /**
     * If instanceKey is not passed on then it's the first iteration of the functions.
     */

    if (instanceKey != undefined) {
        objectInstance = new type();
        instance[instanceKey] = objectInstance;
    } else {
        objectInstance = instance;
    }

    Object.keys(objectInstance).forEach((key: string) => {
        /**
         * Check if there is any DecoratorMetadata attached to this property, otherwise create a new one.
         */
        let metadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(objectInstance, key);
        if (metadata === undefined) {
            metadata = { name: key, required: false, access: AccessType.BOTH };
        }
        /**
         * Check requried property
         */
        if (metadata.required && json[metadata.name] === undefined) {
            throw new JsonConverstionError("JSON structure does have have required property '"
                + metadata.name + "' as required by '" + getTypeNameFromInstance(objectInstance)
                + "[" + key + "]", json);
        }

        let jsonKeyName = metadata.name != undefined ? metadata.name : key;

        if (json[jsonKeyName] != undefined) {
            if (metadata.type === undefined) {
                /**
                * If we do not have any type defined, then we can't do much here but to hope for the best.
                */
                objectInstance[key] = json[jsonKeyName];
            } else {
                if (!isArrayType(objectInstance, key)) {
                    let typeName = getTypeName(objectInstance, key);
                    if (!isSimpleType(typeName)) {
                        objectInstance[key] = new metadata.type();;
                        conversionFunctionsList.push({ functionName: 'object', type: metadata.type, instance: objectInstance[key], json: json[jsonKeyName] });
                    } else {
                        conversionFunctions[typeName](objectInstance, key, typeName, json, jsonKeyName);
                    }
                } else {
                    let moreFunctions: Array<ConversionFunctionStructure> = conversionFunctions['array'](objectInstance, key, metadata.type, json, jsonKeyName);
                    moreFunctions.forEach((struct: ConversionFunctionStructure) => {
                        conversionFunctionsList.push(struct);
                    });
                }
            }
        }

    });

    return conversionFunctionsList;

}

/**
 * Conversion function parameters structure that will be used to call the function.
 */
export interface ConversionFunctionStructure {
    functionName: string,
    instance: any,
    instanceKey?: string,
    type?: any,
    json: any,
    jsonKey?: string
}

/**
 * List of JSON object conversion functions.
 */
export var conversionFunctions = new Object();
conversionFunctions['object'] = DeserializeComplexType;
conversionFunctions['array'] = DeserializeArrayType;
conversionFunctions['date'] = DeserializeDateType;
conversionFunctions['string'] = DeserializeSimpleType;
conversionFunctions['number'] = DeserializeSimpleType;
conversionFunctions['boolean'] = DeserializeSimpleType;
conversionFunctions['fromArray'] = SimpleTypeCoverter;