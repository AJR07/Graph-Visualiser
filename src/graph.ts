import Pair from "./pair";

// "typedef" for adjacency list
// The pair is Pair(node, weight)
export type AdjList = Map<number, Pair<number, number>[]>;

export enum GraphType {
  AdjList = "AdjList",
  AdjMatrix = "AdjMatrix",
  EdgeList = "EdgeList",
}

export interface GraphOptions {
  type: GraphType;
  weighted: boolean;
  bidirectional: boolean;
  startingIndex: number;
}

/**
 * Stores information about a graph
 */
export default class Graph {
  adjlist: AdjList;
  options: GraphOptions;

  constructor(adjlist: AdjList, options: GraphOptions) {
    this.adjlist = adjlist;
    this.options = options;
  }

  /**
   * Parses a graph from a string using the provided options
   * 
   * @param str The string to parse
   * @param options The graph options
   * @returns The parsed graph
   */
  static parseGraph(str: string, options: GraphOptions): Graph {
    let adjlist: AdjList = new Map();

    switch (options.type) {
      case GraphType.EdgeList:
        for (const line of str.split("\n")) {
          // A, B and weight as string
          const [aS, bS, wS] = line.split(" ");
          if (!aS || !bS || !wS) continue;

          // We parse the string into int
          // TODO: Check for invalid input like not number, negatives, etc
          const a = parseInt(aS);
          const b = parseInt(bS);
          const w = options.weighted ? parseInt(wS) : 1; // if its unweighted, the weight will default to 1

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
        break;

      case GraphType.AdjList:
        for (const [idx, line] of str.split("\n").entries()) {
          const from = idx + options.startingIndex;
          adjlist.set(from, []);

          if (options.weighted) {
            const spaceSeparated = line.split(" ");
            for (let i = 0; i < spaceSeparated.length - 1; i += 2) {
              const to = parseInt(spaceSeparated[i]) + options.startingIndex;
              const weight = parseInt(spaceSeparated[i + 1]);
              adjlist.get(from)?.push(new Pair(to, weight));
              if (options.bidirectional) {
                if (!adjlist.get(to)) adjlist.set(to, []);
                adjlist.get(to)?.push(new Pair(from, weight));
              }
            }
          } else {
            for (const toS of line.split(" ")) {
              const to = parseInt(toS) + options.startingIndex;
              adjlist.get(from)?.push(new Pair(to, 1));
              if (options.bidirectional) {
                if (!adjlist.get(to)) adjlist.set(to, []);
                adjlist.get(to)?.push(new Pair(from, 1));
              }
            }
          }
        }
        break;

      case GraphType.AdjMatrix:

        break;

      default:
        throw `Graph type ${options.type} not implemented`;
    }

    return new Graph(adjlist, options);
  }

}