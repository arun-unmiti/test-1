import { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { getSelf, updateProfile } from '../../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Settings, Trash2, Info, User, AlertCircle, CheckCircle2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

export function SettingsScreen() {
  const { data, resetData } = useAppContext();
  const { token } = useAuth();

  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState(false);

  useEffect(() => {
    if (!token) return;
    let isMounted = true;
    setProfileLoading(true);
    getSelf(token)
      .then((data) => {
        if (!isMounted) return;
        setProfileName(data.name ?? data.full_name ?? '');
        setProfileEmail(data.email ?? '');
        setProfilePhone(data.phone ?? data.phone_number ?? '');
      })
      .catch(() => {/* silently ignore profile load error */})
      .finally(() => { if (isMounted) setProfileLoading(false); });
    return () => { isMounted = false; };
  }, [token]);

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setProfileSaving(true);
    setProfileError('');
    setProfileSuccess(false);
    try {
      await updateProfile(token, {
        name: profileName,
        email: profileEmail,
        phone: profilePhone || null,
      });
      setProfileSuccess(true);
    } catch (err: unknown) {
      setProfileError(err instanceof Error ? err.message : 'Failed to save profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleReset = () => {
    resetData();
    window.location.reload();
  };

  return (
    <div className="space-y-6 p-4 pb-24">
      <div>
        <h1 className="text-2xl font-semibold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences</p>
      </div>

      {/* My Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            My Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profileLoading ? (
            <p className="text-sm text-muted-foreground">Loading profile…</p>
          ) : (
            <form onSubmit={handleProfileSave} className="space-y-3">
              <div>
                <Label className="text-muted-foreground text-xs">Full Name</Label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  placeholder="Your name"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Email Address</Label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={e => setProfileEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Phone</Label>
                <input
                  type="tel"
                  value={profilePhone}
                  onChange={e => setProfilePhone(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                  className="w-full mt-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              {profileError && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50 text-red-700 text-xs">
                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                  {profileError}
                </div>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 text-green-700 text-xs">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  Profile saved successfully.
                </div>
              )}
              <Button
                type="submit"
                disabled={profileSaving}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {profileSaving ? 'Saving…' : 'Save Profile'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Farm Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Farm Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-muted-foreground">Farm Name</Label>
            <p className="text-lg font-medium">{data.farmSetup.farmName}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Currency</Label>
            <p className="text-lg font-medium">{data.farmSetup.currency}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Units</Label>
            <p className="text-lg font-medium">{data.farmSetup.units === 'kg' ? 'Kilograms' : 'Pounds'}</p>
          </div>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Farms:</span>
            <span className="font-medium">{data.farms.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Herds:</span>
            <span className="font-medium">{data.herds.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Animals:</span>
            <span className="font-medium">{data.animals.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Total Animals (Current Herd):</span>
            <span className="font-medium">{data.herdData.totalAnimals}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Lactating Cows:</span>
            <span className="font-medium">{data.herdData.lactatingCows}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Feed Items:</span>
            <span className="font-medium">{data.feedItems.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Monthly Snapshots:</span>
            <span className="font-medium">{data.history.length}</span>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
          <CardDescription>
            Dairy Profitability & Advisory App
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This app helps dairy farms track production, understand profitability, 
            and receive actionable recommendations for improvement.
          </p>
        </CardContent>
      </Card>

      {/* Reset Data */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                Reset All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all your farm data,
                  including herd information, production records, and historical snapshots.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleReset} className="bg-red-600 hover:bg-red-700">
                  Reset Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}