import {Component, ElementRef,} from '@angular/core';
import {cellTypes, useMode} from "../global/enums";
import {MatSnackBar} from '@angular/material/snack-bar';
import {Direction, GridController} from "../global/gridController";
import {UserController} from "../global/userController";
import {BreadthFirstSearchController} from "../global/algorithms/breadthFirstSearch";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class BodyComponent{
  public isMouseDown = false;
  private startEndErrorBlocker = false; //disable the error message if just placing a starting/ending point

  constructor(private el : ElementRef,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.createGrid();
  }

  //calculate number of grid cells, depending on the windows size
  private createGrid() {
    let width = this.el.nativeElement!.clientWidth;
    let height = this.el.nativeElement!.clientHeight;
    let cellSize = 23;
    let maxCellCountHorizontal : number = Math.round((width - 0.01*width) / cellSize);
    let maxCellCountVertical : number = Math.round((height - 0.01*height) / cellSize);
    console.log("generating grid: " + maxCellCountHorizontal + " by " + maxCellCountVertical);
    GridController.setAllCells(cellTypes.Unused, maxCellCountHorizontal, maxCellCountVertical)
  }

  //makes painting one cell easier
  public mouseDown(idx_h: number, idx_v: number) {
    this.isMouseDown = true;
    this.startEndErrorBlocker = false;
    this.handleMouseAction(idx_h, idx_v);
    this.startEndErrorBlocker = true;
  }

  public async handleMouseAction(idx_h: number, idx_v: number) {
    if (!this.isMouseDown) return;
    if (!GridController.getCellArray()) {
      throw new Error("Cells Array Error")
    }

    //depending on current tool selected, edit the grid
    switch (UserController.currentUseMode) {
      case useMode.PlaceStart:
        if (GridController.canPlaceStart()) {
          await this.placeCell(idx_h, idx_v, cellTypes.Start);
        } else {
          if (this.startEndErrorBlocker) break;
          this.snackBar.open("Already placed a starting point!", "Ok", {duration: 3000})
        }
        break;

      case useMode.PlaceEnd:
        if (GridController.canPlaceEnd()) {
          await this.placeCell(idx_h, idx_v, cellTypes.End);
        } else {
          if (this.startEndErrorBlocker) break;
          this.snackBar.open("Already placed a ending point!", "Ok", {duration: 3000})
        }
        break;

      case useMode.PlaceWall:
        await this.placeCell(idx_h, idx_v, cellTypes.Wall);
        break;

      case useMode.None:
        await this.placeCell(idx_h, idx_v, cellTypes.Unused);
        break;
    }
  }

  //if algorithm is done, dynamically update path depending on new cells placed
  private async placeCell(x:number, y:number, type:cellTypes) {
    //if the start is changed, dont try to run the algorithm
    if (GridController.cellEquals(x,y, cellTypes.Start)) {
      GridController.removeAllHighlightsPaths();
    }
    GridController.setCell(x, y, type);
    if (GridController.algorithmDone && GridController.getStartList().length > 0) {
      BreadthFirstSearchController.showAnimations = false;
      let start = GridController.getStartList()[0]
      await BreadthFirstSearchController.bfs(start[0], start[1]);
      BreadthFirstSearchController.showAnimations = true;
    }
  }

  public onDragStart() {
    return false;
  }

  protected readonly cellTypes = cellTypes;
  protected readonly GridController = GridController;
  protected readonly Direction = Direction;
}
