import { DependencyTreeNode } from "../dependencyTreeNode";

export interface Visitor<T> {
    visitTree(element: DependencyTreeNode<any>): T;
  }