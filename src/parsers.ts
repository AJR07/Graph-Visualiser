import Graph, { GraphOptions, GraphType } from "./graph";
import Pair from "./pair";

type GraphParser = (str: string, options: GraphOptions) => Graph;

function adjlistParser(str: string, options: GraphOptions): Graph {
  const adjlist = new Map();
  for (const [idx, line] of str.split("\n").entries()) {
    const from = idx + options.startingIndex;
    adjlist.set(from, []);

    if (options.weighted) {
      const spaceSeparated = line.split(" ");
      for (let i = 0; i < spaceSeparated.length - 1; i += 2) {
        const to = parseInt(spaceSeparated[i], 10) + options.startingIndex;
        const weight = parseInt(spaceSeparated[i + 1], 10);
        adjlist.get(from)?.push(new Pair(to, weight));
      }
    } else {
      for (const toS of line.split(" ")) {
        const to = parseInt(toS, 10) + options.startingIndex;
        adjlist.get(from)?.push(new Pair(to, 1));
      }
    }
  }
  return new Graph(adjlist, options);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function adjMatrixParser(str: string, options: GraphOptions): Graph {
  throw new Error("Not implemented");
}

function edgeListParser(str: string, options: GraphOptions): Graph {
  const adjlist = new Map();
  for (const line of str.split("\n")) {
    // A, B and weight as string
    const [aS, bS, wS] = line.split(" ");
    if (!aS || !bS || !wS) continue;

    // We parse the string into int
    // TODO: Check for invalid input like not number, negatives, etc
    const a = parseInt(aS, 10);
    const b = parseInt(bS, 10);
    const w = options.weighted ? parseInt(wS, 10) : 1; // if its unweighted, the weight will default to 1

    // If the node doesn't exist yet, create a empty array there
    if (!adjlist.has(a)) adjlist.set(a, []);
    // We push the new node + weight into the adjacency list
    adjlist.get(a)?.push(new Pair(b, w));

    // we do the same for the opposite if its bidirectional
    if (options.bidirectional) {
      if (!adjlist.has(b)) adjlist.set(b, []);
      adjlist.get(b)?.push(new Pair(a, w));
    }
  }
  return new Graph(adjlist, options);
}
const PARSERS: { [k in GraphType]: GraphParser } = {
  AdjList: adjlistParser,
  AdjMatrix: adjMatrixParser,
  EdgeList: edgeListParser,
};

export default PARSERS;
