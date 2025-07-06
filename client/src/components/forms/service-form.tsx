import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertItilServiceSchema, type ItilService, type InsertItilService } from "@shared/schema";
import type { Brand } from "@/lib/types";
import { z } from "zod";

interface ServiceFormProps {
  service?: ItilService | null;
  onSuccess: () => void;
  selectedBrand: Brand;
}

const serviceFormSchema = insertItilServiceSchema.extend({
  categoryId: z.number().optional(),
  description: z.string().optional(),
  serviceOwner: z.string().optional(),
  slaTarget: z.string().optional(),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

export default function ServiceForm({ service, onSuccess, selectedBrand }: ServiceFormProps) {
  const { toast } = useToast();

  // Fetch service categories for the dropdown
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/service-categories', selectedBrand],
    queryFn: () => fetch(`/api/service-categories?brand=${selectedBrand}`).then(res => res.json())
  });
  
  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      serviceName: service?.serviceName || "",
      serviceCode: service?.serviceCode || "",
      categoryId: service?.categoryId || undefined,
      description: service?.description || "",
      serviceOwner: service?.serviceOwner || "",
      businessCriticality: service?.businessCriticality || "medium",
      serviceStatus: service?.serviceStatus || "operational",
      slaTarget: service?.slaTarget || "",
      brand: service?.brand || selectedBrand,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertItilService) => {
      const response = await apiRequest("POST", "/api/itil-services", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/itil-services"] });
      toast({
        title: "Success",
        description: "Service created successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Create service error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to create service",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertItilService) => {
      const response = await apiRequest("PUT", `/api/itil-services/${service!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/itil-services"] });
      toast({
        title: "Success",
        description: "Service updated successfully",
      });
      onSuccess();
    },
    onError: (error: any) => {
      console.error("Update service error:", error);
      toast({
        title: "Error",
        description: error?.response?.data?.message || "Failed to update service",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ServiceFormData) => {
    const processedData = {
      ...data,
      categoryId: data.categoryId || null,
      description: data.description || null,
      serviceOwner: data.serviceOwner || null,
      slaTarget: data.slaTarget || null,
    };

    console.log("Submitting service data:", processedData);

    if (service) {
      updateMutation.mutate(processedData);
    } else {
      createMutation.mutate(processedData);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="serviceName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter service name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Code</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. AZ-INFRA-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={(value) => field.onChange(parseInt(value))} defaultValue={field.value?.toString()}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category: any) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceOwner"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Owner</FormLabel>
                <FormControl>
                  <Input placeholder="Service owner name" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="businessCriticality"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Business Criticality</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select criticality" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="critical">Critical</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="serviceStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Service Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="operational">Operational</SelectItem>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="retired">Retired</SelectItem>
                    <SelectItem value="under_change">Under Change</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slaTarget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SLA Target</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 99.9% uptime" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="blorcs">Blorcs</SelectItem>
                    <SelectItem value="shaypops">Shaypops</SelectItem>
                    <SelectItem value="all">All Brands</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter service description, purpose, and key features"
                  className="min-h-[100px]"
                  {...field} 
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={onSuccess}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-ms-blue hover:bg-blue-600"
            disabled={isPending}
          >
            {isPending ? "Saving..." : service ? "Update Service" : "Create Service"}
          </Button>
        </div>
      </form>
    </Form>
  );
}