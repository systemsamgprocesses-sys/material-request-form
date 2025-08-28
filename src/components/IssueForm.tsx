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
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl floating"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl floating" style={{ animationDelay: "-3s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl floating" style={{ animationDelay: "-1.5s" }}></div>
      </div>

      <div className="glass-card rounded-3xl p-8 w-full max-w-5xl animate-slide-in relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Logo Section */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center space-y-6 p-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full transform scale-110"></div>
              <img 
                src={amgLogo} 
                alt="AMG Reality Logo" 
                className="relative w-40 h-auto object-contain drop-shadow-2xl floating"
              />
            </div>
            <div className="text-center space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                AMG Reality
              </h1>
              <h2 className="text-xl font-semibold text-foreground/80">Issue Management</h2>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Streamlined resource tracking and inventory management system
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Store Name */}
                <div className="space-y-3">
                  <Label htmlFor="storeName" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Store Name *
                  </Label>
                  <Select value={formData.storeName} onValueChange={(value) => handleInputChange("storeName", value)}>
                    <SelectTrigger className="glass-input h-12 text-base">
                      <SelectValue placeholder="Select Store" />
                    </SelectTrigger>
                    <SelectContent className="glass-card border-none">
                      {stores.map((store) => (
                        <SelectItem key={store} value={store} className="focus:bg-primary/10">
                          {store}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Item Name */}
                <div className="space-y-3">
                  <Label htmlFor="itemName" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Item Name *
                  </Label>
                  <Input
                    id="itemName"
                    value={formData.itemName}
                    onChange={(e) => handleInputChange("itemName", e.target.value)}
                    className="glass-input h-12 text-base"
                    placeholder="Enter item name"
                  />
                </div>

                {/* Specifications */}
                <div className="space-y-3">
                  <Label htmlFor="specifications" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                    Specifications
                  </Label>
                  <Input
                    id="specifications"
                    value={formData.specifications}
                    onChange={(e) => handleInputChange("specifications", e.target.value)}
                    className="glass-input h-12 text-base"
                    placeholder="Enter specifications"
                  />
                </div>

                {/* Quantity */}
                <div className="space-y-3">
                  <Label htmlFor="quantity" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Quantity Issued *
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                    className="glass-input h-12 text-base"
                    placeholder="Enter quantity"
                  />
                </div>

                {/* Issued To */}
                <div className="space-y-3">
                  <Label htmlFor="issuedTo" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                    Issued To
                  </Label>
                  <Input
                    id="issuedTo"
                    value={formData.issuedTo}
                    onChange={(e) => handleInputChange("issuedTo", e.target.value)}
                    className="glass-input h-12 text-base"
                    placeholder="Enter recipient name"
                  />
                </div>

                {/* Gate Pass No */}
                <div className="space-y-3">
                  <Label htmlFor="gatePass" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                    Gate Pass No.
                  </Label>
                  <Input
                    id="gatePass"
                    value={formData.gatePass}
                    onChange={(e) => handleInputChange("gatePass", e.target.value)}
                    className="glass-input h-12 text-base"
                    placeholder="Enter gate pass number"
                  />
                </div>

                {/* Date */}
                <div className="space-y-3">
                  <Label htmlFor="date" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary"></span>
                    Date *
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange("date", e.target.value)}
                    className="glass-input h-12 text-base"
                  />
                </div>

                {/* Indent Number */}
                <div className="space-y-3">
                  <Label htmlFor="indentNumber" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                    Indent Number
                  </Label>
                  <Input
                    id="indentNumber"
                    value={formData.indentNumber}
                    onChange={(e) => handleInputChange("indentNumber", e.target.value)}
                    className="glass-input h-12 text-base"
                    placeholder="Enter indent number"
                  />
                </div>

                {/* A/U */}
                <div className="space-y-3">
                  <Label htmlFor="au" className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                    A/U
                  </Label>
                  <Input
                    id="au"
                    value={formData.au}
                    onChange={(e) => handleInputChange("au", e.target.value)}
                    className="glass-input h-12 text-base"
                    placeholder="Enter A/U"
                  />
                </div>
              </div>

              {/* Purpose - Full width */}
              <div className="space-y-3">
                <Label htmlFor="purpose" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground"></span>
                  Purpose
                </Label>
                <Textarea
                  id="purpose"
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  className="glass-input min-h-[80px] resize-none text-base"
                  placeholder="Enter purpose of issue"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  className="apple-button w-full h-14 text-lg font-semibold text-white border-0 relative overflow-hidden"
                >
                  <span className="relative z-10">Submit Issue Form</span>
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;