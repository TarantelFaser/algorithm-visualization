import {Component, ElementRef,} from '@angular/core';
import {cellTypes} from "../global/enums";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class BodyComponent{
  protected readonly cellTypes = cellTypes;
  public cellSize : number | undefined;
  public cells : cellTypes[][]| undefined = [];

  public canPaint = false;

  constructor(private el : ElementRef) {
  }

  ngOnInit() {
    let width = this.el.nativeElement!.clientWidth;
    let height = this.el.nativeElement!.clientHeight;
    this.cellSize = 25;

    let maxCellCountHorizontal : number = Math.round((width - 0.01*width) / this.cellSize);
    let maxCellCountVertical : number = Math.round((height - 0.01*height) / this.cellSize);

    for (let i = 0; i < maxCellCountVertical; i++) {
      this.cells!.push([])
      for (let j = 0; j < maxCellCountHorizontal; j++) {
        this.cells![i].push(cellTypes.Unused);
      }
    }

    this.cells![1][1] = this.cellTypes.Start;
  }

  public handleMouseAction(idx_h: number, idx_v: number) {
    if (!this.canPaint) return;
    this.cells![idx_h][idx_v] === cellTypes.Unused ? this.cells![idx_h][idx_v] = cellTypes.Selected : this.cells![idx_h][idx_v] = cellTypes.Selected
  }
}
