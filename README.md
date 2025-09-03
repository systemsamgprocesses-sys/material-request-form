# AMG Reality Indent/Issue Request Form

A modern, responsive React-based form for submitting indent and issue requests with real-time stock tracking and Google Sheets integration.

## Features

### 🚀 **Core Functionality**
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Real-time Stock Tracking**: Displays current stock and calculated stock after purchase
- **Auto-generated Indent Numbers**: Automatically generates sequential indent numbers (I-001, I-002, etc.)
- **Multi-item Support**: Add multiple items in a single request
- **Google Sheets Integration**: Direct submission to Google Sheets for data storage and management

### 📱 **Responsive Interface**
- **Desktop View**: Table layout with all columns visible
- **Mobile View**: Card-based layout optimized for small screens
- **Touch-friendly**: Large buttons and inputs for mobile users

### 📊 **Data Management**
- **Master Data Integration**: Fetches item names and stock data from Google Sheets
- **Stock Calculation**: Automatically calculates stock after purchase (Current Stock + Requested Quantity)
- **One-time Information**: Repeats general information across all item rows in submissions
- **Validation**: Ensures required fields are filled before submission

## Form Structure

### General Information (One-time Entry)
- **Indent Number**: Auto-generated (format: I-XXX)
- **Store Name**: Dropdown selection from predefined stores
- **Requested By**: Person making the request
- **By Whom Orders/Instruction**: Authority source
- **Project Name**: Optional project association
- **Store Required by Date**: Target delivery date
- **Nature of Demand**: Type/category of request
- **Purpose**: Detailed description of request purpose

### Items Required (Multi-entry)
- **Item Name**: Searchable dropdown from master data
- **Quantity**: Number of items requested
- **A/U**: Unit of measurement
- **Current Stock**: Auto-populated from master data
- **Stock After**: Auto-calculated (Current + Quantity)
- **Remarks**: Optional additional notes

## Google Sheets Setup

### Required Sheets

#### 1. **Master Sheet**
Contains master data for the form:
- **Column A**: Item Names
- **Column B**: Current Stock Quantities

#### 2. **Issue Requests Sheet**
Stores form submissions with these columns:
- **Column A**: Timestamp
- **Column B**: Indent Number
- **Column C**: Store Name
- **Column D**: Requested By
- **Column E**: By Whom Orders/Instruction
- **Column F**: Project Name
- **Column G**: Store Required by Date
- **Column H**: Nature of Demand
- **Column I**: Purpose
- **Column J**: Item Name
- **Column K**: Quantity
- **Column L**: A/U
- **Column M**: Current Stock
- **Column N**: Stock After Purchase
- **Column O**: Remarks

### Google Apps Script Setup

1. **Create a new Google Apps Script project**
2. **Replace the default code** with the provided `apps-script.js` code
3. **Deploy as web app** with the following settings:
   - Execute as: Me
   - Who has access: Anyone
4. **Copy the deployment URL** and update it in the React form

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Shadcn/ui component library
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Backend**: Google Apps Script
- **Data Storage**: Google Sheets

## Installation & Setup

### Prerequisites
- Node.js (version 16 or higher)
- Google account for Sheets integration

### Frontend Setup
```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Google Sheets Configuration

1. **Create a new Google Spreadsheet**
2. **Create two sheets**: "Master" and "Issue Requests"
3. **Set up the Master sheet**:
   - Column A: Add item names
   - Column B: Add current stock quantities
4. **Set up column headers** in Issue Requests sheet as specified above
5. **Create and deploy the Google Apps Script**
6. **Update the script URL** in the React form

## Usage

### Adding Items to Master Data
1. Open your Google Spreadsheet
2. Go to the "Master" sheet
3. Add new items in Column A
4. Add corresponding stock quantities in Column B
5. The form will automatically fetch this data

### Submitting Requests
1. **Fill General Information** (required fields marked with *)
2. **Add Items**:
   - Select item from dropdown
   - Enter quantity (stock info updates automatically)
   - Add A/U and remarks as needed
   - Use "Add Another Item" for multiple items
3. **Submit the form**
4. **Data is saved** to the Issue Requests sheet

### Viewing Submissions
- All submissions are stored in the "Issue Requests" sheet
- Each item creates a separate row
- General information is repeated for each item row
- Filter by indent number to group related items

## File Structure

```
src/
├── components/
│   ├── IssueForm.tsx          # Main form component
│   └── ui/                    # Shadcn UI components
├── assets/
│   └── amg-logo-new.png       # Company logo
├── hooks/
│   └── use-toast.ts           # Toast notification hook
├── lib/
│   └── utils.ts               # Utility functions
├── pages/
│   ├── Index.tsx              # Main page
│   └── NotFound.tsx           # 404 page
└── index.css                  # Global styles and design system
```

## Customization

### Adding New Stores
Update the `stores` array in `IssueForm.tsx`:
```typescript
const stores = [
  "Palm Walk",
  "Palm Marina", 
  "Palm City",
  "Garden",
  "Maurya Green",
  "ONE AMG",
  "Your New Store" // Add here
];
```

### Modifying Form Fields
1. **Update TypeScript interfaces** in `IssueForm.tsx`
2. **Add form inputs** in the JSX
3. **Update Google Apps Script** to handle new fields
4. **Add corresponding columns** in Google Sheets

### Styling Changes
- **Colors**: Update CSS variables in `index.css`
- **Components**: Modify Tailwind classes in components
- **Layout**: Adjust grid layouts for responsive design

## API Endpoints

The Google Apps Script provides these endpoints:

### GET Requests
- `?action=getMasterData` - Returns item names and stock data
- `?action=getNextIndentNumber` - Returns next sequential indent number
- Default (no action) - Returns item names only (backward compatibility)

### POST Requests
- Form submission data as JSON in `submissionData` parameter

## Troubleshooting

### Common Issues

1. **Items not loading**:
   - Check Google Apps Script deployment
   - Verify sheet names ("Master" and "Issue Requests")
   - Check CORS settings in Apps Script

2. **Stock not updating**:
   - Ensure Column B in Master sheet contains numeric values
   - Check item name spelling matches exactly

3. **Form not submitting**:
   - Verify required fields are filled
   - Check browser console for errors
   - Ensure Google Apps Script URL is correct

4. **Mobile display issues**:
   - Clear browser cache
   - Check responsive breakpoints in CSS

### Debug Mode
Enable debug mode by checking browser console for detailed logs about:
- Master data loading
- Stock calculations
- Form submission process

---

## Project Development Info

**URL**: https://lovable.dev/projects/8f428e27-5915-472a-9096-86d91c291bcb

### How to edit this code

**Use Lovable**: Visit the [Lovable Project](https://lovable.dev/projects/8f428e27-5915-472a-9096-86d91c291bcb) and start prompting.

**Use your preferred IDE**: Clone this repo and push changes. The only requirement is having Node.js & npm installed.

### Deployment

Simply open [Lovable](https://lovable.dev/projects/8f428e27-5915-472a-9096-86d91c291bcb) and click on Share → Publish.

### Custom Domain

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

---

**Last Updated**: December 2024  
**Version**: 2.0.0  
**Compatibility**: React 18+, Modern browsers, Mobile devices
