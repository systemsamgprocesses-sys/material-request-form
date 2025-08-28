import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import amgLogo from "@/assets/amg-logo-new.png";

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
  const [itemNames, setItemNames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openItemDropdown, setOpenItemDropdown] = useState(false);
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

  // Load item names on component mount
  useEffect(() => {
    const loadItemNames = async () => {
      try {
        // Create a temporary script element to bypass CORS
        const script = document.createElement('script');
        const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
        
        // Create global callback function
        (window as any)[callbackName] = (data: string[]) => {
          console.log('Received item names:', data);
          setItemNames(data || []);
          document.body.removeChild(script);
          delete (window as any)[callbackName];
        };
        
        // Your Google Apps Script returns JSON, so we need to modify the approach
        // Instead, let's try a different method using fetch with no-cors mode
        try {
          const response = await fetch('https://script.google.com/macros/s/AKfycbxpTagX48Xood2raaimXfxhh14EdGUXAtaqgDoWog-edBumuUfHmFSTq5Wa3mkvern45A/exec', {
            method: 'GET',
            mode: 'cors'
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Loaded item names via fetch:', data);
            setItemNames(data || []);
          } else {
            throw new Error('Fetch failed');
          }
        } catch (fetchError) {
          console.log('Fetch failed, trying iframe approach');
          // Fallback: create hidden iframe to load data
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = 'https://script.google.com/macros/s/AKfycbxpTagX48Xood2raaimXfxhh14EdGUXAtaqgDoWog-edBumuUfHmFSTq5Wa3mkvern45A/exec';
          document.body.appendChild(iframe);
          
          iframe.onload = () => {
            try {
              const content = iframe.contentDocument?.body?.textContent;
              if (content) {
                const data = JSON.parse(content);
                console.log('Loaded item names via iframe:', data);
                setItemNames(data || []);
              }
            } catch (iframeError) {
              console.log('Could not load item names via iframe');
            } finally {
              document.body.removeChild(iframe);
            }
          };
        }
      } catch (error) {
        console.log('Could not load item names:', error);
      }
    };

    loadItemNames();
  }, []);

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

    setIsSubmitting(true);

    // Create hidden iframe for submission to avoid navigation
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'submission-frame';
    document.body.appendChild(iframe);

    // Create form and target the iframe
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbxpTagX48Xood2raaimXfxhh14EdGUXAtaqgDoWog-edBumuUfHmFSTq5Wa3mkvern45A/exec';
    form.target = 'submission-frame';

    Object.entries(formData).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // Handle iframe load event to detect completion
    iframe.onload = () => {
      setTimeout(() => {
        setIsSubmitting(false);
        document.body.removeChild(iframe);
        document.body.removeChild(form);

        toast({
          title: "✅ Submitted Successfully!",
          description: "Your issue form has been submitted and saved to the spreadsheet.",
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
      }, 1000); // Small delay to ensure submission is complete
    };

    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="min-h-screen p-6 flex items-center justify-center">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-scale">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img 
              src={amgLogo} 
              alt="AMG Reality Logo" 
              className="h-16 w-auto object-contain"
            />
            <div className="text-left">
              <h1 className="text-3xl font-bold text-foreground">AMG Reality</h1>
              <p className="text-lg text-muted-foreground">Material Issue Request form</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="modern-card p-8 animate-slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Issue Form</h2>
            <p className="text-muted-foreground">Please fill in the details below to submit an issue request</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-sm font-semibold text-foreground">
                  Store Name <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.storeName} onValueChange={(value) => handleInputChange("storeName", value)}>
                  <SelectTrigger className="modern-input h-12">
                    <SelectValue placeholder="Select Store" />
                  </SelectTrigger>
                  <SelectContent className="modern-card border-none">
                    {stores.map((store) => (
                      <SelectItem key={store} value={store} className="focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 hover:text-foreground">
                        {store}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemName" className="text-sm font-semibold text-foreground">
                  Item Name <span className="text-destructive">*</span>
                </Label>
                <Popover open={openItemDropdown} onOpenChange={setOpenItemDropdown}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={openItemDropdown}
                      className="modern-input h-12 justify-between font-normal"
                    >
                      {formData.itemName
                        ? itemNames.find((item) => item === formData.itemName) || formData.itemName
                        : "Select item name..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 modern-card border-none" align="start">
                    <Command>
                      <CommandInput placeholder="Search items..." />
                      <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {itemNames.map((item) => (
                            <CommandItem
                              key={item}
                              value={item}
                              onSelect={(currentValue) => {
                                handleInputChange("itemName", currentValue === formData.itemName ? "" : currentValue);
                                setOpenItemDropdown(false);
                              }}
                              className="focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 hover:text-foreground"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  formData.itemName === item ? "opacity-100" : "opacity-0"
                                )}
                              />
                              {item}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-sm font-semibold text-foreground">
                  Quantity Issued <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  className="modern-input h-12"
                  placeholder="Enter quantity"
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="specifications" className="text-sm font-semibold text-foreground">
                  Specifications
                </Label>
                <Input
                  id="specifications"
                  value={formData.specifications}
                  onChange={(e) => handleInputChange("specifications", e.target.value)}
                  className="modern-input h-12"
                  placeholder="Enter specifications"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="issuedTo" className="text-sm font-semibold text-foreground">
                  Issued To
                </Label>
                <Input
                  id="issuedTo"
                  value={formData.issuedTo}
                  onChange={(e) => handleInputChange("issuedTo", e.target.value)}
                  className="modern-input h-12"
                  placeholder="Enter recipient name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-semibold text-foreground">
                  Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange("date", e.target.value)}
                  className="modern-input h-12"
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="gatePass" className="text-sm font-semibold text-foreground">
                  Gate Pass No.
                </Label>
                <Input
                  id="gatePass"
                  value={formData.gatePass}
                  onChange={(e) => handleInputChange("gatePass", e.target.value)}
                  className="modern-input h-12"
                  placeholder="Enter gate pass number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="indentNumber" className="text-sm font-semibold text-foreground">
                  Indent Number
                </Label>
                <Input
                  id="indentNumber"
                  value={formData.indentNumber}
                  onChange={(e) => handleInputChange("indentNumber", e.target.value)}
                  className="modern-input h-12"
                  placeholder="Enter indent number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="au" className="text-sm font-semibold text-foreground">
                  A/U
                </Label>
                <Input
                  id="au"
                  value={formData.au}
                  onChange={(e) => handleInputChange("au", e.target.value)}
                  className="modern-input h-12"
                  placeholder="Enter A/U"
                />
              </div>
            </div>

            {/* Purpose - Full width */}
            <div className="space-y-2">
              <Label htmlFor="purpose" className="text-sm font-semibold text-foreground">
                Purpose
              </Label>
              <Textarea
                id="purpose"
                value={formData.purpose}
                onChange={(e) => handleInputChange("purpose", e.target.value)}
                className="modern-input min-h-[100px] resize-none"
                placeholder="Enter purpose of issue"
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="modern-button px-12 py-3 text-white text-base font-semibold h-12 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Submit Issue Form"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default IssueForm;