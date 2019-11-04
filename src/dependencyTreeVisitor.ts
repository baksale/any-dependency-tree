import { DependencyTreeNode } from './dependencyTreeNode';
import { Serializer, DefaultSerializer } from './serializer';

export class Indent {
  public constructor(public indent: string = '', public parent: Indent = null) {}
  public toString(): string {
    return ((this.parent && this.parent.toString()) || '') + this.indent;
  }
}

export class DependencyTreeVisitor {
  private idnentForDependency: string = '+- ';
  private indentLastNodeOnLevel: string = '\\- ';
  private indentFillForParentNonLast = '|  ';
  private indentEmptyFill = '   ';
  public serializer: Serializer<any> = new DefaultSerializer();

  public visitTree(node: DependencyTreeNode<any>): string {
    let result: string = '';
    result += this.visitNode(node) + '\n';
    node.children.forEach(childNode => {
      result += this.visitTree(childNode);
    });
    return result;
  }
  public visitNode(node: DependencyTreeNode<any>): string {
    let result: string = '';
    result += this.indentForNode(node).toString();
    result += this.serializer.serialize(node.nodeElement);
    return result;
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
