'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import type { CartItem } from '@/types';

const STORAGE_KEY = 'kdb-cart-v1';

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (producto_id: string, talla: string) => void;
  updateQuantity: (producto_id: string, talla: string, cantidad: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

function sameLine(a: CartItem, producto_id: string, talla: string) {
  return a.producto_id === producto_id && a.talla === talla;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Cargar desde localStorage al montar
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      // Hidratación desde localStorage: setState en mount es intencional y necesario.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch (err) {
      console.error('Error reading cart from storage:', err);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Persistir cuando cambia (después de hidratar)
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error('Error saving cart to storage:', err);
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((p) => sameLine(p, item.producto_id, item.talla));
      if (existing) {
        return prev.map((p) =>
          sameLine(p, item.producto_id, item.talla)
            ? { ...p, cantidad: Math.min(10, p.cantidad + item.cantidad) }
            : p
        );
      }
      return [...prev, { ...item, cantidad: Math.min(10, item.cantidad) }];
    });
  }, []);

  const removeItem = useCallback((producto_id: string, talla: string) => {
    setItems((prev) => prev.filter((p) => !sameLine(p, producto_id, talla)));
  }, []);

  const updateQuantity = useCallback(
    (producto_id: string, talla: string, cantidad: number) => {
      setItems((prev) =>
        prev
          .map((p) =>
            sameLine(p, producto_id, talla)
              ? { ...p, cantidad: Math.max(0, Math.min(10, cantidad)) }
              : p
          )
          .filter((p) => p.cantidad > 0)
      );
    },
    []
  );

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = useMemo(
    () => items.reduce((sum, p) => sum + p.cantidad, 0),
    [items]
  );
  const subtotal = useMemo(
    () => items.reduce((sum, p) => sum + p.precio * p.cantidad, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      hydrated,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, subtotal, hydrated, addItem, removeItem, updateQuantity, clearCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
