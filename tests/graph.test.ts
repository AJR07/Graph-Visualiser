import Graph, { AdjList, GraphOptions, GraphType } from "../src/graph";
import Pair from "../src/pair";

function equalAdjlist(a: AdjList, b: AdjList): boolean {
  if (a.size !== b.size) return false;

  let testVal: Pair<number, number>[] | undefined = undefined;
  for (const [key, val] of a) {
    testVal = b.get(key);

    const test1 = testVal?.every((v1) => val.filter((v2) => v2.equals(v1)));
    const test2 = val.every((v1) => testVal?.filter((v2) => v2.equals(v1)));

    if (!(test1 && test2) || (testVal === undefined && !b.has(key)))
      return false;
  }

  return true;
}

describe("Edge List", () => {
  test.each([
    [
      "1 2 1\n1 3 5\n2 6 3\n4 6 2\n5 6 3",
      {
        type: GraphType.EdgeList,
        bidirectional: true,
        weighted: true,
        startingIndex: 1,
      },
      new Map([
        [1, [new Pair(2, 1), new Pair(3, 5)]],
        [2, [new Pair(1, 1), new Pair(6, 3)]],
        [3, [new Pair(1, 5)]],
        [4, [new Pair(6, 2)]],
        [5, [new Pair(6, 3)]],
        [6, [new Pair(2, 3), new Pair(4, 2), new Pair(5, 3)]],
      ]),
    ],
  ])(
    "graphStr '%s' → %p",
    (graphStr: string, graphOptions: GraphOptions, expected: AdjList) => {
      expect(
        equalAdjlist(Graph.parseGraph(graphStr, graphOptions).adjlist, expected)
      ).toBe(true);
    }
  );
});
