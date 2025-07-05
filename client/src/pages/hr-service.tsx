import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, UserPlus, Clock, CheckCircle, Plus, MessageSquare } from "lucide-react";
import type { Brand } from "@/lib/types";

interface HRServiceProps {
  selectedBrand: Brand;
}

export default function HRService({ selectedBrand }: HRServiceProps) {
  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-ms-text">HR Service Desk</h2>
            <p className="text-gray-600 mt-2">
              Employee support and HRIS platform integrations
            </p>
          </div>
          <Button className="bg-ms-blue hover:bg-blue-600">
            <Plus className="mr-2 w-4 h-4" />
            Create Ticket
          </Button>
        </div>
      </div>

      {/* HR Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Open Tickets</p>
                <p className="text-2xl font-bold text-ms-text">24</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="text-ms-blue w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">-12% from last week</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Hires</p>
                <p className="text-2xl font-bold text-ms-green">8</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserPlus className="text-ms-green w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
                <p className="text-2xl font-bold text-ms-text">2.4h</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="text-ms-orange w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-ms-green mt-2">-30min from target</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-2xl font-bold text-ms-green">96%</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-ms-green w-6 h-6" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">First contact resolution</p>
          </CardContent>
        </Card>
      </div>

      {/* HRIS Integrations */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>HRIS Platform Integrations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Users className="w-4 h-4 text-ms-blue" />
                  </div>
                  <h4 className="font-semibold">SAP SuccessFactors</h4>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Core HR, Payroll, and Performance Management</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Last sync: 2 min ago</span>
                <span>1,247 employees</span>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                    <Users className="w-4 h-4 text-ms-orange" />
                  </div>
                  <h4 className="font-semibold">Workday</h4>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">Talent Management and Recruiting</p>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Last sync: 5 min ago</span>
                <span>Real-time data</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent HR Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Support Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-ms-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New employee onboarding</p>
                  <p className="text-xs text-gray-600">Setup accounts for Sarah Johnson</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">Onboarding</Badge>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                </div>
                <Badge className="bg-yellow-100 text-yellow-800">In Progress</Badge>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-ms-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Password reset request</p>
                  <p className="text-xs text-gray-600">Employee unable to access SAP</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-red-100 text-red-800 text-xs">Access</Badge>
                    <span className="text-xs text-gray-500">4 hours ago</span>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Resolved</Badge>
              </div>

              <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                  <Clock className="w-4 h-4 text-ms-orange" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Benefits enrollment question</p>
                  <p className="text-xs text-gray-600">Question about health insurance options</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-purple-100 text-purple-800 text-xs">Benefits</Badge>
                    <span className="text-xs text-gray-500">6 hours ago</span>
                  </div>
                </div>
                <Badge className="bg-blue-100 text-blue-800">Open</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employee Self-Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <UserPlus className="mr-3 w-4 h-4" />
                New Employee Onboarding
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Clock className="mr-3 w-4 h-4" />
                Time-off Request
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-3 w-4 h-4" />
                Directory Lookup
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="mr-3 w-4 h-4" />
                IT Support Request
              </Button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Quick Stats</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Active Employees:</span>
                  <span className="font-medium">1,247</span>
                </div>
                <div className="flex justify-between">
                  <span>Open Positions:</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between">
                  <span>Pending Reviews:</span>
                  <span className="font-medium">15</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
