import {Algorithms, cellTypes, Direction, GridGeneration} from "./enums";
import {AlgorithmsController} from "./algorithmsController";




export class GridController {

  //arrays used for visualization / animations and path construction
  private static cells : cellTypes[][]| undefined = [];
  private static path : Direction[][] = []
  private static startCount = 0;
  private static endCount = 0;
  private static startList:number[][] = [];
  private static endList:number[][] = [];

  public static width = 0;
  public static height = 0;

  public static showAnimations = true;

  public static selectedGridGen = GridGeneration.None.valueOf();
  public static gridGenOptions = Object.values(GridGeneration);

  public static directions : Direction[] = [Direction.Left, Direction.Right, Direction.Up,  Direction.Down];

  public static getCell(x:number, y:number) : cellTypes {
    if (!GridController.cells) throw new Error("Grid Error!");
    let maxHor = GridController.cells[0].length;
    let maxVer = GridController.cells.length;
    if (x < 0 || x >= maxHor || y < 0 || y >= maxVer) {
      return cellTypes.Null;
    }
    return GridController.cells[y][x];
  }

  public static setCell(x : number, y : number, type : cellTypes) : boolean {
    if (!GridController.cells) throw new Error("Grid Error!");

    if (GridController.cellEquals(x, y, cellTypes.Start)) {
      GridController.startCount--;
      //remove entry from list
      let newList: number[][] = [];
      GridController.startList.forEach((el) => {
        if (el[0] !== x && el[1] !== y) newList.push(el)})
      GridController.startList = newList;
    } else if (GridController.cellEquals(x, y, cellTypes.End)) {
      GridController.endCount--;
      //remove entry from list
      let newList: number[][] = [];
      GridController.endList.forEach((el) => {
        if (el[0] !== x && el[1] !== y) newList.push(el)})
      GridController.endList = newList;
    }

    if (type === cellTypes.Start) {
      GridController.startCount++;
      GridController.startList.push([x,y]);
    }
    if (type === cellTypes.End) {
      GridController.endCount++;
      GridController.endList.push([x,y]);
    }

    GridController.cells[y][x] = type;
    return true;
  }

  public static cellEquals(x : number, y : number, type : cellTypes) : boolean {
    if (!GridController.cells) throw new Error("Grid Error!");
    return GridController.cells[y][x] === type;
  }

  public static getCellArray() {
    if (!GridController.cells) throw new Error("Grid Error!");
    return GridController.cells;
  }

  public static setCellArray(array : cellTypes[][]) {
    GridController.cells = array;
  }

  public static setDirArray(array : Direction[][]) {
    GridController.path = array;
  }

