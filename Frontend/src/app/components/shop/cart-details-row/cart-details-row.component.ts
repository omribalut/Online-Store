import { Component, Input, OnInit } from '@angular/core';
import { CartDetailsModel } from 'src/app/models/cart-details.model';
import store from 'src/app/redux/store';
import { CartDetailsService } from 'src/app/services/cart-details.service';
import { NotifyService } from 'src/app/services/notify.service';

@Component({
  selector:'[app-cart-details-row]' ,
  templateUrl: './cart-details-row.component.html',
  styleUrls: ['./cart-details-row.component.css']
})
export class CartDetailsRowComponent implements OnInit {

  @Input()
    public cartProduct: CartDetailsModel;

  public amount: number;
  public cartId:string;
  public price: number;

  constructor(private cartDetailsService: CartDetailsService, private notifyService: NotifyService) { }


  ngOnInit(): void {
    this.cartId = store.getState().cartsState.cart._id;

  }

  async deleteProductFromCart(productId: string){
    try{
      await this.cartDetailsService.deleteOneCartProduct(productId, this.cartId);
      this.notifyService.success('Product has been deleted');
    }
    catch(err:any){
      this.notifyService.error(err);
    }
    
  }

  async updateCartProduct(id: string){
    this.price = this.cartProduct.totalPrice / this.cartProduct.amount;
    if(!this.amount){
      this.notifyService.error("Amount can't be empty");
      return
  }
    this.cartProduct.amount = this.amount;
    this.cartProduct.totalPrice = this.price * this.amount;
    try{
      await this.cartDetailsService.addCartProduct(this.cartProduct);
  }
  catch(err:any){
      this.notifyService.error(err);
  }
}

}
