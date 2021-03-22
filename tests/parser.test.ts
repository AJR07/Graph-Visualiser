import prettyFormat from "pretty-format";
import Graph, { AdjList, GraphOptions, GraphType } from "../src/graph";
import Pair from "../src/pair";

function equalAdjlist(
  actual: AdjList | null | undefined,
  expected: AdjList
): boolean {
  const errMsg = `❌ Got: ${prettyFormat(actual)}, Expected: ${prettyFormat(
    expected
  )}`;

  if (!actual) {
    console.error(errMsg);
    return false;
  }

  if (actual.size !== expected.size) {
    console.error(errMsg);
    return false;
  }

  let testVal: Pair<number, number>[] | undefined = undefined;
  for (const [key, val] of actual) {
    testVal = expected.get(key);

    const test1 = testVal?.every((v1) => val.filter((v2) => v2.equals(v1)));
    const test2 = val.every((v1) => testVal?.filter((v2) => v2.equals(v1)));

    if (!(test1 && test2) || (testVal === undefined && !expected.has(key))) {
      console.error(errMsg);
      return false;
    }
  }

  return true;
}

const formatStr = "graphStr '%s', options %p";
const testFn = (
  graphStr: string,
  graphOptions: GraphOptions,
  expected: AdjList
) => {
  expect(
    equalAdjlist(Graph.parseGraph(graphStr, graphOptions)?.adjlist, expected)
  ).toBe(true);
};
const negativeTestFn = (str: string, options: GraphOptions) => {
  expect(Graph.parseGraph(str, options)).toBeNull();
};

describe("Edge List", () => {
  test.each<[string, GraphOptions, AdjList]>([
    // Test weighted+bidirectional
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
    [
      "1 2 1\n1 3 5\n2 6 3\n4 6 2\n5 6 3\n5 2 1",
      {
        type: GraphType.EdgeList,
        bidirectional: true,
        weighted: true,
        startingIndex: 1,
      },
      new Map([
        [1, [new Pair(2, 1), new Pair(3, 5)]],
        [2, [new Pair(1, 1), new Pair(5, 1), new Pair(6, 3)]],
        [3, [new Pair(1, 5)]],
        [4, [new Pair(6, 2)]],
        [5, [new Pair(2, 1), new Pair(6, 3)]],
        [6, [new Pair(2, 3), new Pair(4, 2), new Pair(5, 3)]],
      ]),
    ],
    // Test unweighted+bidirectional
    [
      "1 2\n1 3\n2 6\n4 6\n5 6\n5 2",
      {
        type: GraphType.EdgeList,
        bidirectional: true,
        weighted: false,
        startingIndex: 1,
      },
      new Map([
        [1, [new Pair(2, 1), new Pair(3, 1)]],
        [2, [new Pair(1, 1), new Pair(5, 1), new Pair(6, 1)]],
        [3, [new Pair(1, 1)]],
        [4, [new Pair(6, 1)]],
        [5, [new Pair(2, 1), new Pair(6, 1)]],
        [6, [new Pair(2, 1), new Pair(4, 1), new Pair(5, 1)]],
      ]),
    ],
    // Test weighted+directed
    [
      "1 2 1\n1 3 5\n2 6 3\n4 6 2\n5 6 3\n5 2 1",
      {
        type: GraphType.EdgeList,
        bidirectional: false,
        weighted: true,
        startingIndex: 1,
      },
      new Map([
        [1, [new Pair(2, 1), new Pair(3, 5)]],
        [2, [new Pair(1, 1)]],
        [3, []],
        [4, [new Pair(6, 2)]],
        [5, [new Pair(6, 3)]],
        [6, []],
      ]),
    ],
    // Test unweighted+directed
    [
      "1 2\n1 3\n2 6\n4 6\n5 6\n5 2",
      {
        type: GraphType.EdgeList,
        bidirectional: false,
        weighted: false,
        startingIndex: 1,
      },
      new Map([
        [1, [new Pair(2, 1), new Pair(3, 1)]],
        [2, [new Pair(1, 1)]],
        [3, []],
        [4, [new Pair(6, 1)]],
        [5, [new Pair(6, 1)]],
        [6, []],
      ]),
    ],
    // Test different starting index
    [
      "0 1\n0 2\n1 5\n3 5\n3 5\n4 1",
      {
        type: GraphType.EdgeList,
        bidirectional: false,
        weighted: false,
        startingIndex: 0,
      },
      new Map([
        [0, [new Pair(1, 1), new Pair(2, 1)]],
        [1, [new Pair(0, 1)]],
        [2, []],
        [3, [new Pair(5, 1)]],
        [4, [new Pair(5, 1)]],
        [5, []],
      ]),
    ],
  ])("Positive test:\n" + formatStr, testFn);

  test.each<[string, GraphOptions]>([
    [
      "",
      {
        type: GraphType.EdgeList,
        bidirectional: false,
        weighted: false,
        startingIndex: 0,
      },
    ],
    [
      "abc def",
      {
        type: GraphType.EdgeList,
        bidirectional: false,
        weighted: false,
        startingIndex: 0,
      },
    ],
    [
      "-1 -10 2",
      {
        type: GraphType.EdgeList,
        bidirectional: true,
        weighted: true,
        startingIndex: 0,
      },
    ],
    [
      "0 1 2 1\n1 2 34 1",
      {
        type: GraphType.EdgeList,
        bidirectional: true,
        weighted: true,
        startingIndex: 1,
      },
    ],
    [
      "1 2 1\n1 3 4qwerty",
      {
        type: GraphType.EdgeList,
        bidirectional: true,
        weighted: true,
        startingIndex: 1,
      },
    ],
  ])("Negative test:\n" + formatStr, negativeTestFn);
});

