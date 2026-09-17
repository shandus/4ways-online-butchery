import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  deliveryFee = 40;
  whatsappNumber = '27772032201';

  // Hero Image URL (Replace with 'assets/images/hero-banner.jpg' when downloaded)
  heroImage = 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1200&q=80';

  // Butchery Combos
  combos: Combo[] = [
    {
      name: 'Family Combo',
      price: 1358,
      image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&w=800&q=80',
      items: [
        '1.5 kg Wors',
        '1.5 kg Beef Stew',
        '1.5 kg Lean Mince',
        '2 kg Chuck',
        '2 kg Short Rib',
        '2 * Brine Free Frozen Full Chicken',
        '2 kg Frozen Chips',
        '1.2 kg Butternut (cut)',
        '600 g Spinach (cut)',
        '600 g Coleslaw Mix (cut)'
      ]
    },
    {
      name: 'Lone Combo',
      price: 772,
      image: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=800&q=80',
      items: [
        '1 kg Wors',
        '1 kg Beef Stew',
        '1 kg Mince',
        '1 kg Chuck',
        '1 kg Short Rib',
        '1 * Brine Free Frozen Full Chicken',
        '1 kg Frozen Chips',
        '600 g Butternut (cut)',
        '300 g Spinach (cut)',
        '300 g Coleslaw Mix (cut)'
      ]
    }
  ];

  // Shop Categories
  categories: Category[] = [
    {
      name: 'Beef',
      image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80',
      products: [
        { name: 'Stew', price: 90, unit: 'kg' },
        { name: 'Pork Chops', price: 85, unit: 'kg' },
        { name: 'Pork Shoulder', price: 95, unit: 'kg' },
        { name: 'Pork Trotters', price: 50, unit: 'kg' },
        { name: 'Pork Ribs', price: 90, unit: 'kg' }
      ]
    },
    {
      name: 'Chicken',
      image: 'https://images.unsplash.com/photo-1587593810167-a84920ea0781?auto=format&fit=crop&w=800&q=80',
      products: [
        { name: 'Chicken Feet', price: 45, unit: 'kg' },
        { name: 'Chicken Livers', price: 48, unit: 'kg' },
        { name: 'Chicken Necks', price: 45, unit: 'kg' },
        { name: 'Chicken Wings', price: 90, unit: 'kg' },
        { name: 'Chicken Drumsticks', price: 70, unit: 'kg' },
        { name: 'Full Brine Free Frozen Chicken', price: 90, unit: 'each' }
      ]
    },
    {
      name: 'Lamb',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
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
      image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
      products: [
        { name: 'Frozen Chips', price: 30, unit: 'kg' },
        { name: 'Butternut (cut) 500g', price: 19, unit: 'pack' },
        { name: 'Spinach (cut) 300g', price: 18, unit: 'pack' },
        { name: 'Coleslaw Rainbow 300g', price: 20, unit: 'pack' }
      ]
    }
  ];

  cart: CartItem[] = [];

  scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  }

  addToCart(item: { name: string; price: number; unit?: string }, type: 'combo' | 'product') {
    const existing = this.cart.find(i => i.name === item.name);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({
        name: item.name,
        price: item.price,
        unit: item.unit,
        quantity: 1,
        type
      });
    }
  }

  increaseQuantity(item: CartItem) {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem) {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeFromCart(item);
    }
  }

  removeFromCart(item: CartItem) {
    this.cart = this.cart.filter(i => i.name !== item.name);
  }

  clearOrder() {
    this.cart = [];
  }

  get cartSubtotal(): number {
    return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  get cartTotal(): number {
    return this.cart.length > 0 ? this.cartSubtotal + this.deliveryFee : 0;
  }

  orderOnWhatsApp() {
    if (this.cart.length === 0) return;

    let text = `*NEW ORDER - 4WAYS BUTCHERY*\n\n`;
    
    this.cart.forEach(item => {
      text += `• ${item.quantity}x ${item.name} - R${item.price * item.quantity}\n`;
    });

    text += `\n*Subtotal:* R${this.cartSubtotal}`;
    text += `\n*Delivery Fee:* R${this.deliveryFee}`;
    text += `\n*Total Due:* R${this.cartTotal}\n\n`;
    text += `Please confirm my order and provide payment details.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${this.whatsappNumber}?text=${encodedText}`, '_blank');
  }
}