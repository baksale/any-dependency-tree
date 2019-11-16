import { DependencyTreeNode } from './dependencyTreeNode';

export interface Serializer<T> {
  serialize(element: DependencyTreeNode<T>): string;
}
export class DefaultSerializer<T> implements Serializer<T> {
  public serialize(element: DependencyTreeNode<T>): string {
    return JSON.stringify(element.nodeElement);
  }
}
