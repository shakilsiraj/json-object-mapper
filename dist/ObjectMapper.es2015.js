function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __metadata(k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
}

/**
 * Reflect Metadata json properties storage name.
 */
var METADATA_JSON_PROPERTIES_NAME = 'JsonProperties';
var METADATA_JSON_IGNORE_NAME = 'JsonIgnore';
/**
 * Returns the JsonProperty decorator metadata.
 */
var getJsonPropertyDecoratorMetadata = function (target, key) {
    return Reflect.getMetadata(JSON_PROPERTY_DECORATOR_NAME, target, key);
};
/**
 * Returns the JsonProperty name (if any) associated with the object instance.
 * If any JsonProperty metadata found, it returns the key name as the name of the property.
 */
var getKeyName = function (target, key) {
    var metadata = getJsonPropertyDecoratorMetadata(target, key);
    // tslint:disable-next-line:triple-equals
    if (metadata != undefined && metadata.name != undefined) {
        return metadata.name;
    }
    else {
        return key;
    }
};
/**
 * Returns the JsonPropertyDecoratorMetadata for the property
 */
var getJsonPropertyDecorator = function (metadata) {
    return getPropertyDecorator(JSON_PROPERTY_DECORATOR_NAME, metadata);
};
/**
 * Returns the JsonIgnoreDecoratorMetadata for the property
 */
var getJsonIgnoreDecorator = function () {
    return function (target, propertyKey) {
        Reflect.defineMetadata(METADATA_JSON_IGNORE_NAME, true, target, propertyKey);
    };
};
var getPropertyDecorator = function (metadataKey, metadata) {
    return Reflect.metadata(metadataKey, metadata);
};
/**
 * Checks to see if the specified type is a standard JS object type.
 */
var isSimpleType = function (typeName) {
    switch (typeName) {
        case Constants.STRING_TYPE: return true;
        case Constants.NUMBER_TYPE: return true;
        case Constants.BOOLEAN_TYPE: return true;
        case Constants.DATE_TYPE: return true;
        case Constants.STRING_TYPE_LOWERCASE: return true;
        case Constants.NUMBER_TYPE_LOWERCASE: return true;
        case Constants.BOOLEAN_TYPE_LOWERCASE: return true;
        case Constants.DATE_TYPE_LOWERCASE: return true;
        default: return false;
    }
};
/**
 * Returns the the instance type name by looking at the constructor name.
 * Stupid IE does not have name property! Hence the hack.
 */
var getTypeNameFromInstance = function (instance) {
    return instance.toString().trim().split(/[\s\()]/g)[1];
};
var getType = function (instance, key) {
    return Reflect.getMetadata('design:type', instance, key);
};
var isArrayType = function (instance, key) {
    return Array === getType(instance, key);
};
var getTypeName = function (instance, key) {
    var type = getType(instance, key);
    // tslint:disable-next-line:triple-equals
    if (type != undefined) {
        return getTypeNameFromInstance(type);
    }
    return type;
};
var Constants = {
    OBJECT_TYPE: 'Object',
    OBJECT_TYPE_LOWERCASE: 'object',
    STRING_TYPE: 'String',
    STRING_TYPE_LOWERCASE: 'string',
    NUMBER_TYPE: 'Number',
    NUMBER_TYPE_LOWERCASE: 'number',
    BOOLEAN_TYPE: 'Boolean',
    BOOLEAN_TYPE_LOWERCASE: 'boolean',
    DATE_TYPE: 'Date',
    DATE_TYPE_LOWERCASE: 'date',
    ARRAY_TYPE: 'Array',
    ARRAY_TYPE_LOWERCASE: 'array',
    FROM_ARRAY: 'fromArray'
};
var getCachedType = function (type, cache) {
    // tslint:disable-next-line:triple-equals
    var typeName = type.getJsonObjectMapperCacheKey != undefined ? type.getJsonObjectMapperCacheKey() : getTypeNameFromInstance(type);
    if (!cache[typeName]) {
        cache[typeName] = new type();
    }
    return cache[typeName];
};

/**
 * Decorator names
 */
