// Google Apps Script for AMG Reality Indent/Issue Request Form
// This script handles form submissions and provides data to the React form

function doPost(e) {
  try {
    // Get the "Issue Requests" sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Issue Requests");
    
    // Parse the submission data
    var submissionData = JSON.parse(e.parameter.submissionData);
    
    console.log('Received submission data:', submissionData);
    
    // Process each item in the submission
    submissionData.forEach(function(itemData) {
      var data = [
        new Date(), // Timestamp
        itemData.indentNumber,
        itemData.storeName,
        itemData.requestedBy,
        itemData.byWhomOrders,
        itemData.projectName,
        itemData.storeRequiredByDate,
        itemData.natureOfDemand,
        itemData.purpose,
        itemData.itemName,
        itemData.quantity,
        itemData.au,
        itemData.currentStock,
        itemData.stockAfterPurchase,
        itemData.remarks
      ];
      
      // Append the row to the sheet
      sheet.appendRow(data);
    });
    
    return ContentService.createTextOutput("Success")
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('Error in doPost:', error);
    return ContentService.createTextOutput("Error: " + error.toString())
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

function doGet(e) {
  try {
    var action = e.parameter.action;
    
    switch(action) {
      case 'getMasterData':
        return getMasterData();
      case 'getNextIndentNumber':
        return getNextIndentNumber();
      default:
        // Default behavior - return item names for backward compatibility
        return getItemNames();
    }
  } catch (error) {
    console.error('Error in doGet:', error);
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getMasterData() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master");
    
    // Get item names from column A (starting from row 2)
    var itemNamesRange = sheet.getRange("A2:A");
    var itemNamesValues = itemNamesRange.getValues().filter(function(row) {
      return row[0] && row[0].toString().trim() !== '';
    });
    var itemNames = itemNamesValues.map(function(row) {
      return row[0].toString().trim();
    });
    
    // Get stock data from column B (starting from row 2)
    var stockRange = sheet.getRange("B2:B" + (itemNamesValues.length + 1));
    var stockValues = stockRange.getValues();
    
    // Create stock data object
    var stockData = {};
    itemNames.forEach(function(itemName, index) {
      var stockValue = stockValues[index] ? stockValues[index][0] : 0;
      stockData[itemName] = typeof stockValue === 'number' ? stockValue : parseInt(stockValue) || 0;
    });
    
    var result = {
      itemNames: itemNames,
      stockData: stockData
    };
    
    console.log('Returning master data:', result);
    
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in getMasterData:', error);
    return ContentService.createTextOutput(JSON.stringify({
      itemNames: [],
      stockData: {},
      error: error.toString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
  }
}

function getItemNames() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master");
    var values = sheet.getRange("A2:A").getValues().filter(function(row) {
      return row[0] && row[0].toString().trim() !== '';
    });
    var itemNames = values.map(function(row) {
      return row[0].toString().trim();
    });
    
    return ContentService.createTextOutput(JSON.stringify(itemNames))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error in getItemNames:', error);
    return ContentService.createTextOutput(JSON.stringify([]))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getNextIndentNumber() {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Issue Requests");
    
    // Get all indent numbers from column B (starting from row 2)
    var indentRange = sheet.getRange("B2:B");
    var indentValues = indentRange.getValues().filter(function(row) {
      return row[0] && row[0].toString().trim() !== '';
    });
    
    if (indentValues.length === 0) {
      // No previous submissions, start with I-001
      return ContentService.createTextOutput("I-001")
        .setMimeType(ContentService.MimeType.TEXT);
    }
    
    // Find the highest number
    var maxNumber = 0;
    indentValues.forEach(function(row) {
      var indentNumber = row[0].toString().trim();
      // Extract number from format I-XXX
      var match = indentNumber.match(/I-(\d+)/);
      if (match) {
        var number = parseInt(match[1]);
        if (number > maxNumber) {
          maxNumber = number;
        }
      }
    });
    
    // Generate next number
    var nextNumber = maxNumber + 1;
    var nextIndentNumber = "I-" + nextNumber.toString().padStart(3, '0');
    
    console.log('Generated next indent number:', nextIndentNumber);
    
    return ContentService.createTextOutput(nextIndentNumber)
      .setMimeType(ContentService.MimeType.TEXT);
      
  } catch (error) {
    console.error('Error in getNextIndentNumber:', error);
    return ContentService.createTextOutput("I-001")
      .setMimeType(ContentService.MimeType.TEXT);
  }
}

// Test function to verify the setup
function testSetup() {
  console.log('Testing Apps Script setup...');
  
  try {
    // Test getMasterData
    var masterData = getMasterData();
    console.log('Master data test:', masterData.getContent());
    
    // Test getNextIndentNumber
    var nextIndent = getNextIndentNumber();
    console.log('Next indent number test:', nextIndent.getContent());
    
    console.log('Setup test completed successfully!');
    
  } catch (error) {
    console.error('Setup test failed:', error);
  }
}