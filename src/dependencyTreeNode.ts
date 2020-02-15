export class DependencyTreeNode<T> {
  private static linkChildWithParent(child: DependencyTreeNode<any>, parent: DependencyTreeNode<any>): void {
    child.nodeLevel = parent.nodeLevel + 1;
    child.nodeIndex = parent.children.length;
    child.parent.children.push(child);    
  }
  public nodeLevel: number = 0;
  public nodeIndex: number = 0;
  constructor(
    public nodeElement: T,
    public parent: DependencyTreeNode<T> = null,
    public children: DependencyTreeNode<T>[] = [],
  ) {
    if (null != parent) {
      DependencyTreeNode.linkChildWithParent(this, parent);
    }
  }
  // non-thread-safe
  public extendWithSubTree(subTreeNode: DependencyTreeNode<T>): void {
    subTreeNode.parent = this;
    DependencyTreeNode.linkChildWithParent(subTreeNode, this);
    this.fixNodeLevels(subTreeNode);
  }
  private fixNodeLevels(node: DependencyTreeNode<T>): void {
    node.nodeLevel = node.parent.nodeLevel + 1;
    node.children.forEach(child => this.fixNodeLevels(child));
  }
}
