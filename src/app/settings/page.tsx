'use client';

import { useState } from 'react';
import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
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
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Privacy Policy</h3>
            <div className="space-y-6 text-sm text-white/80">
              <p className="text-white/70">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Information We Collect</h4>
                <p className="mb-2">We collect information you provide directly to us, such as when you create an account, add pet information, or contact us for support. This may include:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li>Name, email address, and contact information</li>
                  <li>Pet information including photos, medical records, and breeding history</li>
                  <li>Communication preferences and support requests</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">How We Use Your Information</h4>
                <p className="mb-2">We use the information we collect to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li>Provide and maintain our services</li>
                  <li>Process transactions and send related information</li>
                  <li>Send technical notices and support messages</li>
                  <li>Respond to your comments and questions</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Data Security</h4>
                <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Contact Us</h4>
                <p>If you have any questions about this Privacy Policy, please contact us at privacy@zoion.com</p>
              </div>
            </div>
          </div>
        );

      case 'terms':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Terms & Conditions</h3>
            <div className="space-y-6 text-sm text-white/80">
              <p className="text-white/70">Last updated: {new Date().toLocaleDateString()}</p>
              
              <div>
                <h4 className="font-semibold text-white mb-2">Acceptance of Terms</h4>
                <p>By accessing and using Zoion, you accept and agree to be bound by the terms and provision of this agreement.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Use License</h4>
                <p>Permission is granted to temporarily download one copy of Zoion for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">User Responsibilities</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Provide accurate and complete information about your pets</li>
                  <li>Respect other users and maintain appropriate conduct</li>
                  <li>Not use the service for illegal or unauthorized purposes</li>
                  <li>Maintain the security of your account credentials</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Prohibited Uses</h4>
                <p className="mb-2">You may not use our service:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Disclaimer</h4>
                <p>The information on this service is provided on an "as is" basis. To the fullest extent permitted by law, this Company excludes all representations, warranties, conditions and terms relating to our service.</p>
              </div>
            </div>
          </div>
        );

      case 'report':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">Report a Problem</h3>
            <div className="space-y-6 text-sm text-white/80">
              <p>We appreciate your feedback and want to help resolve any issues you encounter.</p>
              
              <div>
                <h4 className="font-semibold text-white mb-2">What to Report</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Technical bugs or app crashes</li>
                  <li>Inappropriate content or behavior</li>
                  <li>Security concerns</li>
                  <li>Feature requests or improvements</li>
                  <li>Account or payment issues</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">How to Report</h4>
                <p className="mb-2">Please include the following information when reporting:</p>
                <ul className="list-disc list-inside mt-2 space-y-1 ml-2">
                  <li>Detailed description of the issue</li>
                  <li>Steps to reproduce the problem (if applicable)</li>
                  <li>Device and browser information</li>
                  <li>Screenshots or error messages</li>
                  <li>Your contact information for follow-up</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Contact Methods</h4>
                <div className="space-y-2">
                  <p><strong className="text-white">Email:</strong> support@zoion.com</p>
                  <p><strong className="text-white">Response Time:</strong> We typically respond within 24-48 hours</p>
                  <p><strong className="text-white">Priority:</strong> Security issues are addressed immediately</p>
                </div>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => window.open('mailto:support@zoion.com?subject=Problem Report', '_blank')}
                  className="bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30"
                >
                  Send Report via Email
                </Button>
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold text-white">About Zoion</h3>
            <div className="space-y-6 text-sm text-white/80">
              <div>
                <h4 className="font-semibold text-white mb-2">Our Mission</h4>
                <p>Zoion is a comprehensive platform designed to connect responsible pet breeders and owners, facilitating healthy breeding practices and pet management through advanced technology and community support.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Version Information</h4>
                <div className="bg-white/5 p-4 rounded-lg border border-white/20">
                  <div className="space-y-2">
                    <p><strong className="text-white">Version:</strong> 1.0.0</p>
                    <p><strong className="text-white">Build:</strong> 2024.1.0</p>
                    <p><strong className="text-white">Platform:</strong> Web Application</p>
                    <p><strong className="text-white">Last Updated:</strong> {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Key Features</h4>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>AI-powered pet search and matching</li>
                  <li>Advanced filtering and breeding compatibility</li>
                  <li>Pet profile management with medical records</li>
                  <li>Community features and breeder connections</li>
                  <li>Favorites and personalized recommendations</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Technology Stack</h4>
                <p>Built with modern web technologies including Next.js, React, TypeScript, and GraphQL for optimal performance and user experience.</p>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Contact Information</h4>
                <div className="space-y-1">
                  <p><strong className="text-white">Website:</strong> www.zoion.com</p>
                  <p><strong className="text-white">Email:</strong> info@zoion.com</p>
                  <p><strong className="text-white">Support:</strong> support@zoion.com</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-2">Copyright</h4>
                <p>© 2024 Zoion. All rights reserved. This application and its contents are protected by copyright and other intellectual property laws.</p>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="p-4 rounded-lg border border-white/20 bg-white/5 text-white text-left hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="w-5 h-5 text-white" />
                    <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  </div>
                  <p className="text-sm text-white/80">{item.description}</p>
                </button>
              );
            })}
          </div>
        );
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex h-full bg-transparent">
          <div className="flex flex-col gap-6 overflow-y-auto overflow-x-visible rounded-xl border border-gray-100/30 bg-white/5 md:h-[calc(100vh-2rem)] p-6 w-full">
            <div className="flex items-center gap-4">
              {activeSection && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 bg-white/5 text-white border border-white/20 hover:bg-white/10 hover:border-white/30"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <div className="flex flex-col gap-2">
                <h2 className="text-2xl font-semibold tracking-tight text-white">Settings</h2>
                <p className="text-sm text-white/80">
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
