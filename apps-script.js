// Google Apps Script for AMG Reality Indent/Issue Request Form
// This script handles form submissions and manages master data

const SHEET_ID = 'YOUR_SHEET_ID_HERE'; // Replace with your actual Google Sheets ID

function doPost(e) {
  try {
    console.log('POST request received');
    
    const submissionData = JSON.parse(e.parameter.submissionData);
    console.log('Submission data:', submissionData);
    
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('Issue Requests');
    
    // Create sheet if it doesn't exist
    if (!sheet) {
      sheet = spreadsheet.insertSheet('Issue Requests');
      
      // Add headers
      const headers = [
        'Timestamp',
        'Indent Number',
        'Store Name',
        'Requested By',
        'By Whom Orders',
        'Purpose',
        'Gate Pass',
        'Nature of Demand',
        'Project Name',
        'Store Required By Date',
        'Item Name',
        'Quantity',
        'A/U',
        'Remarks',
        'Current Stock',
        'Stock After Purchase'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285f4');
      headerRange.setFontColor('#ffffff');
    }
    
    // Add each item as a separate row
    submissionData.forEach(item => {
      const rowData = [
        item.timestamp,
        item.indentNumber,
        item.storeName,
        item.requestedBy,
        item.byWhomOrders,
        item.purpose,
        item.gatePass || '',
        item.natureOfDemand,
        item.projectName,
        item.storeRequiredByDate,
        item.itemName,
        item.quantity,
        item.au,
        item.remarks,
        item.currentStock || 0,
        item.stockAfterPurchase || 0
      ];
      
      sheet.appendRow(rowData);
    });
    
    // Auto-resize columns for better visibility
    sheet.autoResizeColumns(1, sheet.getLastColumn());
    
    console.log('Data submitted successfully');
    return ContentService.createTextOutput('Success');
    
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput('Error: ' + error.toString());
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action;
    
    if (action === 'getNextIndentNumber') {
      return ContentService.createTextOutput(getNextIndentNumber());
    }
    
    if (action === 'getMasterData') {
      const masterData = getMasterData();
      return ContentService
        .createTextOutput(JSON.stringify(masterData))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Default: return item names for backward compatibility
    const itemNames = getItemNames();
    return ContentService
      .createTextOutput(JSON.stringify(itemNames))
      .setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput('Error: ' + error.toString());
  }
}

function getNextIndentNumber() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = spreadsheet.getSheetByName('Issue Requests');
    
    if (!sheet || sheet.getLastRow() <= 1) {
      return 'I-001';
    }
    
    // Get all indent numbers from column B (Indent Number)
    const indentNumbers = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
    
    let maxNumber = 0;
    indentNumbers.forEach(row => {
      const indentNumber = row[0];
      if (indentNumber && typeof indentNumber === 'string') {
        const match = indentNumber.match(/I-(\d+)/);
        if (match) {
          const number = parseInt(match[1]);
          if (number > maxNumber) {
            maxNumber = number;
          }
        }
      }
    });
    
    const nextNumber = maxNumber + 1;
    return `I-${String(nextNumber).padStart(3, '0')}`;
    
  } catch (error) {
    console.error('Error generating indent number:', error);
    return 'I-001';
  }
}

function getMasterData() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let masterSheet = spreadsheet.getSheetByName('Master');
    
    // Create master sheet if it doesn't exist
    if (!masterSheet) {
      masterSheet = spreadsheet.insertSheet('Master');
      
      // Add sample data with headers
      const sampleData = [
        ['Item Name', 'Current Stock'],
        ['Name\n(B-C-D)', 10],
        ['CATEGORY 1 Item Name 1 6*4 MM', 20],
        ['CATEGORY 1 Item Name 2 90 MM', 30],
        ['CATEGORY 1 Item Name 3 50*32 MM', 40],
        ['PVC Item Name 4 25 MM', 50],
        ['PVC Item Name 5 32 MM', 60],
        ['CATEGORY 3 Item Name 6 90 MM', 70],
        ['CATEGORY 3 Item Name 7 6*4"', 80],
        ['CATEGORY 3 Item Name 8 90 MM', 90],
        ['PVC Item Name 9 50*32 MM', 100],
        ['PVC Item Name 10 25 MM', 110],
        ['PVC Item Name 11 32 MM', 120],
        ['PVC Item Name 12 90 MM', 130],
        ['PVC Item Name 13 6*4"', 140],
        ['CATEGORY 3 Item Name 14 90 MM', 150],
        ['CATEGORY 3 Item Name 15 50*32 MM', 160],
        ['CATEGORY 3 Item Name 16 25 MM', 170],
        ['CATEGORY 3 Item Name 17 32 MM', 180],
        ['CATEGORY 3 Item Name 18 90 MM', 190],
        ['CATEGORY 4 Item Name 19 6*4"', 200],
        ['CATEGORY 4 Item Name 20 90 MM', 210],
        ['CATEGORY 4 Item Name 21 50*32 MM', 220],
        ['CATEGORY 4 Item Name 22 25 MM', 230],
        ['CATEGORY 1 Item Name 23 32 MM', 240],
        ['CATEGORY 1 Item Name 24 90 MM', 250],
        ['CATEGORY 1 SKU NAME 88 MM', 260]
      ];
      
      masterSheet.getRange(1, 1, sampleData.length, 2).setValues(sampleData);
      
      // Format headers
      const headerRange = masterSheet.getRange(1, 1, 1, 2);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#34a853');
      headerRange.setFontColor('#ffffff');
      
      // Auto-resize columns
      masterSheet.autoResizeColumns(1, 2);
      
      // Set column widths for better visibility
      masterSheet.setColumnWidth(1, 300); // Item Name column
      masterSheet.setColumnWidth(2, 120); // Stock column
    }
    
    // Get data from master sheet
    const lastRow = masterSheet.getLastRow();
    if (lastRow <= 1) {
      return { itemNames: [], stockData: {} };
    }
    
    const data = masterSheet.getRange(2, 1, lastRow - 1, 2).getValues();
    
    const itemNames = [];
    const stockData = {};
    
    data.forEach(row => {
      const itemName = row[0];
      const stock = row[1];
      
      if (itemName && itemName.toString().trim()) {
        const cleanItemName = itemName.toString().trim();
        itemNames.push(cleanItemName);
        stockData[cleanItemName] = stock || 0;
      }
    });
    
    console.log('Returning master data with', itemNames.length, 'items');
    
    return {
      itemNames: itemNames,
      stockData: stockData
    };
    
  } catch (error) {
    console.error('Error getting master data:', error);
    return { itemNames: [], stockData: {} };
  }
}

