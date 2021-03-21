# Graph Visualization tool

🚀[Website](https://ajr07.github.io/Graph-Visualiser/)

## Documentation

### Supported Graph Types

### 1. Adjacency List

NOTE: All these are assuming bi-directional, the directed option should be pretty self explanatory

**Options**  
The `bidirectional` option doesn't apply here

**Unweighted**  
Format:
`i`th line contains all the nodes `i` is connected to

<table>
<tr><td>Input</td><td>Result</td></tr>
<tr>
<td>
<pre>
2 3
1 3
4 1
</pre>
</td>
<td>
<pre>
1: (2, 1), (3, 1)
2: (1, 1), (3, 1)
3: (4, 1), (1, 1)
</pre>
</td>
</tr>
</table>

**Weighted**  
Format:
`i`th line contains `[n1] [w1] [n2] [w2] ...`, where `n` is the node its connected to and `w` is the weight

<table>
<tr><td>Input</td><td>Result</td></tr>
<tr>
<td>
<pre>
2 1 3 2
1 5 3 1
4 3 1 2
</pre>
</td>
<td>
<pre>
1: (2, 1), (3, 2)
2: (1, 5), (3, 1)
3: (4, 3), (1, 2)
</pre>
</td>
</tr>
</table>

### 2. Edge List

**Options**  
The `startingIndex` option doesn't apply here

**Unweighted**  
Format: For every line of input `[a] [b]`, means there is a edge connecting node `a` to node `b`.

<table>
<tr><td>Input</td><td>Result</td></tr>
<tr>
<td>
<pre>
1 2
1 3
2 6
4 6
5 6
</pre>
</td>
<td>
<pre>
1: (2, 1), (3, 1)
2: (1, 1), (6, 1)
3: (1, 1)
4: (6, 1)
5: (6, 1)
</pre>
</td>
</tr>
</table>

**Weighted**  
Format: For every line of input `[a] [b] [w]`, means that there is a edge connecting node `a` to node `b` with weight `w`.

<table>
<tr><td>Input</td><td>Result</td></tr>
<tr>
<td>
<pre>
1 2 1
1 3 5
2 6 3
4 6 2
5 6 3
</pre>
</td>
<td>
<pre>
1: (2, 1), (3, 5)
2: (1, 1), (6, 3)
3: (1, 5)
4: (6, 2)
5: (6, 3)
</pre>
</td>
</tr>
</table>

### 3. Adjacency Matrix

Format: For every `i`th line, the `n`th number in that line (space separated) means there is a edge connecting node `i` to node `n`.
If the graph is weighted, then the weight of the edge connecting node `i` to node `n` is the `n`th number at the `i`th row.

**Options**  
Both the `bidirectional` and the `weighted` options doesn't apply here.
If the graph is bidirectional, the matrix should be symmetrical

<table>
<tr><td>Input</td><td>Result</td></tr>
<tr>
<td>
<pre>
0 1 5 0 0 0
1 0 0 0 0 3
5 0 0 0 0 0
0 0 0 0 0 2
0 0 0 0 0 3
0 3 0 2 3 0
</pre>
</td>
<td>
<pre>
1: (2, 1), (3, 5)
2: (1, 1), (6, 3)
3: (1, 5)
4: (6, 2)
5: (6, 3)
</pre>
</td>
</tr>
</table>

### Weight Representation

1. **Thickness**: If checked, this displays the weight of the graph through the thickness of the edges
2. **Default Thickness**: This slider value affects the thickness of the edges when the "thickness" checkbox is unchecked
3. **Length**: If checked, this allows the weight of the edges to be represented by the length of the edges (or more specifically, the Rest Length)
4. **Default Length**: This will affect the Length of the graph edges (if the Length checkbox is unchecked, this will directly affect the length of each edge, otherwise, this will be a multiplier to the weight for exaggeration of the weights)

## Dev instructions

**Build and Run**

```
npm install
npm run dev
```

**Build**

```
npm run build
```

**To Test**

```
npm test
```

## TODO
**Actual stuff**
- ! Ability to draw arrows both ways
- UI for options.startingIndex
- Dim the options UI for when the particular graph type doesn't use it
- Show/Hide menus
- Help/Documentation box

**Potential Features**
- Support for multiple edges / self edges
- Figure out what to do when graph is too big for screen:
  - scale out OR
  - ability pan around OR
  - both
