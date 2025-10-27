'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, FileText, Flag, Info, ChevronLeft } from 'lucide-react';

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const menuItems = [
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: Shield,
      description: 'How we collect, use, and protect your data',
    },
    {
      id: 'terms',
      title: 'Terms & Conditions',
      icon: FileText,
      description: 'Terms of service and user agreement',
    },
    {
      id: 'report',
      title: 'Report a Problem',
      icon: Flag,
      description: 'Report bugs, issues, or inappropriate content',
    },
    {
      id: 'about',
      title: 'About',
      icon: Info,
      description: 'Learn more about Zoion',
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'privacy':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Privacy Policy</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Information We Collect</h4>
                <p>We collect information you provide directly to us, such as when you create an account, add pet information, or contact us for support. This may include:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Name, email address, and contact information</li>
                  <li>Pet information including photos, medical records, and breeding history</li>
                  <li>Communication preferences and support requests</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">How We Use Your Information</h4>
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Data Security</h4>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Contact Us</h4>
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@zoion.com</p>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Terms & Conditions</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>Last updated: {new Date().toLocaleDateString()}</p>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Acceptance of Terms</h4>
                <p>By accessing and using Zoion, you accept and agree to be bound by the terms and provision of this agreement.</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Use License</h4>
                <p>Permission is granted to temporarily download one copy of Zoion for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">User Responsibilities</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Provide accurate and complete information about your pets</li>
                  <li>Respect other users and maintain appropriate conduct</li>
                  <li>Not use the service for illegal or unauthorized purposes</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Prohibited Uses</h4>
                <p>You may not use our service:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Disclaimer</h4>
                <p>The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our service.</p>
              </div>
            </div>
          </div>
        );

      case 'report':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Report a Problem</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <p>We appreciate your feedback and want to help resolve any issues you encounter.</p>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">What to Report</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Technical bugs or app crashes</li>
                  <li>Inappropriate content or behavior</li>
                  <li>Security concerns</li>
                  <li>Feature requests or improvements</li>
                  <li>Account or payment issues</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">How to Report</h4>
                <p>Please include the following information when reporting:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Detailed description of the issue</li>
                  <li>Steps to reproduce the problem (if applicable)</li>
                  <li>Device and browser information</li>
                  <li>Screenshots or error messages</li>
                  <li>Your contact information for follow-up</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Contact Methods</h4>
                <div className="space-y-2">
                  <p><strong>Email:</strong> support@zoion.com</p>
                  <p><strong>Response Time:</strong> We typically respond within 24-48 hours</p>
                  <p><strong>Priority:</strong> Security issues are addressed immediately</p>
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={() => window.open('mailto:support@zoion.com?subject=Problem Report', '_blank')}>
                  Send Report via Email
                </Button>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">About Zoion</h3>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div>
                <h4 className="font-medium text-foreground mb-2">Our Mission</h4>
                <p>Zoion is a comprehensive platform designed to connect responsible pet breeders and owners, facilitating healthy breeding practices and pet management through advanced technology and community support.</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Version Information</h4>
                <div className="bg-muted p-3 rounded-lg">
                  <p><strong>Version:</strong> 1.0.0</p>
                  <p><strong>Build:</strong> 2024.1.0</p>
                  <p><strong>Platform:</strong> Web Application</p>
                  <p><strong>Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>AI-powered pet search and matching</li>
                  <li>Advanced filtering and breeding compatibility</li>
                  <li>Pet profile management with medical records</li>
                  <li>Community features and breeder connections</li>
                  <li>Favorites and personalized recommendations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Technology Stack</h4>
                <p>Built with modern web technologies including Next.js, React, TypeScript, and GraphQL for optimal performance and user experience.</p>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Contact Information</h4>
                <div className="space-y-1">
                  <p><strong>Website:</strong> www.zoion.com</p>
                  <p><strong>Email:</strong> info@zoion.com</p>
                  <p><strong>Support:</strong> support@zoion.com</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Copyright</h4>
                <p>© 2024 Zoion. All rights reserved. This application and its contents are protected by copyright and other intellectual property laws.</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveSection(item.id)}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5 text-[#3d7c6f]" />
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-screen flex-col p-6 pt-6 pb-0 bg-sidebar">
          <div className="flex flex-1 flex-col gap-4 overflow-auto rounded-t-xl bg-white border-t border-l border-r border-gray-200/50 p-6 mt-4">
            <div className="flex items-center gap-4">
              {activeSection && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight">Settings</h2>
                <p className="text-sm text-muted-foreground">
                  {activeSection ? 'View details and information' : 'Manage your preferences and app information'}
                </p>
              </div>
            </div>

            <div className="flex-1">
              {renderContent()}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}


