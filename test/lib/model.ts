import { Serializer } from "../../src/serializer";

export class Package {
    constructor(public id:string, public name:string){};
}
export class MockSerializer implements Serializer<Package>{
    serialize(element: Package): string {
        return element.name;
    }
    
}