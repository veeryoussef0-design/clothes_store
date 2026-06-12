import { supabase } from './supabaseClient';
import type { CartItem } from './cart';

export type OrderItem = {
  name: string;
  qty: number;
  size?: string | null;
  price: number;
  total: number;
};

export interface Order {
  id?: string;
  customer_name: string;
  customer_phone: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  created_at?: string;
}

export async function saveOrder(order: Omit<Order, 'id' | 'created_at'> | (Omit<Order, 'id' | 'created_at'> & { items: CartItem[] })) {
  try {
    const simplifiedItems = order.items.map((item: any) => ({
      name: item.product?.name ?? item.name,
      qty: item.qty,
      size: item.size ?? null,
      price: item.product?.price ?? item.price,
      total: (item.product?.price ?? item.price) * item.qty,
    }));

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          items: simplifiedItems,
          total: order.total,
          status: order.status,
        },
      ])
      .select();

    if (error) {
      console.error('Error saving order:', error);
      throw error;
    }

    return data?.[0];
  } catch (error) {
    console.error('Failed to save order:', error);
    throw error;
  }
}

export async function getOrders(phone?: string) {
  try {
    let query = supabase.from('orders').select('*');

    if (phone) {
      query = query.eq('customer_phone', phone);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: Order['status']) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select();

    if (error) throw error;
    return data?.[0];
  } catch (error) {
    console.error('Failed to update order:', error);
    throw error;
  }
}
