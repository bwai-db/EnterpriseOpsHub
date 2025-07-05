import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Edit, Trash2, Plus, Shield, ShieldCheck, ShieldX, MapPin, User, ExternalLink, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Vendor, VendorAgreement } from "@shared/schema";

interface VendorTableProps {
  vendors: Vendor[];
  isLoading: boolean;
  onEdit: (vendor: Vendor) => void;
  onDelete: (id: number) => void;
}

export default function VendorTable({ vendors, isLoading, onEdit, onDelete }: VendorTableProps) {
  // Fetch vendor agreements for all vendors
  const { data: agreements = [] } = useQuery<VendorAgreement[]>({
    queryKey: ['/api/vendor-agreements'],
    enabled: vendors.length > 0,
  });

  const getVendorAgreementStatus = (vendorId: number) => {
    const vendorAgreements = agreements.filter(agreement => agreement.vendorId === vendorId);
    
    if (vendorAgreements.length === 0) {
      return { hasNDA: false, hasMSA: false, totalAgreements: 0, pendingCount: 0, activeCount: 0 };
    }

    const hasNDA = vendorAgreements.some(a => a.agreementType === 'nda' && a.status === 'active');
    const hasMSA = vendorAgreements.some(a => a.agreementType === 'msa' && a.status === 'active');
    const pendingCount = vendorAgreements.filter(a => 
      a.status === 'pending_signature' || a.status === 'pending_review' || a.status === 'draft'
    ).length;
    const activeCount = vendorAgreements.filter(a => a.status === 'active').length;

    return { 
      hasNDA, 
      hasMSA, 
      totalAgreements: vendorAgreements.length, 
      pendingCount, 
      activeCount,
      agreements: vendorAgreements
    };
  };

  const getAgreementStatusBadges = (vendorId: number) => {
    const status = getVendorAgreementStatus(vendorId);
    const badges = [];

    if (status.totalAgreements === 0) {
      badges.push(
        <Badge key="no-agreements" variant="outline" className="text-gray-500 border-gray-300 text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          No Agreements
        </Badge>
      );
      return badges;
    }

    if (status.hasNDA) {
      badges.push(
        <Badge key="nda" className="bg-green-100 text-green-800 border-green-200 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          NDA Active
        </Badge>
      );
    }

    if (status.hasMSA) {
      badges.push(
        <Badge key="msa" className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
          <CheckCircle className="w-3 h-3 mr-1" />
          MSA Active
        </Badge>
      );
    }

    if (status.pendingCount > 0) {
      badges.push(
        <Badge key="pending" variant="outline" className="text-orange-600 border-orange-200 text-xs">
          <AlertTriangle className="w-3 h-3 mr-1" />
          {status.pendingCount} Pending
        </Badge>
      );
    }

    if (status.activeCount > 0) {
      badges.push(
        <Badge key="total" variant="outline" className="text-gray-600 border-gray-200 text-xs">
          <FileText className="w-3 h-3 mr-1" />
          {status.activeCount} Active
        </Badge>
      );
    }

    return badges;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const colorMap = {
      software: "bg-blue-100 text-blue-800",
      hardware: "bg-orange-100 text-orange-800",
      cloud: "bg-purple-100 text-purple-800",
      security: "bg-red-100 text-red-800",
      manufacturing: "bg-green-100 text-green-800",
      services: "bg-indigo-100 text-indigo-800",
    };
    
    return (
      <Badge className={colorMap[category as keyof typeof colorMap] || "bg-gray-100 text-gray-800"}>
        {category}
      </Badge>
    );
  };

  const getGdapStatusBadge = (vendor: Vendor) => {
    if (!vendor.providesGDAP) {
      return (
        <Badge variant="outline" className="text-red-600 border-red-200">
          <ShieldX className="w-3 h-3 mr-1" />
          No GDAP
        </Badge>
      );
    }
    
    switch (vendor.gdapStatus) {
      case "compliant":
        return (
          <Badge className="bg-green-100 text-green-800 border-green-200">
            <ShieldCheck className="w-3 h-3 mr-1" />
            GDAP Compliant
          </Badge>
        );
      case "non_compliant":
        return (
          <Badge variant="outline" className="text-orange-600 border-orange-200">
            <Shield className="w-3 h-3 mr-1" />
            Non-Compliant
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-200">
            <Shield className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-gray-600 border-gray-200">
            <Shield className="w-3 h-3 mr-1" />
            Unknown
          </Badge>
        );
    }
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(parseFloat(amount));
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "No end date";
    return new Date(date).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendors</CardTitle>
      </CardHeader>
      <CardContent>
        {vendors.length === 0 ? (
          <div className="text-center py-8">
            <Building className="mx-auto w-12 h-12 mb-4 text-gray-300" />
            <p className="text-gray-500 mb-4">No vendors found</p>
            <p className="text-sm text-gray-400">Try adjusting your filters or add a new vendor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category & Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GDAP Compliance
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agreement Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Account Manager
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building className="text-gray-600 w-5 h-5" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                          <div className="text-sm text-gray-500">{vendor.description}</div>
                          {vendor.website && (
                            <a 
                              href={vendor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center mt-1"
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              Website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getCategoryBadge(vendor.category)}
                        {getStatusBadge(vendor.status)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getGdapStatusBadge(vendor)}
                        {vendor.entraB2BConfigured && (
                          <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                            Entra B2B
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {getAgreementStatusBadges(vendor.id)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {vendor.accountManager ? (
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900 flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            {vendor.accountManager}
                          </div>
                          {vendor.accountManagerEmail && (
                            <div className="text-xs text-gray-500">{vendor.accountManagerEmail}</div>
                          )}
                          {vendor.accountManagerPhone && (
                            <div className="text-xs text-gray-500">{vendor.accountManagerPhone}</div>
                          )}
                          {vendor.hqCity && (
                            <div className="text-xs text-gray-500 flex items-center mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {vendor.hqCity}, {vendor.hqState}
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No contact assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(vendor)}
                          className="text-ms-blue hover:text-blue-600"
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete(vendor.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
