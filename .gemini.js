module.exports = {
  rootUrl: 'http://100.124.107.167:3000',
  gridUrl: 'http://localhost:4444/wd/hub',
  compositeImage: true,
  windowSize: '1920x1080',

  browsers: {
    chromeMobileVertical: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          mobileEmulation: {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X)'
            + ' AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4',
            deviceMetrics: {
              width: 360,
              height: 640,
              pixelRatio: 1
            }
          }
        }
      }
    },
    chromeMobileHorizontal: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          mobileEmulation: {
            userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 8_0 like Mac OS X)'
            + ' AppleWebKit/600.1.3 (KHTML, like Gecko) Version/8.0 Mobile/12A4345d Safari/600.1.4',
            deviceMetrics: {
              width: 640,
              height: 360,
              pixelRatio: 1
            }
          }
        }
      }
    },
    chromeDesktop: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          mobileEmulation: {
            deviceMetrics: {
              width: 1280,
              height: 1024,
              pixelRatio: 1
            }
          }
        }
      }
    }
  }
};
