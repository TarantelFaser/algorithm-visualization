import {Queue} from "../Queue";
import {GridController} from "../gridController";
import {cellTypes} from "../enums";
import {UserController} from "../userController";
import {AlgorithmsController} from "../algorithmsController";

export class BreadthFirstSearchController {

  public static async bfs() {
    let queue: Queue<number[]> = new Queue()
    queue.enqueue([AlgorithmsController.startingPoint[0], AlgorithmsController.startingPoint[1]]);
    let iterationCounter = 0;

    while (!queue.isEmpty() && !AlgorithmsController.hasFoundPath && AlgorithmsController.canRun) {
      iterationCounter++;
      //check neighboring cells and enqueue if valid
      let coords = queue.dequeue();
      let x = coords![0];
      let y = coords![1];
      for (let index = 0; index < 4; index++) {
        let ar = GridController.getNeighborCellIndex(GridController.directions[index],x,y)
        let cell = GridController.getCell(ar[0], ar[1]);
        if (cell === cellTypes.End) {
          AlgorithmsController.hasFoundPath = true; //stop the exploration
          GridController.setCellDir(ar[0], ar[1], GridController.directions[index]);
        } else if (cell === cellTypes.Unused) {
          queue.enqueue(ar);
          GridController.setCellDir(ar[0], ar[1], GridController.directions[index]);
          GridController.setCell(ar[0], ar[1], cellTypes.Highlighted)
        }
      }

      if (GridController.showAnimations && iterationCounter % UserController.animationSpeed === 0) {
        await new Promise(f => setTimeout(f, 1));
      }
    }
  }
}
