export class DependencyTreeNode<T> {
  public nodeLevel: number = 0;
  public nodeIndex: number = 0;
  constructor(
    public nodeElement: T,
    public parent: DependencyTreeNode<T>,
    public children: DependencyTreeNode<T>[] = [],
  ) {
    if (null != parent) {
      this.nodeLevel = parent.nodeLevel + 1;
      this.nodeIndex = parent.children.length;
      this.parent.children.push(this);
    }
  }
}
