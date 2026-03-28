'use client';

import * as React from 'react';
import { Check, ChevronsUpDown, User, Building, Briefcase, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { updateUserRole } from '@/actions/user';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

type UserRole = 'PUBLIC' | 'OWNER' | 'BROKER' | 'ADMIN';

interface RoleSwitcherProps {
  currentRole: UserRole;
}

const roles = [
  {
    value: 'PUBLIC' as UserRole,
    label: 'Public User',
    description: 'Browse and search properties',
    icon: User,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    value: 'OWNER' as UserRole,
    label: 'Property Owner',
    description: 'List and manage properties',
    icon: Building,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    value: 'BROKER' as UserRole,
    label: 'Real Estate Broker',
    description: 'Manage clients and listings',
    icon: Briefcase,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    value: 'ADMIN' as UserRole,
    label: 'Administrator',
    description: 'Full system access',
    icon: Shield,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    disabled: true,
  },
];

export function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedRole, setSelectedRole] = React.useState(currentRole);
  const router = useRouter();

  const currentRoleData = roles.find((role) => role.value === selectedRole);

  const handleRoleChange = async (newRole: UserRole) => {
    if (newRole === 'ADMIN' || newRole === selectedRole) return;

    setIsLoading(true);
    try {
      const result = await updateUserRole(newRole);
      
      if (result.success) {
        setSelectedRole(newRole);
        toast.success(`Role changed to ${roles.find(r => r.value === newRole)?.label}`);
        router.refresh();
      } else {
        toast.error(result.error || 'Failed to change role');
      }
    } catch (error) {
      toast.error('An error occurred while changing role');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between"
          disabled={isLoading}
        >
          <div className="flex items-center gap-2">
            {currentRoleData && (
              <>
                <div className={cn('rounded-full p-1.5', currentRoleData.bgColor)}>
                  <currentRoleData.icon className={cn('h-4 w-4', currentRoleData.color)} />
                </div>
                <span className="truncate">{currentRoleData.label}</span>
              </>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[280px]" align="start">
        <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {roles.map((role) => (
          <DropdownMenuItem
            key={role.value}
            onClick={() => handleRoleChange(role.value)}
            disabled={role.disabled || isLoading}
            className={cn(
              'cursor-pointer',
              role.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-center gap-3 w-full">
              <div className={cn('rounded-full p-2', role.bgColor)}>
                <role.icon className={cn('h-4 w-4', role.color)} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{role.label}</span>
                  {selectedRole === role.value && (
                    <Check className="h-4 w-4 text-spectron-teal" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{role.description}</p>
              </div>
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Note: Admin role cannot be self-assigned
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