var JSON_PROPERTY_DECORATOR_NAME = 'JsonProperty';
var AccessType;
(function (AccessType) {
    AccessType[AccessType["READ_ONLY"] = 0] = "READ_ONLY";
    AccessType[AccessType["WRITE_ONLY"] = 1] = "WRITE_ONLY";
    AccessType[AccessType["BOTH"] = 2] = "BOTH";
})(AccessType || (AccessType = {}));
/**
 * JsonProperty Decorator function.
 */
var JsonProperty = function (metadata) {
    if (typeof metadata === 'string') {
        return getJsonPropertyDecorator({ name: metadata, required: false, access: AccessType.BOTH });
    }
    else {
        return getJsonPropertyDecorator(metadata);
    }
};
/**
 * Decorator for specifying cache key.
 * Used for Serializer/Deserializer caching.
 *
 * @export
 * @param {string} key
 * @returns
 */
var CacheKey = function (key) {
    return function (f) {
        var functionName = 'getJsonObjectMapperCacheKey';
        var functionImpl = new Function("return '" + key + "';");
        f[functionName] = functionImpl;
    };
};
/**
 * JsonIgnore Decorator function.
 */
var JsonIgnore = function () {
    return getJsonIgnoreDecorator();
};
/**
 * Json convertion error type.
 */
var JsonConverstionError = (function () {
    function JsonConverstionError(message, json) {
        this.json = json;
        this.message = message;
        this.stack = (new Error()).stack;
    }
    return JsonConverstionError;
}());

var SimpleTypeCoverter = function (value, type) {
    return type === Constants.DATE_TYPE ? new Date(value) : value;
};
/**
 * Deserializes a standard js object type(string, number and boolean) from json.
 */
var DeserializeSimpleType = function (instance, instanceKey, type, json, jsonKey) {
    try {
        instance[instanceKey] = json[jsonKey];
        return [];
    }
    catch (e) {
        // tslint:disable-next-line:no-string-literal
        throw new JsonConverstionError("Property '" + instanceKey + "' of " + instance.constructor['name'] + " does not match datatype of " + jsonKey, json);
    }
};
/**
 * Deserializes a standard js Date object type from json.
 */
var DeserializeDateType = function (instance, instanceKey, type, json, jsonKey) {
    try {
        instance[instanceKey] = new Date(json[jsonKey]);
        return [];
    }
    catch (e) {
        // tslint:disable-next-line:no-string-literal
        throw new JsonConverstionError("Property '" + instanceKey + "' of " + instance.constructor['name'] + " does not match datatype of " + jsonKey, json);
    }
};
/**
 * Deserializes a JS array type from json.
 */
var DeserializeArrayType = function (instance, instanceKey, type, json, jsonKey) {
    var jsonObject = (jsonKey !== undefined) ? (json[jsonKey] || []) : json;
    var jsonArraySize = jsonObject.length;
    var conversionFunctionsList = [];
    var arrayInstance = [];
    instance[instanceKey] = arrayInstance;
    if (jsonArraySize > 0) {
        for (var i = 0; i < jsonArraySize; i++) {
            var typeName = getTypeNameFromInstance(type);
            if (!isSimpleType(typeName)) {
                var typeInstance = new type();
                conversionFunctionsList.push({ functionName: Constants.OBJECT_TYPE, instance: typeInstance, json: jsonObject[i] });
                arrayInstance.push(typeInstance);
            }
            else {
                arrayInstance.push(conversionFunctions[Constants.FROM_ARRAY](jsonObject[i], typeName));
            }
        }
    }
    return conversionFunctionsList;
};
/**
 * Deserializes a js object type from json.
 */
