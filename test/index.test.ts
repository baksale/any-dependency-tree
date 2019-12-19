import { DependencyTreeNode } from '../src/dependencyTreeNode';
import {DependencyTreeBuilder, EntityDependencyApi} from '../src/index'

import {Package} from './lib/model'
/**
    Main Package:0
    +- 1st Level Pacakge 1:A
    | +- 2nd Level Package 1:C
    | +- 2nd Level Package 2:D
    | | \- 3rd Level Package only:F
    | \- 2nd Level Package last:E
    +- 1st Level Pacakge 2:B
 */

class MockDependencyApi implements EntityDependencyApi<Package>{
    public async getEntityDependencies(entity: Package): Promise<Package[]> {
        switch(entity.id){
            case '0': return [new Package('A', '1st Level Pacakge 1'), new Package('B', '1st Level Pacakge 2')];
            case 'A': return [new Package('C', '2nd Level Package 1'), new Package('D', '2nd Level Package 2'), new Package('E', '2nd Level Package 3')];
            case 'B': return [];
            case 'C': return [];
            case 'D': return [new Package('F', '3rd Level Package only')];
            case 'E': return [];
            case 'F': return [];
        }
    }
}
const dependencyTreeBuilder = new DependencyTreeBuilder<Package>(new MockDependencyApi());

it('builds dependency tree', async () => {
    const mainPackage = new Package('0', 'Main Package');
    const rootNode: DependencyTreeNode<Package> = await dependencyTreeBuilder.buildDependencyTree(mainPackage);
    expect(rootNode.nodeElement).toEqual(mainPackage);
    expect(rootNode.children.length).toEqual(2);
    expect(rootNode.children[0].nodeElement).toEqual(new Package('A', '1st Level Pacakge 1'));
    expect(rootNode.children[0].children.length).toEqual(3);
});

it('extend the tree from its leafs', async () => {
    const existingTreeTopNode = new Package('Top Node', 'Existing Tree Top Package');
    const rootNode = new DependencyTreeNode<Package>(existingTreeTopNode);
    const existingTreeNode1 = new Package('0', 'Existing Tree 1st Level Node 1');
    const firstLevelNode1 = new DependencyTreeNode<Package>(existingTreeNode1, rootNode);
    const existingTreeNode2 = new Package('A', 'Existing Tree 1st Level Node 2');
    const firstLevelNode2 = new DependencyTreeNode<Package>(existingTreeNode2, rootNode);
    await dependencyTreeBuilder.extendTreeLeafs(rootNode);
    expect(rootNode.children.length).toEqual(2);
    expect(firstLevelNode1.children.length).toEqual(2);
    expect(firstLevelNode2.children.length).toEqual(3);
});