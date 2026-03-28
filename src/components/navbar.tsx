'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  MapPin, 
  BarChart3, 
  Building2, 
  User, 
  LogIn,
  Menu,
  X,
  Satellite
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { signIn } from 'next-auth/react';

interface NavbarProps {
  user?: any;
}

export function Navbar({ user }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Properties', href: '/properties', icon: Building2 },
    { name: 'Map View', href: '/map', icon: MapPin },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Urban Sprawl', href: '/urban-sprawl', icon: Satellite },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-spectron-gold to-spectron-teal">
              <Home className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-spectron-gold to-spectron-teal bg-clip-text text-transparent">
              Nastiva
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="hidden sm:flex">
                    <User className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Badge variant="secondary" className="hidden sm:flex">
                  {user.email}
                </Badge>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button onClick={() => signIn('google', { callbackUrl: '/' })} variant="outline" size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  SignUp
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className={cn(
          "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
          isMenuOpen ? "max-h-96 pb-4" : "max-h-0"
        )}>
          <div className="space-y-2 pt-4 border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
            
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-muted rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4" />
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}