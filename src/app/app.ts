import { Component } from '@angular/core';

interface Product {
  name: string;
  price: number;
  unit: string;
}

interface Category {
  name: string;
  products: Product[];
}

interface OrderItem {
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {

  whatsappNumber = '27772032201';

  categories: Category[] = [
    {
      name: 'Beef',
      products: [
        { name: 'Brisket', price: 110, unit: 'kg' },
        { name: 'Wors', price: 100, unit: 'kg' },
        { name: 'Beef Stew', price: 100, unit: 'kg' },
        { name: 'Lean Mince', price: 133, unit: 'kg' },
        { name: 'Chuck', price: 127, unit: 'kg' },
        { name: 'Short Rib', price: 127, unit: 'kg' },
        { name: 'Ox Tribe', price: 70, unit: 'kg' },
        { name: 'Cow Heels', price: 60, unit: 'kg' },
        { name: 'Ox Liver', price: 76, unit: 'kg' },
        { name: 'Oxtail', price: 130, unit: 'kg' }
      ]
    },
    {
      name: 'Pork',
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
      products: [
        { name: 'Chicken Feet', price: 45, unit: 'kg' },
        { name: 'Chicken Livers', price: 48, unit: 'kg' },
        { name: 'Chicken Necks', price: 45, unit: 'kg' },
        { name: 'Chicken Wings', price: 90, unit: 'kg' },
        { name: 'Chicken Drumsticks', price: 70, unit: 'kg' },
        {
          name: 'Full Brine-Free Frozen Chicken',
          price: 90,
          unit: 'each'
        }
      ]
    },
    {
      name: 'Lamb',
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
      products: [
        { name: 'Frozen Chips', price: 30, unit: 'kg' },
        { name: 'Butternut (Cut) 500g', price: 19, unit: 'pack' },
        { name: 'Spinach (Cut) 300g', price: 18, unit: 'pack' },
        { name: 'Coleslaw Rainbow 300g', price: 20, unit: 'pack' }
      ]
    }
  ];

  combos = [
    {
      name: 'Family Combo',
      price: 1358,
      description: 'A generous family-sized meat and vegetable combo.',
      items: [
        '1.5 kg Wors',
        '1.5 kg Beef Stew',
        '1.5 kg Lean Mince',
        '2 kg Chuck',
        '2 kg Short Rib',
        '2 × Brine-Free Frozen Full Chicken',
        '2 kg Frozen Chips',
        '1.2 kg Butternut',
        '600 g Spinach',
        '600 g Coleslaw Mix'
      ]
    },
    {
      name: 'Lone Combo',
      price: 772,
      description: 'A smaller combo with a great selection of essentials.',
      items: [
        '1 kg Wors',
        '1 kg Beef Stew',
        '1 kg Mince',
        '1 kg Chuck',
        '1 kg Short Rib',
        '1 × Brine-Free Frozen Full Chicken',
        '1 kg Frozen Chips',
        '600 g Butternut',
        '300 g Spinach',
        '300 g Coleslaw Mix'
      ]
    }
  ];

  orderItems: OrderItem[] = [];

  scrollToProducts(): void {
    document.getElementById('products')?.scrollIntoView({
      behavior: 'smooth'
    });
  }

  addProduct(product: Product): void {
    const existingItem = this.orderItems.find(
      item => item.name === product.name
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.orderItems.push({
        name: product.name,
        price: product.price,
        unit: product.unit,
        quantity: 1
      });
    }

    this.scrollToOrder();
  }

  addCombo(combo: { name: string; price: number }): void {
    const existingItem = this.orderItems.find(
      item => item.name === combo.name
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.orderItems.push({
        name: combo.name,
        price: combo.price,
        unit: 'combo',
        quantity: 1
      });
    }

    this.scrollToOrder();
  }

  increaseQuantity(item: OrderItem): void {
    item.quantity++;
  }

  decreaseQuantity(item: OrderItem): void {
    if (item.quantity > 1) {
      item.quantity--;
    } else {
      this.removeItem(item);
    }
  }

  removeItem(item: OrderItem): void {
    this.orderItems = this.orderItems.filter(
      orderItem => orderItem !== item
    );
  }

  get orderCount(): number {
    return this.orderItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  get orderTotal(): number {
    return this.orderItems.reduce(
      (total, item) => total + (item.price * item.quantity),
      0
    );
  }

  scrollToOrder(): void {
    setTimeout(() => {
      document.getElementById('order-summary')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  }

  orderOnWhatsApp(): void {
    if (this.orderItems.length === 0) {
      return;
    }

    let message = `Hi Fourways Butchery,\n\n`;
    message += `I would like to place the following order:\n\n`;

    this.orderItems.forEach(item => {
      const itemTotal = item.price * item.quantity;

      message += `${item.name} x${item.quantity} - R${itemTotal}\n`;
    });

    message += `\nEstimated total: R${this.orderTotal}\n\n`;
    message += `Please confirm availability and the final order total.\n\n`;
    message += `Thank you.`;

    const whatsappUrl =
      `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank');
  }

  clearOrder(): void {
    this.orderItems = [];
  }
}