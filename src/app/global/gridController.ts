import {cellTypes} from "./enums";

export class GridController {
  private static cells : cellTypes[][]| undefined = [];

  public static getCell(x:number, y:number) : cellTypes {
    if (!GridController.cells) {
      throw new Error("Grid Error!");
    }
    return GridController.cells[x][y];
  }

  public static setCell(x : number, y : number, type : cellTypes) : boolean {
    if (!GridController.cells) {
      throw new Error("Grid Error!");
    }
    GridController.cells[x][y] = type;
    return true;
  }

  public static cellEquals(x : number, y : number, type : cellTypes) : boolean {
    if (!GridController.cells) {
      throw new Error("Grid Error!");
    }
    return GridController.cells[x][y] === type;
  }

  public static getCellArray() {
    if (!GridController.cells) {
      throw new Error("Grid Error!");
    }
    return GridController.cells;
  }

  public static setCellArray(array : cellTypes[][]) {
    GridController.cells = array;
  }
}
