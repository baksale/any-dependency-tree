import { DependencyTreeNode } from "../../src/dependencyTreeNode";
import { Filter, Serializer } from "../../src/index";

export class Package {
    constructor(public id:string, public name:string){};
}
export class PackageSerializer implements Serializer<Package>{
    public serialize(element: DependencyTreeNode<Package>): string {
        return element.nodeElement.name;
    }
    
}
export class PackageIncludeFilter implements Filter<Package>{
    constructor(private filter: string){};
    public accept(element: DependencyTreeNode<Package>): boolean {
        return element.nodeElement.name.indexOf(this.filter) >= 0;
    }
}
export class PackageExcludeFilter implements Filter<Package>{
    constructor(private filter: string){};
    public accept(element: DependencyTreeNode<Package>): boolean {
        return element.nodeElement.name.indexOf(this.filter) >= 0;
    }
}