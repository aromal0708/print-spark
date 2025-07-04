import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import axios from '../../config/axios';
// import { createAdmin, createStore } from '@/services/mockData';

interface AdminStoreFormData {
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  storeName: string;
  storeLocation: string;
}

const AdminStoreCreator = () => {
  const [formData, setFormData] = useState<AdminStoreFormData>({
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    storeName: '',
    storeLocation: '',
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.adminEmail.includes('@') || formData.adminPassword.length < 6) {
      toast.error('Please enter a valid email and password (min 6 characters)');
      return;
    }
    if (!formData.adminName || !formData.storeName || !formData.storeLocation) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      // Create new admin
      await axios.post('/admins', {
        name: formData.adminName,
        email: formData.adminEmail,
        password: formData.adminPassword,
        storeName: formData.storeName,
        storeLocation: formData.storeLocation
      });
      setFormData({
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        storeName: '',
        storeLocation: '',
      });
      toast.success('Admin and store created successfully');
    } catch (error) {
      toast.error('Failed to create admin and store');
      console.error('Error creating admin and store:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Admin & Store</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="adminName">Admin Name</Label>
            <Input
              id="adminName"
              name="adminName"
              value={formData.adminName}
              onChange={handleInputChange}
              placeholder="Enter admin name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input
              id="adminEmail"
              name="adminEmail"
              type="email"
              value={formData.adminEmail}
              onChange={handleInputChange}
              placeholder="Enter admin email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="adminPassword">Admin Password</Label>
            <Input
              id="adminPassword"
              name="adminPassword"
              type="password"
              value={formData.adminPassword}
              onChange={handleInputChange}
              placeholder="Enter admin password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeName">Store Name</Label>
            <Input
              id="storeName"
              name="storeName"
              value={formData.storeName}
              onChange={handleInputChange}
              placeholder="Enter store name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeLocation">Store Location</Label>
            <Input
              id="storeLocation"
              name="storeLocation"
              value={formData.storeLocation}
              onChange={handleInputChange}
              placeholder="Enter store location"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Admin & Store'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdminStoreCreator; 