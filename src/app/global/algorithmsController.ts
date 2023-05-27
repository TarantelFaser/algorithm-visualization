import {cellTypes} from "./enums";
import {GridController} from "./gridController";
import {BreadthFirstSearchController} from "./algorithms/breadthFirstSearch";

export class AlgorithmsController {
  public static algorithmCanRun = false;

  public static selectedAlgorithm = "Breadth First Search";
  public static algorithmOptions = ["Breadth First Search", "Depth First Search", "Dijkstra", "A*"];

  public static stopAlgorithm() {
    AlgorithmsController.algorithmCanRun = false;
    GridController.setAllCells(cellTypes.Unused);
    GridController.placeStartEndRandom();
  }

  public static async runAlgorithm() {
    AlgorithmsController.algorithmCanRun = true;
    if (AlgorithmsController.selectedAlgorithm === "Breadth First Search") {
      await BreadthFirstSearchController.bfs();
    } else if (AlgorithmsController.selectedAlgorithm === "Depth First Search") {
      //AlgorithmsController.depthFirstSearch();
    } else if (AlgorithmsController.selectedAlgorithm === "Dijkstra") {
      //AlgorithmsController.dijkstra();
    } else if (AlgorithmsController.selectedAlgorithm === "A*") {
      //AlgorithmsController.aStar();
    }
  }
}
