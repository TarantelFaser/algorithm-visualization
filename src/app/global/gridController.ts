import {cellTypes} from "./enums";

export class GridController {
  private static cells : cellTypes[][]| undefined = [];
  private static startCount = 0;
  private static endCount = 0;
  private static startList:number[][] = [];
  private static endList:number[][] = [];

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

  public static setAllCells(type : cellTypes, width= GridController.cells![0].length, height = GridController.cells!.length) {
    if (!GridController.cells) throw new Error("Grid Error!");
    let newCellArray : cellTypes[][] = [];
    for (let i = 0; i < height; i++) {
      newCellArray.push([])
      for (let j = 0; j < width; j++) {
        newCellArray[i].push(type);
      }
    }
    GridController.setCellArray(newCellArray);
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
}
