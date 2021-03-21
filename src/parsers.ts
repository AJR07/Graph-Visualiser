import Graph, { AdjList, GraphOptions, GraphType } from "./graph";
import Pair from "./pair";

type GraphParser = (str: string, options: GraphOptions) => Graph | null;

function isNumber(s: string): boolean {
  return /^[0-9]+$/.test(s);
}

function adjlistParser(str: string, options: GraphOptions): Graph | null {
  if (str.trim().length == 0) return null;

  const adjlist: AdjList = new Map();
  for (const [idx, line] of str.split("\n").entries()) {
    const from = idx + options.startingIndex;

    if (from < 0) return null;

    adjlist.set(from, []);

    if (options.weighted) {
      const spaceSeparated = line.split(" ");
      for (let i = 0; i < spaceSeparated.length - 1; i += 2) {
        if (!(isNumber(spaceSeparated[i]) && isNumber(spaceSeparated[i + 1])))
          return null;

        const to = parseInt(spaceSeparated[i], 10) + options.startingIndex;
        const weight = parseInt(spaceSeparated[i + 1], 10);

        if (isNaN(to) || isNaN(weight)) return null;
        if (to < 0) return null;

        adjlist.get(from)?.push(new Pair(to, weight));
      }
    } else {
      for (const toS of line.split(" ")) {
        if (!isNumber(toS)) return null;

        const to = parseInt(toS, 10) + options.startingIndex;

        if (isNaN(to)) return null;
        if (to < 0) return null;

        adjlist.get(from)?.push(new Pair(to, 1));
      }
    }
  }
  return new Graph(adjlist, options);
}

function adjMatrixParser(str: string, options: GraphOptions): Graph | null {
  if (str.trim().length == 0) return null;

  const adjlist: AdjList = new Map();

  for (const [i, line] of str.split("\n").entries()) {
    for (const [j, numS] of line.trim().split(" ").entries()) {
      if (i < 0 || j < 0) return null;

      const from = i + options.startingIndex;
      const to = j + options.startingIndex;

      if (from < 0 || to < 0) return null;

      if (!adjlist.get(from)) adjlist.set(from, []);
      if (!adjlist.get(to)) adjlist.set(to, []);

      if (!isNumber(numS)) return null;
      const n = parseInt(numS.trim(), 10);

      if (isNaN(n)) return null;

      adjlist.get(from)?.push(new Pair(to, n));
    }
  }

  return new Graph(adjlist, options);
}

function edgeListParser(str: string, options: GraphOptions): Graph | null {
  if (str.trim().length == 0) return null;

  const adjlist: AdjList = new Map();
  for (const line of str.split("\n")) {
    // A, B and weight as string
    const [aS, bS, wS, ...remaining] = line.split(" ");

    if (remaining.length > 0) return null;
    if (!(isNumber(aS) && isNumber(bS))) return null;
    if (options.weighted && !isNumber(wS)) return null;

    // We parse the string into int
    const a = parseInt(aS, 10);
    const b = parseInt(bS, 10);
    const w = options.weighted ? parseInt(wS, 10) : 1; // if its unweighted, the weight will default to 1

    if (isNaN(a) || isNaN(b) || isNaN(w)) return null;
    if (a < 0 || b < 0) return null;

    // If the node doesn't exist yet, create a empty array there
    if (!adjlist.has(a)) adjlist.set(a, []);
    // Do the same for all referenced nodes
    if (!adjlist.has(b)) adjlist.set(b, []);
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
