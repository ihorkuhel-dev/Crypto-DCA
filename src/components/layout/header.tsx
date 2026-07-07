import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {Link} from '@tanstack/react-router';
import {Route as calculatorRoute} from '@/app/routes/calculator.index.tsx';
import {Route as dashboardRoute} from '@/app/routes/index.tsx';
import {Route as settingsRoute} from '@/app/routes/settings.tsx';

import {Plus, Settings} from 'lucide-react';

export function Header() {
  return (
    <header className="sticky left-0 top-0 z-10  py-3 pt-6 flex items-center gap-10 border-b">
      <div className="flex gap-1 items-center">
        <h2 className="text-2xl font-bold">Crypto DCA</h2>
      </div>
      <NavigationMenu className="w-full max-w-none">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={<Link to={dashboardRoute.to}>Dashboard</Link>}
            />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={
                <Link to={calculatorRoute.to} className="flex items-center">
                  New Calculation
                  <Plus className="size-5" />
                </Link>
              }
            />
          </NavigationMenuItem>
          <NavigationMenuItem className="ml-auto">
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={
                <Link to={settingsRoute.to} className="flex items-center">
                  Settings
                  <Settings className="size-5" />
                </Link>
              }
            />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
