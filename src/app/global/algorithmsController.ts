import {Algorithms, cellTypes, Direction} from "./enums";
import {GridController} from "./gridController";
import {BreadthFirstSearchController} from "./algorithms/breadthFirstSearch";
import {UserController} from "./userController";

export class AlgorithmsController {
  public static canRun = false; //used to stop the algorithm
  public static hasFoundPath = false;
  public static isDone = false;
  public static selectedAlgorithm = Algorithms.BreadthFirstSearch.valueOf();
  public static algorithmOptions = Object.values(Algorithms);

  public static startingPoint :number[] = [];

  public static stopAlgorithm(clearGrid: boolean = true) {
    AlgorithmsController.canRun = false;
    if (clearGrid) {
      GridController.setAllCells(cellTypes.Unused);
    }
  }

  public static async runAlgorithm() {
    if (GridController.getStartList().length === 0) return;

    AlgorithmsController.canRun = true;
    AlgorithmsController.hasFoundPath = false;
    AlgorithmsController.isDone = false;
    GridController.removeAllHighlightsPaths();

    AlgorithmsController.startingPoint = GridController.getStartList()[0];

    if (AlgorithmsController.selectedAlgorithm === Algorithms.BreadthFirstSearch) {
      await BreadthFirstSearchController.bfs();
    } /* else if (AlgorithmsController.selectedAlgorithm === Algorithms.DepthFirstSearch) {
      //AlgorithmsController.depthFirstSearch();
    } else if (AlgorithmsController.selectedAlgorithm === Algorithms.Dijkstra) {
      //AlgorithmsController.dijkstra();
    } else if (AlgorithmsController.selectedAlgorithm === Algorithms.AStar) {
      //AlgorithmsController.aStar();
    } */

    AlgorithmsController.isDone = true;

    if (AlgorithmsController.hasFoundPath) {
      await AlgorithmsController.constructPath(GridController.getEndList()[0][0], GridController.getEndList()[0][1]);
    }
  }

  public static async runAlgorithmNoAnimations() {
    GridController.showAnimations = false;
    await AlgorithmsController.runAlgorithm()
    GridController.showAnimations = true;
  }

  static async constructPath(end_x: number, end_y: number) {
    let nextCell = [end_x, end_y];
    nextCell = AlgorithmsController.getNextCell(nextCell[0],nextCell[1]);
    let queueCounter = 0;
    while (!GridController.cellEquals(nextCell[0], nextCell[1], cellTypes.Start)) {
      GridController.setCell(nextCell[0], nextCell[1], cellTypes.Path);
      queueCounter++;
      let x = nextCell[0];
      let y = nextCell[1];
      nextCell = AlgorithmsController.getNextCell(x,y);

      if (GridController.showAnimations && queueCounter % UserController.animationSpeed === 0) {
        await new Promise(f => setTimeout(f, 40));
      }
    }
  }

  private static getNextCell(x:number,y:number) {
    let nextCell;
    switch (GridController.getCellDir(x, y)) {
      case Direction.Up:
        nextCell = [x, y - 1];
        break;
      case Direction.Down:
        nextCell = [x, y + 1];
        break;
      case Direction.Left:
        nextCell = [x - 1, y];
        break;
      case Direction.Right:
        nextCell = [x + 1, y];
        break;
      default:
        nextCell = [x,y];
        break;
    }
    return nextCell;
  }
}
