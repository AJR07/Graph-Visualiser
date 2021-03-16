import Graph, { AdjList, EdgeList } from "../src/graph";
import Pair from "../src/pair";

function formatEdgeList(edgeList: EdgeList): string {
  let out = "\n";

  for (const row of edgeList) {
    out += `${row[0]} ${row[1]} ${row[2]}\n`;
  }

  return out.slice(0, -1); // this is to remove the last \n
}

function equalEdgeList(actual: EdgeList, expected: EdgeList): boolean {
  const errMsg = `❌ Got: ${formatEdgeList(actual)}, expected: ${formatEdgeList(
    expected
  )}`;

  if (actual.length !== expected.length) {
    console.error(errMsg);
    return false;
  }

  for (const row of actual) {
    if (
      !expected.filter(
        (v) => v[0] == row[0] && v[1] == row[1] && v[2] == row[2]
      )
    ) {
      console.error(errMsg);
      return false;
    }
  }

  return true;
}

test.each<[AdjList, EdgeList]>([
  [
    new Map([
      [1, [new Pair(2, 1), new Pair(3, 5)]],
      [2, [new Pair(1, 1), new Pair(6, 3)]],
      [3, [new Pair(1, 5)]],
      [4, [new Pair(6, 2)]],
      [5, [new Pair(6, 3)]],
      [6, [new Pair(2, 3), new Pair(4, 2), new Pair(5, 3)]],
    ]),
    [
      [1, 2, 1],
      [1, 3, 5],
      [2, 6, 3],
      [4, 6, 2],
      [5, 6, 3],
    ],
  ],
])("adjlist: %p, expected edgelist: %p", (adjlist, expected) => {
  expect(equalEdgeList(Graph.adjlistToEdgelist(adjlist), expected)).toBe(true);
});
