import { JsonProperty, JsonPropertyDecoratorMetadata, JsonConverstionError } from "./DecoratorMetadata";
import { ConversionFunctionStructure, conversionFunctions } from "./DeserializationHelper";
import { SerializationStructure, serializeFunctions, mergeObjectOrArrayValues } from "./SerializationHelper";
import { Constants } from "./ReflectHelper";

export namespace ObjectMapper {

    /**
     * Deserializes a Object type with the passed on JSON data.
     */
    export var deserialize = <T>(type: { new (): T }, json: Object): T => {
        let dtoInstance = new type();
        let conversionFunctionStructure: ConversionFunctionStructure =
            { functionName: Constants.OBJECT_TYPE, instance: dtoInstance, json: json };

        var converstionFunctionsArray: Array<ConversionFunctionStructure> = new Array<ConversionFunctionStructure>();
        converstionFunctionsArray.push(conversionFunctionStructure);

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

        return dtoInstance;
    }

    /**
     * Serializes an object instance to JSON string.
     */
    export var serialize = (obj: any): String => {
        let stack: Array<SerializationStructure> = new Array<SerializationStructure>();
        let struct: SerializationStructure = {
            id: undefined,
            type: Constants.OBJECT_TYPE,
            instance: obj,
            parentIndex: undefined,
            values: new Array<String>(),
            key: undefined,
            dependsOn: new Array<String>()
        }

        stack.push(struct);

        do {
            let instanceStruct: SerializationStructure = stack[stack.length - 1];
            let parentStruct: SerializationStructure = stack[stack.length > 1 ? instanceStruct.parentIndex : 0];
            let moreStructures: Array<SerializationStructure> = serializeFunctions[instanceStruct.type](parentStruct, instanceStruct, stack.length - 1);
            if (moreStructures.length > 0) {
                moreStructures.forEach((each: SerializationStructure) => {
                    stack.push(each);
                });
            } else {
                if (stack.length > 1) {
                    mergeObjectOrArrayValues(instanceStruct);
                    parentStruct.values.push(instanceStruct.values.pop());
                }
                stack.pop();
            }
        } while (stack.length > 1);

        mergeObjectOrArrayValues(struct);

        return struct.values[0];
    }
}
export default {
    JsonProperty, JsonConverstionError
}