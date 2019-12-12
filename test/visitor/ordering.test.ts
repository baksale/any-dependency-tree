import {DependencyTreeNode} from '../../src/dependencyTreeNode'
import {OrderingVisitor} from '../../src/visitor/ordering'

import {Package} from '../lib/model'

const orderVisitor = new OrderingVisitor();

const topNodePackage = new Package('0', 'A');
const l1p1 = new Package('1.1', '1st Level Dependency p#1');
const l1p2 = new Package('1.2', '1st Level Dependency p#2');

it('single node tree is to have single element list', () => {
    const singleNodeTree = new DependencyTreeNode<Package>(topNodePackage, null);

    expect(orderVisitor.visitTree(singleNodeTree)).toEqual([singleNodeTree]);
});

it('children are earlier than parent', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    new DependencyTreeNode<Package>(l1p1, topNode);
    new DependencyTreeNode<Package>(l1p2, topNode);

    const result = orderVisitor.visitTree(topNode);

    expect(result.length).toEqual(3);
    expect(result[result.length - 1]).toEqual(topNode);
});

it('root node can be excluded from the list', () => {
    const singleTestVisitor = new OrderingVisitor(false);
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    new DependencyTreeNode<Package>(l1p1, topNode);
    const lastDependency = new DependencyTreeNode<Package>(l1p2, topNode);

    const result = singleTestVisitor.visitTree(topNode);

    expect(result.length).toEqual(2);
    expect(result[result.length - 1]).toEqual(lastDependency);
});
