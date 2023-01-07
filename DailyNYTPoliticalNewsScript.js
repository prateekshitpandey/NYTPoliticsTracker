function nytAPI() {
  /*
  This function fetches NYT Politics News articles from a day before and stores it in a Google spreadsheet
  */

  // Fetching yesterday's date
  var dateyester = new Date();
  dateyester.setDate(dateyester.getDate() - 1);
  var dateyester = Utilities.formatDate(dateyester, "GMT", "yyyyMMdd");
  //var dateweekago = datetoday - 7
  
  // Adding yesterday's date to NYT API query text
  var apiKey = "YOUR API KEY HERE"
  var queryText = "https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=news_desk:%22Politics%22%20AND%20document_type:%22article%22&begin_date=" + dateyester + "&end_date=" + dateyester + "&api-key=" + apiKey

  // Passing query text to NYT API
  var response = UrlFetchApp.fetch(queryText);

  // Extracting data from API response
  var fact = response.getContentText(); //extracting API response as plain text
  var data = JSON.parse(fact); //parsing plain text as JSON object
  var response = data['response']['docs']; //fetching list of articles from JSON object

  // Fetching Google spreadsheet to fill
  var Allsheets = SpreadsheetApp.openById('132e3cDNnMuMLQA0d3xCn0EWydMUH3s5nuhpUsTQChfQ');
  var mainsheet = Allsheets.getSheets()[0];

  for (r in response) {
    response_i = response[r];
    var title = response_i['headline']['main'];
    var lead_para = response_i['lead_paragraph'];
    var snippet = response_i['snippet'];
    var url = response_i['web_url'];
    var pubdate = response_i['pub_date']

    if (!lead_para.includes('newsletter') & !snippet.includes('We ') & !snippet.includes('we ')) {
      lastRow = mainsheet.getLastRow();
      mainsheet.getRange(lastRow + 1,2).setValue([title]);
      mainsheet.getRange(lastRow + 1,3).setValue([lead_para]);
      mainsheet.getRange(lastRow + 1,4).setValue([snippet]);
      mainsheet.getRange(lastRow + 1,5).setValue([pubdate]);
      mainsheet.getRange(lastRow + 1,6).setValue([url]);

      var idname = randomStr_(5);
      while(idname in mainsheet.getRange(1,1, lastRow)) {
        var idname = randomStr_(5);
      }
      mainsheet.getRange(lastRow + 1,1).setValue([idname]);
    }
  }  
}

function randomStr_(m) {
  var m = m || 15; s = '', r = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i=0; i < m; i++) { s += r.charAt(Math.floor(Math.random()*r.length)); }
  return s;
}