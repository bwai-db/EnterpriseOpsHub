import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import type { Brand } from "@/lib/types";

interface SecurityProps {
  selectedBrand: Brand;
}

export default function Security({ selectedBrand }: SecurityProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-ms-text">Security & Compliance</h2>
        <p className="text-gray-600 mt-2">
          Governance, Risk, Compliance (GRC) and security operations management
        </p>
      </div>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Score</p>
                <p className="text-2xl font-bold text-ms-green">94%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="text-ms-green w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-ms-green mt-2">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Threats</p>
                <p className="text-2xl font-bold text-ms-orange">3</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="text-ms-orange w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Compliance Status</p>
                <p className="text-2xl font-bold text-ms-green">98.5%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-ms-green w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">SOX, PCI, GDPR</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PII Data Points</p>
                <p className="text-2xl font-bold text-ms-text">1.2M</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Lock className="text-ms-blue w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Protected & encrypted</p>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Frameworks */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compliance Frameworks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">SOX Compliance</h4>
                <Badge className="bg-green-100 text-green-800">Compliant</Badge>
              </div>
              <p className="text-sm text-gray-600">Sarbanes-Oxley Act compliance</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-ms-green h-2 rounded-full" style={{ width: "98%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">98% compliant</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">PCI DSS</h4>
                <Badge className="bg-green-100 text-green-800">Compliant</Badge>
              </div>
              <p className="text-sm text-gray-600">Payment Card Industry standards</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-ms-green h-2 rounded-full" style={{ width: "100%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">100% compliant</p>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">GDPR</h4>
                <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
              </div>
              <p className="text-sm text-gray-600">General Data Protection Regulation</p>
              <div className="mt-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-yellow-500 h-2 rounded-full" style={{ width: "85%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">85% compliant</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Security Operations Center</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-sm">Critical Alert</p>
                    <p className="text-xs text-gray-600">Suspicious login attempt detected</p>
                  </div>
                </div>
                <Badge className="bg-red-100 text-red-800">High</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Eye className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="font-medium text-sm">Monitoring</p>
                    <p className="text-xs text-gray-600">Unusual network traffic pattern</p>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="font-medium text-sm">Resolved</p>
                    <p className="text-xs text-gray-600">Malware scan completed successfully</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Low</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data Protection & PII Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">Customer Data</h4>
                  <Lock className="w-4 h-4 text-ms-blue" />
                </div>
                <p className="text-xs text-gray-600 mb-2">Encrypted customer information and transaction data</p>
                <div className="flex justify-between text-xs">
                  <span>850K records</span>
                  <span className="text-ms-green">100% encrypted</span>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">Employee Data</h4>
                  <Lock className="w-4 h-4 text-ms-blue" />
                </div>
                <p className="text-xs text-gray-600 mb-2">HR records and personal information</p>
                <div className="flex justify-between text-xs">
                  <span>15K records</span>
                  <span className="text-ms-green">100% encrypted</span>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-sm">Financial Data</h4>
                  <Lock className="w-4 h-4 text-ms-blue" />
                </div>
                <p className="text-xs text-gray-600 mb-2">Payment and financial transaction records</p>
                <div className="flex justify-between text-xs">
                  <span>2.1M records</span>
                  <span className="text-ms-green">100% encrypted</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Risk Assessment Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto w-12 h-12 mb-4 text-gray-300" />
            <p>Comprehensive risk assessment and audit tools</p>
            <p className="text-sm">Real-time risk monitoring and compliance reporting</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
