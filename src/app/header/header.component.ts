import { Component, OnInit } from '@angular/core';
import {useMode} from "../global/enums";
import {userController} from "../global/userController";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  changeUseMode(mode : useMode) {
    userController.currentUseMode = mode;
  }

  protected readonly useMode = useMode;
  protected readonly userController = userController;
}
