export enum cellTypes {
  Unused ,
  Start,
  End,
  Path,
  Selected,
  Highlighted,
  Wall,
  Null
}

export enum useMode {
  NoInteraction,
  None,
  PlaceWall,
  DraggingStart,
  DraggingEnd
}

export enum Direction {
  None,
  Up,
  Down,
  Left,
  Right
}

export enum Algorithms {
  BreadthFirstSearch= "Breadth First Search",
  //DepthFirstSearch = "Depth First Search",
  //Dijkstra = "Dijkstra",
  //AStar = "A*"
}

export enum GridGeneration {
  None = "None",
  Random = "Random",
  Fill = "Fill",
  MazePrim_straightWalls = "Maze (Prim's Algorithm)",
  MazePrim = "Maze (Prim's Algorithm, alt)",
  DFS_straightWalls = "Maze (Randomized Depth-First Search)",
  DFS = "Maze (Randomized Depth-First Search, alt)",
}
