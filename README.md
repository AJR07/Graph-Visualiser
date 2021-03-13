# draw-graph (WORK IN PROGRESS)
Graph Drawing given some edges and connected or not (supposed to help for CP)

## TODO
- Add support for parsing different graph types
- Support for representing one-directional edges
- Actually let the user paste in the graph they want to visualize
- Figure out what to do when graph is too big for screen:
  - scale out OR
  - ability pan around OR
  - both


## Documentation

### Graph Types
NOTE: All these are assuming bi-directional, the directed option should be pretty self explanatory
#### Adjacency List
**Unweighted**
Format:
`i`th line contains all the nodes `i` is connected to

Input
```
2 3
1 3
4 1
```
↓ Result
```
1: (2, 1), (3, 1)
2: (1, 1), (3, 1)
3: (4, 1), (1, 1)
```
**Weighted**
Format:
`i`th line contains `[n1] [w1] [n2] [w2] ...`, where `n` is the node its connected to and `w` is the weight

Input
```
2 1 3 2
1 5 3 1
4 3 1 2
```
↓ Result
```
1: (2, 1), (3, 2)
2: (1, 5), (3, 1)
3: (4, 3), (1, 2)
```
#### Edge List
**Unweighted**
Format: For every line of input `[a] [b]`, means there is a edge connecting node `a` to node `b`.

Input
```
1 2
1 3
2 6
4 6
5 6
```
↓ Result
```
1: (2, 1), (3, 1)
2: (1, 1), (6, 1)
3: (1, 1)
4: (6, 1)
5: (6, 1)
```

**Weighted**
Format: For every line of input `[a] [b] [w]`, means that there is a edge connecting node `a` to node `b` with weight `w`.

Input
```
1 2 1
1 3 5
2 6 3
4 6 2
5 6 3
```
↓ Result
```
1: (2, 1), (3, 5)
2: (1, 1), (6, 3)
3: (1, 5)
4: (6, 2)
5: (6, 3)
```


## Dev instructions
**Development**
```
npm i
npm run dev
```

**Build**
```
npm run build
```