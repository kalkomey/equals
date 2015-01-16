# equals
Compare two web pages for equality. If not equal, a diff image is created.

##Install

Install node-canvas and all it's dependencies i.e [Cairo](http://cairographics.org)

````bash 
wget https://raw.githubusercontent.com/LearnBoost/node-canvas/master/install -O - | sh
````

Install node packages

````bash
npm install
````


## Usage

Setup your config file (options explained in detail, in the next section)

```js
  protocol: 'https',
  rootUrls: ['qa1.boat-ed.com/', 'www.boat-ed.com/'],
  pages: ['texas/'], 
  viewport: {
    width: 1200
  },
  screenshotFolder: 'screenshots',
  logfile: 'log'
````

Then run the app

```bash
node app.js
````


## Options

### rootUrls
Specify two root urls without the protocol

### pages
Pages that will be appended to the root url and compared. Trailing slash on the page is required if that page redirects to another page e.g to the https version of the page. PhantomJS does not handle redirects very well.

### viewport(width, height)
Specify the height and the width of the viewport.


### screenshotFolder
Equals will take screenshots and store them in the folder you specify within the current directory.

### logfile
All errors are logged to this file within the current directory.


