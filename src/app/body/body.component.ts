import {Component, ElementRef,} from '@angular/core';

export enum cellTypes {
  Unused ,
  Start,
  End,
  Path,
  Selected,
  Highlighted,
  Checked
}

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})

export class BodyComponent{
  public cellSize : number | undefined;
  public cells : cellTypes[][]| undefined = [];

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
  }

  protected readonly cellTypes = cellTypes;
}
