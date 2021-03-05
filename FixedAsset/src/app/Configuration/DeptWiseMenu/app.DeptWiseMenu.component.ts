import { Component,OnInit,Inject } from '@angular/core';
import { DeptWiseMenuService } from './Shared/DeptWiseMenu.service';
import { DeptWiseMenuModel } from './Shared/DeptWiseMenu.model';
import { NgForm, FormControl,Validators,FormBuilder,FormGroup} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { LoaderService } from '../../Layout/Shared/loader.service';
import { AppSharedUrlComponent } from '../../Shared/appSharedUrl.Component';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { from } from 'rxjs';

import {SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as ObservableOf} from 'rxjs';

export class TodoItemNode {
  children: TodoItemNode[];
  name: string;

  menuId:number;
  parentId:number;
  actualMenuName:string;
  controllerName:string;
  actionName:string;
  queryString:string;
  ordering:number;
  parentMenuLinkId:string;
  parentMenuCssClass:string;
  userId:number;

  
}

/** Flat to-do item node with expandable and level information */
export class TodoItemFlatNode {
  name: string;
  level: number;
  expandable: boolean;

  menuId:number;
  parentId:number;
  actualMenuName:string;
  controllerName:string;
  actionName:string;
  queryString:string;
  ordering:number;
  parentMenuLinkId:string;
  parentMenuCssClass:string;
  userId:number;
  children:any[];
  userNameList:any[];
  menuList:any[];
  }

@Component({
    templateUrl:'./app.DeptWiseMenu.component.html',
    providers:[DeptWiseMenuModel,DeptWiseMenuService]
})
export class DeptWiseMenuComponent extends AppSharedUrlComponent implements OnInit{
 
  /** Map from flat node to nested node. This helps us finding the nested node to be modified */
flatNodeMap = new Map<TodoItemFlatNode, TodoItemNode>();

/** Map from nested node to flattened node. This helps us to keep the same object for selection */
nestedNodeMap = new Map<TodoItemNode, TodoItemFlatNode>();

/** A selected parent node to be inserted */
selectedParent: TodoItemFlatNode | null = null;

/** The new item's name */
newItemName = '';

  treeControl: FlatTreeControl<TodoItemFlatNode>;

  treeFlattener: MatTreeFlattener<TodoItemNode, TodoItemFlatNode>;

  dataSource: MatTreeFlatDataSource<TodoItemNode, TodoItemFlatNode>;


/** The selection for checklist */
checklistSelection = new SelectionModel<TodoItemFlatNode>(true /* multiple */);
//values = this.checklistSelection.selected;
    constructor(private service:DeptWiseMenuService,public model:DeptWiseMenuModel,private toast:ToastrService,
        public loader:LoaderService, private router:Router,private formBuilder:FormBuilder){
            super();

            this.treeFlattener = new MatTreeFlattener(this._transformer, this.getLevel,
              this.isExpandable, this.getChildren);
            this.treeControl = new FlatTreeControl<TodoItemFlatNode>(this.getLevel, this.isExpandable);
            this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

    }

    DeptList:any[];
    DeptWiseMenuForm:FormGroup;

    getLevel = (node: TodoItemFlatNode) => node.level;

    isExpandable = (node: TodoItemFlatNode) => node.expandable;

    getChildren = (node: TodoItemNode): TodoItemNode[] => node.children;

    hasChild = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.expandable;

    hasNoContent = (_: number, _nodeData: TodoItemFlatNode) => _nodeData.name === '';

