# FAQ

### I remixed this site... how do I log in?

There's a peculiarity around Oauth logins, since the providers expect the site to have a different domain than what your remix has.  To log in to your new remixed site:

1. In a new browser tab, visit [Glitch.com](https://glitch.com) and log in if you aren't already.

2. Open up your browser's [Developer Tools](https://webmasters.stackexchange.com/a/77337/2628) and run this command in the console: `window.localStorage.cachedUser`.  Highlight and copy the big JSON blob that it prints out.
  
3. Now, back in your remixed community site, click on the 'show' button to view your running app.  Open the developer tools again and this time type in
  
  ```
  window.localStorage.cachedUser = `[Paste Here]`
  ```
  
replacing the `[Paste Here]` with your copied JSON blob from the other tab. Hit enter, refresh the page, and you're logged in! 

Depending on what browser you're using, there might be a finnicky spacing issue that's preventing the JSON from coming through cleanly.  If that's the case, it can be helpful to copy just the inner JSON object, and then load the object into the page using 
```
window.localStorage.cachedUser = JSON.stringify(`[Paste JSON Here]`)
```

### What is Sentry and how do I get my real line numbers back?

We use Sentry to capture our exceptions and log messages to help us spot bugs in the wild.

Because it's a wrapper, you might lose access to the line numbers you were looking for in your js console. Sentry [may one day fix this](https://github.com/getsentry/sentry-javascript/issues/1003), but in the meantime you can fix it with [BlackBoxing](https://developer.chrome.com/devtools/docs/blackboxing)

In Chrome, open up the developer tools, go to the Sources tab, click the kebab menu in the corner, and click Settings:

> ![](https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Fdevtools-settings.PNG?1534365344027)

Now select 'BlackBoxing' on the left, and blackbox `@sentry`:

> ![](https://cdn.glitch.com/02863ac1-a499-4a41-ac9c-41792950000f%2Fblackbox-raven-js.PNG?1534365343672)

Now, in your devtools, it'll be just like Raven.js doesn't exist -- line numbers and exceptions will flow straight through, but it'll stay functional behind the scenes.


### What are dev toggles?

We use them to hide features that we're still working on. The code lives in `dev-toggles.jsx`. Visit remix.glitch.me/secret to enable a feature locally.


### Is any configuration required to get my remix running?

Nope! Though you can set your remix to run in production mode by setting `NODE_ENV=production` in the `.env` file. Doing so will improve performance a bit, but webpack will take a lot longer.

### How does caching work?


### How do I add a question to the FAQ?

I'd suggest remixing the site and adding the question.  Feel free to take a stab at the answer, if you like.  See CONTRIBUTING.md for how to contribute :-)