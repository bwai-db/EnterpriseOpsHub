import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings, Bell, User } from "lucide-react";
import type { Brand } from "@/lib/types";

interface HeaderProps {
  selectedBrand: Brand;
  onBrandChange: (brand: Brand) => void;
}

export default function Header({ selectedBrand, onBrandChange }: HeaderProps) {
  return (
    <header className="bg-ms-card border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-ms-blue rounded flex items-center justify-center">
              <Settings className="text-white w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-ms-text">Enterprise Operations</h1>
          </div>
          
          <div className="ml-8">
            <Select value={selectedBrand} onValueChange={(value: Brand) => onBrandChange(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Brands</SelectItem>
                <SelectItem value="blorcs">Blorcs</SelectItem>
                <SelectItem value="shaypops">Shaypops</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="w-4 h-4 text-gray-600" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-ms-blue rounded-full flex items-center justify-center">
              <User className="text-white w-4 h-4" />
            </div>
            <span className="text-sm">John Doe</span>
          </div>
        </div>
      </div>
    </header>
  );
}
