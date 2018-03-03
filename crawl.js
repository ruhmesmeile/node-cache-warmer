const Crawler = require("crawler");
const Seenreq = require('seenreq');

const PAGE = process.env.CRAWL_PAGE;
const LINKSELECTOR = process.env.CRAWL_LINKSELECTOR;
const seen = new Seenreq();

var crawledTotal = 0;

var handleCrawlResult = function handleCrawlResult (error, res, done) {
  var urls = [];

  if (error) {
    console.log(error);
  } else {
    var $ = res.$;
    var linkUrl, relLinkUrl;

    if (typeof $ === "function") {
      $(LINKSELECTOR).each(function (index, link) {
        linkUrl = $(link).attr('href');
        if (linkUrl
          && linkUrl.length
          && (linkUrl.indexOf("http") < 0 || linkUrl.indexOf(PAGE) > -1)
          && linkUrl.indexOf("javascript:") < 0
          && linkUrl.indexOf("mailto:") < 0
          && linkUrl.indexOf("fileadmin") < 0) {
          relLinkUrl = linkUrl.replace(PAGE,"")
          if (!seen.exists(PAGE+relLinkUrl)) {
            urls.push(PAGE+relLinkUrl);
          }
        }
      });
    }

    console.log(`[RM Cache Warmer] Scraped: ${res.options.uri.replace(PAGE,"")} - ${$("title").text()} (${urls.length} urls queued, queue size ${c.queueSize}, total crawled ${crawledTotal++})`);
  }

  if (urls.length) c.queue(urls);
  done();
};

const options = {
  auth: {
    user: process.env.CRAWL_USER,
    pass: process.env.CRAWL_PASSWORD
  },
  maxConnections : 10,
  rateLimit: 300,
  callback : handleCrawlResult
};

console.log(`[RM Cache Warmer] Scraping: ${PAGE}`);
const c = new Crawler(options);
c.queue(PAGE);
