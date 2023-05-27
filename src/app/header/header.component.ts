import {Component, OnInit} from '@angular/core';
import {cellTypes, useMode} from "../global/enums";
import {MatDialog} from "@angular/material/dialog";
import {DeleteAllDialogComponent} from "./delete-all-dialog/delete-all-dialog.component";
import {GridController} from "../global/gridController";
import {BreadthFirstSearchController} from "../global/algorithms/breadthFirstSearch";
import {UserController} from "../global/userController";
import {AlgorithmsController} from "../global/algorithmsController";
import {InfoDialogComponent} from "./info-dialog/info-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  changeUseMode(mode : useMode) {
    UserController.currentUseMode = mode;
  }

  protected readonly useMode = useMode;
  protected readonly UserController = UserController;
  protected readonly GridController = GridController;
  protected readonly BreadthFirstSearchController = BreadthFirstSearchController;
  protected readonly AlgorithmsController = AlgorithmsController;

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteAllDialogComponent, {
      panelClass: 'dialog-css',
      data: {deleteAll : false}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        AlgorithmsController.stopAlgorithm();
        GridController.setAllCells(cellTypes.Unused);
        AlgorithmsController.algorithmCanRun = false;
      }
    });
  }

  async BFS() {
    AlgorithmsController.algorithmCanRun = true;
    await BreadthFirstSearchController.bfs();
  }

  openInfoDialog() {
    const dialogRef = this.dialog.open(InfoDialogComponent, {
      panelClass: 'dialog-css'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
