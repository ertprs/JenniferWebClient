import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';


import { UserService } from '../../_services/service/user.service';
import { CrossborderuserService } from 'src/app/_services/service/crossborder/crossborderuser.service';
import { ToastrService } from 'ngx-toastr';
import { IUser } from '../../_services/model';

import { AuthorizationGuard } from '../../_guards/Authorizationguard'
import { process, State } from '@progress/kendo-data-query';
import { GridDataResult, DataStateChangeEvent, PageChangeEvent } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';

@Component({
  selector: 'app-crossborderuserlist',
  templateUrl: './crossborderuserlist.component.html',
  styleUrls: ['./crossborderuserlist.component.css']
})
export class CrossborderuserlistComponent implements OnInit {
  user: IUser;
  userForm: FormGroup;

  selectedDeleteId: number;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  constructor(
    private alertService: ToastrService,
    private router: Router,
    private _userService: UserService,
    private _crossborderuserService: CrossborderuserService,

    private _authorizationGuard: AuthorizationGuard
  ) {
  }

  ngOnInit() {
    this.onLoad(this.SearchBy, this.SearchKeyword, true);
  }

  confirmDeleteid(id: number, DeleteColumnvalue: string) {
    // if (this._authorizationGuard.CheckAcess("/CrossBorder/Crossborderuserlist", "ViewEdit")) {
    //   return;
    // }

    this.selectedDeleteId = + id;
    this.deleteColumn = DeleteColumnvalue;
    $('#modaldeleteconfimation').modal('show');
  }


  Search(): void {
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
  }


  delete() { 
    this._crossborderuserService.delete(this.selectedDeleteId).subscribe(
      (data) => {
        if (data != null && data.Flag == true) {
          this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction);
          this.alertService.success('User data has been deleted successful');
        } else {
          this.alertService.error('User – ' + this.deleteColumn + ' is being used in the application, Can’t be deleted.!');
        }
        $('#modaldeleteconfimation').modal('hide'); 
      },
      (error: any) => { 
        console.log(error);
      }
    );
  }


  onLoad(SearchBy: string, Search: string, IsActive: boolean) { 
    return this._crossborderuserService.search(SearchBy, Search, IsActive).subscribe(
      (lst) => {
        if (lst != null) {
          this.items = lst;
          this.loadItems();
        } 
      },
      (err) => { 
        console.log(err);
      }
    );
  }

  AddNewLink() {
    // if (this._authorizationGuard.CheckAcess("/CrossBorder/Crossborderuserlist", "ViewEdit")) {
    //   return;
    // }
    this.router.navigate(['/CrossBorder/Crossborderuser/Create',]);
  }

  //#region Paging Sorting and Filtering Start
  public allowUnsort = false;
  public sort: SortDescriptor[] = [{
    field: 'FirstName',
    dir: 'asc'
  }];
  public gridView: GridDataResult;
  public pageSize = 10;
  public skip = 0;
  private data: Object[];
  private items: IUser[] = [] as any;
  public state: State = {
    skip: 0,
    take: 5,

    // Initial filter descriptor
    filter: {
      logic: 'and',
      filters: [{ field: 'FirstName', operator: 'contains', value: '' }]
    }
  };

  public pageChange({ skip, take }: PageChangeEvent): void {
    this.skip = skip;
    this.pageSize = take;
    this.loadItems();
  }

  public sortChange(sort: SortDescriptor[]): void {
    this.sort = sort;
    this.loadSortItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  private loadSortItems(): void {
    this.gridView = {
      data: orderBy(this.items, this.sort).slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  public dataStateChange(state: DataStateChangeEvent): void {
    this.state = state;
    this.gridView = process(this.items, this.state);
  }

  public onFilter(inputValue: string): void {
    this.gridView = process(this.items, {
      filter: {
        logic: "or",
        filters: [
          {
            field: 'FirstName',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'Email',
            operator: 'contains',
            value: inputValue
          },
          {
            field: 'UserType',
            operator: 'contains',
            value: inputValue
          },
        ],
      }
    });
  }
  //#endregion Paging Sorting and Filtering End


}
