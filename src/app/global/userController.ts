import {useMode} from "./enums";

export class UserController {
  public static currentUseMode : useMode = useMode.None;
  public static animationSpeed : number = 5;
  public static isDraggingStart : boolean = false;
  public static isDraggingEnd : boolean = false;
}
