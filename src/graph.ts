import Pair from "./pair";
import PARSERS from "./parsers";

export type AdjList = Map<number, Pair<number, number>[]>; // from => (to, weight)
export type EdgeList = [number, number, number][]; // [from, to, weight]

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

  get minWeight(): number {
    let minWeight = Infinity;

    for (const edge of Graph.adjlistToEdgelist(this.adjlist)) {
      if (edge[2] < minWeight) minWeight = edge[2];
    }
    return minWeight;
  }

  get maxWeight(): number {
    let maxWeight = -Infinity;
    for (const edge of Graph.adjlistToEdgelist(this.adjlist)) {
      if (edge[2] > maxWeight) maxWeight = edge[2];
    }
    return maxWeight;
  }

  /**
   * Parses a graph from a string using the provided options
   *
   * @param str The string to parse
   * @param options The graph options
   * @returns The parsed graph
   */
  static parseGraph(str: string, options: GraphOptions): Graph | null {
    return PARSERS[options.type](str, options);
  }

  static adjlistToEdgelist(adjlist: AdjList): EdgeList {
    const edgeList: EdgeList = [];

    for (const [from, edges] of adjlist) {
      for (const edge of edges) {
        if (
          edgeList.filter(
            (v) =>
              (from == v[0] && edge.first == v[1] && edge.second == v[2]) ||
              (edge.first == v[0] && from == v[1] && edge.second == v[2])
          ).length != 0
        ) {
          continue;
        }

        edgeList.push([from, edge.first, edge.second]);
      }
    }

    return edgeList;
  }
}

export const DEFAULT_GRAPH = "1 2 1\n1 3 5\n2 6 3\n4 6 2\n5 6 3";

export const DEFAULT_GRAPH_OPTIONS: GraphOptions = {
  type: GraphType.EdgeList,
  bidirectional: true,
  weighted: true,
  startingIndex: 1,
};
