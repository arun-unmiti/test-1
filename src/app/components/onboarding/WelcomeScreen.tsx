import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Home, Beef, Droplets, Heart } from 'lucide-react';

interface WelcomeScreenProps {
  onGetStarted: () => void;
  onSkip: () => void;
}

export function WelcomeScreen({ onGetStarted, onSkip }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-green-50 to-white">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-green-700">Welcome to</h1>
          <h2 className="text-2xl font-bold text-gray-800">Dairy Farm Manager</h2>
          <p className="text-gray-600">Track your farm, herd & animals all in one place</p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-green-50 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Home className="w-6 h-6 text-green-700" />
            </div>
            <p className="text-sm font-medium text-center">Farm Setup</p>
          </Card>

          <Card className="p-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-green-50 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Beef className="w-6 h-6 text-green-700" />
            </div>
            <p className="text-sm font-medium text-center">Animals</p>
          </Card>

          <Card className="p-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-green-50 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Droplets className="w-6 h-6 text-green-700" />
            </div>
            <p className="text-sm font-medium text-center">Milk Entry</p>
          </Card>

          <Card className="p-6 flex flex-col items-center justify-center space-y-2 bg-white hover:bg-green-50 transition-colors">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Heart className="w-6 h-6 text-green-700" />
            </div>
            <p className="text-sm font-medium text-center">Health Card</p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={onGetStarted} 
            className="w-full bg-green-600 hover:bg-green-700"
          >
            Get Started
          </Button>
          <Button 
            onClick={onSkip} 
            variant="outline"
            className="w-full"
          >
            Skip for Now
          </Button>
        </div>

        <p className="text-xs text-center text-gray-500">
          You can always add this information later from the settings menu
        </p>
      </div>
    </div>
  );
}
