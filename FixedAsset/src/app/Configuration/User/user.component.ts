import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {


  constructor() { }

  // navLinks = [{ path: 'unitFunctionalDept', label: 'Unit Functional Department', index: 0 },
  // { path: 'unitInventoryDept', label: 'Unit Inventory Department', index: 1 },
  // { path: 'hqInventoryDept', label: 'HQ Inventory Department', index: 2 }
  // ];
  // activeLink = this.navLinks[0].path;

  ngOnInit(): void {
  }

}
