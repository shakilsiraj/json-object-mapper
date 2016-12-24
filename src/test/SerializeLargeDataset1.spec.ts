/// <reference path="../../typings/index.d.ts"/>
import { JsonProperty } from "../main/DecoratorMetadata";
import { ObjectMapper } from "../main/index";



describe("Testing serialization of large datasets", () => {
    it("Testing with JSON.strify() method", () => {
        class NodeWith1Children {
            uuid: String = generateRandomString();
        }
        class NodeWith2Children {
            @JsonProperty("UUID")
            uuid: String = generateRandomString();
            @JsonProperty({ type: NodeWith1Children })
            childNode: NodeWith1Children = new NodeWith1Children();
        }
        class NodeWith3Children {
            uuid: String = generateRandomString();
            random: Number = Math.random();
            @JsonProperty({ type: NodeWith2Children })
            childNodes: Array<NodeWith2Children> = new Array<NodeWith2Children>();
            constructor() {
                for (var i = 0; i < 300; i++) {
                    this.childNodes.push(new NodeWith2Children());
                }
            }
        }

        let testInstance: NodeWith3Children = new NodeWith3Children();
        let serializedWithObjectMapper: String = ObjectMapper.serialize(testInstance);

        let verifyInstance: Object = JSON.parse(serializedWithObjectMapper.toString());
        expect(verifyInstance["uuid"]).toBe(testInstance.uuid);
        expect(verifyInstance["random"]).toBe(testInstance.random);
        expect(verifyInstance["childNodes"].length).toBe(300);

    });
});




function generateRandomString() {
    return Date.now() + "-" + Math.random();
}