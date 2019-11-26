import { DependencyTreeNode } from './dependencyTreeNode';

export interface EntityDependencyApi<T> {
  getEntityDependencies(entity: T): Promise<T[]>;
}
export interface Serializer<T> {
  serialize(element: DependencyTreeNode<T>): string;
}
export class DefaultSerializer<T> implements Serializer<T> {
  public serialize(element: DependencyTreeNode<T>): string {
    return JSON.stringify(element.nodeElement);
  }
}
export interface Filter<T> {
  accept(element: DependencyTreeNode<T>): boolean;
}
export class DependencyTreeBuilder<T> {
  protected entityDependencyApi: EntityDependencyApi<T>;

  constructor(entityDependencyApi: EntityDependencyApi<T>) {
    this.entityDependencyApi = entityDependencyApi;
  }
  public async buildDependencyTree(entity: T): Promise<DependencyTreeNode<T>> {
    return await this.buildTreeWithRecursion(entity, null);
  }
  private async buildTreeWithRecursion(entity: T, parent: DependencyTreeNode<T>): Promise<DependencyTreeNode<T>> {
    const result = new DependencyTreeNode<T>(entity, parent);
    const dependencies = await this.entityDependencyApi.getEntityDependencies(result.nodeElement);
    const children: DependencyTreeNode<T>[] = [];
    let dependency: T;
    for (dependency of dependencies) {
      children.push(await this.buildTreeWithRecursion(dependency, result));
    }
    result.children = children;
    return result;
  }
}
