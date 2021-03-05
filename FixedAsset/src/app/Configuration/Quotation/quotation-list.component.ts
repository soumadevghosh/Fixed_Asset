import { Component, OnInit, ViewChild, Input, Output } from '@angular/core';
import { QuotationEntryModel } from './Shared/quotation-entry-model';
import { QuotationEntryService } from './Shared/quotation-entry.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/Shared/app.ConfirmDialog.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { QuotationEntryComponent } from './QuotationEntry/quotation-entry.component';

@Component({
  selector: 'app-quotation-list',
  templateUrl: './quotation-list.component.html',
  providers: [QuotationEntryModel, QuotationEntryService]
  })
export class QuotationListComponent implements OnInit {

  constructor(public model: QuotationEntryModel, private service: QuotationEntryService, private toastr: ToastrService,
    private router: Router, private dialog: MatDialog, private dialogService: DialogService, private route: ActivatedRoute) { }

    searchKey: string;
    QuotationId : any;
    isLoaded : boolean;
    isGridLoaded : boolean;
    dataSource: MatTableDataSource<any>;
    displayedColumns= ['position','VendorName','ItemName','Action'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.isGridLoaded = true;
    this.loadGrid();
  }
  quotationEntryComponent(){
    this.isGridLoaded = false;
    this.isLoaded = true;
    this.QuotationId = 0;
  }

  // quotationEntryComponent(){
  //   const config = new MatDialogConfig();
  //   config.disableClose = true;
  //   config.autoFocus = true;
  //   config.width = "100%";
  //   config.position = {
  //     top : "55px"
  //   }
  //   config.data = {
  //     QuotationId : 0
  //   }
  //   this.dialog.open(QuotationEntryComponent, config).afterClosed().subscribe(()=>this.loadGrid());
  // }

  loadGrid(){
    this.service.getQuotationEntryList().subscribe((res)=>{
      if(res.isIdentityExist == true){
        if(res.isSuccess == true){
          this.dataSource = new MatTableDataSource(res.QuotationList);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.model.QuotationList = res.QuotationList;
        }
        else{
          this.toastr.error(res.responseMsg);
        }
      }
      else{
        this.toastr.error(res.responseMsg);
        setTimeout(()=>{
          this.router.navigate(["./login"]);
        }, 1000);
      }
    });
  }

  OnEdit(model : QuotationEntryModel){
    if(model.QuotationId > 0){
      this.QuotationId = model.QuotationId;
      this.isLoaded = true;
      this.isGridLoaded = false;
    }
    
  }

  applyFilter(){
    this.dataSource.filter=this.searchKey.trim().toLocaleLowerCase();
  }

  

  

  

}