    _transformer = (node: TodoItemNode, level: number) => {
      const existingNode = this.nestedNodeMap.get(node);
      const flatNode = existingNode && existingNode.name === node.name
          ? existingNode
          : new TodoItemFlatNode();
      flatNode.name = node.name;
      flatNode.level = level;
      flatNode.expandable = !!node.children?.length;
      this.flatNodeMap.set(flatNode, node);
      this.nestedNodeMap.set(node, flatNode);
      return flatNode;
    }
    buildFileTree(obj: {[key: string]: any}, level: number): TodoItemNode[] {
      //debugger;
      return Object.keys(obj).reduce<TodoItemNode[]>((accumulator, key) => {
        const value = obj[key];
        const node = new TodoItemNode();
        node.name = key;
  
        if (value != null) {
          if (typeof value === 'object') {
            node.children = this.buildFileTree(value, level + 1);
          } else {
            node.name = value;
          }
        }
  
        return accumulator.concat(node);
      }, []);
    }

    ngOnInit():void{
        
      this.service.getDept().subscribe((res) => {
            
        if(res.isIdentityExist==true){
            if(res.isSuccess==true){
                this.model.DeptList=res.DeptList;
            }

            else{
                this.toast.error(res.responseMsg);
            }
        }
        else{
            this.toast.error(res.responseMsg);
            setTimeout(() => {
                this.router.navigate(["./login"]);
            }, 1000);
        }
       

     });
      this.service.getMenu().subscribe((res)=>{

        if(res.isIdentityExist==true){
          if(res.isSuccess==true){
            this.model.menuList=res.MenuList;
            this.model.MenuListR=res.MenuListR;
     // var test=res.menuList[1].children[2].text;
            // const TREE_DATA = {
            //   Groceries: [
            //     'Almond Meal flour', 
            //     // : null
            //     // 'Organic eggs': null,
            //     'Organic eggs',
            //     'Protein Powder',
            //   ],
            //   Reminders: [
            //     'Cook dinner',
            //     'Read the Material Design spec',
            //     'Upgrade Application to Angular'
            //   ],
            //   // Reminders:{
            //   //   'Cook Dinner':null,
            //   //   'Read Book':null,
            //   // },
            //   Test:[]
            // };
            
              
            this.treeControl = new FlatTreeControl<TodoItemFlatNode>(
              node => node.level, node => node.expandable);

              this.treeFlattener = new MatTreeFlattener(
              this._transformer, node => node.level, node => node.expandable, node => node.children);

              this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

              // const data = this.buildFileTree(TREE_DATA, 0);

            var information = new Array()  
           // var ChildInformation=new Array()

  
  res.MenuList.forEach(element => {
    var name=element.name;
    var ChildInformation=new Array()
    for(var i=0; i<element.children.length; i++)
    {
      var childName=element.children[i].name;
      var childId=element.children[i].menuId;
      //ChildInformation[childName]=[childName,childId];
      ChildInformation[childName]=[];
     // ChildInformation:(childName| childId)[i]=[];
      // information[childName]=element.children;
    }
    information[name] =ChildInformation; 
  });

 //return information;
 const data = this.buildFileTree(information, 0);
              this.dataSource.data = data;
     var NodeDetails=res.MenuList;
             // this.dataSource.data=res.MenuList;
          }

          else{
              this.toast.error(res.responseMsg);
          }
      }
      else{
          this.toast.error(res.responseMsg);
          setTimeout(() => {
              this.router.navigate(["./login"]);
          }, 1000);
      }
      });
      
        
     this.DeptWiseMenuForm=new FormGroup({
        DeptName:new FormControl('',Validators.required),
     });

    }

