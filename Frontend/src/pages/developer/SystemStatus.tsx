import  { useState, useEffect } from 'react';
import useAuthStore from '@/store/authStore';
import DeveloperLayout from '@/components/layouts/DeveloperLayout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import axios from '../../config/axios';

const SystemStatus = () => {
  const { user } = useAuthStore();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [stats, setStats] = useState({
    dailyOrders: 0,
    monthlyOrders: 0,
    monthlyRevenue: 0,
    activeStores: 0,
    activeAdmins: 0,
    storageUsed: 0,
    totalStorage: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      try {
        const statsRes = await axios.get('/platform-stats');
        setStats(statsRes.data);
        const maintRes = await axios.get('/system/maintenance');
        setMaintenanceMode(maintRes.data.enabled);
      } catch (error) {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
  }, []);

  const handleToggleMaintenance = async () => {
    try {
      if (!user) {
        throw new Error('You must be logged in to perform this action');
      }

      if (user.role !== 'developer') {
        throw new Error('Only developers can toggle maintenance mode');
      }

      const newMode = !maintenanceMode;
      setMaintenanceMode(newMode);
      
      await axios.post('i/system/maintenance', 
        { 
          enabled: newMode,
          message: newMode ? "System is currently under maintenance. Please try again later." : "",
          reason: newMode ? "Scheduled maintenance" : "Maintenance completed"
        },
        
      );
      
      toast({
        title: newMode ? "Maintenance Mode Enabled" : "Maintenance Mode Disabled",
        description: newMode ? "The platform is now in maintenance mode." : "The platform is now active.",
      });
    } catch (error) {
      console.error('Maintenance mode error:', error);
      setMaintenanceMode(!maintenanceMode); // Revert the UI state on error
      toast({
        title: "Error",
        description: "Failed to update maintenance mode. Please ensure you're logged in with developer privileges.",
        variant: "destructive",
      });
    }
  };

  const storagePercentage = (stats.storageUsed / stats.totalStorage) * 100;
  const isStorageCritical = storagePercentage > 90;

  return (
    <DeveloperLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Status</h1>
          <p className="text-gray-600">Monitor and control system-wide settings</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Controls</CardTitle>
            <CardDescription>Manage system-wide settings and maintenance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label>Maintenance Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle platform-wide maintenance mode
                </p>
              </div>
              <Switch
                checked={maintenanceMode}
                onCheckedChange={handleToggleMaintenance}
              />
            </div>

            <div>
              <Label>Storage Usage</Label>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <>
                  <Progress value={storagePercentage} className="mt-2" />
                  <p className={`text-sm mt-1 ${isStorageCritical ? 'text-red-500' : 'text-muted-foreground'}`}>
                    {stats.storageUsed}GB / {stats.totalStorage}GB
                    {isStorageCritical && ' - Critical storage level!'}
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DeveloperLayout>
  );
};

export default SystemStatus; 