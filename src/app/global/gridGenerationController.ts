import {cellTypes} from "./enums";
import {GridController} from "./gridController";


export class GridGenerationController {
  public static stopGenerating = false;

  static getGridCopy(type:cellTypes = cellTypes.Wall): cellTypes[][] {
    if (!GridController.cells) return [];
    let mazeArray : cellTypes[][] = [];
    for (let y = 0; y < GridController.height; y++) {
      mazeArray.push([]);
      for (let x = 0; x < GridController.width; x++) {
        mazeArray[y][x] = type;
      }
    }
    return mazeArray;
  }

  static async copyGridToCells(array: cellTypes[][]) {
    if (!GridController.cells) throw new Error("Grid Error!");
    //secondly copy the maze to GridController.cells row by row
    for (let y = 0; y < GridController.cells.length; y++) {
      for (let x = 0; x < GridController.cells[0].length; x++) {
        GridController.setCell(x, y, array[y][x]);
      }
      await new Promise(f => setTimeout(f, 1));
    }
  }

  static getRandomNeighborCell(x:number, y:number) {
    //create an array of all the neighbors
    let neighbors : number[][] = [];
    if (x-1 >= 0) neighbors.push([x-1, y]);
    if (x+1 < GridController.width) neighbors.push([x+1, y]);
    if (y-1 >= 0) neighbors.push([x, y-1]);
    if (y+1 < GridController.height) neighbors.push([x, y+1]);
    //pick a random neighbor
    return neighbors[Math.floor(Math.random() * neighbors.length)];
  }

  static getRandomCell() {
    let x = Math.floor(Math.random() * (GridController.width-1))+1;
    let y = Math.floor(Math.random() * (GridController.height-1))+1;
    return [x,y];
  }

  static getNeighborTypeCount(x:number, y:number, type:cellTypes, array:cellTypes[][] = GridController.cells!, includeDiagonals = false) {
    let count = 0;
    if (x > 0 && array[y][x-1] === type) count++;
    if (x < GridController.width-1 && array[y][x+1] === type) count++;
    if (y > 0 && array[y-1][x] === type) count++;
    if (y < GridController.height-1 && array[y+1][x] === type) count++;
    if (includeDiagonals) {
      if (x > 0 && y > 0 && array[y-1][x-1] === type) count++;
      if (x < GridController.width-1 && y > 0 && array[y-1][x+1] === type) count++;
      if (x > 0 && y < GridController.height-1 && array[y+1][x-1] === type) count++;
      if (x < GridController.width-1 && y < GridController.height-1 && array[y+1][x+1] === type) count++;
    }
    return count;
  }

  static getNeighborCellOfTypeArray(x:number, y:number, type:cellTypes, array:cellTypes[][] = GridController.cells!) {
    //check if there are any neighbors of the given type
    if (GridGenerationController.getNeighborTypeCount(x,y,type,array) === 0) {
      return null;
    }

    //create an array of all the neighbors
    let neighbors : number[][] = [];
    if (x > 0 && array[y][x-1] === type) neighbors.push([x-1, y]);
    if (x < GridController.width-1 && array[y][x+1] === type) neighbors.push([x+1, y]);
    if (y > 0 && array[y-1][x] === type) neighbors.push([x, y-1]);
    if (y < GridController.height-1 && array[y+1][x] === type) neighbors.push([x, y+1]);

    return neighbors;
  }

  static async generateRandomGrid() {
    if (!GridController.cells) return;
    let chance = 0.3;
    for (let y = 0; y < GridController.cells.length; y++) {
      for (let x = 0; x < GridController.cells[0].length; x++) {
        if (Math.random() < chance) {
          GridController.setCell(x, y, cellTypes.Wall);
        } else {
          GridController.setCell(x, y, cellTypes.Unused);
        }
      }
      await new Promise(f => setTimeout(f, 1));
    }
  }

