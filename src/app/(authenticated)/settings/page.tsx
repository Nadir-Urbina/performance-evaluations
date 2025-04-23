import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings | Simple Evaluation",
  description: "Manage your organization settings",
};

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Organization Settings */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Organization</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="orgName">
                Organization Name
              </label>
              <input
                id="orgName"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-2"
                placeholder="Enter organization name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="orgEmail">
                Contact Email
              </label>
              <input
                id="orgEmail"
                type="email"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-2"
                placeholder="Enter contact email"
              />
            </div>
            
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10">
              Save Changes
            </button>
          </div>
        </div>
        
        {/* Subscription Settings */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Subscription</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <h3 className="font-medium">Current Plan</h3>
                <p className="text-sm text-muted-foreground">14-day free trial</p>
              </div>
              <div className="text-sm font-medium text-primary">
                Upgrade Plan
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Seats</h3>
                <p className="text-sm text-muted-foreground">1 used of 1 available</p>
              </div>
              <div className="text-sm font-medium text-primary">
                Add Seats
              </div>
            </div>
          </div>
        </div>
        
        {/* User Settings */}
        <div className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold mb-4">Account</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-2"
                placeholder="Your name"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Change Password
              </label>
              <input
                id="password"
                type="password"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 mt-2"
                placeholder="New password"
              />
            </div>
            
            <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 h-10">
              Update Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 