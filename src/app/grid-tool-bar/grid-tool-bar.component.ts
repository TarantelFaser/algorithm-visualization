import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DeleteAllDialogComponent} from "../header/delete-all-dialog/delete-all-dialog.component";
import {cellTypes, useMode} from "../global/enums";
import {GridController} from "../global/gridController";
import {BreadthFirstSearchController} from "../global/algorithms/breadthFirstSearch";
import {UserController} from "../global/userController";
import {AlgorithmsController} from "../global/algorithmsController";

@Component({
  selector: 'app-grid-tool-bar',
  templateUrl: './grid-tool-bar.component.html',
  styleUrls: ['./grid-tool-bar.component.scss']
})
export class GridToolBarComponent implements OnInit {

  protected readonly useMode = useMode;
  protected readonly UserController = UserController;
  protected readonly GridController = GridController;
  protected readonly BreadthFirstSearchController = BreadthFirstSearchController;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  changeUseMode(mode : useMode) {
    UserController.currentUseMode = mode;
  }

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteAllDialogComponent, {
      panelClass: 'dialog-css',
      data: {deleteAll : false}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        AlgorithmsController.stopAlgorithm();
      }
    });
  }

  async BFS() {
    AlgorithmsController.algorithmCanRun = true;
    await BreadthFirstSearchController.bfs();
  }
}
