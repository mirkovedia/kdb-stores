'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@/lib/validations';
import { createClient } from '@/lib/supabase/client';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true);
    setLoginError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        setLoginError('Credenciales inválidas. Intentá de nuevo.');
        return;
      }

      // Honra ?redirect= pero solo rutas internas del admin (evita open redirect).
      const param = new URLSearchParams(window.location.search).get('redirect');
      const dest = param && param.startsWith('/admin') ? param : '/admin';
      router.push(dest);
      router.refresh();
    } catch {
      setLoginError('Error al iniciar sesión. Intentá de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  const inputClasses =
    'h-12 w-full rounded-md border border-line bg-surface px-4 text-sm text-ink transition-colors placeholder:text-ink-subtle focus:border-ink focus:outline-none';

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="text-2xl font-bold uppercase tracking-[0.3em] text-ink">
            KDB
          </span>
          <p className="text-eyebrow mt-4 text-ink-muted">Panel administrativo</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-10 space-y-5 border border-line p-7"
        >
          {loginError && (
            <p role="alert" className="border-l-2 border-danger pl-4 text-sm text-danger">
              {loginError}
            </p>
          )}

          <div>
            <label htmlFor="email" className="text-eyebrow mb-2 block text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="admin@kdb.pe"
              className={inputClasses}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'err-login-email' : undefined}
              {...register('email')}
            />
            {errors.email && (
              <p id="err-login-email" className="mt-2 text-xs text-danger">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="text-eyebrow mb-2 block text-ink">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={`${inputClasses} pr-12`}
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? 'err-login-pass' : undefined}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-ink-subtle transition-colors hover:text-ink"
              >
                {showPassword ? (
                  <EyeOff size={17} strokeWidth={1.5} />
                ) : (
                  <Eye size={17} strokeWidth={1.5} />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="err-login-pass" className="mt-2 text-xs text-danger">
                {errors.password.message}
              </p>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="btn-solid h-12 w-full rounded-md">
            {isLoading ? 'Iniciando sesión…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-subtle">
          KDB Stores — Panel administrativo
        </p>
      </div>
    </div>
  );
}
