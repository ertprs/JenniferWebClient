import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { DiscountService } from '../../_services/service/discount.service';
import { Discount, Customer, Dropdown, ProductGroup, Category, SubCategory, Item } from '../../_services/model';
import { PrivateutilityService } from '../../_services/service/privateutility.service';
import { AuthorizationGuard } from '../../_guards/Authorizationguard' 
import * as moment from 'moment';


@Component({
  selector: 'app-discountlist',
  templateUrl: './discountlist.component.html',
  styleUrls: ['./discountlist.component.css']
})
export class DiscountlistComponent implements OnInit {

  lstCustomer: Customer[];
  lstTransactionType: Dropdown[];
  lstInventoryType: Dropdown[];

  lstProductGroup: ProductGroup[];
  lstCategory: Category[];
  lstSubCategory: SubCategory[];
  lstItem: Item[] = [] as any;
  lstItemSelected: Item[] = [] as any;
  objItem: Item = {} as any;
  lstDiscount: Discount[];
  objDiscount: Discount = {} as any;
  discountForm: FormGroup;
  panelTitle: string;
  action: boolean;
  identity: number = 0;
  deleteColumn: string;
  dtOptions: DataTables.Settings = {};
  MarketPlaceContribution: any;
  StoreContribution: any;
  OtherContribution: any;
  TotalDiscountPer: any;
  SearchBy: string = '';
  SearchKeyword: string = '';
  Searchaction: boolean = true;
  selectedDateRange: any;
  Searchranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  }
  MinDate: moment.Moment;
  ItemCode: string = '';
  ItemID: number = 0;
  ConvertToFloat(val) {
    return parseFloat(val).toFixed(2);
  }
  config = {
    displayKey: "ItemCode", //if objects array passed which key to be displayed defaults to description
    search: true,
    limitTo: 3
  };
  constructor(
    private alertService: ToastrService,
    private _discountService: DiscountService,
    private _spinner: NgxSpinnerService,
    private _authorizationGuard: AuthorizationGuard,
    private fb: FormBuilder,
    private _PrivateutilityService: PrivateutilityService,
  ) { }


  //#region Validation Start
  formErrors = {
    'CustomerID': '',
    'TransactionType': '',
    'InventoryType': '',

    'ItemID': '',
    'MarketPlaceContribution': '',
    'StoreContribution': '',
    'OtherContribution': '',

    'StartDate': '',
    'EndDate': '',
  };

  // This object contains all the validation messages for this form
  validationMessages = {

    'CustomerID': {
      'min': 'This Field is required.',
    },
    'TransactionType': {
      'required': 'This Field is required.',
    },
    'InventoryType': {
      'required': 'This Field is required.',
    },


    'ItemID': {
      'required': 'This Field is required.',
    },
    'MarketPlaceContribution': {
      'required': 'This Field is required.',
      'pattern': 'This Field must be a numeric(0-100).',
      'min': 'This Field must be a numeric(0.01-100).',
      'max': 'This Field must be a numeric(0.01-100).',
    },
    'StoreContribution': {
      'required': 'This Field is required.',
      'pattern': 'This Field must be a numeric(0-100).',
      'min': 'This Field must be a numeric(0.01-100).',
      'max': 'This Field must be a numeric(0.01-100).',
    },
    'OtherContribution': {
      'required': 'This Field is required.',
      'pattern': 'This Field must be a numeric(0-100).',
      'min': 'This Field must be a numeric(0.01-100).',
      'max': 'This Field must be a numeric(0.01-100).',
    },

    'StartDate': {
      'required': 'This Field is required.',
      'invalidDate': 'This Field must be date format(MM-DD-YYYY HH:mm).',
    },
    'EndDate': {
      'required': 'This Field is required.',
      'invalidDate': 'This Field must be date format(MM-DD-YYYY HH:mm).',
    },
  };

  logValidationErrors(group: FormGroup = this.discountForm): void {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      // if (abstractControl && abstractControl.value && abstractControl.value.length > 0 && !abstractControl.value.replace(/\s/g, '').length) {
      //   abstractControl.setValue('');
      // }
      this.formErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const messages = this.validationMessages[key];
        for (const errorKey in abstractControl.errors) {
          if (errorKey) {
            this.formErrors[key] += messages[errorKey] + ' ';
          }
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.logValidationErrors(abstractControl);
      }
    });
  }
  //#endregion Validation End

  onChange(range) {
    let startdate: string = range.startDate._d.toISOString().substring(0, 10);
    let enddate: string = range.endDate._d.toISOString().substring(0, 10);
  }
  ngOnInit() {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);

    this.panelTitle = 'Add New Discount ';
    this.action = true;
    this.identity = 0;
    this.discountForm = this.fb.group({

      CustomerID: [0, [Validators.min(1)]],
      TransactionType: ['', [Validators.required]],
      InventoryType: ['', [Validators.required]],

      ProductGroupID: [0, []],
      CategoryID: [0, []],
      SubCategoryID: [0, []],
      ItemID: ['', [Validators.min(1)]],

      MarketPlaceContribution: ['', [Validators.required, Validators.min(0.01), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],
      StoreContribution: ['', [Validators.required, Validators.min(0.01), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],
      OtherContribution: ['', [Validators.required, Validators.min(0.01), Validators.max(100), Validators.pattern("(100|[0-9]{1,2})(\.[0-9]{1,2})?"),]],

      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      //IsActive: [0,],
    });

    this.objItem.ItemID = 0;
    this.objItem.ItemCode = 'Select';
    this.lstItemSelected = [] as any;
    this.lstItemSelected.push(this.objItem);
  }

  Search(): void {
    let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
    let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
    this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);
  }

  Refresh(): void {
    this.SearchBy = '';
    this.SearchKeyword = '';
    this.Searchaction = true;
    this.selectedDateRange = { startDate: moment().subtract(0, 'months').date(1), endDate: moment().subtract(1, 'days') };

  }

  newButtonClick() {
    this.MinDate = moment().add(0, 'days');
    if (this._authorizationGuard.CheckAcess("Discountlist", "ViewEdit")) {
      return;
    }
    // this._spinner.show();
    // this._PrivateutilityService.getCustomers()
    //   .subscribe(
    //     (data: Customer[]) => {
    //       this.lstCustomer = data;
    //       this._spinner.hide();
    //     },
    //     (err: any) => {
    //       console.log(err);
    //       this._spinner.hide();
    //     }
    //   );
    this._spinner.show();
    this._PrivateutilityService.GetValues('TransactionType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstTransactionType = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
        }
      );
    this._spinner.show();
    this._PrivateutilityService.GetValues('InventoryType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstInventoryType = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err); this._spinner.hide();
        }
      );
    this._spinner.show();
    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );

    $('#modalpopup_discount').modal('show');
    this.logValidationErrors();
    this.panelTitle = "Add New Discount";
    this.action = true;

    $('#CustomerID').removeAttr("disabled");
    $('#TransactionType').removeAttr("disabled");
    $('#InventoryType').removeAttr("disabled");

    $('#ItemID').removeAttr("disabled");
    $('#MarketPlaceContribution').removeAttr("disabled");
    $('#StoreContribution').removeAttr("disabled");
    $('#OtherContribution').removeAttr("disabled");

    $('#MarketPlaceContribution').val("");
    $('#StoreContribution').val("");
    $('#OtherContribution').val("");
    $('#TotalDiscountPer').val("");

    $('#StartDate').val("");
    $('#EndDate').val("");

  }

  editButtonClick(id: number) {
    this.MinDate = moment().add(0, 'days');
    if (this._authorizationGuard.CheckAcess("Discountlist", "ViewEdit")) {
      return;
    }
    // this._spinner.show();
    // this._PrivateutilityService.getCustomers()
    //   .subscribe(
    //     (data: Customer[]) => {
    //       this.lstCustomer = data;
    //       this._spinner.hide();
    //     },
    //     (err: any) => {
    //       console.log(err);
    //     }
    //   );
    this._spinner.show();
    this._PrivateutilityService.GetValues('TransactionType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstTransactionType = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );
    this._spinner.show();
    this._PrivateutilityService.GetValues('InventoryType')
      .subscribe(
        (data: Dropdown[]) => {
          this.lstInventoryType = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );
    this._spinner.show();
    this._PrivateutilityService.getProductGroups()
      .subscribe(
        (data: ProductGroup[]) => {
          this.lstProductGroup = data;
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );

    this.panelTitle = "Edit Discount";
    this.action = false;
    this.identity = + id;
    this._spinner.show();
    this._discountService.searchById(this.identity)
      .subscribe(
        (data: Discount) => {
          var ItemIDvalue = data.ItemID.toString();
          this.objItem.ItemID = data.ItemID;
          this.objItem.ItemCode = data.ItemCode;
          this.lstItemSelected = [] as any;
          this.lstItemSelected.push(this.objItem);
          var StartDate = moment(data.StartDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();
          var EndDate = moment(data.EndDate, 'YYYY-MM-DD[T]HH:mm').format('MM-DD-YYYY HH:mm').toString();

          this.discountForm.patchValue({
            CustomerID: data.CustomerID,
            TransactionType: data.TransactionType,
            InventoryType: data.InventoryType,

            MarketPlaceContribution: data.MarketPlaceContribution,
            StoreContribution: data.StoreContribution,
            OtherContribution: data.OtherContribution,
            TotalDiscountPer: data.TotalDiscountPer,
            StartDate: data.StartDate,
            EndDate: data.EndDate,
            // IsActive: data.IsActive,
            ItemID: ItemIDvalue,
          });
          this.ItemCode = data.ItemCode;
          this.ItemID = data.ItemID;
          $("#CustomerID").attr("disabled", "disabled");
          $("#TransactionType").attr("disabled", "disabled");
          $("#InventoryType").attr("disabled", "disabled");
          $("#ItemID").attr("disabled", "disabled");
          $("#MarketPlaceContribution").attr("disabled", "disabled");
          $("#StoreContribution").attr("disabled", "disabled");
          $("#OtherContribution").attr("disabled", "disabled");


          $('#StartDate').val(StartDate);
          $('#EndDate').val(EndDate);
          //this.logValidationErrors();
          this.onchangeContribution();
          //this.onchangeSubCategoryID("-1");
          this._spinner.hide();
        },
        (err: any) => {
          console.log(err);
          this._spinner.hide();
        }
      );
    $('#modalpopup_discount').modal('show');
  }

  onLoad(SearchBy: string, Search: string, IsActive: Boolean, StartDate: Date, EndDate: Date) {
    this._spinner.show();
    return this._discountService.search(SearchBy, Search, IsActive, StartDate, EndDate).subscribe(
      (employeeList) => {
        this.lstDiscount = employeeList;
        this.dtOptions = {
          pagingType: 'full_numbers',
          "language": {
            "search": 'Filter',
          },
        };

        this._spinner.hide();
      },
      (err) => {
        this._spinner.hide();
        console.log(err);
      }
    );
  }

  onchangeTransactionType(selectedValue: string) {
    let id = (selectedValue);
    if (id != "") {
      this._spinner.show();
      this._PrivateutilityService.getCustomersBasedType(id)
        .subscribe(
          (data: Customer[]) => {
            this.lstCustomer = data
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
  }

  onchangeProductGroupID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      this._spinner.show();
      this._PrivateutilityService.getCategories(id)
        .subscribe(
          (statesa: Category[]) => {
            this.lstCategory = statesa;
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
  }

  onchangeCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      this._spinner.show();
      this._PrivateutilityService.getSubCategories(id)
        .subscribe(
          (data: SubCategory[]) => {
            this.lstSubCategory = data
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
  }

  onchangeSubCategoryID(selectedValue: string) {
    let id = parseInt(selectedValue);
    if (id > 0) {
      this._spinner.show();
      this._PrivateutilityService.getItems(id)
        .subscribe(
          (data: Item[]) => {
            this.lstItem = data;
            this.objItem.ItemID = 0;
            this.objItem.ItemCode = 'Select';
            this.lstItemSelected = [] as any;
            this.lstItemSelected.push(this.objItem);
            this._spinner.hide();
          },
          (err: any) => {
            console.log(err);
            this._spinner.hide();
          }
        );
    }
  }


  onchangeContribution() {
    this.TotalDiscountPer =
      parseFloat(this.MarketPlaceContribution) + parseFloat(this.StoreContribution) + parseFloat(this.OtherContribution);

  }


  SaveData(): void {
    if (this._authorizationGuard.CheckAcess("Discountlist", "ViewEdit")) {
      return;
    }
    // stop here if form is invalid
    if (this.discountForm.invalid) {
      return;
    }
    let StartDate: Date = new Date(moment(new Date(this.discountForm.controls['StartDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let EndDate: Date = new Date(moment(new Date(this.discountForm.controls['EndDate'].value.startDate._d)).format("MM-DD-YYYY HH:mm"));
    let currentdate: Date = new Date(moment(new Date()).format("MM-DD-YYYY HH:mm"));
    if (currentdate > StartDate) {
      this.alertService.error('The StartDate must be greater than or equal to current datetime.!');
      return;
    }
    else if (StartDate > EndDate) {
      this.alertService.error('The EndDate must be greater than or equal to StartDate.!');
      return;
    }
    else if (this.TotalDiscountPer != 100) {
      this.alertService.error('The sum of MarketPlace , Store and Other Contribution must be 100.!');
      return;
    }
    else if (this.discountForm.controls['ItemID'].value == "") {
      this.alertService.error('Please select atleast one item in a list.!');
      return;
    }
    if (this.identity > 0) {
      this.Update();
    }
    else {
      this.Insert();
    }
  }
  StartDateUpdated(range) {
    this.logValidationErrors();
  }

  EndDateUpdated(range) {
    this.logValidationErrors();
  }

  Insert() {

    this.objDiscount.CustomerID = this.discountForm.controls['CustomerID'].value;
    this.objDiscount.TransactionType = this.discountForm.controls['TransactionType'].value;
    this.objDiscount.InventoryType = this.discountForm.controls['InventoryType'].value;

    this.objDiscount.ItemID = this.discountForm.controls['ItemID'].value;
    this.objDiscount.MarketPlaceContribution = this.discountForm.controls['MarketPlaceContribution'].value;
    this.objDiscount.StoreContribution = this.discountForm.controls['StoreContribution'].value;
    this.objDiscount.OtherContribution = this.discountForm.controls['OtherContribution'].value;

    this.objDiscount.StartDate = this.discountForm.controls['StartDate'].value.startDate._d.toLocaleString();
    this.objDiscount.EndDate = this.discountForm.controls['EndDate'].value.startDate._d.toLocaleString();
    var Itemids = this.discountForm.controls['ItemID'].value.map(a => a.ItemID);
    this._spinner.show();
    this._discountService.upsert(this.objDiscount, Itemids).subscribe(
      (data) => {
        if (data && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success('Discount  data has been added successfully');
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
        }
        $('#modalpopup_discount').modal('hide');
        let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
        let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate); this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );


  }

  Update() {
    this.objDiscount.DiscountID = this.identity;

    this.objDiscount.CustomerID = this.discountForm.controls['CustomerID'].value;
    this.objDiscount.TransactionType = this.discountForm.controls['TransactionType'].value;
    this.objDiscount.InventoryType = this.discountForm.controls['InventoryType'].value;

    this.objDiscount.ItemID = this.discountForm.controls['ItemID'].value;
    this.objDiscount.MarketPlaceContribution = this.discountForm.controls['MarketPlaceContribution'].value;
    this.objDiscount.StoreContribution = this.discountForm.controls['StoreContribution'].value;
    this.objDiscount.OtherContribution = this.discountForm.controls['OtherContribution'].value;

    this.objDiscount.StartDate = this.discountForm.controls['StartDate'].value.startDate._d.toLocaleString();
    this.objDiscount.EndDate = this.discountForm.controls['EndDate'].value.startDate._d.toLocaleString();
    //this.objDiscount.IsActive = this.discountForm.controls['IsActive'].value;

    this.objItem.ItemID = this.discountForm.controls['ItemID'].value;
    let Itemids: number[] = [] as any;
    Itemids.push(this.discountForm.controls['ItemID'].value);
    this._spinner.show();
    this._discountService.upsert(this.objDiscount, Itemids).subscribe(
      (data) => {
        if (data && data.Flag == true) {
          this._spinner.hide();
          this.alertService.success('Discount  data has been updated successful');
        }
        else {
          this._spinner.hide();
          this.alertService.error(data.Msg);
        }
        $('#modalpopup_discount').modal('hide');

        let startdate: Date = this.selectedDateRange.startDate._d.toISOString().substring(0, 10);
        let enddate: Date = this.selectedDateRange.endDate._d.toISOString().substring(0, 10);
        this.onLoad(this.SearchBy, this.SearchKeyword, this.Searchaction, startdate, enddate);
        this.identity = 0;
      },
      (error: any) => {
        this._spinner.hide();
        console.log(error);
      }
    );

  }

}