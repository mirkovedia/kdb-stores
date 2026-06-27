'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Info,
  AlertTriangle,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* -------------------------------------------------------------------------- */
/*  Tipos                                                                      */
/* -------------------------------------------------------------------------- */

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Estilo destructivo (rojo) para acciones como eliminar. */
  danger?: boolean;
}

interface ConfirmState extends ConfirmOptions {
  open: boolean;
}

interface AdminFeedbackContextValue {
  /** Muestra un toast efímero. */
  toast: (message: string, type?: ToastType) => void;
  /** Abre un diálogo de confirmación. Resuelve true si el usuario confirma. */
  confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const AdminFeedbackContext = createContext<AdminFeedbackContextValue | null>(null);

/* -------------------------------------------------------------------------- */
/*  Hook                                                                       */
/* -------------------------------------------------------------------------- */

export function useAdminFeedback(): AdminFeedbackContextValue {
  const ctx = useContext(AdminFeedbackContext);
  if (!ctx) {
    throw new Error('useAdminFeedback debe usarse dentro de <AdminFeedbackProvider>');
  }
  return ctx;
}

/* -------------------------------------------------------------------------- */
/*  Provider                                                                   */
/* -------------------------------------------------------------------------- */

const toastStyles: Record<ToastType, { icon: ReactNode; border: string }> = {
  success: {
    icon: <CheckCircle2 className="w-5 h-5 text-success" />,
    border: 'border-success/30',
  },
  error: {
    icon: <XCircle className="w-5 h-5 text-danger" />,
    border: 'border-danger/30',
  },
  info: {
    icon: <Info className="w-5 h-5 text-gold" />,
    border: 'border-gold/30',
  },
};

export function AdminFeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [confirmState, setConfirmState] = useState<ConfirmState>({
    open: false,
    message: '',
  });
  const idRef = useRef(0);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = ++idRef.current;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast]
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    setConfirmState({ ...options, open: true });
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const closeConfirm = useCallback((result: boolean) => {
    resolverRef.current?.(result);
    resolverRef.current = null;
    setConfirmState((prev) => ({ ...prev, open: false }));
  }, []);

  // Diálogo abierto: enfocar el botón de confirmar, cerrar con Escape y atrapar
  // el foco (Tab/Shift+Tab) dentro del modal.
  useEffect(() => {
    if (!confirmState.open) return;
    confirmBtnRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeConfirm(false);
        return;
      }
      if (e.key === 'Tab' && dialogRef.current) {
        const focusables =
          dialogRef.current.querySelectorAll<HTMLElement>('button');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [confirmState.open, closeConfirm]);

  return (
    <AdminFeedbackContext.Provider value={{ toast, confirm }}>
      {children}

      {/* Toasts */}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[calc(100vw-2rem)] max-w-sm">
        <AnimatePresence initial={false}>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 40, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-md bg-kdb-card border shadow-lg',
                toastStyles[t.type].border
              )}
            >
              <span className="shrink-0 mt-0.5">{toastStyles[t.type].icon}</span>
              <p className="flex-1 text-sm text-text-primary">{t.message}</p>
              <button
                onClick={() => dismissToast(t.id)}
                className="shrink-0 text-text-muted hover:text-text-primary transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Confirm dialog */}
      <AnimatePresence>
        {confirmState.open && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => closeConfirm(false)}
            />
            <motion.div
              ref={dialogRef}
              role="alertdialog"
              aria-modal="true"
              aria-labelledby={confirmState.title ? 'confirm-title' : undefined}
              aria-describedby="confirm-message"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="relative w-full max-w-md bg-kdb-card border border-kdb-border rounded-lg p-6 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                {confirmState.danger && (
                  <AlertTriangle className="w-6 h-6 text-danger shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  {confirmState.title && (
                    <h3
                      id="confirm-title"
                      className="text-lg font-semibold text-text-primary mb-1"
                    >
                      {confirmState.title}
                    </h3>
                  )}
                  <p id="confirm-message" className="text-sm text-text-secondary">
                    {confirmState.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-6">
                <button
                  onClick={() => closeConfirm(false)}
                  className="px-4 py-2 text-sm text-text-secondary hover:text-text-primary rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-gold transition-colors"
                >
                  {confirmState.cancelLabel || 'Cancelar'}
                </button>
                <button
                  ref={confirmBtnRef}
                  onClick={() => closeConfirm(true)}
                  className={cn(
                    'px-5 py-2 text-sm font-semibold rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-kdb-card',
                    confirmState.danger
                      ? 'bg-danger text-white hover:bg-red-600 focus-visible:ring-danger'
                      : 'bg-gold text-kdb-bg hover:bg-gold-light focus-visible:ring-gold'
                  )}
                >
                  {confirmState.confirmLabel || 'Confirmar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AdminFeedbackContext.Provider>
  );
}