describe("Adjacency List", () => {
  test.each<[string, GraphOptions, AdjList]>([
    [
      "2 1 3 5\n1 1 6 3\n1 5\n6 2\n6 3\n4 2 5 3",
      {
        type: GraphType.AdjList,
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
    [
      "2 3 5\n1 4 5\n1 2\n3\n1 4",
      {
        type: GraphType.AdjList,
        bidirectional: true,
        weighted: false,
        startingIndex: 1,
      },
      new Map([
        [1, [new Pair(2, 1), new Pair(3, 1), new Pair(5, 1)]],
        [2, [new Pair(1, 1), new Pair(4, 1), new Pair(5, 1)]],
        [3, [new Pair(1, 1), new Pair(2, 1)]],
        [4, [new Pair(3, 1)]],
        [5, [new Pair(1, 1), new Pair(4, 1)]],
      ]),
    ],
    [
      "2 3\n1 3\n4 1",
      {
        type: GraphType.AdjList,
        bidirectional: true,
        weighted: false,
        startingIndex: 1,
      },
      new Map([
        [1, [new Pair(2, 1), new Pair(3, 1)]],
        [2, [new Pair(1, 1), new Pair(3, 1)]],
        [3, [new Pair(1, 1), new Pair(4, 1)]],
        [4, []],
      ]),
    ],
  ])("Positive test:\n" + formatStr, testFn);
});

describe("Adjacency Matrix", () => {
  test.each<[string, GraphOptions, AdjList]>([
    [
      "0 1 5 0 0 0\n \
       1 0 0 0 0 3\n \
       5 0 0 0 0 0\n \
       0 0 0 0 0 2\n \
       0 0 0 0 0 3\n \
       0 3 0 2 3 0",
      {
        type: GraphType.AdjMatrix,
        bidirectional: true,
        weighted: false,
        startingIndex: 1,
      },
      new Map([
        [1, [new Pair(2, 1), new Pair(3, 5)]],
        [2, [new Pair(1, 1), new Pair(6, 3)]],
        [3, [new Pair(1, 5)]],
        [4, [new Pair(6, 2)]],
        [5, [new Pair(6, 3)]],
        [6, [new Pair(4, 2), new Pair(5, 3)]],
      ]),
    ],
  ])("Positive test:\n" + formatStr, testFn);
});
