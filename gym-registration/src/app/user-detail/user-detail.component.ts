import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  public userId!: number;
  userDetail!: User;

  constructor(
    private activatedRoute: ActivatedRoute,
    private apiService: ApiService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.activatedRoute.params.subscribe(val => {
      setTimeout(() => {
        this.userId = val['id'];
        this.fetchUserDetails(this.userId);
        this.spinner.hide();
      }, 500);
    })
  }

  fetchUserDetails(userId: number) {
    this.apiService.getRegisteredUserById(userId).subscribe(res => {
      this.userDetail = res;
    })
  }
}
