import { DependencyTreeNode } from "../../src/dependencyTreeNode";
import { Filter } from "../../src/index";
import { SerializingVisitor } from "../../src/visitor/serializing";

import { Package, PackageIncludeFilter, PackageSerializer, PackageExcludeFilter} from '../lib/model'

const visitor: SerializingVisitor = new SerializingVisitor(new PackageSerializer());
const topNodePackage = new Package('0', 'A');
const l1p1 = new Package('1.1', '1st Level Dependency p#1');
const l1p2 = new Package('1.2', '1st Level Dependency p#2');
const l2p1 = new Package('2.1', '2nd Level Dependency p#1');
const l2p2 = new Package('2.2', '2nd Level Dependency p#2');
const l2p3 = new Package('2.3', '2nd Level Dependency p#3');
const l3p1 = new Package('3.1', '3rd Level Dependency p#1');
const l3p2 = new Package('3.2', '3rd Level Dependency p#2');

it('no indent for top level node, just display the node\'s internals', () => {
    const singleNode = new DependencyTreeNode<Package>(topNodePackage, null);

    expect(visitor.visitNode(singleNode)).toEqual(topNodePackage.name);
});

it('indent for last dependency on the level to be "\\- "', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    const d12 = new DependencyTreeNode<Package>(l1p2, topNode);
    const d21= new DependencyTreeNode<Package>(l2p1, d11);

    expect(visitor.visitNode(d21)).toEqual(`|  \\- ${l2p1.name}`);
    expect(visitor.visitNode(d12)).toEqual(`\\- ${l1p2.name}`);
});

it('indent for non-last dependency on the level to be "+- "', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    new DependencyTreeNode<Package>(l1p2, topNode);// add one more to parent for the previous node to be non-last

    expect(visitor.visitNode(d11)).toEqual(`+- ${l1p1.name}`);
});

it('indent to be prefixd with "|  " if parent is non-last dependency on its level', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    const d21 = new DependencyTreeNode<Package>(l2p1, d11);
    new DependencyTreeNode<Package>(l1p2, topNode);// add one more to parent for the previous node to be non-last

    expect(visitor.visitNode(d21)).toEqual(`|  \\- ${l2p1.name}`);
});

it(`
multi-level final test      +- 1.1
                            |  +- 2.1
                            |  +- 2.2
                            |  |  +- 3.1
                            |  |  \- 3.2
                            |  \- 2.3
                            \- 1.2
                               \- 2.2
                                  +- 3.1
                                  \- 3.2
`, () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    const d21 = new DependencyTreeNode<Package>(l2p1, d11);
    const d22 = new DependencyTreeNode<Package>(l2p2, d11);
    const d31 = new DependencyTreeNode<Package>(l3p1, d22);
    const d32 = new DependencyTreeNode<Package>(l3p2, d22);
    const d23 = new DependencyTreeNode<Package>(l2p3, d11);
    const d12 = new DependencyTreeNode<Package>(l1p2, topNode);
    const d22X = new DependencyTreeNode<Package>(l2p2, d12);
    const d31X = new DependencyTreeNode<Package>(l3p1, d22X);
    const d32X = new DependencyTreeNode<Package>(l3p2, d22X);

    expect(visitor.visitNode(d11)).toEqual(`+- ${l1p1.name}`);
    expect(visitor.visitNode(d21)).toEqual(`|  +- ${l2p1.name}`);
    expect(visitor.visitNode(d22)).toEqual(`|  +- ${l2p2.name}`);
    expect(visitor.visitNode(d31)).toEqual(`|  |  +- ${l3p1.name}`);
    expect(visitor.visitNode(d32)).toEqual(`|  |  \\- ${l3p2.name}`);
    expect(visitor.visitNode(d23)).toEqual(`|  \\- ${l2p3.name}`);
    expect(visitor.visitNode(d12)).toEqual(`\\- ${l1p2.name}`);
    expect(visitor.visitNode(d22X)).toEqual(`   \\- ${l2p2.name}`);
    expect(visitor.visitNode(d31X)).toEqual(`      +- ${l3p1.name}`);
    expect(visitor.visitNode(d32X)).toEqual(`      \\- ${l3p2.name}`);
});

it('display node if at least one branch satisfies filter', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    const d21 = new DependencyTreeNode<Package>(l2p1, d11);

    const filter: Filter<Package> = new PackageIncludeFilter(d21.nodeElement.name);
    const filteringVisitor: SerializingVisitor = new SerializingVisitor(new PackageSerializer(), filter);
    expect(filteringVisitor.acceptNode(topNode)).toEqual(true);
    expect(filteringVisitor.acceptNode(d11)).toEqual(true);
    expect(filteringVisitor.acceptNode(d21)).toEqual(true);
});
it('do not display node if no single branch satisfies filter', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    const d21 = new DependencyTreeNode<Package>(l2p1, d11);

    const filter: Filter<Package> = new PackageIncludeFilter(topNode.nodeElement.name);
    const filteringVisitor: SerializingVisitor = new SerializingVisitor(new PackageSerializer(), filter);

    expect(filteringVisitor.acceptNode(topNode)).toEqual(true);
    expect(filteringVisitor.acceptNode(d11)).toEqual(false);
    expect(filteringVisitor.acceptNode(d21)).toEqual(false);
});
it('do not display node if satisfies exclude filter', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    const d21 = new DependencyTreeNode<Package>(l2p1, d11);

    const filteringVisitor: SerializingVisitor = new SerializingVisitor(
        new PackageSerializer(), 
        null, 
        new PackageExcludeFilter(d21.nodeElement.name));

    expect(filteringVisitor.acceptNode(topNode)).toEqual(true);
    expect(filteringVisitor.acceptNode(d11)).toEqual(true);
    expect(filteringVisitor.acceptNode(d21)).toEqual(false);
});