    onSubmit(DeptWiseMenuForm:any){
      if(DeptWiseMenuForm.invalid){
        this.DeptWiseMenuForm.get('DeptName').markAsTouched();
          return
      }
      this.model.DeptId=DeptWiseMenuForm.controls.DeptName.value;
      var value=this.checklistSelection.selected;
      if(value.length==0){
        this.toast.error("No, Menu selcted. please select menus");
        return;
      }
     
      var menuToSave=this.model.menuList;
    
      var myObjArray = new Array()
      value.forEach(element => {
       var filterItem=element.name;
          let m =this.model.MenuListR.filter(p=>p.name==filterItem);
            myObjArray.push(m);   
      });
      this.model.Menu=myObjArray;
      this.model.Menu=value;
      
           this.service.addDeptWiseMenu(this.model).subscribe((res:any)=>{
               if(res.isIdentityExist==true){
                   if(res.isSuccess==true){
                       this.DeptWiseMenuForm.reset();
                       this.DeptWiseMenuForm.controls.DeptName.reset();
                       this.checklistSelection.clear();
                       
                       this.toast.success(res.responseMsg);
                   }
                   else{
                       this.toast.error(res.responseMsg);
                   }
               }
               else{
                   this.toast.error(res.responseMsg);
                   setTimeout(() => {
                       this.router.navigate(["./login"]);
                   }, 1000);
               }
           });
  }
BindMenu(FormData?:any) {
  let DeptId:number=this.DeptWiseMenuForm.controls.DeptName.value!="" ? this.DeptWiseMenuForm.controls.DeptName.value : FormData.DeptId;
     this.model.DeptId=DeptId;
      this.service.getMenuOfDept(DeptId).subscribe((res:any)=>{
          if(res.isIdentityExist==true){
              if(res.isSuccess==true){
                this.checklistSelection.clear();
              var selList=res.SelectedMenuList;
              selList.forEach(element => {
                for (let i = 0; i < this.treeControl.dataNodes.length; i++) {
                  if (this.treeControl.dataNodes[i].name == element.name) {
                   this.checklistSelection.toggle(this.treeControl.dataNodes[i]);
                  }
                }

              });
            }
            else{
                this.toast.error(res.responseMsg);
            }
        }
        else{
            this.toast.error(res.responseMsg);
            setTimeout(() => {
                this.router.navigate(["./login"]);
            }, 1000);
        }
    }); 

}


  getFormData(form:any){
    this.model.DeptId=form.controls.DeptName.value;
    }

      /** Whether all the descendants of the node are selected. */
  descendantsAllSelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    return descAllSelected;
  }

  /** Whether part of the descendants are selected */
  descendantsPartiallySelected(node: TodoItemFlatNode): boolean {
    const descendants = this.treeControl.getDescendants(node);
    const result = descendants.some(child => this.checklistSelection.isSelected(child));
    return result && !this.descendantsAllSelected(node);
  }

  /** Toggle the to-do item selection. Select/deselect all the descendants node */
  todoItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    const descendants = this.treeControl.getDescendants(node);
    let isSelect=this.checklistSelection.isSelected(node);
    isSelect ? this.checklistSelection.select(...descendants) : this.checklistSelection.deselect(...descendants);

    // Force update for the parent
    descendants.forEach(child => this.checklistSelection.isSelected(child));
    this.checkAllParentsSelection(node);
  }

  /** Toggle a leaf to-do item selection. Check all the parents to see if they changed */
  todoLeafItemSelectionToggle(node: TodoItemFlatNode): void {
    this.checklistSelection.toggle(node);
    this.checkAllParentsSelection(node);
  }

  /* Checks all the parents when a leaf node is selected/unselected */
  checkAllParentsSelection(node: TodoItemFlatNode): void {
    let parent: TodoItemFlatNode | null = this.getParentNode(node);
    while (parent) {
      this.checkRootNodeSelection(parent);
      parent = this.getParentNode(parent);
    }
  }

   /* Get the parent node of a node */
   getParentNode(node: TodoItemFlatNode): TodoItemFlatNode | null {
    const currentLevel = this.getLevel(node);
    

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
    return null;
  }

  /** Check root node checked state and change it accordingly */
  checkRootNodeSelection(node: TodoItemFlatNode): void {
    const nodeSelected = this.checklistSelection.isSelected(node);
    const descendants = this.treeControl.getDescendants(node);
    const descAllSelected = descendants.length > 0 && descendants.every(child => {
      return this.checklistSelection.isSelected(child);
    });
    if (nodeSelected && !descAllSelected) {
      this.checklistSelection.deselect(node);
    } else if (!nodeSelected && descAllSelected) {
      this.checklistSelection.select(node);
    }
  }

}


  