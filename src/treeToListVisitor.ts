import { DependencyTreeNode } from "./dependencyTreeNode";

export class TreeToListVisitor<T> {
    constructor(public withRootNode: boolean = true){}
    public visitTree(topNode: DependencyTreeNode<T>): DependencyTreeNode<T>[] {
        const result: DependencyTreeNode<T>[] = [];
        topNode.children.forEach(node => {
            result.push(...this.visitTreeNode(node));
        });
        if(this.withRootNode) result.push(topNode);
        return result;        
    }
    protected visitTreeNode(treeNode: DependencyTreeNode<T>): DependencyTreeNode<T>[] {
        const result: DependencyTreeNode<T>[] = [];
        treeNode.children.forEach(node => {
            result.push(...this.visitTreeNode(node));
        });
        result.push(treeNode);
        return result;
    }
}
