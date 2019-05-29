import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ims',
  templateUrl: './ims.component.html',
  styleUrls: ['./ims.component.scss']
})
export class ImsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    window.location.href = environment.app.ims.url;
  }

}
