import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertCorporateSchema, type Corporate, type InsertCorporate } from "@shared/schema";

interface CorporateFormProps {
  corporate?: Corporate | null;
  onSuccess: () => void;
}

export default function CorporateForm({ corporate, onSuccess }: CorporateFormProps) {
  const { toast } = useToast();
  
  const form = useForm<InsertCorporate>({
    resolver: zodResolver(insertCorporateSchema),
    defaultValues: {
      name: corporate?.name || "",
      description: corporate?.description || "",
      brand: corporate?.brand || "blorcs",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertCorporate) => {
      const response = await apiRequest("POST", "/api/corporates", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/corporates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/divisions"] });
      toast({
        title: "Success",
        description: "Corporate created successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create corporate",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertCorporate) => {
      const response = await apiRequest("PUT", `/api/corporates/${corporate!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/corporates"] });
      queryClient.invalidateQueries({ queryKey: ["/api/divisions"] });
      toast({
        title: "Success",
        description: "Corporate updated successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update corporate",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertCorporate) => {
    if (corporate) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Corporate Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter corporate name" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="blorcs">Blorcs</SelectItem>
                    <SelectItem value="shaypops">Shaypops</SelectItem>
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
                  placeholder="Enter corporate description"
                  className="min-h-[120px]"
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
            {isPending ? "Saving..." : corporate ? "Update Corporate" : "Create Corporate"}
          </Button>
        </div>
      </form>
    </Form>
  );
}