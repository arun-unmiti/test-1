import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { HerdTab } from './HerdTab';
import { MilkTab } from './MilkTab';
import { FeedTab } from './FeedTab';
import { CostsTab } from './CostsTab';
import { OtherRevenueTab } from './OtherRevenueTab';

export function InputScreen() {
  const [activeTab, setActiveTab] = useState('herd');

  return (
    <div className="p-4 pb-24">
      <div className="mb-4">
        <h1 className="text-2xl font-semibold">Input Data</h1>
        <p className="text-muted-foreground">Update your farm information</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="herd">Herd</TabsTrigger>
          <TabsTrigger value="milk">Milk</TabsTrigger>
          <TabsTrigger value="feed">Feed</TabsTrigger>
        </TabsList>
        <TabsList className="grid w-full grid-cols-2 mt-2">
          <TabsTrigger value="costs">Costs</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="herd">
            <HerdTab />
          </TabsContent>
          <TabsContent value="milk">
            <MilkTab />
          </TabsContent>
          <TabsContent value="feed">
            <FeedTab />
          </TabsContent>
          <TabsContent value="costs">
            <CostsTab />
          </TabsContent>
          <TabsContent value="revenue">
            <OtherRevenueTab />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
