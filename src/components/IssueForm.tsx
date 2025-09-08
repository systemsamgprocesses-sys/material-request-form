import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Plus, X, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import amgLogo from "@/assets/amg-logo-new.png";

interface ItemData {
  itemName: string;
  customItemName?: string;
  quantity: string;
  au: string;
  remarks: string;
  currentStock?: number;
  stockAfterPurchase?: number;
}

interface OneTimeData {
  storeName: string;
  requestedBy: string;
  byWhomOrders: string;
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

const units = ["ft", "PC", "meter", "NOS", "CMs"];
const demandTypes = ["normal", "urgent"];

const IssueForm = () => {
  const { toast } = useToast();
  const [itemNames, setItemNames] = useState<string[]>([]);
  const [stockData, setStockData] = useState<{[key: string]: number}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openPopovers, setOpenPopovers] = useState<{[key: number | string]: boolean}>({});
  
  const [oneTimeData, setOneTimeData] = useState<OneTimeData>({
    storeName: "",
    requestedBy: "",
    byWhomOrders: "",
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
    remarks: "",
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
      au: 'au',
      remarks: 'remarks'
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
        const response = await fetch('https://script.google.com/macros/s/AKfycbxUgvb1L4rQNVtOLgO0LfNNDVy10EQD-HmeyC7uYBkUetaWaJ1YbbumtBphNJst9y0qAg/exec?action=getMasterData', {
          method: 'GET',
          mode: 'cors'
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Loaded master data:', data);
          
          // Remove duplicates from item names to fix React key warning
          const uniqueItemNames = [...new Set((data.itemNames || []) as string[])];
          // Add Miscellaneous option at the beginning
          setItemNames(["Miscellaneous", ...uniqueItemNames]);
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
            // Remove duplicates here too
            const uniqueItemNames = [...new Set((data || []) as string[])];
            setItemNames(uniqueItemNames);
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
    
    // Handle Miscellaneous item selection
    if (field === 'itemName' && value === 'Miscellaneous') {
      newItems[index].currentStock = 0;
      newItems[index].stockAfterPurchase = 0;
      newItems[index].customItemName = '';
    }
    
    // Calculate stock information when quantity changes (skip for Miscellaneous)
    if ((field === 'quantity' || field === 'itemName') && newItems[index].itemName && newItems[index].itemName !== 'Miscellaneous') {
      const currentStock = stockData[newItems[index].itemName] || 0;
      const quantity = parseInt(value) || 0;
      newItems[index].currentStock = currentStock;
      newItems[index].stockAfterPurchase = currentStock - quantity;
    }
    
    // Update stock when item name changes (skip for Miscellaneous)
    if (field === 'itemName' && value !== 'Miscellaneous') {
      const currentStock = stockData[value] || 0;
      const quantity = parseInt(newItems[index].quantity) || 0;
      newItems[index].currentStock = currentStock;
      newItems[index].stockAfterPurchase = currentStock - quantity;
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    const newItemIndex = items.length;
    setItems([...items, {
      itemName: "",
      quantity: "",
      au: "",
      remarks: "",
      currentStock: 0,
      stockAfterPurchase: 0
    }]);
    
    // Initialize popover states for new item
    setOpenPopovers(prev => ({
      ...prev,
      [newItemIndex]: false,
      [`mobile-${newItemIndex}`]: false
    }));
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
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
        // Use custom item name for miscellaneous items
        itemName: item.itemName === 'Miscellaneous' && item.customItemName 
          ? `Miscellaneous: ${item.customItemName}`
          : item.itemName,
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
          byWhomOrders: "",
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
          remarks: "",
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
              
              {/* Row 1: Indent Number (Auto-generated) - Full width */}
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="indentNumber" className="text-sm font-semibold text-foreground">
                    Indent Number (Auto-generated)
                  </Label>
                  <Input
                    id="indentNumber"
                    value={oneTimeData.indentNumber}
                    readOnly
                    className="modern-input h-12 bg-muted text-center text-lg font-semibold"
                    placeholder="Auto-generated"
                  />
                </div>
              </div>

              {/* Row 2: Store, Requested By, By Whom Orders */}
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
                  <Label htmlFor="byWhomOrders" className="text-sm font-semibold text-foreground">
                    By Whom Orders/Instruction
                  </Label>
                  <Input
                    id="byWhomOrders"
                    value={oneTimeData.byWhomOrders}
                    onChange={(e) => handleOneTimeDataChange("byWhomOrders", e.target.value)}
                    className="modern-input h-12"
                    placeholder="Enter orders/instruction source"
                  />
                </div>
              </div>

              {/* Row 3: Project Name, Store Required By Date, Nature of Demand */}
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
                  <Label htmlFor="natureOfDemand" className="text-sm font-semibold text-foreground">
                    Nature of Demand
                  </Label>
                  <Select value={oneTimeData.natureOfDemand} onValueChange={(value) => handleOneTimeDataChange("natureOfDemand", value)}>
                    <SelectTrigger className="modern-input h-12">
                      <SelectValue placeholder="Select demand type" />
                    </SelectTrigger>
                    <SelectContent className="modern-card border-none">
                      {demandTypes.map((type) => (
                        <SelectItem key={type} value={type} className="focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 hover:text-foreground capitalize">
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
              <h3 className="text-lg font-semibold text-foreground">Items Required</h3>

              {/* Desktop Table View */}
              <div className="hidden md:block">
                <div className="bg-background border rounded-lg overflow-hidden">
                  <div className="bg-muted/50 px-6 py-3 border-b">
                    <div className="grid gap-4 text-sm font-semibold text-foreground" style={{gridTemplateColumns: "60px 300px 120px 80px 120px 120px 200px 80px"}}>
                      <div>S.No</div>
                      <div>Item Name</div>
                      <div>Quantity</div>
                      <div>A/U</div>
                      <div>Current Stock</div>
                      <div>Stock After</div>
                      <div>Remarks</div>
                      <div>Action</div>
                    </div>
                  </div>
                  
                  {items.map((item, index) => (
                    <div key={index} className="px-6 py-4 border-b last:border-b-0">
                      <div className="grid gap-4 items-center" style={{gridTemplateColumns: "60px 300px 120px 80px 120px 120px 200px 80px"}}>
                        {/* S.No */}
                        <div className="text-sm font-medium">{index + 1}</div>
                        
                        {/* Item Name */}
                         <div className="space-y-1">
                           <Popover open={openPopovers[index]} onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, [index]: open }))}>
                             <PopoverTrigger asChild>
                               <Button
                                 variant="outline"
                                 role="combobox"
                                 aria-expanded={openPopovers[index]}
                                 className="h-10 w-full justify-between text-left font-normal"
                               >
                                 <span className="truncate">
                                   {item.itemName === 'Miscellaneous' && item.customItemName 
                                     ? `Miscellaneous: ${item.customItemName}`
                                     : item.itemName || "Select item..."}
                                 </span>
                                 <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                               </Button>
                             </PopoverTrigger>
                             <PopoverContent className="w-[400px] p-0">
                               <Command>
                                 <CommandInput placeholder="Search items..." />
                                 <CommandList>
                                   <CommandEmpty>No item found.</CommandEmpty>
                                   <CommandGroup>
                                     {itemNames.filter(name => name.trim()).map((name) => (
                                       <CommandItem
                                         key={name}
                                         value={name}
                                         onSelect={() => {
                                           handleItemChange(index, "itemName", name);
                                           setOpenPopovers(prev => ({ ...prev, [index]: false }));
                                         }}
                                       >
                                         <Check
                                           className={cn(
                                             "mr-2 h-4 w-4",
                                             item.itemName === name ? "opacity-100" : "opacity-0"
                                           )}
                                         />
                                         <span className="text-sm">{name}</span>
                                       </CommandItem>
                                     ))}
                                   </CommandGroup>
                                 </CommandList>
                               </Command>
                             </PopoverContent>
                           </Popover>
                           
                           {/* Custom Item Name Input for Miscellaneous */}
                           {item.itemName === 'Miscellaneous' && (
                             <Input
                               value={item.customItemName || ''}
                               onChange={(e) => handleItemChange(index, "customItemName", e.target.value)}
                               className="h-10 mt-2"
                               placeholder="Enter custom item name"
                             />
                           )}
                         </div>
                         
                         {/* Quantity */}
                         <div className="space-y-1">
                           <Input
                             type="number"
                             value={item.quantity}
                             onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                             className="h-10 text-center"
                             placeholder="0"
                             min="0"
                           />
                         </div>
                        
                         {/* A/U */}
                         <div className="space-y-1">
                           <Select value={item.au} onValueChange={(value) => handleItemChange(index, "au", value)}>
                             <SelectTrigger className="h-10">
                               <SelectValue placeholder="Unit" />
                             </SelectTrigger>
                             <SelectContent className="modern-card border-none">
                               {units.map((unit) => (
                                 <SelectItem key={unit} value={unit} className="focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 hover:text-foreground">
                                   {unit}
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                         </div>
                        
                        {/* Current Stock */}
                        <div className="text-sm font-medium bg-muted/50 px-3 py-2 rounded text-center">
                          {item.currentStock || 0}
                        </div>
                        
                        {/* Stock After */}
                        <div className="text-sm font-medium bg-primary/10 px-3 py-2 rounded text-center">
                          {item.stockAfterPurchase || 0}
                        </div>
                        
                        {/* Remarks */}
                        <div className="space-y-1">
                          <Input
                            value={item.remarks}
                            onChange={(e) => handleItemChange(index, "remarks", e.target.value)}
                            className="h-10"
                            placeholder="Optional"
                          />
                        </div>
                        
                        {/* Action */}
                        <div className="flex justify-center">
                          {items.length > 1 && (
                            <Button 
                              type="button" 
                              onClick={() => removeItem(index)}
                              variant="outline" 
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {items.map((item, index) => (
                  <div key={index} className="bg-background border rounded-lg p-4 space-y-4">
                    <div className="flex items-center justify-between mb-3">
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

                    {/* Mobile Form Fields */}
                    <div className="space-y-4">
                       {/* Item Name */}
                       <div className="space-y-2">
                         <Label className="text-sm font-semibold text-foreground">Item Name</Label>
                         <Popover open={openPopovers[`mobile-${index}`]} onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, [`mobile-${index}`]: open }))}>
                           <PopoverTrigger asChild>
                             <Button
                               variant="outline"
                               role="combobox"
                               aria-expanded={openPopovers[`mobile-${index}`]}
                               className="h-12 w-full justify-between"
                             >
                               {item.itemName === 'Miscellaneous' && item.customItemName 
                                 ? `Miscellaneous: ${item.customItemName}`
                                 : item.itemName || "Select item..."}
                               <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                             </Button>
                           </PopoverTrigger>
                           <PopoverContent className="w-[300px] p-0">
                             <Command>
                               <CommandInput placeholder="Search items..." />
                               <CommandList>
                                 <CommandEmpty>No item found.</CommandEmpty>
                                 <CommandGroup>
                                   {itemNames.map((name) => (
                                     <CommandItem
                                       key={name}
                                       value={name}
                                       onSelect={() => {
                                         handleItemChange(index, "itemName", name);
                                         setOpenPopovers(prev => ({ ...prev, [`mobile-${index}`]: false }));
                                       }}
                                     >
                                       <Check
                                         className={cn(
                                           "mr-2 h-4 w-4",
                                           item.itemName === name ? "opacity-100" : "opacity-0"
                                         )}
                                       />
                                       {name}
                                     </CommandItem>
                                   ))}
                                 </CommandGroup>
                               </CommandList>
                             </Command>
                           </PopoverContent>
                         </Popover>
                         
                         {/* Custom Item Name Input for Miscellaneous */}
                         {item.itemName === 'Miscellaneous' && (
                           <Input
                             value={item.customItemName || ''}
                             onChange={(e) => handleItemChange(index, "customItemName", e.target.value)}
                             className="h-12 mt-2"
                             placeholder="Enter custom item name"
                           />
                         )}
                       </div>

                      {/* Quantity and A/U Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">Quantity</Label>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            className="h-12"
                            placeholder="0"
                            min="0"
                          />
                        </div>
                         <div className="space-y-2">
                           <Label className="text-sm font-semibold text-foreground">A/U</Label>
                           <Select value={item.au} onValueChange={(value) => handleItemChange(index, "au", value)}>
                             <SelectTrigger className="h-12">
                               <SelectValue placeholder="Unit" />
                             </SelectTrigger>
                             <SelectContent className="modern-card border-none">
                               {units.map((unit) => (
                                 <SelectItem key={unit} value={unit} className="focus:bg-primary/10 focus:text-foreground hover:bg-primary/10 hover:text-foreground">
                                   {unit}
                                 </SelectItem>
                               ))}
                             </SelectContent>
                           </Select>
                         </div>
                      </div>

                      {/* Stock Information Row */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">Current Stock</Label>
                          <div className="h-12 flex items-center justify-center bg-muted/50 rounded border text-sm font-medium">
                            {item.currentStock || 0}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-semibold text-foreground">Stock After</Label>
                          <div className="h-12 flex items-center justify-center bg-primary/10 rounded border text-sm font-medium">
                            {item.stockAfterPurchase || 0}
                          </div>
                        </div>
                      </div>

                      {/* Remarks */}
                      <div className="space-y-2">
                        <Label className="text-sm font-semibold text-foreground">Remarks</Label>
                        <Input
                          value={item.remarks}
                          onChange={(e) => handleItemChange(index, "remarks", e.target.value)}
                          className="h-12"
                          placeholder="Optional"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Another Item Button - Positioned after items */}
              <div className="flex justify-center">
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
