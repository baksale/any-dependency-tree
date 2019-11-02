import { DependencyTreeNode } from "./dependencyTreeNode";

export interface EntityDependencyApi<T>{
    getEntityDependencies(entity: T): Array<T>;
}

export class DependencyTreeBuilder<T>{
    protected entityDependencyApi: EntityDependencyApi<T>;

    constructor (entityDependencyApi: EntityDependencyApi<T>){
        this.entityDependencyApi = entityDependencyApi;
    };
    public buildDependencyTree(entity: T): DependencyTreeNode<T> {
        return this.buildTreeWithRecursion(entity, null);
    }
    private buildTreeWithRecursion(entity: T, parent: DependencyTreeNode<T>): DependencyTreeNode<T>{
        const result = new DependencyTreeNode<T>(entity, parent);
        const dependencies = this.entityDependencyApi.getEntityDependencies(result.nodeElement);
        const children = new Array<DependencyTreeNode<T>>();
        dependencies.forEach(dependency => {
            children.push(this.buildTreeWithRecursion(dependency, result));
        });
        result.children = children;
        return result;
    }
}