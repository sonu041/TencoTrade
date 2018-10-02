/*
 * Stock Data Notification.
 * Developed by: Shuvankar Sarkar
 * GitHub: https://github.com/sonu041/TencoTrade
 * DemoGoogleSheet: https://docs.google.com/spreadsheets/d/1fIfQh18F0CSko1UdPj4WXpfVONHgCbBeFzop_fzkrFE/edit?usp=sharing
 * Date: 01-Aug-2018
 */

function myFunction() {
  var lowerAlertPrice, higherAlertPrice, url, currentPrice, monConData;
  var masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("MasterData");
  var configSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Config");
  var emailid = configSheet.getRange("B1").getValue();
  var vals = masterSheet.getRange("A1:A").getValues();
  var last = vals.filter(String).length;
  var data = masterSheet.getDataRange().getValues();
  for (var i = 1; i < last; i++) {
    lowerAlertPrice = data[i][2];
    higherAlertPrice = data[i][3];
    url = data[i][4];
    monConData = getHTML(url);
    currentPrice = getCurrentPrice(monConData);
    masterSheet.getRange("B"+(i+1)).setValue(currentPrice);
    masterSheet.getRange("F"+(i+1)).setValue(Utilities.formatDate(new Date(), "GMT+5:30", "dd/MM/yyyy hh:mm:ss"));

    //If current price reaches target price then send mail.
    if (currentPrice <= lowerAlertPrice) {
      sendEmail(emailid,"Alert! Price reduced for "+data[i][0], "Price reduced for "+data[i][0]+": " + currentPrice);
    }
    if (currentPrice >= higherAlertPrice) {
      sendEmail(emailid,"Alert! Price increased for "+data[i][0], "Price increased for "+data[i][0]+": " + currentPrice);
    }
    //Todo: If current price is 52 weeks lower then send mail.

    //Pause for some moment to avoid DOS in Moneycontrol.
    Utilities.sleep(1000);
  }
}

function getCurrentPrice(content) {
    var fromText = 'id="Nse_Prc_tick"><strong>';
    var toText = '</strong>';

    //Thanks to https://www.kutil.org/2016/01/easy-data-scrapping-with-google-apps.html for the Parser library.
    var scraped = Parser
                    .data(content)
                    .from(fromText)
                    .to(toText)
                    .build();
    //Logger.log(scraped);
    return scraped;
}

function getHTML(url) {
  var content = UrlFetchApp.fetch(url).getContentText();
  return content;
}

function setHTML() {
}

function sendEmail(emailAddress, subject, message) {
    MailApp.sendEmail(emailAddress, subject, message);
}

// TODO: Only send mail in market hours
function isMarketHour() {
}

// TODO: Send Daily Status mail
function sendDailyStatus() {
}
