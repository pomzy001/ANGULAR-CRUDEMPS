import { Component, OnInit, ViewChild } from '@angular/core';
import { EmpAddEditComponent } from './emp-add-edit/emp-add-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeService } from './services/employee.service';
import {MatPaginator } from '@angular/material/paginator';
import {MatSort } from '@angular/material/sort';
import {MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
 
  displayedColumns: string[] = [
     
    'id', 
    'Name', 
    'position',
    'Action'

  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog, 
    private _empService: EmployeeService,
    private _coreService: CoreService ) {}
ngOnInit(): void {
  this.getEmployeeList();
}
  openAddEditEmpForm(){
    const DialogRef=this._dialog.open(EmpAddEditComponent);
    DialogRef.afterClosed().subscribe({
      next: (val)=>{
        if(val){
          this.getEmployeeList();
        }
      }
    })
  }
  getEmployeeList(){
    this._empService.getEmployeeList().subscribe({
      next: (res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.sort =this.sort;
          this.dataSource.paginator=this.paginator;

      },
      error:console.log
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  deleteEmployee(id: number){
    if(confirm("Are you sure you want to delete?"))
    this._empService.deleteEmployee(id).subscribe({
      next: (res)=>{
        this._coreService.openSnackBar('Employee Deleted!', 'Done');
        this.getEmployeeList();
      },
      error: console.log,
    })

  }
  openEditForm(data: any){
    const DialogRef=this._dialog.open(EmpAddEditComponent, {
      data,
    });
    
    DialogRef.afterClosed().subscribe({
      next: (val)=>{
        if(val){
          this.getEmployeeList();
        }
      }
    })
  }
  
}