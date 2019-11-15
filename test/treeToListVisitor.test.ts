import { Package } from "./lib/model";
import { DependencyTreeNode } from "../src/dependencyTreeNode";
import { TreeToListVisitor } from "../src/treeToListVisitor";

const visitor = new TreeToListVisitor<Package>();

const topNodePackage = new Package('0', 'A');
const l1p1 = new Package('1.1', '1st Level Dependency p#1');
const l1p2 = new Package('1.2', '1st Level Dependency p#2');
// const l2p1 = new Package('2.1', '2nd Level Dependency p#1');

it('single node tree is to have single element list', () => {
    const singleNodeTree = new DependencyTreeNode<Package>(topNodePackage, null);

    expect(visitor.visitTree(singleNodeTree)).toEqual([singleNodeTree]);
});
it('children are earlier than parent', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    new DependencyTreeNode<Package>(l1p1, topNode);
    new DependencyTreeNode<Package>(l1p2, topNode);

    const result = visitor.visitTree(topNode);

    expect(result.length).toEqual(3);
    expect(result[2]).toEqual(topNode);
});
it('root node can be excluded', () => {
    const singleTestVisitor = new TreeToListVisitor(false);
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    new DependencyTreeNode<Package>(l1p1, topNode);
    const secondDependency = new DependencyTreeNode<Package>(l1p2, topNode);

    const result = singleTestVisitor.visitTree(topNode);

    expect(result.length).toEqual(2);
    expect(result[1]).toEqual(secondDependency);
});