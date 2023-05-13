import {Component, OnInit} from '@angular/core';
import {cellTypes, useMode} from "../global/enums";
import {userController} from "../global/userController";
import {MatDialog} from "@angular/material/dialog";
import {DeleteAllDialogComponent} from "./delete-all-dialog/delete-all-dialog.component";
import {GridController} from "../global/gridController";
import {BreadthFirstSearchController} from "../global/algorithms/breadthFirstSearch";

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
    userController.currentUseMode = mode;
  }

  protected readonly useMode = useMode;
  protected readonly userController = userController;

  openDeleteDialog() {
    const dialogRef = this.dialog.open(DeleteAllDialogComponent, {
      panelClass: 'dialog-css',
      data: {deleteAll : false}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        GridController.setAllCells(cellTypes.Unused);
      }
    });
  }

  protected readonly GridController = GridController;
  protected readonly BreadthFirstSearchController = BreadthFirstSearchController;

  BFS() {
    let firstStart = GridController.getStartList()[0];
    BreadthFirstSearchController.bfs(firstStart[0], firstStart[1]);
  }
}
