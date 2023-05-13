import {Component, ElementRef,} from '@angular/core';
import {cellTypes, useMode} from "../global/enums";
import {userController} from "../global/userController";
import {MatSnackBar} from '@angular/material/snack-bar';
import {GridController} from "../global/gridController";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class BodyComponent{
  public isMouseDown = false;
  private placedStart = false;
  private placedEnd = false;

  constructor(private el : ElementRef,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    let width = this.el.nativeElement!.clientWidth;
    let height = this.el.nativeElement!.clientHeight;

    let cellSize = 23;
    let maxCellCountHorizontal : number = Math.round((width - 0.01*width) / cellSize);
    let maxCellCountVertical : number = Math.round((height - 0.01*height) / cellSize);

    let cellArray : cellTypes[][] = []
    for (let i = 0; i < maxCellCountVertical; i++) {
      cellArray.push([])
      for (let j = 0; j < maxCellCountHorizontal; j++) {
        cellArray[i].push(cellTypes.Unused);
      }
    }
    GridController.setCellArray(cellArray);
  }

  //makes painting one cell easier
  public mouseDown(idx_h: number, idx_v: number) {
    this.isMouseDown = true;
    this.handleMouseAction(idx_h, idx_v);
  }

  public handleMouseAction(idx_h: number, idx_v: number) {
    if (!this.isMouseDown) return;

    if (!GridController.getCellArray()) {
      throw new Error("Cells Array Error")
    }

    switch (userController.currentUseMode) {
      case useMode.PlaceStart:
        if (!this.placedStart) {
          GridController.setCell(idx_h,idx_v, cellTypes.Start);
          this.placedStart = true;
        } else {
          this.snackBar.open("Already placed a starting point!", "Ok", {duration: 3000})
        }
        break;

      case useMode.PlaceEnd:
        if (!this.placedEnd) {
          GridController.setCell(idx_h,idx_v, cellTypes.End);
          this.placedEnd = true;
        } else {
          this.snackBar.open("Already placed a ending point!", "Ok", {duration: 3000})
        }
        break;

      case useMode.PlaceWall:
        GridController.setCell(idx_h,idx_v, cellTypes.Wall);
        break;

      case useMode.None:
        if (GridController.cellEquals(idx_h, idx_v, cellTypes.Start)) this.placedStart = false;
        if (GridController.cellEquals(idx_h, idx_v, cellTypes.End)) this.placedEnd = false;
        GridController.setCell(idx_h, idx_v, cellTypes.Unused);
        break;
    }
  }

  protected readonly cellTypes = cellTypes;
  protected readonly GridController = GridController;
}
