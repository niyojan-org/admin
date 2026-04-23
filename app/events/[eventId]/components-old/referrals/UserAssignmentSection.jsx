import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { IconUser, IconLoader2, IconCheck, IconChevronDown } from '@tabler/icons-react';

export function UserAssignmentSection({
    formData,
    errors,
    organizationUsers,
    userSearch,
    setUserSearch,
    usersLoading,
    hasSearched,
    userPopoverOpen,
    setUserPopoverOpen,
    filteredUsers,
    onDropdownOpen,
    onUserSelect
}) {
    const selectedUser = organizationUsers.find(u => u._id === formData.whose);

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-base">User Assignment</CardTitle>
                <CardDescription>
                    Assign this referral code to a team member
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                <Label htmlFor="whose">Assign to User *</Label>
                <Popover open={userPopoverOpen} onOpenChange={setUserPopoverOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={userPopoverOpen}
                            className={`w-full justify-between ${errors.whose ? 'border-destructive' : ''}`}
                            onClick={onDropdownOpen}
                        >
                            {formData.whose ? (
                                <div className="flex items-center gap-2 flex-1 min-w-0">
                                    {selectedUser?.avatar ? (
                                        <img
                                            src={selectedUser.avatar}
                                            alt={selectedUser.name}
                                            className="w-6 h-6 rounded-full flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <IconUser className="w-3 h-3 text-primary" />
                                        </div>
                                    )}
                                    <span className="truncate">
                                        {selectedUser?.name || 'Select user...'}
                                    </span>
                                </div>
                            ) : (
                                <span className="text-muted-foreground">Select a user...</span>
                            )}
                            <IconChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[400px] sm:w-[450px] p-0" align="start">
                        <Command className="rounded-lg border-none shadow-none">
                            <CommandInput
                                placeholder="Search users by name, email, or role..."
                                value={userSearch}
                                onValueChange={setUserSearch}
                            />
                            <CommandList className="max-h-80">
                                {usersLoading ? (
                                    <div className="flex items-center justify-center py-6">
                                        <IconLoader2 className="w-4 h-4 animate-spin mr-2" />
                                        <span className="text-sm text-muted-foreground">Loading members...</span>
                                    </div>
                                ) : (
                                    <>
                                        <CommandEmpty>
                                            <div className="py-6 text-center text-sm">
                                                {!hasSearched && organizationUsers.length === 0
                                                    ? 'Click to load members...'
                                                    : 'No users found.'}
                                            </div>
                                        </CommandEmpty>
                                        <CommandGroup heading="Team Members">
                                            {filteredUsers.map((user) => (
                                                <CommandItem
                                                    key={user._id}
                                                    value={user._id}
                                                    keywords={[user.name, user.email, user.organization?.role]}
                                                    onSelect={() => onUserSelect(user._id)}
                                                >
                                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                                        {user.avatar ? (
                                                            <img
                                                                src={user.avatar}
                                                                alt={user.name}
                                                                className="w-8 h-8 rounded-full flex-shrink-0"
                                                            />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                                <IconUser className="w-4 h-4 text-primary" />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-medium truncate">{user.name}</div>
                                                            <div className="text-xs text-muted-foreground truncate">
                                                                {user.email}
                                                            </div>
                                                            {user.organization?.role && (
                                                                <div className="text-xs text-primary font-medium capitalize">
                                                                    {user.organization.role}
                                                                    {user.organization?.status && (
                                                                        <span className={`ml-2 ${user.organization.status === 'active' ? 'text-green-600' : 'text-orange-600'}`}>
                                                                            ({user.organization.status})
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {formData.whose === user._id && (
                                                            <IconCheck className="w-4 h-4 text-primary flex-shrink-0" />
                                                        )}
                                                    </div>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                {errors.whose && (
                    <p className="text-sm text-destructive">{errors.whose}</p>
                )}
            </CardContent>
        </Card>
    );
}
