import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'gym-registration';
  public footer: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.footer = true;
  }
}



