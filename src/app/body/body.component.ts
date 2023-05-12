import {Component, ElementRef,} from '@angular/core';
import {cellTypes, useMode} from "../global/enums";
import {userController} from "../global/userController";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class BodyComponent{
  public cells : cellTypes[][]| undefined = [];
  public isMouseDown = false;
  private placedStart = false;

  constructor(private el : ElementRef,
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    let width = this.el.nativeElement!.clientWidth-6;
    let height = this.el.nativeElement!.clientHeight;

    let cellSize = 25;
    let maxCellCountHorizontal : number = Math.round((width - 0.01*width) / cellSize);
    let maxCellCountVertical : number = Math.round((height - 0.01*height) / cellSize);

    for (let i = 0; i < maxCellCountVertical; i++) {
      this.cells!.push([])
      for (let j = 0; j < maxCellCountHorizontal; j++) {
        this.cells![i].push(cellTypes.Unused);
      }
    }
  }

  public mouseDown(idx_h: number, idx_v: number) {
    this.isMouseDown = true;
    this.handleMouseAction(idx_h, idx_v);
  }

  public handleMouseAction(idx_h: number, idx_v: number) {
    if (!this.isMouseDown) return;

    if (!this.cells) {
      throw new Error("Cells Array Error")
    }

    switch (userController.currentUseMode) {
      case useMode.PlaceStart:
        if (!this.placedStart) {
          this.cells[idx_h][idx_v] = cellTypes.Start;
          this.placedStart = true;
        } else {
          this.snackBar.open("Already placed a starting point!", "Ok", {duration: 3000})
        }
    }
    this.cells![idx_h][idx_v] === cellTypes.Unused ? this.cells![idx_h][idx_v] = cellTypes.Selected : this.cells![idx_h][idx_v] = cellTypes.Selected
  }

  protected readonly cellTypes = cellTypes;
}
