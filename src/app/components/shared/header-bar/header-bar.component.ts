import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-header-bar",
  templateUrl: "./header-bar.component.html",
  styleUrls: ["./header-bar.component.scss"],
})
export class HeaderBarComponent implements OnInit {
  @Input() pageTitle: string;
  @Input() showBackButton: boolean;

  constructor() {}

  ngOnInit() {}
}
