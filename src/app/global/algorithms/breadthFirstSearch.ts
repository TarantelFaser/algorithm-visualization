import {Queue} from "../Queue";
import {Direction, GridController} from "../gridController";
import {cellTypes} from "../enums";
import {UserController} from "../userController";

export class BreadthFirstSearchController {
  public static showAnimations = true;

  public static async bfs(x: number, y: number) {
    GridController.algorithmDone = false;
    GridController.removeAllHighlightsPaths();

    console.log("STARTING BFS")
    let queue: Queue<number[]> = new Queue()
    queue.enqueue([x, y])

    let iterationCounter = 0;
    let foundEnd = false;
    while (!queue.isEmpty() && !foundEnd) {
      iterationCounter++;
      let coords = queue.dequeue();
      if (!coords) break;

      //used for path construction, saves direction from ending to starting point
      x = coords[0];
      y = coords[1];
      const dir = [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]];
      const directions : Direction[] = [Direction.Left, Direction.Right, Direction.Up,  Direction.Down];

      //check neighboring cells and enqueue if valid
      dir.forEach((ar, index) => {
        let cell = GridController.getCell(ar[0], ar[1]);
        if (cell === cellTypes.End) {
          foundEnd = true; //stop the exploration
          GridController.setCelLDir(ar[0], ar[1], directions[index]);
          BreadthFirstSearchController.constructPath(ar[0],ar[1]);
        } else if (cell === cellTypes.Unused) {
          queue.enqueue(ar);
          GridController.setCelLDir(ar[0], ar[1], directions[index]);
          GridController.setCell(ar[0], ar[1], cellTypes.Highlighted)
          GridController.setCellAge(ar[0], ar[1], iterationCounter);
        }
      });

      if (BreadthFirstSearchController.showAnimations && iterationCounter % UserController.animationSpeed === 0) {
        await new Promise(f => setTimeout(f, 1));
      }
    }
    GridController.algorithmDone = true;
  }

  private static async constructPath(end_x: number, end_y: number) {
    let nextCell = [end_x, end_y];
    nextCell = BreadthFirstSearchController.getNextCell(nextCell[0],nextCell[1]);

    let queueCounter = 0;
    while (!GridController.cellEquals(nextCell[0], nextCell[1], cellTypes.Start)) {
      GridController.setCell(nextCell[0], nextCell[1], cellTypes.Path);
      queueCounter++;
      let x = nextCell[0];
      let y = nextCell[1];
      nextCell = BreadthFirstSearchController.getNextCell(x,y);

      if (BreadthFirstSearchController.showAnimations && queueCounter % UserController.animationSpeed === 0) {
        await new Promise(f => setTimeout(f, 40));
      }
    }

    GridController.algorithmDone = true;
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
