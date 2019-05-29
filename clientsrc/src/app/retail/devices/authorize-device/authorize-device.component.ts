import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-authorize-device',
  templateUrl: './authorize-device.component.html',
  styleUrls: ['./authorize-device.component.scss']
})
export class AuthorizeDeviceComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private router: Router) { }
    userCode = null;

  ngOnInit() {
    this.route
      .queryParams
      .subscribe(params => {
        // Defaults to 0 if no query param provided.
        this.userCode = params['user_code'] || null;
        if (this.userCode) {
          window.location.href = `${environment.authorizeDeviceUrl}?user_code=${this.userCode}`;
        } else {
          window.location.href = environment.authorizeDeviceUrl;
        }
      });
  }

}
