import { ConversionFunctionStructure, conversionFunctions } from "./DeserializationHelper";
import { SerializationStructure, serializeFunctions, mergeObjectOrArrayValues, mergeObjectOrArrayValuesAndCopyToParents } from "./SerializationHelper";
import { Constants } from "./ReflectHelper";

export namespace ObjectMapper {

    /**
     * Deserializes an array of object types with the passed on JSON data.
     */
    export var deserializeArray = <T>(type: { new (): T }, json: Object): T[] => {
        class ObjectsArrayParent {
            instances: T[] = undefined
        }

        let parent: ObjectsArrayParent = new ObjectsArrayParent();
        runDeserialization(conversionFunctions[Constants.ARRAY_TYPE](parent, "instances", type, json, undefined));

        return parent.instances || [];
    }

    /**
     * Deserializes a Object type with the passed on JSON data.
     */
    export var deserialize = <T>(type: { new (): T }, json: Object): T => {
        let dtoInstance = new type();
        let conversionFunctionStructure: ConversionFunctionStructure =
            { functionName: Constants.OBJECT_TYPE, instance: dtoInstance, json: json };

        runDeserialization([conversionFunctionStructure]);

        return dtoInstance;
    }

    var runDeserialization = (conversionFunctionStructures: ConversionFunctionStructure[]): void => {

        var converstionFunctionsArray: Array<ConversionFunctionStructure> = new Array<ConversionFunctionStructure>();
        conversionFunctionStructures.forEach((struct: ConversionFunctionStructure) => {
            converstionFunctionsArray.push(struct);
        });

        let conversionFunctionStructure: ConversionFunctionStructure = converstionFunctionsArray[0];

        while (conversionFunctionStructure != undefined) {
            let stackEntries: Array<ConversionFunctionStructure> = conversionFunctions[conversionFunctionStructure.functionName](
                conversionFunctionStructure.instance, conversionFunctionStructure.instanceKey,
                conversionFunctionStructure.type, conversionFunctionStructure.json,
                conversionFunctionStructure.jsonKey);
            stackEntries.forEach((structure: ConversionFunctionStructure) => {
                converstionFunctionsArray.push(structure);
            });
            conversionFunctionStructure = converstionFunctionsArray.pop();
        }

    }

    /**
     * Serializes an object instance to JSON string.
     */
    export var serialize = (obj: any): String => {
        let stack: Array<SerializationStructure> = new Array<SerializationStructure>();
        let struct: SerializationStructure = {
            id: undefined,
            type: Array.isArray(obj) == true ? Constants.ARRAY_TYPE: Constants.OBJECT_TYPE,
            instance: obj,
            parentIndex: undefined,
            values: new Array<String>(),
            key: undefined,
            visited: false
        }

        stack.push(struct);

        do {
            let instanceStruct: SerializationStructure = stack[stack.length - 1];
            let parentStruct: SerializationStructure = stack[stack.length > 1 ? instanceStruct.parentIndex : 0];
            if (instanceStruct.visited) {
                mergeObjectOrArrayValuesAndCopyToParents(instanceStruct, parentStruct);
                stack.pop();
            } else {
                let moreStructures: Array<SerializationStructure> = serializeFunctions[instanceStruct.type](parentStruct, instanceStruct, stack.length - 1);
                if (moreStructures.length > 0) {
                    moreStructures.forEach((each: SerializationStructure) => {
                        stack.push(each);
                    });
                } else {
                    if (stack.length > 1) {
                        mergeObjectOrArrayValuesAndCopyToParents(instanceStruct, parentStruct);
                    }
                    stack.pop();
                }
            }
        } while (stack.length > 1);

        mergeObjectOrArrayValues(struct);

        return struct.values[0];
    }
}
export { JsonProperty, JsonConverstionError, AccessType, CacheKey } from "./DecoratorMetadata";
export { DateSerializer } from "./SerializationHelper";
