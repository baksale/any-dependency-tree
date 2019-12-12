# Description

[![CircleCI](https://circleci.com/gh/baksale/any-dependency-tree/tree/master.svg?style=shield)](https://circleci.com/gh/baksale/any-dependency-tree/tree/master)[![Greenkeeper badge](https://badges.greenkeeper.io/baksale/any-dependency-tree.svg)](https://greenkeeper.io/)

Build and visualize dependency tree for any hierarchical structure.  
Just implement *element => dependencies: element[]* [interface](./src/index.ts#EntityDependencyApi)  

# Usage
Install the package
```bash
npm i any-depepndency-tree
```
## Minimal
[Implement EntityDependencyApi](./src/index.ts#EntityDependencyApi)
```typescript
...
const myImp: EntityDependencyApi<MyHierarchyType> = ...; // Mandatory custom implementation
```
Define starting point of the tree
```typescript
const myRoot: MyHierarchyType = ...; // this is starting poing of the tree;
```
Build the complete tree
```typescript
...
const builder = new DependencyTreeBuilder<MyHierarchyType>(myImp);
const rootNode = await dependencyTreeBuilder.buildDependencyTree(myRoot);
// now the rootTreeNode has the complete tree
```
## Optional
Can visualize the tree using standard JSON.stringify approach
```typescript
...
const serializingVisitor: = new SerializingVisitor();
const treeString: string = serializingVisitor.visitTree(rootNode);
console.log(treeString);
```
Or via custom implementation of tree node element visualizer
```typescript
...
const customSerializer: Serializer<MyHierarchyType> = ... // Optional custom implementation
const serializingVisitor: = new SerializingVisitor(customSerializer);
const treeString: string = serializingVisitor.visitTree(rootTreeNode);
console.log(treeString);
```  
Also supports:  
*  Exclusion filter to remove sub-tree
*  Inclusion filter to leave only some parts of the tree
```typescript
...
const exclusionFilter: Filter<MyHierarchyType> = ... // Optional custom implementation
const inclusionFilter: Filter<MyHierarchyType> = ... // Optional custom implementation
const serializingVisitor: = new SerializingVisitor(customSerializer, inclusionFilter, exclusionFilter);
const filteredTreeString: string = serializingVisitor.visitTree(rootTreeNode);
console.log(filteredTreeString);
```  
Can also convert built tree into the ordered list where children are at the beginning  
```
const orderVisitor: Ordering = new OrderingVisitor(true);
const orderedElements: DependencyTreeNode<any>[] = orderVisitor.visitTree(rootNode);
```
orderedElements now contains all nodes from the tree including root as the very last element.  

## Examples
1. [index.test.ts](./test/index.test.ts)
1. [serializing.test.ts](./test/visitor/serializing.test.ts)
1. [ordering.test.ts](./test/visitor/ordering.test.ts)

# Contribution
If you are interested in contributing, please take a look at the [CONTRIBUTING](./CONTRIBUTING.md) guide.