function getItemNames() {
  try {
    const masterData = getMasterData();
    return masterData.itemNames;
  } catch (error) {
    console.error('Error getting item names:', error);
    return [];
  }
}

// Helper function to create sample data for testing
function createSampleMasterData() {
  try {
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    let masterSheet = spreadsheet.getSheetByName('Master');
    
    if (!masterSheet) {
      masterSheet = spreadsheet.insertSheet('Master');
    }
    
    // Clear existing data
    masterSheet.clear();
    
    // Add comprehensive sample data
    const sampleData = [
      ['Item Name', 'Current Stock'],
      ['Name\n(B-C-D)', 10],
      ['CATEGORY 1 Item Name 1 6*4 MM', 20],
      ['CATEGORY 1 Item Name 2 90 MM', 30],
      ['CATEGORY 1 Item Name 3 50*32 MM', 40],
      ['PVC Item Name 4 25 MM', 50],
      ['PVC Item Name 5 32 MM', 60],
      ['CATEGORY 3 Item Name 6 90 MM', 70],
      ['CATEGORY 3 Item Name 7 6*4"', 80],
      ['CATEGORY 3 Item Name 8 90 MM', 90],
      ['PVC Item Name 9 50*32 MM', 100],
      ['PVC Item Name 10 25 MM', 110],
      ['PVC Item Name 11 32 MM', 120],
      ['PVC Item Name 12 90 MM', 130],
      ['PVC Item Name 13 6*4"', 140],
      ['CATEGORY 3 Item Name 14 90 MM', 150],
      ['CATEGORY 3 Item Name 15 50*32 MM', 160],
      ['CATEGORY 3 Item Name 16 25 MM', 170],
      ['CATEGORY 3 Item Name 17 32 MM', 180],
      ['CATEGORY 3 Item Name 18 90 MM', 190],
      ['CATEGORY 4 Item Name 19 6*4"', 200],
      ['CATEGORY 4 Item Name 20 90 MM', 210],
      ['CATEGORY 4 Item Name 21 50*32 MM', 220],
      ['CATEGORY 4 Item Name 22 25 MM', 230],
      ['CATEGORY 1 Item Name 23 32 MM', 240],
      ['CATEGORY 1 Item Name 24 90 MM', 250],
      ['CATEGORY 1 SKU NAME 88 MM', 260]
    ];
    
    masterSheet.getRange(1, 1, sampleData.length, 2).setValues(sampleData);
    
    // Format the sheet
    const headerRange = masterSheet.getRange(1, 1, 1, 2);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#34a853');
    headerRange.setFontColor('#ffffff');
    
    // Set column widths
    masterSheet.setColumnWidth(1, 300); // Item Name column - wider for full names
    masterSheet.setColumnWidth(2, 120); // Stock column
    
    console.log('Sample master data created successfully');
    
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
}

// Test function to verify the setup
function testScript() {
  console.log('Testing script...');
  
  try {
    // Test getNextIndentNumber
    const nextIndent = getNextIndentNumber();
    console.log('Next indent number:', nextIndent);
    
    // Test getMasterData
    const masterData = getMasterData();
    console.log('Master data items count:', masterData.itemNames.length);
    console.log('Sample items:', masterData.itemNames.slice(0, 3));
    
    console.log('Test completed successfully');
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}