import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {AngularShopFormService} from '../../services/angular-shop-form.service';
import {Country} from '../../common/country';
import {State} from '../../common/state';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup:FormGroup

  totalPrice:number=0;
  totalQuantity:number=0;

  creditCardYears:number[]=[]
  creditCardMonths:number[]=[]

  countries:Country[]=[]
  states:State[]=[]

  shippingAddressStates:State[]=[]
  billingAddressStates:State[]=[]

  constructor(private formBuilder:FormBuilder,private angularShopFormService:AngularShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup=this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:['']
      }),
      shippingAddress:this.formBuilder.group({
        street:[""],
        city:[""],
        state:[""],
        country:[""],
        zipCode:[""],

      }),
     billingAddress:this.formBuilder.group({
        street:[""],
        city:[""],
        state:[""],
        country:[""],
        zipCode:[""],

      }),
      creditCard:this.formBuilder.group({
        cardType:[""],
        nameOnCard:[""],
        cardNumber:[""],
        securityCode:[""],
        expirationMonth:[""],
        expirationYear:[""],
      })
    })

    //populate credit card months
    const startMonth:number=new Date().getMonth()+1;
    console.log("start month : "+startMonth)

    this.angularShopFormService.getCreditCardMonths(startMonth).subscribe(data=>{
      console.log("Retrieved credit card months : "+ JSON.stringify(data))
      this.creditCardMonths=data
    })

    //populate credit card years
    this.angularShopFormService.getCreditCardYears().subscribe(data=>{
      console.log("Retrieved credit card years : "+ JSON.stringify(data))
      this.creditCardYears=data
    })

    this.angularShopFormService.getCountries().subscribe(data=>{
      console.log("Retrieved countries : "+JSON.stringify(data))
      this.countries=data
    })




  }

  onSubmit(){
    console.log("Handling the submit button")
    console.log(this.checkoutFormGroup.get('customer').value)
    console.log(this.checkoutFormGroup.get('customer').value.email)

    console.log("The shipping address country is "+this.checkoutFormGroup.get('shippingAddress').value.country.name)
    console.log("The billing address country is "+this.checkoutFormGroup.get('billingAddress').value.country.name)


  }

  copyShippingToBillingAddress(event) {
    if (event.target.checked){
      this.checkoutFormGroup.controls.billingAddress.setValue(this.checkoutFormGroup.controls.shippingAddress.value);

      this.billingAddressStates=this.shippingAddressStates
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();

      this.billingAddressStates=[];
    }
  }

  handleMonthsAndYears() {
    const creditCardFormGroup=this.checkoutFormGroup.get('creditCard')

    const currentYear:number=new Date().getFullYear()
    const selectedYear:number=Number(creditCardFormGroup.value.creditCardYears);

    //if the current year equals the selected year, then start with current month
    let startMonth:number

    if (currentYear==selectedYear){
      startMonth=new Date().getMonth()+1;
    }else {
      startMonth=1
    }

    this.angularShopFormService.getCreditCardMonths(startMonth).subscribe(data=>{
      console.log("Retrieved credit card months : "+JSON.stringify(data))
      this.creditCardMonths=data
    })

  }

  getStates(formGroupName: string) {
   const formGroup=this.checkoutFormGroup.get(formGroupName);

    const  countryCode=formGroup.value.country.code;
    const  countryName=formGroup.value.country.name;

    console.log(`${formGroupName} country code : ${countryCode}`)
    console.log(`${formGroupName} country name : ${countryName}`)

    this.angularShopFormService.getStates(countryCode).subscribe(
      data=>{
        if (formGroupName==='shippingAddress'){
          this.shippingAddressStates=data
        }else {
          this.billingAddressStates=data
        }

        //select first item by default
        formGroup.get('state').setValue(data[0])
      }


    )

  }
}
