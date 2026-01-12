/**
 * Copyright (c) 2026 Winplaybox
 * All rights reserved.
 *
 * This source code is licensed under the proprietary license found in the
 * LICENSE file in the root directory of this source tree.
 * Unauthorized copying of this file, via any medium, is strictly prohibited.
 *
 * Proprietary and confidential.
 */
import {cn} from '@/app/lib/utils';
import * as React from 'react';

// Responsive media query hook
function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = React.useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia(query).matches;
        }
        return false;
    });

    React.useEffect(() => {
        if (typeof window === 'undefined') return;
        const media = window.matchMedia(query);
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        setMatches(media.matches); // sync on mount
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
}

interface TabsContextValue {
    value: string;
    onValueChange: (value: string) => void;
}

const TabsContext = React.createContext<TabsContextValue | undefined>(undefined);

interface TabsProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
    children: React.ReactNode;
    className?: string;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
    ({defaultValue, value: controlledValue, onValueChange, children, className, ...props}, ref) => {
        const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue || '');
        const isControlled = controlledValue !== undefined;
        const value = isControlled ? controlledValue : uncontrolledValue;

        const handleValueChange = React.useCallback(
            (newValue: string) => {
                if (!isControlled) {
                    setUncontrolledValue(newValue);
                }
                onValueChange?.(newValue);
            },
            [isControlled, onValueChange]
        );

        return (
            <TabsContext.Provider value={{value, onValueChange: handleValueChange}}>
                <div ref={ref} className={cn('w-full', className)} {...props}>
                    {children}
                </div>
            </TabsContext.Provider>
        );
    }
);
Tabs.displayName = 'Tabs';

interface TabsListProps extends React.HTMLAttributes<HTMLDivElement> {
    className?: string;
}

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.HTMLAttributes<HTMLButtonElement> & {value: string}>(
    ({className, children, value, ...props}, ref) => {
        const context = React.useContext(TabsContext);
        if (!context) {
            throw new Error('TabsTrigger must be used within Tabs');
        }
        const isActive = context.value === value;

        return (
            <button
                ref={ref}
                role='tab'
                aria-selected={isActive}
                className={cn(
                    'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground',
                    className
                )}
                data-state={isActive ? 'active' : 'inactive'}
                onClick={() => context.onValueChange(value)}
                {...props}
            >
                {children}
            </button>
        );
    }
);
TabsTrigger.displayName = 'TabsTrigger';

const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(({className, children, ...props}, ref) => {
    // Use media query to detect mobile/tablet
    const isMobile = useMediaQuery('(max-width: 1050px)');
    const context = React.useContext(TabsContext);
    // Find all TabsTrigger children
    const triggers = React.Children.toArray(children).filter((child: any) => child?.type?.displayName === 'TabsTrigger');
    if (isMobile && context) {
        // Render dropdown/select for mobile/tablet
        return (
            <div ref={ref} className={cn('w-full mb-4', className)} {...props}>
                <select
                    className='max-w-fit rounded-md border border-white/10 bg-muted p-2 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'
                    value={context.value}
                    onChange={(e) => context.onValueChange(e.target.value)}
                    role='tablist'
                >
                    {triggers.map((trigger: any) => (
                        <option key={trigger.props.value} value={trigger.props.value}>
                            {trigger.props.children}
                        </option>
                    ))}
                </select>
            </div>
        );
    }
    // Desktop: render tab buttons
    return (
        <div
            ref={ref}
            className={cn('inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground', className)}
            {...props}
        >
            {children}
        </div>
    );
});
TabsList.displayName = 'TabsList';

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    className?: string;
}

const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(({value, className, ...props}, ref) => {
    const context = React.useContext(TabsContext);
    if (!context) {
        throw new Error('TabsContent must be used within Tabs');
    }

    if (context.value !== value) {
        return null;
    }

    return (
        <div
            ref={ref}
            role='tabpanel'
            className={cn(
                'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                className
            )}
            {...props}
        />
    );
});
TabsContent.displayName = 'TabsContent';

export {Tabs, TabsContent, TabsList, TabsTrigger};