  public static setAllCells(type : cellTypes, width= GridController.cells![0].length, height = GridController.cells!.length) {
    if (!GridController.cells) throw new Error("Grid Error!");

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        GridController.cells[y][x] = type;
        GridController.path[y][x] = Direction.None;
      }
    }

    GridController.startList = [];
    GridController.endList = [];
    GridController.startCount = 0;
    GridController.endCount = 0;
  }

  public static generateGridArray(width : number, height : number, type : cellTypes){
    if (!GridController.cells) throw new Error("Grid Error!");
    let newCellArray : cellTypes[][] = [];
    let newDirArray : Direction[][] = [];
    for (let i = 0; i < height; i++) {
      newCellArray.push([]);
      newDirArray.push([]);
      for (let j = 0; j < width; j++) {
        newCellArray[i].push(type);
        newDirArray[i].push(Direction.None);
      }
    }
    GridController.setCellArray(newCellArray);
    GridController.setDirArray(newDirArray);

    GridController.startList = [];
    GridController.endList = [];
    GridController.startCount = 0;
    GridController.endCount = 0;
  }

  public static getStartList() {
    return GridController.startList;
  }
  public static getEndList() {
    return GridController.endList;
  }

  public static removeAllHighlightsPaths() {
    for (let i = 0; i < this.height; i++) {
      for (let j = 0; j < this.width; j++) {
        let cell = GridController.getCell(j,i);
        if (cell === cellTypes.Highlighted || cell === cellTypes.Path) {
          GridController.setCell(j,i,cellTypes.Unused);
          GridController.setCellDir(j,i, Direction.None);
        }
      }
    }
  }

  public static getCellDir(x:number, y:number) {
    return GridController.path[y][x];
  }

  public static setCellDir(x:number, y:number, dir:Direction) {
    GridController.path[y][x] = dir;
  }

  public static async generateGrid() {
    AlgorithmsController.stopAlgorithm();

    if (GridController.selectedGridGen === GridGeneration.None) {
      await GridController.setAllCells(cellTypes.Unused);
    } else if (GridController.selectedGridGen === GridGeneration.Random) {
      await GridController.generateRandomGrid();
    } else if (GridController.selectedGridGen === GridGeneration.MazePrim) {
      await GridController.generateMazeRandomPrimAlgorithm();
    }
    GridController.placeStartEndRandom();
  }

  private static async generateRandomGrid() {
    if (!GridController.cells) return;
    let chance = 0.3;
    for (let y = 0; y < GridController.cells.length; y++) {
      for (let x = 0; x < GridController.cells[0].length; x++) {
        if (Math.random() < chance) {
          GridController.setCell(x, y, cellTypes.Wall);
        } else {
          GridController.setCell(x, y, cellTypes.Unused);
        }
      }
      await new Promise(f => setTimeout(f, 1));
    }
  }

  private static async generateMazeRandomPrimAlgorithm() {
    if (!GridController.cells) return;
    //first create a second array to store the maze -> reduces lag
    let mazeArray : cellTypes[][] = [];
    for (let y = 0; y < GridController.cells.length; y++) {
      mazeArray.push([]);
      for (let x = 0; x < GridController.cells[0].length; x++) {
        mazeArray[y][x] = cellTypes.Wall;
      }
    }
    let wallList : number[][] = [];
    //pick a random starting cell
    let startX = Math.floor(Math.random() * (GridController.width-2))+1;
    let startY = Math.floor(Math.random() * (GridController.height-2))+1;

    //set the starting cell to unused
    mazeArray[startY][startX] = cellTypes.Unused;

    //add all walls of the starting cell to the wall list
    wallList.push([startX-1, startY]);
    wallList.push([startX+1, startY]);
    wallList.push([startX, startY-1]);
    wallList.push([startX, startY+1]);

    //while there are still walls in the list
    while (wallList.length > 0) {
      //pick a random wall from the list
      let wallIndex = Math.floor(Math.random() * wallList.length);
      let wall = wallList[wallIndex];

      //check if wall is not on the edge
      if (wall[0] === 0 || wall[0] === GridController.width-1 || wall[1] === 0 || wall[1] === GridController.height-1) {
        wallList.splice(wallIndex, 1);
        continue;
      }

      //if only one neighbor is unused
      let unusedNeighbors = 0;
      if (mazeArray[wall[1]][wall[0]-1] === cellTypes.Unused) unusedNeighbors++;
      if (mazeArray[wall[1]][wall[0]+1] === cellTypes.Unused) unusedNeighbors++;
      if (mazeArray[wall[1]-1][wall[0]] === cellTypes.Unused) unusedNeighbors++;
      if (mazeArray[wall[1]+1][wall[0]] === cellTypes.Unused) unusedNeighbors++;
      if (unusedNeighbors === 1) {
        //make the wall a passage
        mazeArray[wall[1]][wall[0]] = cellTypes.Unused;

        //add the neighboring walls to the wall list
        if (mazeArray[wall[1]][wall[0]-1] === cellTypes.Wall) wallList.push([wall[0]-1, wall[1]]);
        if (mazeArray[wall[1]][wall[0]+1] === cellTypes.Wall) wallList.push([wall[0]+1, wall[1]]);
        if (mazeArray[wall[1]-1][wall[0]] === cellTypes.Wall) wallList.push([wall[0], wall[1]-1]);
        if (mazeArray[wall[1]+1][wall[0]] === cellTypes.Wall) wallList.push([wall[0], wall[1]+1]);
      }

      //remove the wall from the list
      wallList.splice(wallIndex, 1);
    }


    //secondly copy the maze to GridController.cells row by row
    for (let y = 0; y < GridController.cells.length; y++) {
      for (let x = 0; x < GridController.cells[0].length; x++) {
        GridController.setCell(x, y, mazeArray[y][x]);
      }
      await new Promise(f => setTimeout(f, 1));
    }
  }

  public static placeStartEndRandom() {
    if (!GridController.cells) return;

    //place start and end randomly, but somewhat centered
    const centerPlacementPercent = 0.75;
    let offsetX = Math.floor((1 - centerPlacementPercent) * GridController.width / 2);
    let offsetY = Math.floor((1 - centerPlacementPercent) * GridController.height / 2);
    let startX = Math.floor(Math.random() * GridController.width*centerPlacementPercent) + offsetX;
    let startY = Math.floor(Math.random() * GridController.height*centerPlacementPercent) + offsetY;

    let endX = Math.floor(Math.random() * GridController.width*centerPlacementPercent) + offsetX;
    let endY = Math.floor(Math.random() * GridController.height*centerPlacementPercent) + offsetY;

    if (startX === endX && startY === endY) {
      if (startX === 0) {
        endX++;
      } else {
        endX--;
      }
    }

    GridController.setCell(startX, startY, cellTypes.Start);
    GridController.setCell(endX, endY, cellTypes.End);
  }

  public static getNeighborCellIndex(direction : Direction, x:number, y:number) {
    let dir = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
    return dir[GridController.directions.indexOf(direction)];
  }
}
