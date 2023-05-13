import {Component, OnInit} from '@angular/core';
import {cellTypes, useMode} from "../global/enums";
import {MatDialog} from "@angular/material/dialog";
import {DeleteAllDialogComponent} from "./delete-all-dialog/delete-all-dialog.component";
import {GridController} from "../global/gridController";
import {BreadthFirstSearchController} from "../global/algorithms/breadthFirstSearch";
import {UserController} from "../global/userController";
import {first} from "rxjs";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(public dialog: MatDialog,
              private snackBar : MatSnackBar) { }

  ngOnInit(): void {
  }

  changeUseMode(mode : useMode) {
    UserController.currentUseMode = mode;
  }

  protected readonly useMode = useMode;
  protected readonly UserController = UserController;

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
    if (!firstStart) {
      this.snackBar.open("Please place a starting point first!", "Ok", {duration: 4000})
    }
    BreadthFirstSearchController.bfs(firstStart[0], firstStart[1]);
  }
}
