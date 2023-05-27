import {Component, ElementRef,} from '@angular/core';
import {cellTypes, Direction, useMode} from "../global/enums";
import {MatSnackBar} from '@angular/material/snack-bar';
import {GridController} from "../global/gridController";
import {UserController} from "../global/userController";
import {BreadthFirstSearchController} from "../global/algorithms/breadthFirstSearch";
import {AlgorithmsController} from "../global/algorithmsController";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class BodyComponent{
  public isMouseDown = false;

  protected readonly cellTypes = cellTypes;
  protected readonly GridController = GridController;
  protected readonly Direction = Direction;
  protected readonly BreadthFirstSearchController = BreadthFirstSearchController;
  protected readonly UserController = UserController;

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
    GridController.generateGridArray(maxCellCountHorizontal, maxCellCountVertical, cellTypes.Unused)
    GridController.width = maxCellCountHorizontal;
    GridController.height = maxCellCountVertical;

    GridController.placeStartEndRandom();
  }

  //makes painting one cell easier
  public mouseDown(idx_h: number, idx_v: number) {
    this.isMouseDown = true;
    if (GridController.getCell(idx_h, idx_v) === cellTypes.Start) {
      UserController.isDraggingStart = true;
    }
    if (GridController.getCell(idx_h, idx_v) === cellTypes.End) {
      UserController.isDraggingEnd = true;
    }

    if (GridController.cellEquals(idx_h, idx_v, cellTypes.Unused)
      || GridController.cellEquals(idx_h, idx_v, cellTypes.Highlighted)
      || GridController.cellEquals(idx_h, idx_v, cellTypes.Path)) {
      UserController.currentUseMode = useMode.PlaceWall;
    } else if (GridController.cellEquals(idx_h, idx_v, cellTypes.Wall)) {
      UserController.currentUseMode = useMode.None;
    }

    this.handleMouseAction(idx_h, idx_v);
  }

  public async handleMouseAction(idx_h: number, idx_v: number) {
    if (!GridController.getCellArray()) throw new Error("Cells Array Error")
    if (!this.isMouseDown) return;

    //handle dragging of start / end
    await this.checkForDragging(idx_h, idx_v);

    switch (UserController.currentUseMode) {
      case useMode.PlaceWall:
        if (GridController.cellEquals(idx_h, idx_v, cellTypes.Start) || GridController.cellEquals(idx_h, idx_v, cellTypes.End)) break;
        await this.placeCell(idx_h, idx_v, cellTypes.Wall);
        break;
      case useMode.None:
        if (GridController.cellEquals(idx_h, idx_v, cellTypes.Start) || GridController.cellEquals(idx_h, idx_v, cellTypes.End)) break;
        await this.placeCell(idx_h, idx_v, cellTypes.Unused);
        break;
    }
  }

  //if algorithm is done, dynamically update path depending on new cells placed
  private async placeCell(x:number, y:number, type:cellTypes) {
    GridController.setCell(x, y, type);
    if ((UserController.isDraggingStart || GridController.algorithmDone) && AlgorithmsController.algorithmCanRun && GridController.getStartList().length > 0) {
      GridController.showAnimations = false;
      AlgorithmsController.algorithmCanRun = true;
      await BreadthFirstSearchController.bfs();
      GridController.showAnimations = true;
    }
  }

  //handle start / end dragging
  private async checkForDragging(idx_h: number, idx_v: number) {
    if (UserController.isDraggingStart) {
      if (GridController.cellEquals(idx_h, idx_v, cellTypes.Wall)) return;
      if (GridController.cellEquals(idx_h, idx_v, cellTypes.End)) return;
      //remove old start point
      let oldStart = GridController.getStartList()[0];
      if (!oldStart) return;
      GridController.setCell(oldStart[0], oldStart[1], cellTypes.Unused);
      await this.placeCell(idx_h, idx_v, cellTypes.Start);
      return;
    }

    if (UserController.isDraggingEnd) {
      if (GridController.cellEquals(idx_h, idx_v, cellTypes.Wall)) return;
      if (GridController.cellEquals(idx_h, idx_v, cellTypes.Start)) return;
      //remove old end point
      let oldEnd = GridController.getEndList()[0];
      if (!oldEnd) return;
      GridController.setCell(oldEnd[0], oldEnd[1], cellTypes.Unused);
      await this.placeCell(idx_h, idx_v, cellTypes.End);
      return;
    }
  }

  public onDragStart() {
    return false;
  }

  mouseUp(x: number, y: number) {
    this.isMouseDown = false;
    UserController.isDraggingStart = false;
    UserController.isDraggingEnd = false;
    //GridController.setCell(x,y, GridController.getCell(x,y));
  }
}
