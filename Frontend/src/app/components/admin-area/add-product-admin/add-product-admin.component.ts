import { ProductsService } from './../../../services/products.service';
import { ProductModel } from './../../../models/product.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NotifyService } from 'src/app/services/notify.service';
import { CategoryModel } from 'src/app/models/category.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-product-admin',
  templateUrl: './add-product-admin.component.html',
  styleUrls: ['./add-product-admin.component.css']
})
export class AddProductAdminComponent implements OnInit {

    // Two-Way binding must be into an empty existing object:
    public product = new ProductModel();
    public test: string = '';
    public categories: CategoryModel[];

    // Bind to the <input type="file" ... > 
    @ViewChild("imageBox")
    public imageBoxRef: ElementRef<HTMLInputElement>;

    constructor(
        private productsService: ProductsService,
        private router: Router,
        private notifyService: NotifyService) { }

        async ngOnInit(): Promise<void>{
            try {
              this.categories = await this.productsService.getCategories();
  

              
          }
          catch(err:any){
            this.notifyService.error(err);
          }
      }

      

    async add() {
        try {
            this.test = 'a';
            this.product.image = this.imageBoxRef.nativeElement.files[0];
            const addedProduct = await this.productsService.addProduct(this.product);
            this.notifyService.success("Product has been added");
            this.router.navigateByUrl("/products");
        }
        catch(err: any) {
            this.notifyService.error(err);
        }
    }
    
}