var DeserializeComplexType = function (instance, instanceKey, type, json, jsonKey) {
    var conversionFunctionsList = [];
    var objectInstance;
    /**
     * If instanceKey is not passed on then it's the first iteration of the functions.
     */
    // tslint:disable-next-line:triple-equals
    if (instanceKey != undefined) {
        objectInstance = new type();
        instance[instanceKey] = objectInstance;
    }
    else {
        objectInstance = instance;
    }
    var objectKeys = Object.keys(objectInstance);
    objectKeys = objectKeys.concat((Reflect.getMetadata(METADATA_JSON_PROPERTIES_NAME, objectInstance) || []).filter(function (item) {
        if (objectInstance.constructor.prototype.hasOwnProperty(item) && Object.getOwnPropertyDescriptor(objectInstance.constructor.prototype, item).set === undefined) {
            // Property does not have setter
            return false;
        }
        return objectKeys.indexOf(item) < 0;
    }));
    objectKeys = objectKeys.filter(function (item) {
        return !Reflect.hasMetadata(METADATA_JSON_IGNORE_NAME, objectInstance, item);
    });
    objectKeys.forEach(function (key) {
        /**
         * Check if there is any DecoratorMetadata attached to this property, otherwise create a new one.
         */
        var metadata = getJsonPropertyDecoratorMetadata(objectInstance, key);
        if (metadata === undefined) {
            metadata = { name: key, required: false, access: AccessType.BOTH };
        }
        // tslint:disable-next-line:triple-equals
        if (AccessType.WRITE_ONLY != metadata.access) {
            /**
             * Check requried property
             */
            if (metadata.required && json[metadata.name] === undefined) {
                throw new JsonConverstionError("JSON structure does have have required property '" + metadata.name + "' as required by '" + getTypeNameFromInstance(objectInstance) + "[" + key + "]", json);
            }
            // tslint:disable-next-line:triple-equals
            var jsonKeyName = metadata.name != undefined ? metadata.name : key;
            // tslint:disable-next-line:triple-equals
            if (json[jsonKeyName] != undefined) {
                /**
                 * If metadata has deserializer, use that one instead.
                 */
                // tslint:disable-next-line:triple-equals
                if (metadata.deserializer != undefined) {
                    objectInstance[key] = getOrCreateDeserializer(metadata.deserializer).deserialize(json[jsonKeyName]);
                }
                else if (metadata.type === undefined) {
                    /**
                    * If we do not have any type defined, then we can't do much here but to hope for the best.
                    */
                    objectInstance[key] = json[jsonKeyName];
                }
                else {
                    if (!isArrayType(objectInstance, key)) {
                        // tslint:disable-next-line:triple-equals
                        var typeName = metadata.type != undefined ? getTypeNameFromInstance(metadata.type) : getTypeName(objectInstance, key);
                        if (!isSimpleType(typeName)) {
                            objectInstance[key] = new metadata.type();
                            conversionFunctionsList.push({ functionName: Constants.OBJECT_TYPE, type: metadata.type, instance: objectInstance[key], json: json[jsonKeyName] });
                        }
                        else {
                            conversionFunctions[typeName](objectInstance, key, typeName, json, jsonKeyName);
                        }
                    }
                    else {
                        var moreFunctions = conversionFunctions[Constants.ARRAY_TYPE](objectInstance, key, metadata.type, json, jsonKeyName);
                        moreFunctions.forEach(function (struct) {
                            conversionFunctionsList.push(struct);
                        });
                    }
                }
            }
        }
    });
    return conversionFunctionsList;
};
/**
 * Object to cache deserializers
 */
var deserializers = {};
/**
 * Checks to see if the deserializer already exists or not.
 * If not, creates a new one and caches it, returns the
 * cached instance otherwise.
 */
var getOrCreateDeserializer = function (type) {
    return getCachedType(type, deserializers);
};
/**
 * List of JSON object conversion functions.
 */
var conversionFunctions = {};
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

