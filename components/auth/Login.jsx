'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import { toast } from 'sonner';
import { IconEye, IconEyeOff, IconLoader2 } from '@tabler/icons-react';

export default function Login({ userEmail, setUserEmail, onViewChange }) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useUserStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userEmail) return toast.error('Email is required');
    if (!/\S+@\S+\.\S+/.test(userEmail)) return toast.error('Invalid email');
    if (!password) return toast.error('Password is required');

    const success = await login({ email: userEmail, password, admin: true });
    if (success) {
      setUserEmail(''); // Clear email on successful login
      setPassword(''); // Clear password on successful login
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            name="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            autoComplete="email"
            placeholder="Enter your email"
            className="h-10"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="Enter your password"
              className="h-10 pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              tabIndex={-1}
            >
              {showPassword ? (
                <IconEyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <IconEye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/50 p-3 border border-destructive">
          <p className="text-sm font-medium text-destructive text-center">{error}</p>
        </div>
      )}

      <div className="space-y-3">
        <Button
          type="submit"
          disabled={loading}
          className="w-full "
        >
          {loading ? (
            <>
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            'Login'
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          onClick={() => onViewChange('forgot')}
          className="w-full text-sm text-muted-foreground"
        >
          Forgot password?
        </Button>
      </div>
    </form>
  );
}
