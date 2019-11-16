import { DependencyTreeNode } from '../dependencyTreeNode';
import { Visitor } from '.';

export class Ordering implements Visitor<DependencyTreeNode<any>[]> {
  constructor(public withRootNode: boolean = true){}
  public visitTree(topNode: DependencyTreeNode<any>): DependencyTreeNode<any>[] {
      const result: DependencyTreeNode<any>[] = [];
      topNode.children.forEach(node => {
          result.push(...this.visitTreeNode(node));
      });
      if(this.withRootNode) result.push(topNode);
      return result;        
  }
  protected visitTreeNode(treeNode: DependencyTreeNode<any>): DependencyTreeNode<any>[] {
      const result: DependencyTreeNode<any>[] = [];
      treeNode.children.forEach(node => {
          result.push(...this.visitTreeNode(node));
      });
      result.push(treeNode);
      return result;
  }
}
