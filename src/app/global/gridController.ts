import {cellTypes} from "./enums";
import {Dir} from "@angular/cdk/bidi";

export enum Direction {
  None,
  Up,
  Down,
  Left,
  Right
}


export class GridController {

  //arrays used for visualization / animations and path construction
  private static cells : cellTypes[][]| undefined = [];
  private static cellAge : number[][] = [];
  private static path : Direction[][] = []
  private static startCount = 0;
  private static endCount = 0;
  private static startList:number[][] = [];
  private static endList:number[][] = [];
  public static pathComplete = false;

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
    if (GridController.cellEquals(x, y, cellTypes.Start)) GridController.startCount--;
    if (GridController.cellEquals(x, y, cellTypes.End)) GridController.endCount--;
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
}
