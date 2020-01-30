import { Component, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent {
  collapsed = true;
  @Output() navClick = new EventEmitter<string>();

  onSelect(name: string) {
    this.navClick.emit(name);
  }
}
