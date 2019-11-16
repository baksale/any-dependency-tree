import { Serializer } from "../../src/serializer";
import { DependencyTreeNode } from "../../src/dependencyTreeNode";

export class Package {
    constructor(public id:string, public name:string){};
}
export class PackageSerializer implements Serializer<Package>{
    serialize(element: DependencyTreeNode<Package>): string {
        return element.nodeElement.name;
    }
    
}