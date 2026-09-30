import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Product {
  name: string;
  price: number;
  unit: string;
}

export interface Category {
  name: string;
  image: string;
  products: Product[];
}

export interface Combo {
  name: string;
  price: number;
  image: string;
  items: string[];
}

export interface CartItem {
  name: string;
  price: number;
  quantity: number;
  unit?: string;
  type: 'combo' | 'product';
}

interface IkhokhaPaymentResponse {
  responseCode: string;
  message?: string;
  paylinkUrl?: string;
  paylinkID?: string;
  externalTransactionID?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {

  constructor(
    private http: HttpClient
  ) {}

  deliveryFee = 40;

  whatsappNumber = '27772032201';

  // =========================================================
  // iKHOKHA CONFIGURATION
  // =========================================================

  ikhokhaApiUrl =
    'https://api.ikhokha.com/public-api/v1/api/payment';

  /*
   * IMPORTANT:
   * This is only for testing.
   *
   * DO NOT put your real Application Secret
   * in production Angular code.
   */

  ikhokhaWorkerUrl = 'https://4ways-ikhokha-worker.sshandu0.workers.dev';
  // =========================================================
  // CUSTOMER DETAILS
  // =========================================================

  customerName = '';

  customerPhone = '';

  deliveryAddress = '';

  suburb = '';

  deliveryNotes = '';

  selectedPaymentMethod:
    'ikhokha' | 'whatsapp' = 'ikhokha';

  showValidationError = false;

  isProcessingPayment = false;

  paymentError = '';

  whatsappOrderSentForIkhokha = false;

  // =========================================================
  // IMAGES
  // =========================================================

  heroImage =
    'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80';

  // =========================================================
  // SUBURBS
  // =========================================================

  joburgSuburbs = [
    'Fourways',
    'Sandton',
    'Bryanston',
    'Midrand',
    'Randburg',
    'Sunninghill',
    'Lonehill',
    'Douglasdale',
    'Paulshof',
    'Kyalami',
    'North Riding',
    'Northgate',
    'Rivonia',
    'Other Joburg North'
  ];

  // =========================================================
  // COMBOS
  // =========================================================

  combos: Combo[] = [

    {
      name: 'Family Combo',

      price: 1358,

      image:
        'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1000&q=80',

      items: [
        '1.5kg Wors',
        '1.5kg Beef Stew',
        '1.5kg Lean Mince',
        '2kg Chuck / Short Rib',
        '2 Whole Chickens',
        '1.2kg Butternut',
        '600g Spinach / Coleslaw'
      ]
    },

    {
      name: 'Lone Combo',

      price: 772,

      image:
        'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1000&q=80',

      items: [
        '1kg Wors',
        '1kg Beef Stew',
        '1kg Lean Mince',
        '1kg Chuck / Short Rib',
        '1 Whole Chicken',
        '1kg Chips',
        '600g Butternut',
        '300g Spinach / Coleslaw'
      ]
    }

  ];

  // =========================================================
  // PRODUCTS
  // =========================================================

  categories: Category[] = [

    {
      name: 'Beef',

      image:
        'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=1000&q=80',

      products: [

        { name: 'Brisket', price: 110, unit: 'kg' },
        { name: 'Wors', price: 100, unit: 'kg' },
        { name: 'Beef Stew', price: 100, unit: 'kg' },
        { name: 'Lean Mince', price: 133, unit: 'kg' },
        { name: 'Chuck', price: 127, unit: 'kg' },
        { name: 'Short Rib', price: 127, unit: 'kg' },
        { name: 'Ox Tripe', price: 70, unit: 'kg' },
        { name: 'Cow Heels', price: 60, unit: 'kg' },
        { name: 'Ox Liver', price: 76, unit: 'kg' },
        { name: 'Oxtail', price: 130, unit: 'kg' }

      ]
    },

    {
      name: 'Pork',

      image:
        'https://images.unsplash.com/photo-1432139509613-5c4255815697?auto=format&fit=crop&w=1000&q=80',

      products: [

        { name: 'Pork Stew', price: 90, unit: 'kg' },
        { name: 'Pork Chops', price: 85, unit: 'kg' },
        { name: 'Pork Shoulder', price: 95, unit: 'kg' },
        { name: 'Pork Trotters', price: 50, unit: 'kg' },
        { name: 'Pork Ribs', price: 90, unit: 'kg' }

      ]
    },

    {
      name: 'Chicken',

      image:
        'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=1000&q=80',

      products: [

        { name: 'Chicken Feet', price: 45, unit: 'kg' },
        { name: 'Chicken Livers', price: 48, unit: 'kg' },
        { name: 'Chicken Necks', price: 45, unit: 'kg' },
        { name: 'Chicken Wings', price: 90, unit: 'kg' },
        { name: 'Chicken Drumsticks', price: 70, unit: 'kg' },
        {
          name: 'Full Brine Free Frozen Chicken',
          price: 90,
          unit: 'each'
        }

      ]
    },

    {
      name: 'Lamb',

      image:
        'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=1000&q=80',

      products: [

        { name: 'Lamb Stew', price: 105, unit: 'kg' },
        { name: 'Lamb Chops', price: 155, unit: 'kg' },
        { name: 'Lamb Shank', price: 165, unit: 'kg' },
        { name: 'Lamb Ribs', price: 160, unit: 'kg' },
        { name: 'Lamb Trotters', price: 70, unit: 'kg' }

      ]
    },

    {
      name: 'Vegetables',

      image:
        'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1000&q=80',

      products: [

        { name: 'Frozen Chips', price: 30, unit: 'kg' },
        { name: 'Butternut cut', price: 19, unit: '500g pack' },
        { name: 'Spinach cut', price: 18, unit: '300g pack' },
        { name: 'Coleslaw Rainbow', price: 20, unit: '300g pack' }

      ]
    }

  ];

  // =========================================================
  // CART
  // =========================================================

  cart: CartItem[] = [];

  // =========================================================
  // ADD TO CART
  // =========================================================

  addToCart(
    item: Product | Combo,
    type: 'combo' | 'product'
  ): void {

    const existing = this.cart.find(
      cartItem =>
        cartItem.name === item.name &&
        cartItem.type === type
    );

    if (existing) {

      existing.quantity++;

    } else {

      this.cart.push({

        name: item.name,

        price: item.price,

        quantity: 1,

        unit:
          type === 'product'
            ? (item as Product).unit
            : undefined,

        type

      });

    }

    this.scrollToSection('order-summary');
  }

  // =========================================================
  // QUANTITY
  // =========================================================

  increaseQuantity(item: CartItem): void {

    item.quantity++;

  }

  decreaseQuantity(item: CartItem): void {

    if (item.quantity > 1) {

      item.quantity--;

    } else {

      this.removeFromCart(item);

    }

  }

  removeFromCart(item: CartItem): void {

    this.cart =
      this.cart.filter(
        cartItem => cartItem !== item
      );

  }

  // =========================================================
  // CLEAR ORDER
  // =========================================================

  clearOrder(): void {

    this.cart = [];

    this.customerName = '';

    this.customerPhone = '';

    this.deliveryAddress = '';

    this.suburb = '';

    this.deliveryNotes = '';

    this.showValidationError = false;

    this.paymentError = '';

  }

  // =========================================================
  // TOTALS
  // =========================================================

  get cartSubtotal(): number {

    return this.cart.reduce(

      (total, item) =>
        total +
        item.price * item.quantity,

      0

    );

  }

  get cartTotal(): number {

    if (this.cart.length === 0) {

      return 0;

    }

    return this.cartSubtotal + this.deliveryFee;

  }

  // =========================================================
  // VALIDATION
  // =========================================================

  private validateCustomerDetails(): boolean {

    if (

      !this.customerName.trim() ||

      !this.customerPhone.trim() ||

      !this.deliveryAddress.trim() ||

      !this.suburb

    ) {

      this.showValidationError = true;

      return false;

    }

    this.showValidationError = false;

    return true;

  }

  // =========================================================
  // CREATE ORDER ITEMS
  // =========================================================

  private createOrderItems(): string {

    return this.cart

      .map(item => {

        const itemTotal =
          item.price * item.quantity;

        const unitText =
          item.unit
            ? ` / ${item.unit}`
            : '';

        return (
          `${item.name} x${item.quantity}` +
          `${unitText}` +
          ` - R${itemTotal.toFixed(2)}`
        );

      })

      .join('\n');

  }

  // =========================================================
  // WHATSAPP MESSAGE
  // =========================================================

  private createWhatsAppMessage(): string {

    return `

4WAYS BUTCHERY ORDER
====================

CUSTOMER DETAILS

Name:
${this.customerName}

Phone:
${this.customerPhone}

DELIVERY DETAILS

Address:
${this.deliveryAddress}

Suburb:
${this.suburb}

Special Instructions:
${this.deliveryNotes || 'None'}

ORDER

${this.createOrderItems()}

PAYMENT SUMMARY

Subtotal:
R${this.cartSubtotal.toFixed(2)}

Delivery Fee:
R${this.deliveryFee.toFixed(2)}

TOTAL:
R${this.cartTotal.toFixed(2)}

Payment Method:
${this.selectedPaymentMethod === 'ikhokha'
  ? 'iKhokha'
  : 'WhatsApp'}

Please confirm my order.

`.trim();

  }

  // =========================================================
  // WHATSAPP
  // =========================================================

  private openWhatsApp(): void {

    const message =
      this.createWhatsAppMessage();

    const encodedText =
      encodeURIComponent(message);

    const whatsappUrl =
      `https://wa.me/${this.whatsappNumber}?text=${encodedText}`;

    window.open(
      whatsappUrl,
      '_blank',
      'noopener,noreferrer'
    );

  }



  // =========================================================
// SEND iKHOKHA ORDER DETAILS TO WHATSAPP
// =========================================================

sendIkhokhaOrderToWhatsApp(): void {

  if (this.cart.length === 0) {
    this.paymentError = 'Your cart is empty.';
    return;
  }

  if (!this.validateCustomerDetails()) {
    return;
  }

  const message =
    this.createWhatsAppMessage();

  const encodedText =
    encodeURIComponent(message);

  const whatsappUrl =
    `https://wa.me/${this.whatsappNumber}?text=${encodedText}`;

  window.open(
    whatsappUrl,
    '_blank',
    'noopener,noreferrer'
  );

  // WhatsApp has now been opened with the
  // complete order ready to send.
  this.whatsappOrderSentForIkhokha = true;

  this.paymentError = '';
}


  // =========================================================
// iKHOKHA PAYMENT
// =========================================================

async payWithIkhokha(): Promise<void> {

  if (this.cart.length === 0) {
    this.paymentError = 'Your cart is empty.';
    return;
  }

  if (!this.validateCustomerDetails()) {
    return;
  }

  if (!this.whatsappOrderSentForIkhokha) {
    this.paymentError =
      'Please send your order details to WhatsApp first.';
    return;
  }

  if (!this.cartTotal || this.cartTotal <= 0) {
    this.paymentError = 'Invalid payment amount.';
    return;
  }

  this.isProcessingPayment = true;
  this.paymentError = '';

  try {

    const externalTransactionID =
      `4WAYS-${Date.now()}`;

    const paymentRequest = {

      amount:
        this.cartTotal,

      externalTransactionID,

      requesterUrl:
        window.location.origin,

      callbackUrl:
        `${window.location.origin}/payment-callback`,

      successPageUrl:
        `${window.location.origin}/payment-success`,

      failurePageUrl:
        `${window.location.origin}/payment-failed`,

      cancelUrl:
        `${window.location.origin}/payment-cancelled`

    };

    console.log(
      'Payment request:',
      paymentRequest
    );

    const response =
      await firstValueFrom(

        this.http.post<any>(
          this.ikhokhaWorkerUrl,
          paymentRequest
        )

      );

    console.log(
      'iKhokha response:',
      response
    );

    if (

      response?.success === true &&

      response?.result?.responseCode === '00' &&

      response?.result?.paylinkUrl

    ) {

      const paylinkUrl =
        response.result.paylinkUrl;

      console.log(
        'Redirecting to iKhokha:',
        paylinkUrl
      );

      window.location.href =
        paylinkUrl;

      return;
    }

    console.error(
      'Unexpected iKhokha response:',
      response
    );

    this.paymentError =
      'Unable to create the iKhokha payment. Please try again.';

  }

  catch (error) {

    console.error(
      'iKhokha payment error:',
      error
    );

    this.paymentError =
      'Unable to process the payment. Please try again.';

  }

  finally {

    this.isProcessingPayment = false;

  }
}  

  // =========================================================
  // HMAC SHA256
  // =========================================================

  private async generateIkhokhaSignature(

    endpoint: string,

    requestBody: string,

    secret: string

  ): Promise<string> {

    /*
     * iKhokha signs:
     *
     * path + requestBody
     */

    const url =
      new URL(endpoint);

    const payload =
      url.pathname + requestBody;

    const encoder =
      new TextEncoder();

    const keyData =
      encoder.encode(secret);

    const payloadData =
      encoder.encode(payload);

    const cryptoKey =
      await crypto.subtle.importKey(

        'raw',

        keyData,

        {
          name: 'HMAC',
          hash: 'SHA-256'
        },

        false,

        ['sign']

      );

    const signatureBuffer =
      await crypto.subtle.sign(

        'HMAC',

        cryptoKey,

        payloadData

      );

    const signatureArray =
      Array.from(
        new Uint8Array(signatureBuffer)
      );

    return signatureArray
      .map(
        byte =>
          byte
            .toString(16)
            .padStart(2, '0')
      )
      .join('');

  }

  // =========================================================
  // SUBMIT ORDER
  // =========================================================

  submitOrder(): void {

    if (this.cart.length === 0) {

      return;

    }

    if (!this.validateCustomerDetails()) {

      return;

    }

    if (
      this.selectedPaymentMethod ===
      'whatsapp'
    ) {

      this.openWhatsApp();

      return;

    }

    if (
      this.selectedPaymentMethod ===
      'ikhokha'
    ) {

      this.payWithIkhokha();

      return;

    }

  }

  // =========================================================
  // SCROLL
  // =========================================================

  scrollToSection(
    sectionId: string
  ): void {

    const element =
      document.getElementById(
        sectionId
      );

    if (element) {

      element.scrollIntoView({

        behavior: 'smooth',

        block: 'start'

      });

    }

  }

}