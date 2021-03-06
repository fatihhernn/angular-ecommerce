import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product} from '../common/product';
import {map} from 'rxjs/operators';
import {ProductCategory} from '../common/product-category';



@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private BASE_URL = 'http://localhost:8081/api/products';
  private  categoryUrl='http://localhost:8081/api/product-category'

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId:number): Observable<Product[]>{
    const searchUrl=`${this.BASE_URL}/search/findByCategoryId?id=${theCategoryId}`
    return this.getProducts(searchUrl);
  }

  getProductListPaginate(thePage:number,
                         thePageSize:number,
                         theCategoryId:number): Observable<GetResponseProducts>{
    const searchUrl=`${this.BASE_URL}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`
    return this.httpClient.get<GetResponseProducts>(searchUrl)
  }


  getProductCategories():Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(respose => respose._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string) : Observable<Product[]>{
    const searchUrl=`${this.BASE_URL}/search/findByNameContaining?name=${theKeyword}`
    return this.getProducts(searchUrl);
  }

  //need to build URL based on keyword, page , size
  searchProductsPaginate(thePage:number,
                         thePageSize:number,
                         theKeyword: string): Observable<GetResponseProducts>{
    const searchUrl=`${this.BASE_URL}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`
    return this.httpClient.get<GetResponseProducts>(searchUrl)
  }



  private getProducts(searchUrl: string) {
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(respose => respose._embedded.products)
    );
  }

  getProduct(theProductId: number) : Observable<Product> {
    const productUrl=`${this.BASE_URL}/${theProductId}`

    return this.httpClient.get<Product>(productUrl)
  }
}




interface GetProductListPaginate {
  _embedded: {
    products: Product[];
  },
  page:{
    size:number;
    totalElements:number,
    totalPages:number,
    number:number
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  };
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  };
}
