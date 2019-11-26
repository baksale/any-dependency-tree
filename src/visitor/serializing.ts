import { Visitor } from '.';
import { DependencyTreeNode } from '../dependencyTreeNode';
import { DefaultSerializer, Filter, Serializer } from '../index';

export class Indent {
  public constructor(public indent: string = '', public parent: Indent = null) {}
  public toString(): string {
    return ((this.parent && this.parent.toString()) || '') + this.indent;
  }
}

export class Serializing implements Visitor<string> {
  private idnentForDependency: string = '+- ';
  private indentLastNodeOnLevel: string = '\\- ';
  private indentFillForParentNonLast = '|  ';
  private indentEmptyFill = '   ';

  constructor(
    public serializer: Serializer<any> = new DefaultSerializer(),
    private jsonMode: boolean = false,
    private filter?: Filter<any>,
  ) {}

  public acceptNode(node: DependencyTreeNode<any>): boolean {
    if (null !== this.filter) {
      return (
        this.filter.accept(node) ||
        node.children.some(childNode => {
          return this.acceptNode(childNode);
        })
      );
    }
    return true; // always accept if no filters
  }

  public visitTree(rootNode: DependencyTreeNode<any>): string {
    if (this.jsonMode) {
      this.jsonReady(rootNode);
      return JSON.stringify(rootNode);
    }
    let result: string = '';
    if (this.acceptNode(rootNode)) {
      result += this.visitNode(rootNode) + '\n';
      rootNode.children.forEach(childNode => {
        result += this.visitTree(childNode);
      });
    }
    return result;
  }
  public visitNode(node: DependencyTreeNode<any>): string {
    let result: string = '';
    result += this.indentForNode(node).toString();
    result += this.serializer.serialize(node);
    return result;
  }
  private jsonReady(treeNode: DependencyTreeNode<any>): void {
    treeNode.parent = null;
    treeNode.children.forEach(child => this.jsonReady(child));
  }

  private indentForNode(node: DependencyTreeNode<any>): Indent {
    if (0 == node.nodeLevel) return new Indent(); // no any indent/formatting for top level node
    const parentIndent = this.indentForNodeForParentLevel(node.parent);
    if (this.isLastOnLevel(node)) return new Indent(this.indentLastNodeOnLevel, parentIndent);
    else return new Indent(this.idnentForDependency, parentIndent);
  }
  private indentForNodeForParentLevel(parentNode: DependencyTreeNode<any>): Indent {
    if (parentNode.nodeLevel == 0) return new Indent();
    if (!this.isLastOnLevel(parentNode)) {
      return new Indent(this.indentFillForParentNonLast, this.indentForNodeForParentLevel(parentNode.parent));
    } else {
      return new Indent(this.indentEmptyFill, this.indentForNodeForParentLevel(parentNode.parent));
    }
  }
  private isLastOnLevel(node: DependencyTreeNode<any>): boolean {
    return node.parent.children.indexOf(node) == node.parent.children.length - 1;
  }
}