  static async generateMazeRandomPrimAlgorithm(buildStraightWalls:boolean = false) {
    if (!GridController.cells) return;
    //first create a second array to store the maze -> reduces lag
    let mazeArray = GridGenerationController.getGridCopy();
    let wallList : number[][] = [];
    let start = GridGenerationController.getRandomCell(); //pick a random starting cell
    let start_neighbors = GridGenerationController.getNeighborCellOfTypeArray(start[0], start[1], cellTypes.Wall, mazeArray);
    if (!start_neighbors || start_neighbors.length === 0) return;
    mazeArray[start[1]][start[0]] = cellTypes.Unused; //set the starting cell to unused
    for (let ncell of start_neighbors) {
      wallList.push(ncell);
    }

    //while there are still walls in the list
    while (wallList.length > 0) {
      let wallIndex = Math.floor(Math.random() * wallList.length);
      let wall = wallList[wallIndex];
      //if only one neighbor is unused
      let valid = false;
      if (buildStraightWalls && GridGenerationController.getNeighborTypeCount(wall[0], wall[1], cellTypes.Unused, mazeArray, true) < 3){
        valid = true;
      } else if (!buildStraightWalls && GridGenerationController.getNeighborTypeCount(wall[0], wall[1], cellTypes.Unused, mazeArray, false) === 1){
        valid = true;
      }
      if (valid) {
        //make the wall a passage
        mazeArray[wall[1]][wall[0]] = cellTypes.Unused;
        let neighbors = GridGenerationController.getNeighborCellOfTypeArray(wall[0], wall[1], cellTypes.Wall, mazeArray);
        if (!neighbors || neighbors.length === 0) continue;
        for (let ncell of neighbors) {
          wallList.push(ncell);
        }
      }
      //remove the wall from the list
      wallList.splice(wallIndex, 1);
    }

    //secondly copy the maze to GridController.cells row by row
    for (let y = 0; y < GridController.cells.length; y++) {
      for (let x = 0; x < GridController.cells[0].length; x++) {
        GridController.setCell(x, y, mazeArray[y][x]);
      }
      await new Promise(f => setTimeout(f, 1));
    }
  }

  static async randomizedDFS(buildStraightWalls:boolean = false) {
    if (!GridController.cells) return;
    let mazeArray = GridGenerationController.getGridCopy(); //first create a second array to store the maze -> reduces lag
    let visitedCells : number[][] = []; //stack for backtracking
    let randomCell = GridGenerationController.getRandomCell(); //pick a random starting cell
    mazeArray[randomCell[1]][randomCell[0]] = cellTypes.Unused; //set the starting cell to unused
    visitedCells.push(randomCell); //add the starting cell to the visited cells list

    //while there are still cells in the stack
    while (visitedCells.length > 0) {
      let currentCell = visitedCells.pop()!;
      let neighborArray = GridGenerationController.getNeighborCellOfTypeArray(currentCell[0], currentCell[1], cellTypes.Wall, mazeArray);
      if (!neighborArray || neighborArray?.length === 0) continue;
      let validNeighborArray : number[][] = [];
      for (let ncell of neighborArray) { //filter array to only contain cells with 1 unused neighbor
        if (buildStraightWalls && GridGenerationController.getNeighborTypeCount(ncell[0], ncell[1], cellTypes.Unused, mazeArray, true) < 3){
          validNeighborArray.push(ncell);
        } else if (!buildStraightWalls && GridGenerationController.getNeighborTypeCount(ncell[0], ncell[1], cellTypes.Unused, mazeArray, false) === 1){
          validNeighborArray.push(ncell);
        }
      }
      if (validNeighborArray.length === 0) continue;
      let randomNeighbor = validNeighborArray[Math.floor(Math.random() * validNeighborArray.length)];
      visitedCells.push(currentCell);
      mazeArray[randomNeighbor[1]][randomNeighbor[0]] = cellTypes.Unused;
      visitedCells.push(randomNeighbor);
    }

    await GridGenerationController.copyGridToCells(mazeArray);
  }

  static async fillGrid() {
    for (let y = 0; y < GridController.height; y++) {
      for (let x = 0; x < GridController.width; x++) {
        GridController.setCell(x,y, cellTypes.Wall);
      }
      await new Promise(f => setTimeout(f, 1));
    }

    let start = this.getRandomCell();
    let end = this.getRandomCell();
    while (start[0] === end[0] && start[1] === end[1]) {
      end = this.getRandomCell();
    }
    GridController.setCell(start[0], start[1], cellTypes.Start);
    GridController.setCell(end[0], end[1], cellTypes.End);
  }

