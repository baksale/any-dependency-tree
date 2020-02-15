import { DependencyTreeNode } from '../src/dependencyTreeNode';

it('adds subtree to children', async () => {
  const rootNode = new DependencyTreeNode('root');
  const subTree = new DependencyTreeNode('subtree');
  rootNode.extendWithSubTree(subTree);
  expect(rootNode.children.length).toEqual(1);
});

it('makes root parent of the child', async () => {
  const rootNode = new DependencyTreeNode('root');
  const subTree = new DependencyTreeNode('subtree');
  rootNode.extendWithSubTree(subTree);
  expect(subTree.parent).toEqual(rootNode);
});

it('makes subtree level to be the next level of the root', async () => {
  const rootNode = new DependencyTreeNode('root');
  rootNode.nodeLevel = 10;
  const subTree = new DependencyTreeNode('subtree');
  rootNode.extendWithSubTree(subTree);
  expect(subTree.nodeLevel).toEqual(rootNode.nodeLevel + 1);
});

it('adjusts subtree index to meet the root structure', async () => {
  const rootNode = new DependencyTreeNode('root');
  rootNode.nodeLevel = 10;
  new DependencyTreeNode('existing child 1', rootNode);
  new DependencyTreeNode('existing child 2', rootNode);
  const subTree = new DependencyTreeNode('subtree');
  rootNode.extendWithSubTree(subTree);
  expect(subTree.nodeIndex).toEqual(2);
});

it('adjusts all node levels of the subtree', async () => {
  const subTree = new DependencyTreeNode('subtree');
  const subTreeChildLevel11 = new DependencyTreeNode('subtree child level 1', subTree);
  const subTreeChildLevel21 = new DependencyTreeNode('subtree child level 2.1', subTreeChildLevel11);
  const subTreeChildLevel22 = new DependencyTreeNode('subtree child level 2.2', subTreeChildLevel11);
  const subTreeChildLevel31 = new DependencyTreeNode('subtree child level 3.1', subTreeChildLevel21);

  const rootNode = new DependencyTreeNode('root');
  rootNode.nodeLevel = 10;
  rootNode.extendWithSubTree(subTree);
  expect(subTreeChildLevel11.nodeLevel).toEqual(rootNode.nodeLevel + 2);
  expect(subTreeChildLevel21.nodeLevel).toEqual(rootNode.nodeLevel + 3);
  expect(subTreeChildLevel22.nodeLevel).toEqual(rootNode.nodeLevel + 3);
  expect(subTreeChildLevel31.nodeLevel).toEqual(rootNode.nodeLevel + 4);
});