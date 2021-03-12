import Pair from "./pair";

export type AdjList = Map<number, Pair[]>;
export type EdgeList = [number, number, number][];

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

export default class Graph {
  adjlist: AdjList;
  options: GraphOptions;

  constructor(adjlist: AdjList, options: GraphOptions) {
    this.adjlist = adjlist;
    this.options = options;
  }

  static parseGraph(str: string, options: GraphOptions): Graph {

    let adjlist: AdjList = new Map();

    switch (options.type) {
      case GraphType.EdgeList:
        for (const line of str.split("\n")) {
          const [aS, bS, wS] = line.split(" ");
          if (!aS || !bS || !wS) continue;

          const a = parseInt(aS);
          const b = parseInt(bS);
          const w = options.weighted ? parseInt(wS) : 1;

          if (!adjlist.has(a)) adjlist.set(a, []);
          adjlist.get(a)?.push(new Pair(b, w));

          if (options.bidirectional) {
            if (!adjlist.has(b)) adjlist.set(b, []);
            adjlist.get(b)?.push(new Pair(a, w));
          }
        }
        break;
      default:
        throw `Graph type ${options.type} not implemented`;
      // TODO: Implement other graph types
    }

    return new Graph(adjlist, options);
  }

}