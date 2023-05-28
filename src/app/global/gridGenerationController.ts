import {cellTypes} from "./enums";
import {GridController} from "./gridController";


export class GridGenerationController {


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
    //check if the cell is not on the edge
    if (!(x > 0 && x < GridController.width-1 && y > 0 && y < GridController.height-1)) {
      return null;
    }
    //create an array of all the neighbors
    let neighbors : number[][] = [];
    neighbors.push([x-1, y]);
    neighbors.push([x+1, y]);
    neighbors.push([x, y-1]);
    neighbors.push([x, y+1]);
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
  }
}
