import { ProductModel } from 'src/app/models/product.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public product:ProductModel
  public opened = !true;
  fixedBottomGap: number = 0;
  fixedTopGap: number = 0;
  fixedInViewport = true;
  public flag = '';
  public flagSec = '';

  constructor() { }

  ngOnInit(): void {
  }

  public handlerProductId(product: ProductModel){
    this.flagSec = '';
    this.product = product;
    this.flag = 'a';
  }

  public showAddForm(){
    this.flag = '';
    this.flagSec = 'a';
    this.opened = true;

  }

  public handlerProductId2 (boolVal:boolean){
    if(!boolVal){
      this.opened = true;
    }
    else{
      this.opened = false;
    }
  }

}
