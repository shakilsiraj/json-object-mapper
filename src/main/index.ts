import { conversionFunctions, ConversionFunctionStructure } from './DeserializationHelper';
import { Constants } from './ReflectHelper';
import { mergeObjectOrArrayValues, mergeObjectOrArrayValuesAndCopyToParents, SerializationStructure, serializeFunctions } from './SerializationHelper';

export namespace ObjectMapper {

    /**
     * Deserializes an array of object types with the passed on JSON data.
     */
    export const deserializeArray = <T>(type: { new(): T }, json: Object): T[] => {
        class ObjectsArrayParent {
            instances: T[] = undefined;
        }

        const parent: ObjectsArrayParent = new ObjectsArrayParent();
        runDeserialization(conversionFunctions[Constants.ARRAY_TYPE](parent, 'instances', type, json, undefined));

        return parent.instances;
    };

    /**
     * Deserializes a Object type with the passed on JSON data.
     */
    export const deserialize = <T>(type: { new(): T }, json: Object): T => {
        const dtoInstance = new type();
        const conversionFunctionStructure: ConversionFunctionStructure = {
            functionName: Constants.OBJECT_TYPE,
            instance: dtoInstance,
            json: json,
        };

        runDeserialization([conversionFunctionStructure]);

        return dtoInstance;
    };

    const runDeserialization = (conversionFunctionStructures: ConversionFunctionStructure[]): void => {

        const converstionFunctionsArray: Array<ConversionFunctionStructure> = [];
        conversionFunctionStructures.forEach((struct: ConversionFunctionStructure) => {
            converstionFunctionsArray.push(struct);
        });

        let conversionFunctionStructure: ConversionFunctionStructure = converstionFunctionsArray[0];

        // tslint:disable-next-line:triple-equals
        while (conversionFunctionStructure != undefined) {
            const stackEntries: Array<ConversionFunctionStructure> = conversionFunctions[conversionFunctionStructure.functionName](
                conversionFunctionStructure.instance, conversionFunctionStructure.instanceKey,
                conversionFunctionStructure.type, conversionFunctionStructure.json,
                conversionFunctionStructure.jsonKey);
            stackEntries.forEach((structure: ConversionFunctionStructure) => {
                converstionFunctionsArray.push(structure);
            });
            conversionFunctionStructure = converstionFunctionsArray.pop();
        }
    };

    /**
     * Serializes an object instance to JSON string.
     */
    export const serialize = (obj: any): String => {
        const stack: Array<SerializationStructure> = [];
        const struct: SerializationStructure = {
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
            const instanceStruct: SerializationStructure = stack[stack.length - 1];
            const parentStruct: SerializationStructure = stack[stack.length > 1 ? instanceStruct.parentIndex : 0];
            if (instanceStruct.visited) {
                mergeObjectOrArrayValuesAndCopyToParents(instanceStruct, parentStruct);
                stack.pop();
            } else {
                const moreStructures: Array<SerializationStructure> = serializeFunctions[instanceStruct.type](parentStruct, instanceStruct, stack.length - 1);
                if (moreStructures.length > 0) {
                    let index = moreStructures.length;
                    while (--index >= 0) {
                        stack.push(moreStructures[index]);
                    }
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
    };
}
export { JsonProperty, JsonConverstionError, AccessType, CacheKey, JsonIgnore } from './DecoratorMetadata';
export { DateSerializer } from './SerializationHelper';
