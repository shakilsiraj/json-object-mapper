import { JsonProperty} from "../main/DecoratorMetadata";
export namespace a{

    export class NamespaceAClass{
        f: number = undefined;
        t: number = undefined;
    }    

}

export namespace b{
    export class NamespaceBClass{
        c: string = undefined;
        @JsonProperty({type:a.NamespaceAClass})
        d: a.NamespaceAClass = undefined;
    }
}