var SerializeArrayType = function (parentStructure, instanceStructure, instanceIndex) {
    var furtherSerializationStructures = {};
    var arrayInstance = instanceStructure.instance;
    instanceStructure.visited = true;
    arrayInstance.forEach(function (value) {
        if (value !== undefined) {
            if (!isSimpleType(typeof value)) {
                var struct = {
                    id: uniqueId(),
                    type: Constants.OBJECT_TYPE,
                    instance: value,
                    parentIndex: instanceIndex,
                    values: [],
                    key: undefined,
                    visited: false
                };
                furtherSerializationStructures[struct.id] = struct;
            }
            else {
                instanceStructure.values.push(serializeFunctions[typeof value](undefined, value, serializers[typeof value]));
            }
        }
    });
    return createArrayOfSerializationStructures(furtherSerializationStructures);
};
var createArrayOfSerializationStructures = function (serializationStructuresObject) {
    var serializationStructures = [];
    Object.keys(serializationStructuresObject).forEach(function (key) {
        serializationStructures.push(serializationStructuresObject[key]);
    });
    return serializationStructures;
};
var serializeObject = function (key, instanceValuesStack) {
    var json = (key !== undefined ? "\"" + key + "\":" : '');
    return json + "{" + instanceValuesStack.join() + "}";
};
var serializeArray = function (key, instanceValuesStack) {
    var json = (key !== undefined ? "\"" + key + "\":" : '');
    return json + "[" + instanceValuesStack.join() + "]";
};
var mergeObjectOrArrayValuesAndCopyToParents = function (instanceStructure, parentStructure) {
    mergeObjectOrArrayValues(instanceStructure);
    parentStructure.values.push(instanceStructure.values.pop());
};
var mergeObjectOrArrayValues = function (instanceStructure) {
    var mergedValue;
    if (instanceStructure.type === Constants.OBJECT_TYPE) {
        mergedValue = serializeObject(instanceStructure.key, instanceStructure.values);
    }
    else {
        mergedValue = serializeArray(instanceStructure.key, instanceStructure.values);
    }
    instanceStructure.values = [];
    instanceStructure.values.push(mergedValue);
};
var SerializeObjectType = function (parentStructure, instanceStructure, instanceIndex) {
    var furtherSerializationStructures = {};
    instanceStructure.visited = true;
    var objectKeys = Object.keys(instanceStructure.instance);
    objectKeys = objectKeys.concat((Reflect.getMetadata(METADATA_JSON_PROPERTIES_NAME, instanceStructure.instance) || []).filter(function (item) {
        if (instanceStructure.instance.constructor.prototype.hasOwnProperty(item) && Object.getOwnPropertyDescriptor(instanceStructure.instance.constructor.prototype, item).get === undefined) {
            // Property does not have getter
            return false;
        }
        return objectKeys.indexOf(item) < 0;
    }));
    objectKeys = objectKeys.filter(function (item) {
        return !Reflect.hasMetadata(METADATA_JSON_IGNORE_NAME, instanceStructure.instance, item);
    });
    objectKeys.forEach(function (key) {
        var keyInstance = instanceStructure.instance[key];
        if (keyInstance === null) {
            instanceStructure.values.push("\"" + key + "\":" + keyInstance);
        }
        else if (keyInstance !== undefined) {
            var metadata = getJsonPropertyDecoratorMetadata(instanceStructure.instance, key);
            if (metadata !== undefined && AccessType.READ_ONLY === metadata.access) {
            }
            else if (metadata !== undefined && metadata.serializer !== undefined) {
                var serializer = getOrCreateSerializer(metadata.serializer);
                instanceStructure.values.push(serializeFunctions[Constants.STRING_TYPE](getKeyName(instanceStructure.instance, key), keyInstance, serializer));
            }
            else {
                if (keyInstance instanceof Array) {
                    var struct = {
                        id: uniqueId(),
                        type: Constants.ARRAY_TYPE,
                        instance: keyInstance,
                        parentIndex: instanceIndex,
                        values: [],
                        key: getKeyName(instanceStructure.instance, key),
                        visited: false
                    };
                    furtherSerializationStructures[struct.id] = struct;
                }
                else if (!isSimpleType(typeof keyInstance)) {
                    var struct = {
                        id: uniqueId(),
                        type: Constants.OBJECT_TYPE,
                        instance: keyInstance,
                        parentIndex: instanceIndex,
                        values: [],
                        key: getKeyName(instanceStructure.instance, key),
                        visited: false
                    };
                    furtherSerializationStructures[struct.id] = struct;
                }
                else {
                    var serializer = serializers[typeof keyInstance];
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
var SerializeSimpleType = function (key, instance, serializer) {
    var value = serializer.serialize(instance);
    if (key !== undefined) {
        return "\"" + key + "\":" + value;
    }
    else {
        return value;
    }
};
var DateSerializer = (function () {
    function DateSerializer() {
        this.serialize = function (value) {
            return value.getTime();
        };
    }
    DateSerializer = __decorate([
        CacheKey('DateSerializer'), 
        __metadata('design:paramtypes', [])
    ], DateSerializer);
    return DateSerializer;
}());
var StringSerializer = (function () {
    function StringSerializer() {
        this.serialize = function (value) {
            return JSON.stringify(value);
        };
    }
    StringSerializer = __decorate([
        CacheKey('StringSerializer'), 
        __metadata('design:paramtypes', [])
    ], StringSerializer);
    return StringSerializer;
}());
var NumberSerializer = (function () {
    function NumberSerializer() {
        this.serialize = function (value) {
            return value;
        };
    }
    NumberSerializer = __decorate([
        CacheKey('NumberSerializer'), 
        __metadata('design:paramtypes', [])
    ], NumberSerializer);
    return NumberSerializer;
}());
var BooleanSerializer = (function () {
    function BooleanSerializer() {
        this.serialize = function (value) {
            return value;
        };
    }
    BooleanSerializer = __decorate([
        CacheKey('BooleanSerializer'), 
        __metadata('design:paramtypes', [])
    ], BooleanSerializer);
    return BooleanSerializer;
}());
/**
 * Object to cache serializers
 */
var serializers = {};
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
var getOrCreateSerializer = function (type) {
    return getCachedType(type, serializers);
};
var serializeFunctions = [];
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
var uniqueId = function () {
    return Math.random() + "-" + Date.now();
};

var ObjectMapper;
(function (ObjectMapper) {
    /**
     * Deserializes an array of object types with the passed on JSON data.
     */
    ObjectMapper.deserializeArray = function (type, json) {
        var ObjectsArrayParent = (function () {
            function ObjectsArrayParent() {
                this.instances = undefined;
            }
            return ObjectsArrayParent;
        }());
        var parent = new ObjectsArrayParent();
        runDeserialization(conversionFunctions[Constants.ARRAY_TYPE](parent, 'instances', type, json, undefined));
        return parent.instances;
    };
    /**
     * Deserializes a Object type with the passed on JSON data.
     */
    ObjectMapper.deserialize = function (type, json) {
        var dtoInstance = new type();
        var conversionFunctionStructure = {
            functionName: Constants.OBJECT_TYPE,
            instance: dtoInstance,
            json: json,
        };
        runDeserialization([conversionFunctionStructure]);
        return dtoInstance;
    };
    var runDeserialization = function (conversionFunctionStructures) {
        var converstionFunctionsArray = [];
        conversionFunctionStructures.forEach(function (struct) {
            converstionFunctionsArray.push(struct);
        });
        var conversionFunctionStructure = converstionFunctionsArray[0];
        // tslint:disable-next-line:triple-equals
        while (conversionFunctionStructure != undefined) {
            var stackEntries = conversionFunctions[conversionFunctionStructure.functionName](conversionFunctionStructure.instance, conversionFunctionStructure.instanceKey, conversionFunctionStructure.type, conversionFunctionStructure.json, conversionFunctionStructure.jsonKey);
            stackEntries.forEach(function (structure) {
                converstionFunctionsArray.push(structure);
            });
            conversionFunctionStructure = converstionFunctionsArray.pop();
        }
    };
    /**
     * Serializes an object instance to JSON string.
     */
    ObjectMapper.serialize = function (obj) {
        var stack = [];
        var struct = {
            id: undefined,
            type: Array.isArray(obj) === true ? Constants.ARRAY_TYPE : Constants.OBJECT_TYPE,
            instance: obj,
            parentIndex: undefined,
            values: [],
            key: undefined,
            visited: false
        };
        stack.push(struct);
        do {
            var instanceStruct = stack[stack.length - 1];
            var parentStruct = stack[stack.length > 1 ? instanceStruct.parentIndex : 0];
            if (instanceStruct.visited) {
                mergeObjectOrArrayValuesAndCopyToParents(instanceStruct, parentStruct);
                stack.pop();
            }
            else {
                var moreStructures = serializeFunctions[instanceStruct.type](parentStruct, instanceStruct, stack.length - 1);
                if (moreStructures.length > 0) {
                    var index = moreStructures.length;
                    while (--index >= 0) {
                        stack.push(moreStructures[index]);
                    }
                }
                else {
                    if (stack.length > 1) {
                        mergeObjectOrArrayValuesAndCopyToParents(instanceStruct, parentStruct);
                    }
                    stack.pop();
                }
            }
        } while (stack.length > 1);
        mergeObjectOrArrayValues(struct);
        return struct.values[0];
    };
})(ObjectMapper || (ObjectMapper = {}));

export { ObjectMapper, JsonProperty, JsonConverstionError, AccessType, CacheKey, JsonIgnore, DateSerializer };
