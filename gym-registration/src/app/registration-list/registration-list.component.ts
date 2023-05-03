import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {
  public dataSource!: MatTableDataSource<User>;
  public users!: User[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'id',
    'firstName',
    'lastName',
    'email',
    'mobile',
    'bmiResult',
    'gender',
    'package',
    'enquiryDate',
    'action',
  ]

  constructor(
    private apiService: ApiService,
    private router: Router,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) { }

  getUsers() {
    this.spinner.show()
    this.apiService.getRegisteredUser().subscribe(res => {
      setTimeout(() => {
        this.users = res;
        this.dataSource = new MatTableDataSource(this.users);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.spinner.hide();
      }, 500)
    })
  }

  editUser(id: number) {
    this.router.navigate(['update', id]);
  }

  deleteUser(id: number) {
    let dialogRef = this.dialog.open(DialogComponent);

    dialogRef.afterClosed().subscribe(res => {
      if (res === 'true') {
        this.apiService.deleteRegisteredUser(id).subscribe(res => {
          this.spinner.show();

          setTimeout(() => {
            this.toastr.success('Success', 'Deleted Successfully');
            this.getUsers();
            this.spinner.hide();
          }, 2000);
        })
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngOnInit(): void {
    this.getUsers();
  }

}

