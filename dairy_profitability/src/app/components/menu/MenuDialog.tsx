import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { RevenueConfig } from './RevenueConfig';
import { CostConfig } from './CostConfig';
import { PreCalculatedConfig } from './PreCalculatedConfig';
import { FarmManagement } from './FarmManagement';
import { HerdManagement } from './HerdManagement';
import { AnimalManagement } from './AnimalManagement';

export function MenuDialog() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenuView, setActiveMenuView] = useState<'main' | 'revenue' | 'cost' | 'precalc' | 'farm' | 'herd' | 'animal'>('main');

  const handleMenuItemClick = (view: 'revenue' | 'cost' | 'precalc' | 'farm' | 'herd' | 'animal') => {
    setActiveMenuView(view);
  };

  const handleBackToMenu = () => {
    setActiveMenuView('main');
  };

  return (
    <Sheet open={menuOpen} onOpenChange={(open) => {
      setMenuOpen(open);
      if (open) setActiveMenuView('main');
    }}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
        {activeMenuView === 'main' && (
          <>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>Manage your farm, herds, animals, and configurations</SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-3">
              <div className="pb-2 border-b">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Farm & Herd Management</h4>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleMenuItemClick('farm')}
              >
                <div>
                  <div className="font-semibold">Farms</div>
                  <div className="text-sm text-muted-foreground">Add and manage your farms</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleMenuItemClick('herd')}
              >
                <div>
                  <div className="font-semibold">Herds</div>
                  <div className="text-sm text-muted-foreground">Manage herds within your farms</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleMenuItemClick('animal')}
              >
                <div>
                  <div className="font-semibold">Animals</div>
                  <div className="text-sm text-muted-foreground">Track individual animals in your herds</div>
                </div>
              </Button>
              
              <div className="pb-2 pt-4 border-b">
                <h4 className="text-sm font-semibold text-muted-foreground mb-2">Price Lists & Configuration</h4>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleMenuItemClick('revenue')}
              >
                <div>
                  <div className="font-semibold">Revenue - Assumptions</div>
                  <div className="text-sm text-muted-foreground">Configure milk prices and other revenue sources</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleMenuItemClick('cost')}
              >
                <div>
                  <div className="font-semibold">Cost - Assumptions</div>
                  <div className="text-sm text-muted-foreground">Configure feed, breeding, and labor costs</div>
                </div>
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-left h-auto py-4"
                onClick={() => handleMenuItemClick('precalc')}
              >
                <div>
                  <div className="font-semibold">Pre-Calculated Parameters</div>
                  <div className="text-sm text-muted-foreground">Configure system-wide calculations and recommendations</div>
                </div>
              </Button>
            </div>
          </>
        )}
        {activeMenuView === 'farm' && (
          <>
            <Button variant="ghost" onClick={handleBackToMenu} className="mb-4">
              ← Back to Menu
            </Button>
            <FarmManagement />
          </>
        )}
        {activeMenuView === 'herd' && (
          <>
            <Button variant="ghost" onClick={handleBackToMenu} className="mb-4">
              ← Back to Menu
            </Button>
            <HerdManagement />
          </>
        )}
        {activeMenuView === 'animal' && (
          <>
            <Button variant="ghost" onClick={handleBackToMenu} className="mb-4">
              ← Back to Menu
            </Button>
            <AnimalManagement />
          </>
        )}
        {activeMenuView === 'revenue' && (
          <>
            <Button variant="ghost" onClick={handleBackToMenu} className="mb-4">
              ← Back to Menu
            </Button>
            <RevenueConfig />
          </>
        )}
        {activeMenuView === 'cost' && (
          <>
            <Button variant="ghost" onClick={handleBackToMenu} className="mb-4">
              ← Back to Menu
            </Button>
            <CostConfig />
          </>
        )}
        {activeMenuView === 'precalc' && (
          <>
            <Button variant="ghost" onClick={handleBackToMenu} className="mb-4">
              ← Back to Menu
            </Button>
            <PreCalculatedConfig />
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}