import {Component, ElementRef,} from '@angular/core';
import {cellTypes, useMode} from "../global/enums";
import {MatSnackBar} from '@angular/material/snack-bar';
import {GridController} from "../global/gridController";
import {UserController} from "../global/userController";

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

  public handleMouseAction(idx_h: number, idx_v: number) {
    if (!this.isMouseDown) return;
    if (!GridController.getCellArray()) {
      throw new Error("Cells Array Error")
    }

    //depending on current tool selected, edit the grid
    switch (UserController.currentUseMode) {
      case useMode.PlaceStart:
        if (GridController.canPlaceStart()) {
          GridController.setCell(idx_h,idx_v, cellTypes.Start);
        } else {
          if (this.startEndErrorBlocker) break;
          this.snackBar.open("Already placed a starting point!", "Ok", {duration: 3000})
        }
        break;

      case useMode.PlaceEnd:
        if (GridController.canPlaceEnd()) {
          GridController.setCell(idx_h,idx_v, cellTypes.End);
        } else {
          if (this.startEndErrorBlocker) break;
          this.snackBar.open("Already placed a ending point!", "Ok", {duration: 3000})
        }
        break;

      case useMode.PlaceWall:
        GridController.setCell(idx_h,idx_v, cellTypes.Wall);
        break;

      case useMode.None:
        GridController.setCell(idx_h, idx_v, cellTypes.Unused);
        break;
    }
  }

  protected readonly cellTypes = cellTypes;
  protected readonly GridController = GridController;
}
