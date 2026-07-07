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
    <header className="sticky left-0 top-0 z-10 px-4 pt-6 flex items-center gap-4">
      <div className="flex gap-1 items-center">
        <h2 className="text-2xl font-bold">Crypto DCA</h2>
      </div>
      <NavigationMenu>
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
                <Link to={calculatorRoute.to} className="flex">
                  New Calculation
                  <Plus />
                </Link>
              }
            />
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              className={navigationMenuTriggerStyle()}
              render={
                <Link to={settingsRoute.to} className="flex">
                  Settings
                  <Settings />
                </Link>
              }
            />
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
