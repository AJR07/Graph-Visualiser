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
    
      //supports only weights that are 1 digit only so far
      case GraphType.AdjList:
        let nodeNo = options.startingIndex, w;
        adjlist.set(nodeNo, []);
        if (options.bidirectional) {
          //loop through the string
          for (let i = 0; i < str.length; i++) {
            if (options.weighted) {
              //if it is weighted the weight will be at the current position + 2 
              w = parseInt(str[i + 2]);
              i += 3; //increase i by 3 to skip the current node-weight pair
              if (str[i] == '\n') { //if there's a new line between current node weight-pair
                //and next node-weight pair create new part of the map
                nodeNo++;
                adjlist.set(nodeNo, []);
              }
              adjlist.get(nodeNo)?.push(new Pair(parseInt(str[i]), w));
            } else {
              w = 1; //if its not weighted default to 1
              adjlist.get(nodeNo)?.push(new Pair(parseInt(str[i]), w));
              i++;
              if (str[i] == '\n') { //if there's a new line between current node weight-pair
                //and next node-weight pair create new part of the map
                nodeNo++;
                adjlist.set(nodeNo, []);
              }
            }
          }
          console.log(adjlist)
        }
        break;

      default:
        throw `Graph type ${options.type} not implemented`;
      
      
      
      // TODO: Implement other graph types
    }

    return new Graph(adjlist, options);
  }

}