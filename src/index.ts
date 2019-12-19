import { DependencyTreeNode } from './dependencyTreeNode';

export interface EntityDependencyApi<T> {
  getEntityDependencies(entity: T): Promise<T[]>;
}
export interface Serializer<T> {
  serialize(element: DependencyTreeNode<T>): string;
}
export interface Filter<T> {
  accept(element: DependencyTreeNode<T>): boolean;
}
export class DefaultSerializer<T> implements Serializer<T> {
  public serialize(element: DependencyTreeNode<T>): string {
    return JSON.stringify(element.nodeElement);
  }
}
export class DefaultIncludeFilter<T> implements Filter<T> {
  public accept(element: DependencyTreeNode<T>): boolean {
    return true;
  }
}
export class DefaultExcludeFilter<T> implements Filter<T> {
  public accept(element: DependencyTreeNode<T>): boolean {
    return false;
  }
}

export class DependencyTreeBuilder<T> {
  constructor(protected entityDependencyApi: EntityDependencyApi<T>) {
    this.entityDependencyApi = entityDependencyApi;
  }
  public async extendTreeLeafs(rootNode: DependencyTreeNode<T>) {
      if(rootNode.children.length == 0){
        await this.buildTreeWithRecursion(rootNode);
      }
      else{
        for(const child of rootNode.children){
          await this.extendTreeLeafs(child);
        }
      }
  }
  public async buildDependencyTree(entity: T): Promise<DependencyTreeNode<T>> {
    const result = new DependencyTreeNode<T>(entity, null);
    await this.buildTreeWithRecursion(result);
    return result;
  }
  private async buildTreeWithRecursion(entity: DependencyTreeNode<T>) {
    const dependencies = await this.entityDependencyApi.getEntityDependencies(entity.nodeElement);
    for (const dependency of dependencies) {
      const childDependency = new DependencyTreeNode<T>(dependency, entity);
      await this.buildTreeWithRecursion(childDependency);
    }
  }
}
