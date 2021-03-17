# Graph Visualization tool

🚀 [https://ajr07.github.io/Graph-Visualiser/](https://ajr07.github.io/Graph-Visualiser/)

## TODO

- Support for multiple edges / self edges
- Figure out what to do when graph is too big for screen:
  - scale out OR
  - ability pan around OR
  - both

## Documentation

NOTE: All these are assuming bi-directional, the directed option should be pretty self explanatory

### 1. Adjacency List

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
The `bidirectional` option doesn't apply here.
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

## Dev instructions

**Development**

```
npm install
npm run dev
```

**Build**

```
npm run build
```

**Test**

```
npm test
```
