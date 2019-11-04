# Description
Build and visualize dependency tree for anything with hierarchical structure.  
Just provide *element => dependencies: element[]* realization [interface implementation](./src/index.ts#EntityDependencyApi)  

# Usage
Install the package
```bash
npm install any-depepndency-tree@latest
```
## Minimal
[Implement EntityDependencyApi](./src/index.ts#EntityDependencyApi)
```typescript
import {EntityDependencyApi} from 'any-dependency-tree/dist/index'
...
const myImp: EntityDependencyApi<MyHierarchyElementType> = ...; // Mandatory custom implementation
```
Define starting point of the tree
```typescript
const myRootElement: MyHierarchyElementType = ...; // this is starting poing of the tree;
```
Build the complete tree
```typescript
import { DependencyTreeBuilder } from 'any-dependency-tree/dist/index';
import { DependencyTreeNode } from 'any-dependency-tree/dist/dependencyTreeNode';
...
const dependencyBuilder = new DependencyTreeBuilder<MyHierarchyElementType>(myImp);
const rootTreeNode: DependencyTreeNode<MyHierarchyElementType> = await dependencyTreeBuilder.buildDependencyTree(myRootElement);
// now the rootTreeNode has the complete tree
```
## Optional
Can visualize the tree using standard JSON.stringify approach
```typescript
import { DependencyTreeVisitor } from 'any-dependency-tree/dist/dependencyTreeNode';
...
const serializingVisitor: = new DependencyTreeVisitor();
const treeString: string = serializingVisitor.visitTree(rootTreeNode);
console.log(treeString);
```
Or via custom implementation of tree node element visualizer
```typescript
import { Serializer } from "any-dependency-tree/dist/serializer";
...
const customSerializer: Serializer<MyHierarchyElementType> = ... // Optional custom implementation
serializingVisitor.serializer = customSerializer;
const treeString: string = serializingVisitor.visitTree(rootTreeNode);
console.log(treeString);
```
## Examples
1. [index.test.ts](./test/index.test.ts)
1. [integration.test.ts](./test/integration.test.ts)

# Contribution
If you are interested in contributing, please take a look at the [CONTRIBUTING](./CONTRIBUTING.md) guide.
