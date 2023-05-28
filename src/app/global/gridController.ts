import {cellTypes, Direction, GridGeneration} from "./enums";
import {AlgorithmsController} from "./algorithmsController";
import {GridGenerationController} from "./gridGenerationController";




export class GridController {

  //arrays used for visualization / animations and path construction
  static cells : cellTypes[][]| undefined = [];
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

    switch (GridController.selectedGridGen) {
      case GridGeneration.None:
        await GridController.setAllCells(cellTypes.Unused);
        break;
      case GridGeneration.Random:
        await GridGenerationController.generateRandomGrid();
        break;
      case GridGeneration.MazePrim_straightWalls:
        await GridGenerationController.generateMazeRandomPrimAlgorithm(true);
        break;
      case GridGeneration.MazePrim:
        await GridGenerationController.generateMazeRandomPrimAlgorithm(false);
        break;
      case GridGeneration.DFS_straightWalls:
        await GridGenerationController.randomizedDFS(true);
        break;
      case GridGeneration.DFS:
        await GridGenerationController.randomizedDFS(false);
        break;
      case GridGeneration.Fill:
        await GridGenerationController.fillGrid();
        break;
      case GridGeneration.Kruskal:
        await GridGenerationController.generateMazeKruskal();
        break;
    }

    GridController.placeStartEndRandom();
  }

  public static placeStartEndRandom() {
    if (!GridController.cells) return;

    //place start and end randomly, but somewhat centered
    const centerPlacementPercent = 0.8;
    const minimumDistance = 0.4 * centerPlacementPercent * Math.min(GridController.width, GridController.height);

    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;

    let calcAgain = true;
    while (calcAgain) {
      calcAgain = false;
      let offsetX = Math.floor((1 - centerPlacementPercent) * GridController.width / 2);
      let offsetY = Math.floor((1 - centerPlacementPercent) * GridController.height / 2);
      startX = Math.floor(Math.random() * GridController.width*centerPlacementPercent) + offsetX;
      startY = Math.floor(Math.random() * GridController.height*centerPlacementPercent) + offsetY;
      endX = Math.floor(Math.random() * GridController.width*centerPlacementPercent) + offsetX;
      endY = Math.floor(Math.random() * GridController.height*centerPlacementPercent) + offsetY;

      let distance = Math.sqrt(Math.pow(Math.abs(startX - endX), 2) + Math.pow(Math.abs(startY - endY), 2))

      if ((startX === endX && startY === endY)
        || distance < minimumDistance) {
        calcAgain = true;
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