  static async generateMazeKruskal() {
    if (!GridController.cells) return;
    let mazeArray = GridGenerationController.getGridCopy(); //first create a second array to store the maze -> reduces lag

    let cellSets : number[][][] = []
    for (let y = 1; y < GridController.height; y = y + 2) {
      for (let x = 1; x < GridController.width; x = x + 2) {
        cellSets.push([[x,y]]);
        mazeArray[y][x] = cellTypes.Unused
      }
    }

    let wallList:number[][] = [];
    for (let y = 0; y < GridController.height; y++) {
      for (let x = 0; x < GridController.width; x++) {
        if ((x+y) % 2 !== 0) {
          wallList.push([x,y]);
        }
      }
    }

    //shuffle wallList
    wallList.sort(() => Math.random() - 0.5);

    for (let wall of wallList) {
      //find the two sets that the wall separates
      let set1 : number[][] | undefined = [];
      let set2 : number[][] | undefined = [];
      let neighbors = GridGenerationController.getNeighborCellOfTypeArray(wall[0], wall[1], cellTypes.Unused, mazeArray);
      if (!neighbors || neighbors.length < 2) continue;
      for (let set of cellSets) { //find the two sets that the wall separates
        if (GridGenerationController.containsCell(set, neighbors[0])) {
          set1 = set;
        }
        if (GridGenerationController.containsCell(set, neighbors[1])) {
          set2 = set;
        }
      }
      if (!set1 || !set2 || set1.length === 0 || set2.length === 0) continue;
      if (set1 === set2) continue; //if the wall is in the same set, skip it

      //remove the wall
      mazeArray[wall[1]][wall[0]] = cellTypes.Unused;
      //combine the two sets
      for (let cell of set2) {
        set1.push(cell);
      }
      //remove set2 from cellSets
      cellSets.splice(cellSets.indexOf(set2), 1);
    }

    await GridGenerationController.copyGridToCells(mazeArray);
  }

  private static containsCell(set: number[][], wall: number[]) {
    for (let cell of set) {
      if (cell[0] === wall[0] && cell[1] === wall[1]) return true;
    }
    return false;
  }

  static async generateMazeAB() {
    if (!GridController.cells) return;
    let mazeArray = GridGenerationController.getGridCopy(); //first create a second array to store the maze -> reduces lag

    //all unvisited cells
    let cellList : number[][] = []
    for (let y = 1; y < GridController.height; y = y + 2) {
      for (let x = 1; x < GridController.width; x = x + 2) {
        cellList.push([x,y]);
      }
    }

    let currentCell = cellList[Math.floor(Math.random() * cellList.length)];
    while (cellList.length > 0) {
      let neighbor = GridGenerationController.getRandomNeighborCell(currentCell[0], currentCell[1]);
      //get difference between cells
      let diffX = neighbor[0] - currentCell[0];
      let diffY = neighbor[1] - currentCell[1];
      //get cell next to randomNeighbor according to diff (necessary to keep maze look)
      let nextCell = [neighbor[0] + diffX, neighbor[1] + diffY];
      if (nextCell[0] < 0 || nextCell[0] >= GridController.width || nextCell[1] < 0 || nextCell[1] >= GridController.height) continue;
      if (mazeArray[nextCell[1]][nextCell[0]] === cellTypes.Wall) {
        mazeArray[neighbor[1]][neighbor[0]] = cellTypes.Unused; //open the corridor
        mazeArray[nextCell[1]][nextCell[0]] = cellTypes.Unused;
        cellList.splice(cellList.indexOf(nextCell), 1); //remove the cell from cellList
      }
      currentCell = nextCell; //make nextCell the new currentCell
    }

    await GridGenerationController.copyGridToCells(mazeArray);
  }

  static async generateMazeRecursiveDivision() {
    await this.recursiveDivision(0, GridController.width-1, 0, GridController.height-1)
  }

  static async recursiveDivision(startX: number, endX: number, startY: number, endY: number) {
    if (GridGenerationController.stopGenerating) return;
    let width = endX - startX + 1;
    let height = endY - startY + 1;
    if (width < 3 || height < 3) return; //if the area is too small, stop

    if (width > height) {
      //split vertically, make sure the wall is on an even number
      let wallX = 1;
      while (wallX % 2 !== 0) {
        wallX = startX + Math.floor(Math.random() * (width - 2)) + 1;
      }
      // make sure the hole is on an odd number
      let holeY = 2;
      while (holeY % 2 !== 1) {
        holeY = startY + Math.floor(Math.random() * height);
      }
      for (let y = startY; y <= endY; y++) {
        if (y === holeY) continue;
        GridController.setCell(wallX, y, cellTypes.Wall);
        await new Promise(f => setTimeout(f, 1));
      }
      await this.recursiveDivision(startX, wallX-1, startY, endY);
      await this.recursiveDivision(wallX+1, endX, startY, endY);
    } else {
      //split horizontally, make sure the wall is on an even number
      let wallY= 1;
      while (wallY % 2 !== 0) {
        wallY = startY + Math.floor(Math.random() * (height - 2)) + 1;
      }
      // make sure the hole is on an odd number
      let holeX= 2;
      while (holeX % 2 !== 1) {
        holeX = startX + Math.floor(Math.random() * width);
      }
      for (let x = startX; x <= endX; x++) {
        if (x === holeX) continue;
        GridController.setCell(x, wallY, cellTypes.Wall);
        await new Promise(f => setTimeout(f, 1));
      }
      await this.recursiveDivision(startX, endX, startY, wallY-1);
      await this.recursiveDivision(startX, endX, wallY+1, endY);
    }
  }
}
