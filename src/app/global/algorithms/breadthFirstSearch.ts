import {Queue} from "../Queue";
import {GridController} from "../gridController";
import {cellTypes} from "../enums";
import {UserController} from "../userController";

export class BreadthFirstSearchController {

  public static async bfs(x: number, y: number) {
    GridController.removeAllHighlightsPaths();

    console.log("STARTING BFS")
    let queue: Queue<number[]> = new Queue()
    queue.enqueue([x, y])

    let queueCounter = 0;
    while (!queue.isEmpty()) {
      queueCounter++;
      let coords = queue.dequeue();
      if (!coords) break;
      x = coords[0];
      y = coords[1];

      //check neighboring cells and enqueue if valid
      const dir = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      for (let ar of dir) {
        let cell = GridController.getCell(ar[0], ar[1]);
        if (cell === cellTypes.End) {
          console.log("FOUND END")
          return;
        } else if (cell === cellTypes.Unused) {
          queue.enqueue(ar);
          GridController.setCell(ar[0], ar[1], cellTypes.Highlighted)
        }
      }

      if (queueCounter % UserController.animationSpeed === 0) {
        await new Promise(f => setTimeout(f, 1));
      }
    }
  }
}
