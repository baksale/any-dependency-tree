export class DependencyTreeNode<T>{
    public nodeLevel: number = 0;
    constructor(public nodeElement: T, public parent: DependencyTreeNode<T>, public children: Array<DependencyTreeNode<T>> = []){
        if(null != parent){
            this.nodeLevel = parent.nodeLevel + 1;
            this.parent.children.push(this);
        }
    };
}