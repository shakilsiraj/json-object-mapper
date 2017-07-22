import { JsonConverstionError, JsonPropertyDecoratorMetadata, AccessType , Deserializer} from "./DecoratorMetadata";
import { isSimpleType, getTypeName, getCachedType, getTypeNameFromInstance, getJsonPropertyDecoratorMetadata, isArrayType, Constants, METADATA_JSON_PROPERTIES_NAME } from "./ReflectHelper";

var SimpleTypeCoverter = (value: any, type: string): any => {
    return type === Constants.DATE_TYPE ? new Date(value) : value;
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
    let jsonObject = jsonKey != undefined ? json[jsonKey] : json;
    let jsonArraySize = jsonObject.length;
    let conversionFunctionsList = new Array<ConversionFunctionStructure>();
    if (jsonArraySize > 0) {
        let arrayInstance = [];
        instance[instanceKey] = arrayInstance;
        for (var i = 0; i < jsonArraySize; i++) {
            let typeName = getTypeNameFromInstance(type);
            if (!isSimpleType(typeName)) {
                let typeInstance = new type();
                conversionFunctionsList.push({ functionName: Constants.OBJECT_TYPE, instance: typeInstance, json: jsonObject[i] });
                arrayInstance.push(typeInstance);
            } else {
                arrayInstance.push(conversionFunctions[Constants.FROM_ARRAY](jsonObject[i], typeName));
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

    let objectKeys: string[] = Object.keys(objectInstance);
    objectKeys = objectKeys.concat((Reflect.getMetadata(METADATA_JSON_PROPERTIES_NAME, objectInstance) || []).filter(function(item) {
        return objectKeys.indexOf(item) < 0;
    }));
    objectKeys = objectKeys.concat(Object.keys(json).filter(function(item) {
        if(Reflect.getMetadata("design:type", objectInstance, item) === undefined) {
            return false;
        }
        return objectKeys.indexOf(item) < 0;
    }));
    objectKeys.forEach((key: string) => {
        /**
         * Check if there is any DecoratorMetadata attached to this property, otherwise create a new one.
         */
        let metadata: JsonPropertyDecoratorMetadata = getJsonPropertyDecoratorMetadata(objectInstance, key);
        if (metadata === undefined) {
            metadata = { name: key, required: false, access: AccessType.BOTH };
        }
        if (AccessType.WRITE_ONLY != metadata.access) {
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
                /**
                 * If metadata has deserializer, use that one instead.
                 */
                if (metadata.deserializer != undefined) {
                    objectInstance[key] = getOrCreateDeserializer(metadata.deserializer).deserialize(json[jsonKeyName]);
                }
                else if (metadata.type === undefined) {
                    /**
                    * If we do not have any type defined, then we can't do much here but to hope for the best.
                    */
                    objectInstance[key] = json[jsonKeyName];
                } else {
                    if (!isArrayType(objectInstance, key)) {
                        let typeName = metadata.type != undefined ? getTypeNameFromInstance(metadata.type) : getTypeName(objectInstance, key);
                        if (!isSimpleType(typeName)) {
                            objectInstance[key] = new metadata.type();
                            conversionFunctionsList.push({ functionName: Constants.OBJECT_TYPE, type: metadata.type, instance: objectInstance[key], json: json[jsonKeyName] });
                        } else {
                            conversionFunctions[typeName](objectInstance, key, typeName, json, jsonKeyName);
                        }
                    } else {
                        let moreFunctions: Array<ConversionFunctionStructure> = conversionFunctions[Constants.ARRAY_TYPE](objectInstance, key, metadata.type, json, jsonKeyName);
                        moreFunctions.forEach((struct: ConversionFunctionStructure) => {
                            conversionFunctionsList.push(struct);
                        });
                    }
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
 * Object to cache deserializers
 */
export var deserializers = new Object();

/**
 * Checks to see if the deserializer already exists or not.
 * If not, creates a new one and caches it, returns the
 * cached instance otherwise.
 */
export var getOrCreateDeserializer = (type: any): any => {
    return getCachedType(type, deserializers);
}


/**
 * List of JSON object conversion functions.
 */
export var conversionFunctions = new Object();
conversionFunctions[Constants.OBJECT_TYPE] = DeserializeComplexType;
conversionFunctions[Constants.ARRAY_TYPE] = DeserializeArrayType;
conversionFunctions[Constants.DATE_TYPE] = DeserializeDateType;
conversionFunctions[Constants.STRING_TYPE] = DeserializeSimpleType;
conversionFunctions[Constants.NUMBER_TYPE] = DeserializeSimpleType;
conversionFunctions[Constants.BOOLEAN_TYPE] = DeserializeSimpleType;
conversionFunctions[Constants.FROM_ARRAY] = SimpleTypeCoverter;
conversionFunctions[Constants.OBJECT_TYPE_LOWERCASE] = DeserializeComplexType;
conversionFunctions[Constants.ARRAY_TYPE_LOWERCASE] = DeserializeArrayType;
conversionFunctions[Constants.DATE_TYPE_LOWERCASE] = DeserializeDateType;
conversionFunctions[Constants.STRING_TYPE_LOWERCASE] = DeserializeSimpleType;
conversionFunctions[Constants.NUMBER_TYPE_LOWERCASE] = DeserializeSimpleType;
conversionFunctions[Constants.BOOLEAN_TYPE_LOWERCASE] = DeserializeSimpleType;
