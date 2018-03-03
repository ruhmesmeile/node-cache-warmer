const Crawler = require("crawler");
const Seenreq = require('seenreq');

const PAGE = process.env.CRAWL_PAGE;
const seen = new Seenreq();

var crawledTotal = 0;

var handleCrawlResult = function handleCrawlResult (error, res, done) {
  var urls = [];

  if (error) {
    console.log(error);
  } else {
    var $ = res.$;
    var relLinkUrl;
    $('.nav-main a').each(function (index, link) {
      relLinkUrl = $(link).attr('href').replace(PAGE,"")
      if ((relLinkUrl.indexOf("http") < 0) && !seen.exists(PAGE+relLinkUrl)) {
        urls.push(PAGE+relLinkUrl);
      }
    });

    console.log(`[RM Cache Warmer] Scraped: ${res.options.uri.replace(PAGE,"")} - ${$("title").text()} (${urls.length} urls queued, queue size ${c.queueSize}, total crawled ${crawledTotal++})`);
  }

  c.queue(urls);
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
