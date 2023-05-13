import {cellTypes} from "./enums";

export class GridController {
  private static cells : cellTypes[][]| undefined = [];
  private static startCount = 0;
  private static endCount = 0;

  public static getCell(x:number, y:number) : cellTypes {
    if (!GridController.cells) throw new Error("Grid Error!");
    return GridController.cells[x][y];
  }

  public static setCell(x : number, y : number, type : cellTypes) : boolean {
    if (!GridController.cells) throw new Error("Grid Error!");
    if (GridController.cellEquals(x, y, cellTypes.Start)) GridController.startCount--;
    if (GridController.cellEquals(x, y, cellTypes.End)) GridController.endCount--;
    if (type === cellTypes.Start) GridController.startCount++;
    if (type === cellTypes.End) GridController.endCount++;

    GridController.cells[x][y] = type;
    return true;
  }

  public static cellEquals(x : number, y : number, type : cellTypes) : boolean {
    if (!GridController.cells) throw new Error("Grid Error!");
    return GridController.cells[x][y] === type;
  }

  public static getCellArray() {
    if (!GridController.cells) throw new Error("Grid Error!");
    return GridController.cells;
  }

  public static setCellArray(array : cellTypes[][]) {
    GridController.cells = array;
  }

  public static canPlaceStart() {
    return GridController.startCount === 0;
  }

  public static canPlaceEnd() {
    return GridController.endCount === 0;
  }
}
