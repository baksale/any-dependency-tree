import { Visitor } from '.';
import { DependencyTreeNode } from '../dependencyTreeNode';
import { DefaultExcludeFilter, DefaultIncludeFilter, DefaultSerializer, Filter, Serializer } from '../index';

export class Indent {
  public constructor(public indent: string = '', public parent: Indent = null) {}
  public toString(): string {
    return ((this.parent && this.parent.toString()) || '') + this.indent;
  }
}

export class SerializingVisitor implements Visitor<string> {
  public idnentForDependency: string = '+- ';
  public indentLastNodeOnLevel: string = '\\- ';
  private indentFillForParentNonLast = '|  ';
  private indentEmptyFill = '   ';

  constructor(
    private serializer: Serializer<any> = new DefaultSerializer(),
    private includeFilter: Filter<any> = new DefaultIncludeFilter(),
    private excludeFilter: Filter<any> = new DefaultExcludeFilter(),
  ) {}

  public acceptNode(node: DependencyTreeNode<any>): boolean {
    return (
      !(this.excludeFilter && this.excludeFilter.accept(node)) &&
      (this.includeFilter
        ? this.includeFilter.accept(node) ||
          node.children.some(childNode => {
            return this.acceptNode(childNode);
          })
        : true)
    );
  }
  public visitTree(rootNode: DependencyTreeNode<any>): string {
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
    return node.nodeIndex == node.parent.children.length - 1;
  }
}
