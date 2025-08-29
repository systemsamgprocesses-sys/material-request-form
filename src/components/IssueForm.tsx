import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import amgLogo from "@/assets/amg-logo-new.png";

interface ItemData {
  itemName: string;
  quantity: string;
  au: string;
  currentStock?: number;
  stockAfterPurchase?: number;
}

interface OneTimeData {
  storeName: string;
  requestedBy: string;
  purpose: string;
  gatePass?: string;
  indentNumber: string;
  natureOfDemand: string;
  projectName: string;
  storeRequiredByDate: string;
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
  const [stockData, setStockData] = useState<{[key: string]: number}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openItemDropdowns, setOpenItemDropdowns] = useState<{[key: number]: boolean}>({});
  const [oneTimeData, setOneTimeData] = useState<OneTimeData>({
    storeName: "",
    requestedBy: "",
    purpose: "",
    gatePass: "",
    indentNumber: "",
    natureOfDemand: "",
    projectName: "",
    storeRequiredByDate: ""
  });
  const [items, setItems] = useState<ItemData[]>([{
    itemName: "",
    quantity: "",
    au: "",
    currentStock: 0,
    stockAfterPurchase: 0
  }]);

  // Load URL parameters and prefill form
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const prefillOneTime: Partial<OneTimeData> = {};
    const prefillItems: Partial<ItemData> = {};
    
    // Map URL parameters to form fields
    const oneTimeMapping = {
      storeName: 'storeName',
      requestedBy: 'requestedBy',
      purpose: 'purpose',
      gatePass: 'gatePass',
      indentNumber: 'indentNumber',
      natureOfDemand: 'natureOfDemand',
      projectName: 'projectName',
      storeRequiredByDate: 'storeRequiredByDate'
    };
    
    const itemMapping = {
      itemName: 'itemName',
      quantity: 'quantity',
      au: 'au'
    };
    
    // Extract values from URL parameters
    Object.entries(oneTimeMapping).forEach(([urlParam, formField]) => {
      const value = urlParams.get(urlParam);
      if (value) {
        prefillOneTime[formField as keyof OneTimeData] = decodeURIComponent(value);
      }
    });
    
    Object.entries(itemMapping).forEach(([urlParam, formField]) => {
      const value = urlParams.get(urlParam);
      if (value) {
        (prefillItems as any)[formField] = decodeURIComponent(value);
      }
    });
    
    // Update form data if any prefill data exists
    if (Object.keys(prefillOneTime).length > 0) {
      setOneTimeData(prev => ({ ...prev, ...prefillOneTime }));
    }
    if (Object.keys(prefillItems).length > 0) {
      setItems([{ ...items[0], ...prefillItems }]);
    }
  }, []);

  // Load item names and stock data on component mount
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw4a8syIT0aLF5DGVUIINWfqk1lXx36UOs-jGSLgOGKzAjl_0mpsb6sa7rVA-hQimGt6Q/exec?action=getMasterData', {
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded master data:', data);
          setItemNames(data.itemNames || []);
          setStockData(data.stockData || {});
        }
      } catch (error) {
        console.log('Could not load master data:', error);
        // Fallback to load just item names
        try {
          const response = await fetch('https://script.google.com/macros/s/AKfycbw4a8syIT0aLF5DGVUIINWfqk1lXx36UOs-jGSLgOGKzAjl_0mpsb6sa7rVA-hQimGt6Q/exec', {
            method: 'GET',
            mode: 'cors'
          });
          
          if (response.ok) {
            const data = await response.json();
            setItemNames(data || []);
          }
        } catch (fallbackError) {
          console.log('Could not load item names:', fallbackError);
        }
      }
    };

    const generateIndentNumber = async () => {
      try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbw4a8syIT0aLF5DGVUIINWfqk1lXx36UOs-jGSLgOGKzAjl_0mpsb6sa7rVA-hQimGt6Q/exec?action=getNextIndentNumber', {
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.text();
          setOneTimeData(prev => ({ ...prev, indentNumber: data }));
        }
      } catch (error) {
        console.log('Could not generate indent number:', error);
        setOneTimeData(prev => ({ ...prev, indentNumber: 'I-001' }));
      }
    };

    loadMasterData();
    generateIndentNumber();
  }, []);

  const handleOneTimeDataChange = (field: keyof OneTimeData, value: string) => {
    setOneTimeData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index: number, field: keyof ItemData, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Calculate stock information when quantity changes
    if (field === 'quantity' && newItems[index].itemName) {
      const currentStock = stockData[newItems[index].itemName] || 0;
      const quantity = parseInt(value) || 0;
      newItems[index].currentStock = currentStock;
      newItems[index].stockAfterPurchase = currentStock + quantity;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, {
      itemName: "",
      quantity: "",
      au: "",
      currentStock: 0,
      stockAfterPurchase: 0
    }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
      const newDropdowns = { ...openItemDropdowns };
      delete newDropdowns[index];
      setOpenItemDropdowns(newDropdowns);
    }
  };

  const setItemDropdownOpen = (index: number, open: boolean) => {
    setOpenItemDropdowns(prev => ({ ...prev, [index]: open }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    const hasValidItems = items.some(item => item.itemName && item.quantity);
    if (!oneTimeData.storeName || !hasValidItems || !oneTimeData.storeRequiredByDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields including at least one item",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    // Create submission data - one row per item
    const submissionData = items
      .filter(item => item.itemName && item.quantity)
      .map(item => ({
        ...oneTimeData,
        ...item,
        timestamp: new Date().toISOString()
      }));

    // Create hidden iframe for submission to avoid navigation
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.name = 'submission-frame';
    document.body.appendChild(iframe);

    // Create form and target the iframe
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://script.google.com/macros/s/AKfycbw4a8syIT0aLF5DGVUIINWfqk1lXx36UOs-jGSLgOGKzAjl_0mpsb6sa7rVA-hQimGt6Q/exec';
    form.target = 'submission-frame';

    // Add submission data as JSON
    const dataInput = document.createElement('input');
    dataInput.type = 'hidden';
    dataInput.name = 'submissionData';
    dataInput.value = JSON.stringify(submissionData);
    form.appendChild(dataInput);

    // Handle iframe load event to detect completion
    iframe.onload = () => {
      setTimeout(() => {
        setIsSubmitting(false);
        document.body.removeChild(iframe);
        document.body.removeChild(form);

        toast({
          title: "✅ Submitted Successfully!",
          description: "Your indent/issue request has been submitted and saved to the spreadsheet.",
        });

        // Reset form
        setOneTimeData({
          storeName: "",
          requestedBy: "",
          purpose: "",
        gatePass: "",
          indentNumber: "",
          natureOfDemand: "",
          projectName: "",
          storeRequiredByDate: ""
        });
        setItems([{
          itemName: "",
          quantity: "",
          au: "",
          currentStock: 0,
          stockAfterPurchase: 0
        }]);
      }, 1000);
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
              <p className="text-lg text-muted-foreground">Indent/Issue Request form</p>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="modern-card p-8 animate-slide-up">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-foreground mb-2">Indent/Issue Request Form</h2>
            <p className="text-muted-foreground">Please fill in the details below to submit an indent/issue request</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* One-time Information Section */}
            <div className="bg-muted/50 p-6 rounded-lg space-y-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">General Information</h3>
              
              {/* Row 1: Store, Requested By, Nature of Demand */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-sm font-semibold text-foreground">
                    Store Name <span className="text-destructive">*</span>
                  </Label>
                  <Select value={oneTimeData.storeName} onValueChange={(value) => handleOneTimeDataChange("storeName", value)}>
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
                  <Label htmlFor="requestedBy" className="text-sm font-semibold text-foreground">
                    Requested By
                  </Label>
                  <Input
                    id="requestedBy"
                    value={oneTimeData.requestedBy}
                    onChange={(e) => handleOneTimeDataChange("requestedBy", e.target.value)}
                    className="modern-input h-12"
                    placeholder="Enter requester name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="natureOfDemand" className="text-sm font-semibold text-foreground">
                    Nature of Demand
                  </Label>
                  <Input
                    id="natureOfDemand"
                    value={oneTimeData.natureOfDemand}
                    onChange={(e) => handleOneTimeDataChange("natureOfDemand", e.target.value)}
                    className="modern-input h-12"
                    placeholder="Enter nature of demand"
                  />
                </div>
              </div>

              {/* Row 2: Project Name, Store Required By Date, Indent Number */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectName" className="text-sm font-semibold text-foreground">
                    Project Name (if any)
                  </Label>
                  <Input
                    id="projectName"
                    value={oneTimeData.projectName}
                    onChange={(e) => handleOneTimeDataChange("projectName", e.target.value)}
                    className="modern-input h-12"
                    placeholder="Enter project name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="storeRequiredByDate" className="text-sm font-semibold text-foreground">
                    Store Required by Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="storeRequiredByDate"
                    type="date"
                    value={oneTimeData.storeRequiredByDate}
                    onChange={(e) => handleOneTimeDataChange("storeRequiredByDate", e.target.value)}
                    className="modern-input h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="indentNumber" className="text-sm font-semibold text-foreground">
                    Indent Number (Auto-generated)
                  </Label>
                  <Input
                    id="indentNumber"
                    value={oneTimeData.indentNumber}
                    readOnly
                    className="modern-input h-12 bg-muted"
                    placeholder="Auto-generated"
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
                  value={oneTimeData.purpose}
                  onChange={(e) => handleOneTimeDataChange("purpose", e.target.value)}
                  className="modern-input min-h-[48px] resize-none"
                  placeholder="Enter purpose of request"
                />
              </div>
            </div>

            {/* Items Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Items Required</h3>
                <Button 
                  type="button" 
                  onClick={addItem}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Another Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div key={index} className="bg-background border rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-foreground">Item {index + 1}</h4>
                    {items.length > 1 && (
                      <Button 
                        type="button" 
                        onClick={() => removeItem(index)}
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor={`itemName-${index}`} className="text-sm font-semibold text-foreground">
                        Item Name <span className="text-destructive">*</span>
                      </Label>
                      <Popover open={openItemDropdowns[index] || false} onOpenChange={(open) => setItemDropdownOpen(index, open)}>
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <Input
                              value={item.itemName}
                              onChange={(e) => handleItemChange(index, "itemName", e.target.value)}
                              onClick={() => setItemDropdownOpen(index, true)}
                              className="modern-input h-12 pr-10"
                              placeholder="Enter product name"
                            />
                            <ChevronsUpDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0 modern-card border-none" align="start">
                          <Command>
                            <CommandInput 
                              placeholder="Search items..." 
                              value={item.itemName}
                              onValueChange={(value) => handleItemChange(index, "itemName", value)}
                            />
                            <CommandList>
                              <CommandEmpty>No item found.</CommandEmpty>
                              <CommandGroup>
                                {itemNames
                                  .filter(itemName => 
                                    itemName.toLowerCase().includes(item.itemName.toLowerCase())
                                  )
                                  .map((itemName) => (
                                  <CommandItem
                                    key={itemName}
                                    value={itemName}
                                    onSelect={(currentValue) => {
                                      handleItemChange(index, "itemName", currentValue);
                                      setItemDropdownOpen(index, false);
                                    }}
                                    className="focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 hover:text-foreground"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        item.itemName === itemName ? "opacity-100" : "opacity-0"
                                      )}
                                    />
                                    {itemName}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`quantity-${index}`} className="text-sm font-semibold text-foreground">
                        Quantity <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id={`quantity-${index}`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                        className="modern-input h-12"
                        placeholder="Enter quantity"
                      />
                      {item.currentStock !== undefined && item.quantity && (
                        <div className="text-xs text-muted-foreground mt-1">
                          <div>Current Stock: {item.currentStock}</div>
                          <div>Stock After Purchase: {item.stockAfterPurchase}</div>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`au-${index}`} className="text-sm font-semibold text-foreground">
                        A/U
                      </Label>
                      <Input
                        id={`au-${index}`}
                        value={item.au}
                        onChange={(e) => handleItemChange(index, "au", e.target.value)}
                        className="modern-input h-12"
                        placeholder="Enter A/U"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
                  "Submit Indent/Issue Request"
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