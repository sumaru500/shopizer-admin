import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../shared/services/storage.service';
import { StoreService } from '../../store-management/services/store.service';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SharedService } from '../services/shared.service';
import { error } from '@angular/compiler/src/util';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'ngx-rules-list',
  templateUrl: './rules-list.component.html',
  styleUrls: ['./rules-list.component.scss']
})
export class RulesListComponent implements OnInit {

  source: LocalDataSource = new LocalDataSource();
  loadingList = false;
  settings = {};
  perPage = 10;
  currentPage = 1;
  totalCount;
  stores: Array<any> = [];
  selectedStore: String = '';
  isSuperAdmin: boolean;
  constructor(
    private router: Router,
    private translate: TranslateService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    private storeService: StoreService,
    private storageService: StorageService,
  ) {
    this.getShippingRulesList();
    this.isSuperAdmin = this.storageService.getUserRoles().isSuperadmin;
    this.selectedStore = this.storageService.getMerchant()
  }

  ngOnInit() {
    this.translate.onLangChange.subscribe((lang) => {
      this.getShippingRulesList();
    });
    this.getStoreList();
  }
  getStoreList() {
    this.storeService.getListOfMerchantStoreNames({ 'store': '' })
      .subscribe(res => {
        res.forEach((store) => {
          this.stores.push({ value: store.code, label: store.code });
        });
        // this.stores = res;
      });
  }
  getShippingRulesList() {
    this.loadingList = true;
    this.sharedService.getShippingRules(this.selectedStore)
      .subscribe(data => {
        this.loadingList = false;
        this.source.load(data);
      }, error => {

      });
    this.setSettings();
  }

  setSettings() {
    var me = this;
    this.settings = {

      hideSubHeader: true,
      actions: {
        columnTitle: this.translate.instant('COMMON.ACTIONS'),
        add: false,
        edit: false,
        delete: false,
        position: 'right',
        custom: [
          {
            name: 'edit',
            title: '<i class="nb-edit"></i>'
          },
          {
            name: 'delete',
            title: '<i class="nb-trash"></i>'
          }
        ],
      },
      pager: {
        display: false
      },
      columns: {
        id: {
          title: this.translate.instant('COMMON.ID'),
          type: 'string',
          filter: false
        },
        code: {
          title: this.translate.instant('PACKAGING.CODE'),
          type: 'string',
          filter: false
        },
        name: {
          title: this.translate.instant('RULES.NAME'),
          type: 'string',
          filter: false
        }
      },

    };

  }
  onSelectStore(e) {
    // console.log(value)
    this.selectedStore = e.value;
    this.getShippingRulesList();

  }
  // paginator
  // changePage(event) {
  //   switch (event.action) {
  //     case 'onPage': {
  //       this.currentPage = event.data;
  //       break;
  //     }
  //     case 'onPrev': {
  //       this.currentPage--;
  //       break;
  //     }
  //     case 'onNext': {
  //       this.currentPage++;
  //       break;
  //     }
  //     case 'onFirst': {
  //       this.currentPage = 1;
  //       break;
  //     }
  //     case 'onLast': {
  //       this.currentPage = event.data;
  //       break;
  //     }
  //   }

  // }
  // delete(e) {
  //   this.loadingList = true;
  //   this.sharedService.deletePackaging(e.data.code)
  //     .subscribe(res => {
  //       this.loadingList = false;
  //       this.toastr.success("Packages has been deleted successfully");
  //       this.getShippingRulesList()
  //     }, error => {
  //       this.loadingList = false;

  //     });
  // }
  onClickAction(e) {
    if (e.action == 'delete') {
      // this.delete(e);
    } if (e.action == 'edit') {
      localStorage.setItem('rulesCode', e.data.code);
      this.router.navigate(['pages/shipping/rules/add']);
    }
  }
  createRules() {
    localStorage.setItem('rulesCode', '');
    this.router.navigate(['pages/shipping/rules/add']);
  }
}
