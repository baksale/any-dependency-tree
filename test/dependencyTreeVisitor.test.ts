import {DependencyTreeNode} from '../src/dependencyTreeNode'
import {Serializer} from '../src/serializer'
import {DependencyTreeVisitor} from '../src/dependencyTreeVisitor'
class Package {
    constructor(public id:string, public name:string){};
};
class MockSerializer implements Serializer<Package>{
    serialize(element: Package): string {
        return element.name;
    }
    
}
const visitor: DependencyTreeVisitor = new DependencyTreeVisitor();
visitor.serializer = new MockSerializer();

const topNodePackage = new Package('0', 'A');
const l1p1 = new Package('1.1', '1st Level Dependency p#1');
const l1p2 = new Package('1.2', '1st Level Dependency p#2');
const l2p1 = new Package('2.1', '2nd Level Dependency p#1');

it('top level node to display the node\'s internals', () => {
    const singleNode = new DependencyTreeNode<Package>(topNodePackage, null);

    expect(visitor.visitNode(singleNode)).toEqual(topNodePackage.name);
});

it('last dependency on the level indent to be "\\- "', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    const d12 = new DependencyTreeNode<Package>(l1p2, topNode);
    const d21= new DependencyTreeNode<Package>(l2p1, d11);

    expect(visitor.visitNode(d21)).toEqual(`|  \\- ${l2p1.name}`);
    expect(visitor.visitNode(d12)).toEqual(`\\- ${l1p2.name}`);
});

it('non-last dependency on the level indent to be "+- "', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    new DependencyTreeNode<Package>(l1p2, topNode);//add one more to parent for the previous node to be non-last

    expect(visitor.visitNode(d11)).toEqual(`+- ${l1p1.name}`);
});

it('parent is non-last dependency on the parent level indent to be prefixd with "|  "', () => {
    const topNode = new DependencyTreeNode<Package>(topNodePackage, null);
    const d11 = new DependencyTreeNode<Package>(l1p1, topNode);
    const d21 = new DependencyTreeNode<Package>(l2p1, d11);
    new DependencyTreeNode<Package>(l1p2, topNode);//add one more to parent for the previous node to be non-last

    expect(visitor.visitNode(d21)).toEqual(`|  \\- ${l2p1.name}`);
});
