import {cellTypes} from "./enums";

export class GridController {
  public static cells : cellTypes[][]| undefined = [];

  public getCell(x:number, y:number) {
    if (!GridController.cells) {
      throw new Error("Grid Error!");
    }
    return GridController.cells[x][y];
  }

  public setCell(x : number, y : number, type : cellTypes) {
    if (!GridController.cells) {
      throw new Error("Grid Error!");
    }
    GridController.cells[x][y] = type;
    return true;
  }
}
