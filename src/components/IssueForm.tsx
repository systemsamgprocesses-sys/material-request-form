import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import amgLogo from "@/assets/amg-logo.png";

interface FormData {
  storeName: string;
  itemName: string;
  specifications: string;
  quantity: string;
  issuedTo: string;
  purpose: string;
  gatePass: string;
  date: string;
  indentNumber: string;
  au: string;
}

const stores = [
  "Palm Walk",
  "Palm Marina", 
  "Palm City",
  "Garden",
  "Maurya Green",
  "ONE AMG"
];

const IssueForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    storeName: "",
    itemName: "",
    specifications: "",
    quantity: "",
    issuedTo: "",
    purpose: "",
    gatePass: "",
    date: "",
    indentNumber: "",
    au: ""
  });

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.storeName || !formData.itemName || !formData.quantity || !formData.date) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "✅ Submitted Successfully!",
      description: "Your issue form has been submitted.",
    });

    // Reset form
    setFormData({
      storeName: "",
      itemName: "",
      specifications: "",
      quantity: "",
      issuedTo: "",
      purpose: "",
      gatePass: "",
      date: "",
      indentNumber: "",
      au: ""
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass rounded-3xl p-8 w-full max-w-4xl animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Logo Section */}
          <div className="lg:col-span-1 flex flex-col items-center justify-center space-y-4">
            <img 
              src={amgLogo} 
              alt="AMG Reality Logo" 
              className="w-32 h-32 object-contain"
            />
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary mb-2">AMG Reality</h1>
              <h2 className="text-lg font-semibold text-foreground">Issue Form</h2>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Store Name */}
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-sm font-medium">
                    Store Name *
                  </Label>
                  <Select value={formData.storeName} onValueChange={(value) => handleInputChange("storeName", value)}>
                    <SelectTrigger className="glass-input rounded-xl">
                      <SelectValue placeholder="Select Store" />
                    </SelectTrigger>
                    <SelectContent>
                      {stores.map((store) => (
                        <SelectItem key={store} value={store}>
                          {store}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Item Name */}
                <div className="space-y-2">
                  <Label htmlFor="itemName" className="text-sm font-medium">
                    Item Name *
                  </Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange("itemName", e.target.value)}
                    className="glass-input rounded-xl"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Specifications */}
                <div className="space-y-2">
                  <Label htmlFor="specifications" className="text-sm font-medium">
                    Specifications
                  </Label>
                  <Input
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => handleInputChange("specifications", e.target.value)}
                    className="glass-input rounded-xl"
                    placeholder="Enter specifications"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-sm font-medium">
                    Quantity Issued *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    className="glass-input rounded-xl"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Issued To */}
                <div className="space-y-2">
                  <Label htmlFor="issuedTo" className="text-sm font-medium">
                    Issued To
                  </Label>
                  <Input
                    id="issuedTo"
                    value={formData.issuedTo}
                    onChange={(e) => handleInputChange("issuedTo", e.target.value)}
                    className="glass-input rounded-xl"
                    placeholder="Enter recipient name"
                  />
                </div>

                {/* Gate Pass No */}
                <div className="space-y-2">
                  <Label htmlFor="gatePass" className="text-sm font-medium">
                    Gate Pass No.
                  </Label>
                  <Input
                    id="gatePass"
                    value={formData.gatePass}
                    onChange={(e) => handleInputChange("gatePass", e.target.value)}
                    className="glass-input rounded-xl"
                    placeholder="Enter gate pass number"
                  />
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm font-medium">
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="glass-input rounded-xl"
                  />
                </div>

                {/* Indent Number */}
                <div className="space-y-2">
                  <Label htmlFor="indentNumber" className="text-sm font-medium">
                    Indent Number
                  </Label>
                  <Input
                    id="indentNumber"
                    value={formData.indentNumber}
                    onChange={(e) => handleInputChange("indentNumber", e.target.value)}
                    className="glass-input rounded-xl"
                    placeholder="Enter indent number"
                  />
                </div>

                {/* A/U */}
                <div className="space-y-2">
                  <Label htmlFor="au" className="text-sm font-medium">
                    A/U
                  </Label>
                  <Input
                    id="au"
                    value={formData.au}
                    onChange={(e) => handleInputChange("au", e.target.value)}
                    className="glass-input rounded-xl"
                    placeholder="Enter A/U"
                  />
                </div>
              </div>

              {/* Purpose - Full width */}
              <div className="space-y-2">
                <Label htmlFor="purpose" className="text-sm font-medium">
                  Purpose
                </Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  className="glass-input rounded-xl min-h-[60px] resize-none"
                  placeholder="Enter purpose of issue"
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full mt-6 py-4 text-base font-semibold rounded-xl bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all duration-300 hover:transform hover:-translate-y-0.5"
              >
                Submit Issue Form
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;