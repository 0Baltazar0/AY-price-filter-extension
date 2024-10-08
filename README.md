# web-extension-starter

A simple sample for the basics of web extensions. The capabilities showcased in this project should be applicable to all major browsers (chrome,firefox,safari)

## Installation

`yarn install` or `yarn`

This will install all dependencies.

`yarn build`

This will create a ./dist directory, that will contain an unpacked extension.

You can install that extension on chrome, via chrome://extensions, if you enable "developer mode" (top right)

## Test run/review

This sample showcases 4 different extension functionality:

### Site scripting

In the file ./src/scripts/sample.ts you can see a simple example for injecting an input variable to every website

This works for every website, because the manifest says so:
`"content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["js/sample.js"]
    }
  ],`

If you find the input, add some value, and hit enter, you should be able to see the communication between the service worker, and the script

You can inspect the service worker from the extension manager view.

Site scripting is useful if you want to extract information from specific websites, or you want to implement extra functionality.

It is worth mentioning, that the injected script, and the "window" script are isolated, they can't communicate directly

### service-worker (previously known as background)

Service worker is the main tool to establish consistent functionality, it can help you orchestrate communication between tabs, and centralize some functionality.

Service workers are inactive, which means that they must be event based. You can subscribe to runtime events, storage events, and there is a cron like alert system

You can use fetch api inside the service worker.

### popup

When you click on the extension below the navbar, you open the popup.html

This is a standard html file, with one caveat: it has no minimum size. You must define a fixed minimum size, or it will shrink.

You can see this example uses react to create the popup, you can use most of the tools as you would for a single page app.

### Settings page

If you right click on the extension, and open settings you can see the settings view.

Similarly to the popup, this is created with react, however this document has no size constraints.

## Development

If you fork this repo, you can easily get started with your own extension. You can cherry pick the functionality you need, and extend as needed.

You should be aware, that some functionality requires change to the manifest.json, you can find that in the static folder.

Given the fact, that this extension doesn't cache anything, you shouldn't need to use any versioning for static files, every time you reload the extension the files update

This setup includes Tailwind, React, and Zod as basic tools.

Tailwind is set up per destination.
**THIS IS IMPORTANT, IF YOU USE TAILWIND IN CONTENT SCRIPTS, IT WILL LIKELY BREAK THE WEBPAGE**
If you need tailwind in scripting, create a config file, and use the "prefix" option, so that the class names do not clash with the webpage. You should also consider removing tailwinds "generalization" tools, because they are going to affect the websites you visit.

If you must use every functionality, I would recommend either using a shadowRoot, or only injecting the stylesheet when required, and removing it once it's not needed.

I have selected ESBUILD for a fast, and simple build process. If you feel like you need more functionality, there are vite based starter kits, that might be a better fit.

# Known issues

- For some reason the build-watch:static command fails
- I had to introduce a 10s delay, so that the nodemon does not fail, that might be reduces in the future, once I understand the limitations.
