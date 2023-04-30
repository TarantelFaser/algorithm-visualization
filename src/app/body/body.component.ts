import {Component, ElementRef,} from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent{

  public cellsHorizontal: number[] | undefined;
  public cellsVertical: number[] | undefined;
  public cellSize : number | undefined;
  constructor(private el : ElementRef) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    let width = this.el.nativeElement!.clientWidth;
    let height = this.el.nativeElement!.clientHeight;

    this.cellSize = 25;

    let maxCellCountHorizontal : number = Math.round((width - 0.01*width) / this.cellSize);
    let maxCellCountVertical : number = Math.round((height - 0.01*height) / this.cellSize);

    this.cellsHorizontal = Array(maxCellCountHorizontal).fill(0);
    this.cellsVertical = Array(maxCellCountVertical).fill(0);
  }
}
