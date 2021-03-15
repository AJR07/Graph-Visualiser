import PARSERS from "./parsers";
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
    return PARSERS[options.type](str, options);
  }
}

// These are the default graph that's shown when the user first comes on
export const DEFAULT_GRAPH = "1 2 1\n1 3 4\n2 6 3\n4 6 2\n5 6 3";
export const DEFAULT_GRAPH_OPTIONS: GraphOptions = {
  type: GraphType.EdgeList,
  bidirectional: true,
  weighted: true,
  startingIndex: 1,
};
