'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default function SettingsPage() {

  const menuItems = [
    {
      title: 'Privacy Policy',
      icon: '🔒',
      onClick: () => alert('Privacy Policy'),
    },
    {
      title: 'Terms & Conditions',
      icon: '📄',
      onClick: () => alert('Terms & Conditions'),
    },
    {
      title: 'Report a Problem',
      icon: '🚩',
      onClick: () => alert('Report a Problem'),
    },
    {
      title: 'About',
      icon: 'ℹ️',
      onClick: () => alert('Zoion v1.0.0 - Pet Breeding Platform'),
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full flex-col gap-4 p-4 pt-0">
          <div className="flex h-[calc(100vh-2rem)] flex-col overflow-auto rounded-xl border bg-background p-6 mt-4">
            <div className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
              <p className="text-sm text-muted-foreground">Manage your preferences and app information</p>
            </div>
            <div className="flex-1 space-y-4 mt-6">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full flex items-center justify-between p-4 hover:bg-accent transition-colors border-b border-border last:border-b-0 rounded-md"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{item.icon}</span>
                    <span className="font-medium">{item.title}</span>
                  </div>
                  <span>→</span>
                </button>
              ))}
            </div>
            <div className="mt-auto pt-4 text-center text-sm text-muted-foreground">
              <p>Zoion v1.0.0</p>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


