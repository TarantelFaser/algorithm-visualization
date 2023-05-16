import {cellTypes, Direction} from "./enums";
import {AlgorithmsController} from "./algorithmsController";




export class GridController {

  //arrays used for visualization / animations and path construction
  private static cells : cellTypes[][]| undefined = [];
  private static cellAge : number[][] = [];
  private static path : Direction[][] = []
  private static startCount = 0;
  private static endCount = 0;
  private static startList:number[][] = [];
  private static endList:number[][] = [];
  public static algorithmDone = false;

  public static width = 0;
  public static height = 0;

  public static showAnimations = true;

  public static selectedGridGen = "Random";
  public static gridGenOptions = ["Random", "Maze"];

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

  public static setCellAgeArray(array : number[][]) {
    GridController.cellAge = array;
  }

  public static setDirArray(array : Direction[][]) {
    GridController.path = array;
  }

  public static setAllCells(type : cellTypes, width= GridController.cells![0].length, height = GridController.cells!.length) {
    if (!GridController.cells) throw new Error("Grid Error!");
    let newCellArray : cellTypes[][] = [];
    let newCellAgeArray : number[][] = [];
    let newDirArray : Direction[][] = [];
    for (let i = 0; i < height; i++) {
      newCellArray.push([]);
      newCellAgeArray.push([]);
      newDirArray.push([]);
      for (let j = 0; j < width; j++) {
        newCellArray[i].push(type);
        newCellAgeArray[i].push(0);
        newDirArray[i].push(Direction.None);
      }
    }
    GridController.setCellArray(newCellArray);
    GridController.setCellAgeArray(newCellAgeArray);
    GridController.setDirArray(newDirArray);

    GridController.startList = [];
    GridController.endList = [];
    GridController.startCount = 0;
    GridController.endCount = 0;
  }

  public static canPlaceStart() {
    return GridController.startCount === 0;
  }

  public static canPlaceEnd() {
    return GridController.endCount === 0;
  }

  public static getStartList() {
    return GridController.startList;
  }
  public static getEndList() {
    return GridController.endList;
  }

  public static removeAllHighlightsPaths() {
    let width= GridController.cells![0].length;
    let height = GridController.cells!.length
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        let cell = GridController.getCell(j,i);
        if (cell === cellTypes.Highlighted || cell === cellTypes.Path) {
          GridController.setCell(j,i,cellTypes.Unused);
          GridController.setCelLDir(j,i, Direction.None);
          GridController.setCellAge(j,i, 0);
        }
      }
    }
  }

  public static getCellAge(x:number, y:number) {
    return GridController.cellAge[y][x];
  }

  public static setCellAge(x:number, y:number, age:number) {
    GridController.cellAge[y][x] = age;
  }

  public static setCellAgeRelative(x:number, y:number, relative:number) {
    GridController.cellAge[y][x] += relative;
  }

  public static getCellDir(x:number, y:number) {
    return GridController.path[y][x];
  }

  public static setCelLDir(x:number, y:number, dir:Direction) {
    GridController.path[y][x] = dir;
  }

  public static generateGrid() {
    AlgorithmsController.stopAlgorithm();

    if (GridController.selectedGridGen === "Random") {
      GridController.generateRandomGrid();
    } else if (GridController.selectedGridGen === "Maze") {
      GridController.generateMazeGrid();
    }
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

  private static generateMazeGrid() {
    return;
  }
}
