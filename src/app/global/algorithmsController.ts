import {cellTypes} from "./enums";
import {GridController} from "./gridController";

export class AlgorithmsController {
  public static algorithmCanRun = true;

  public static stopAlgorithm() {
    AlgorithmsController.algorithmCanRun = false;
    GridController.setAllCells(cellTypes.Unused);
  }
}
