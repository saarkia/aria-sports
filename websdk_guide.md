# ![Braze Logo](https://www.braze.com/docs/assets/Braze_Primary_Icon_BLACK.svg?919c4e99e8ae11eafc3470e63b4fedce){: style="float:right;width:120px;border:0;" class="noimgborder"}Integrate the Braze SDK

> Learn how to integrate the Braze SDK into your mobile app. Each SDK is hosted in its own public GitHub repository, which includes fully-buildable sample apps you can use to test Braze features or implement alongside your own applications. To learn more, see [References, Repositories, and Sample Apps](https://www.braze.com/docs/developer_guide/references/). For more general information about the SDK, see [Getting started: Integration overview](https://www.braze.com/docs/developer_guide/getting_started/integration_overview/).





## About the Web Braze SDK

The Web Braze SDK lets you collect analytics and display rich in-app messages, push, and Content Card messages to your web users. For more information, see [Braze JavaScript reference documentation](https://js.appboycdn.com/web-sdk/latest/doc/modules/braze.html).

**Note:**


This guide uses code samples from the Braze Web SDK 4.0.0+. To upgrade to the latest Web SDK version, see [SDK Upgrade Guide](https://github.com/braze-inc/braze-web-sdk/blob/master/UPGRADE_GUIDE.md).




## Integrate the Web SDK

You can integrate the Web Braze SDK using the following methods. For additional options, see [other integration methods](#web_other-integration-methods).

- **Code-based integration:** Integrate the Web Braze SDK directly in your codebase using your preferred package manager or the Braze CDN. This gives you full control over how the SDK is loaded and configured.
- **Google Tag Manager:** A no-code solution that let's you integrate the Web Braze SDK without modifying your site’s code. For more information, see [Google Tag Manager with the Braze SDK](https://www.braze.com/docs/developer_guide/sdk_integration/google_tag_manager/).

**Important:**


We recommend using the [NPM integration method](https://www.braze.com/docs/developer_guide/sdk_integration/?subtab=package%20manager&sdktab=web). Benefits include storing SDK libraries locally on your website, providing immunity from ad-blocker extensions, and contributing to faster load times as part of bundler support.





### Step 1: Install the Braze library

You can install the Braze library using one of the following methods. However, if your website uses a `Content-Security-Policy`, review the [Content Security Policy](https://www.braze.com/docs/developer_guide/platforms/web/content_security_policy/) before continuing.

**Important:**


While most ad blockers do not block the Braze Web SDK, some more-restrictive ad blockers are known to cause issues.





If your site uses NPM or Yarn package managers, you can add the [Braze NPM package](https://www.npmjs.com/package/@braze/web-sdk) as a dependency.

Typescript definitions are now included as of v3.0.0. For notes on upgrading from 2.x to 3.x, see our [changelog](https://github.com/braze-inc/braze-web-sdk/blob/master/UPGRADE_GUIDE.md).

```bash
npm install --save @braze/web-sdk
# or, using yarn:
# yarn add @braze/web-sdk
```

Once installed, you can `import` or `require` the library in the typical fashion:

```typescript
import * as braze from "@braze/web-sdk";
// or, using `require`
const braze = require("@braze/web-sdk");
```



Add the Braze Web SDK directly to your HTML by referencing our CDN-hosted script, which loads the library asynchronously.

<script src="/docs/assets/js/embed.js?target=https%3A%2F%2Fgithub.com%2Fbraze-inc%2Fbraze-web-sdk%2Fblob%2Fmaster%2Fsnippets%2Floading-snippet.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>



### Step 2: Initialize the SDK

After the Braze Web SDK is added to your website, initialize the library with the API key and [SDK endpoint URL](https://www.braze.com/docs/user_guide/administrative/access_braze/sdk_endpoints) found in **Settings** > **App Settings** within your Braze dashboard. For a complete list of options for `braze.initialize()`, along with our other JavaScript methods, see [Braze JavaScript documentation](https://js.appboycdn.com/web-sdk/latest/doc/modules/braze.html#initialize).

```javascript
// initialize the SDK
braze.initialize('YOUR-API-KEY-HERE', {
    baseUrl: "YOUR-SDK-ENDPOINT-HERE",
    enableLogging: false, // set to `true` for debugging
    allowUserSuppliedJavascript: false, // set to `true` to support custom HTML messages
});

// optionally show all in-app messages without custom handling
braze.automaticallyShowInAppMessages();

// if you use Content Cards
braze.subscribeToContentCardsUpdates(function(cards){
    // cards have been updated
});

// optionally set the current user's external ID before starting a new session
// you can also call `changeUser` later in the session after the user logs in
if (isLoggedIn){
    braze.changeUser(userIdentifier);
}

// `openSession` should be called last - after `changeUser` and `automaticallyShowInAppMessages`
braze.openSession();
```

**Important:**


Anonymous users on mobile or web devices may be counted towards your [MAU](https://www.braze.com/docs/user_guide/data_and_analytics/reporting/understanding_your_app_usage_data/#monthly-active-users). As a result, you may want to conditionally load or initialize the SDK to exclude these users from your MAU count.





### Prerequisites

Before you can use this integration method, you'll need to [create an account and container for Google Tag Manager](https://support.google.com/tagmanager/answer/14842164).

### Step 1: Open the tag template gallery

In [Google Tag Manager](https://tagmanager.google.com/), choose your workspace, then select **Templates**. In the **Tag Template** pane, select **Search Gallery**.

![The templates page for an example workspace in Google Tag Manager.](https://www.braze.com/docs/assets/img/web-gtm/search_tag_template_gallery.png?3f889b02db28eee130a2e6afd58a27f4){: style="max-width:95%;"}

### Step 2: Add the initialization tag template

In the template gallery, search for `braze-inc`, then select **Braze Initialization Tag**.

![The template gallery showing the various 'braze-inc' templates.](https://www.braze.com/docs/assets/img/web-gtm/template_gallery_results.png?166c46fcb5f46eeff8bd50727b6bf3ed){: style="max-width:80%;"}

Select **Add to workspace** > **Add**.

![The 'Braze Initialization Tag' page in Google Tag Manager.](https://www.braze.com/docs/assets/img/web-gtm/add_to_workspace.png?426a14d8047898ccb343ac4476d38e3b){: style="max-width:70%;"}

### Step 3: Configure the tag

From the **Templates** section, select your newly added template.

![The "Templates" page in Google Tag Manager showing the Braze Initialization Tag template.](https://www.braze.com/docs/assets/img/web-gtm/select_tag_template.png?54a3dd6d14a80b1b1f45d57a67134b24){: style="max-width:95%;"}

Select the pencil icon to open the **Tag Configuration** dropdown.

![The Tag Configuration tile with the 'pencil' icon shown.](https://www.braze.com/docs/assets/img/web-gtm/gtm-initialization-tag.png?18e7bc10a22d55f5c681ee7a7266c767)

Enter the minimum required information:

| Field         | Description |
| ------------- | ----------- |
| **API Key**   | Your [Braze API Key](https://www.braze.com/docs/api/basics/#about-rest-api-keys), found in the Braze dashboard under **Settings** > **App Settings**. |
| **API Endpoint** | Your REST endpoint URL. Your endpoint will depend on the Braze URL for [your instance](https://www.braze.com/docs/api/basics/#endpoints). |
| **SDK Version**  | The most recent `MAJOR.MINOR` version of the Web Braze SDK listed in the [changelog](https://www.braze.com/docs/developer_guide/changelogs/?sdktab=web). For example, if the latest version is `4.1.2`, enter `4.1`. For more information, see [About SDK version management](https://www.braze.com/docs/developer_guide/sdk_integration/version_management/). |
{: .reset-td-br-1 .reset-td-br-2 role="presentation"}

For additional initialization settings, select **Braze Initialization Options** and choose any options you need.

![The list of Braze Initialization Options in under 'Tag Configuration'.](https://www.braze.com/docs/assets/img/web-gtm/braze_initialization_options.png?7081bcb24b9eda18d19d4b8634dd59e8){: style="max-width:65%;"}

### Step 4: Set to Trigger on *all pages*

The initialization tag should be run on all pages of your site. This allows you to use Braze SDK methods and record web push analytics.

### Step 5: Verify your integration

You can verify your integration using either of the following options:

- **Option 1:** Using Google Tag Manager's [debugging tool](https://support.google.com/tagmanager/answer/6107056?hl=en), you can check if the Braze Initialization Tag is triggering correctly on your configured pages or events.
- **Option 2:** Check for any network requests made to Braze from your web page. Additionally, the global `window.braze` library should now be defined.




## Optional configurations

### Logging

To quickly enable logging, you can add `?brazeLogging=true` as a parameter to your website URL. Alternatively, you can enable [basic](#web_basic-logging) or [custom](#web_custom-logging) logging.

#### Basic logging



Use `enableLogging` to log basic debugging messages to the JavaScript console before the SDK is initialized.

```javascript
enableLogging: true
```

Your method should be similar to the following:

```javascript
braze.initialize('API-KEY', {
    baseUrl: 'API-ENDPOINT',
    enableLogging: true
});
braze.openSession();
```



Use `braze.toggleLogging()` to log basic debugging messages to the JavaScript console after the SDK is initialized. Your method should be similar to the following:

```javascript
braze.initialize('API-KEY', {
    baseUrl: 'API-ENDPOINT',
});
braze.openSession();
...
braze.toggleLogging();
```



**Important:**


Basic logs are visible to all users, so consider disabling, or switch to [`setLogger`](#web_custom-logging), before releasing your code to production.



#### Custom logging

Use `setLogger` to log custom debugging messages to the JavaScript console. Unlike basic logs, these logs are not visible to users.

```javascript
setLogger(loggerFunction: (message: STRING) => void): void
```

Replace `STRING` with your message as a single string parameter. Your method should be similar to the following:

```javascript
braze.initialize('API-KEY');
braze.setLogger(function(message) {
    console.log("Braze Custom Logger: " + message);
});
braze.openSession();
```

## Upgrading the SDK

**Note:**


This guide uses code samples from the Braze Web SDK 4.0.0+. To upgrade to the latest Web SDK version, see [SDK Upgrade Guide](https://github.com/braze-inc/braze-web-sdk/blob/master/UPGRADE_GUIDE.md).




When you reference the Braze Web SDK from our content delivery network, for example, `https://js.appboycdn.com/web-sdk/a.a/braze.min.js` (as recommended by our default integration instructions), your users receive minor updates (bug fixes and backward compatible features, versions `a.a.a` through `a.a.z` in the above examples) automatically when they refresh your site.

However, when we release major changes, we require you to upgrade the Braze Web SDK manually to ensure that breaking changes do not impact your integration. Additionally, if you download our SDK and host it yourself, you won't receive any version updates automatically and should upgrade manually to receive the latest features and bug fixes.

You can keep up-to-date with our latest release [following our release feed](https://github.com/braze-inc/braze-web-sdk/tags.atom) with the RSS Reader or service of your choice, and see [our changelog](https://github.com/braze-inc/braze-web-sdk/blob/master/CHANGELOG.md) for a full accounting of our Web SDK release history. To upgrade the Braze Web SDK:

- Update the Braze library version by changing the version number of `https://js.appboycdn.com/web-sdk/[OLD VERSION NUMBER]/braze.min.js`, or in your package manager's dependencies.
- If you have web push integrated, update the service worker file on your site - by default, this is located at `/service-worker.js` at your site's root directory, but the location may be customized in some integrations. You must access the root directory to host a service worker file.

You must update these two files in coordination with each other for proper functionality.

## Other integration methods

### Accelerated Mobile Pages (AMP)
**See more**


#### Step 1: Include AMP web push script

Add the following async script tag to your head:

```js
<script async custom-element="amp-web-push" src="https://cdn.ampproject.org/v0/amp-web-push-0.1.js"></script>
```

#### Step 2: Add subscription widgets

Add a widget to the body of your HTML that allows users to subscribe and unsubscribe from push.

```js
<!-- A subscription widget -->
<amp-web-push-widget visibility="unsubscribed" layout="fixed" width="250" height="80">
  <button on="tap:amp-web-push.subscribe">Subscribe to Notifications</button>
</amp-web-push-widget>

<!-- An unsubscription widget -->
<amp-web-push-widget visibility="subscribed" layout="fixed" width="250" height="80">
  <button on="tap:amp-web-push.unsubscribe">Unsubscribe from Notifications</button>
</amp-web-push-widget>
```

#### Step 3: Add `helper-iframe` and `permission-dialog`

The AMP Web Push component creates a popup to handle push subscriptions, so you'll need to add the following helper files to your project to enable this feature:

- [`helper-iframe.html`](https://cdn.ampproject.org/v0/amp-web-push-helper-frame.html)
- [`permission-dialog.html`](https://cdn.ampproject.org/v0/amp-web-push-permission-dialog.html)

#### Step 4: Create a service worker file

Create a `service-worker.js` file in the root directory of your website and add the following snippet:

<script src="/docs/assets/js/embed.js?target=https://github.com/braze-inc/braze-web-sdk/blob/master/sample-builds/cdn/service-worker.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>

#### Step 5: Configure the AMP web push HTML element

Add the following `amp-web-push` HTML element to your HTML body. Keep in mind, you need to append your [`apiKey` and `baseUrl`](https://documenter.getpostman.com/view/4689407/SVYrsdsG) as query parameters to `service-worker-URL`.

```js
<amp-web-push
layout="nodisplay"
id="amp-web-push"
helper-iframe-url="FILE_PATH_TO_YOUR_HELPER_IFRAME"
permission-dialog-url="FILE_PATH_TO_YOUR_PERMISSION_DIALOG"
service-worker-url="FILE_PATH_TO_YOUR_SERVICE_WORKER?apiKey={YOUR_API_KEY}&baseUrl={YOUR_BASE_URL}"
>
```



### Asynchronous Module Definition (AMD)

#### Disable support

If your site uses RequireJS or another AMD module-loader, but you prefer to load the Braze Web SDK through one of the other options in this list, you can load a version of the library that does not include AMD support. This version of the library can be loaded from the following CDN location:

<script src="/docs/assets/js/embed.js?target=https%3A%2F%2Fgithub.com%2Fbraze-inc%2Fbraze-web-sdk%2Fblob%2Fmaster%2Fsnippets%2Fno-amd-library.js&style=github&showBorder=on&showLineNumbers=on&showFileMeta=on&showCopy=on"></script>

#### Module loader

If you use RequireJS or other AMD module-loaders we recommend self-hosting a copy of our library and referencing it as you would with other resources:

```javascript
require(['path/to/braze.min.js'], function(braze) {
  braze.initialize('YOUR-API-KEY-HERE', { baseUrl: 'YOUR-SDK-ENDPOINT' });
  braze.automaticallyShowInAppMessages();
  braze.openSession();
});
```

### Electron {#electron}

Electron does not officially support web push notifications (see: this [GitHub issue](https://github.com/electron/electron/issues/6697)). There are other [open source workarounds](https://github.com/MatthieuLemoine/electron-push-receiver) you may try that have not been tested by Braze.

### Jest framework {#jest}

When using Jest, you may see an error similar to `SyntaxError: Unexpected token 'export'`. To fix this, adjust your configuration in `package.json` to ignore the Braze SDK:

```
"jest": {
  "transformIgnorePatterns": [
    "/node_modules/(?!@braze)"
  ]
}
```

### SSR frameworks {#ssr}

If you use a Server-Side Rendering (SSR) framework such as Next.js, you may encounter errors because the SDK is meant to be run in a browser environment. You can resolve these issues by dynamically importing the SDK.

You can retain the benefits of tree-shaking when doing so by exporting the parts of the SDK that you need in a separate file and then dynamically importing that file into your component.

```javascript
// MyComponent/braze-exports.js
// export the parts of the SDK you need here
export { initialize, openSession } from "@braze/web-sdk";

// MyComponent/MyComponent.js
// import the functions you need from the braze exports file
useEffect(() => {
    import("./braze-exports.js").then(({ initialize, openSession }) => {
        initialize("YOUR-API-KEY-HERE", {
            baseUrl: "YOUR-SDK-ENDPOINT",
            enableLogging: true,
        });
        openSession();
    });
}, []);
```

Alternatively, if you're using webpack to bundle your app, you can take advantage of its magic comments to dynamically import only the parts of the SDK that you need.

```javascript
// MyComponent.js
useEffect(() => {
    import(
        /* webpackExports: ["initialize", "openSession"] */
        "@braze/web-sdk"
    ).then(({ initialize, openSession }) => {
        initialize("YOUR-API-KEY-HERE", {
            baseUrl: "YOUR-SDK-ENDPOINT",
            enableLogging: true,
        });
        openSession();
    });
}, []);
```

### Tealium iQ

Tealium iQ offers a basic turnkey Braze integration. To configure the integration, search for Braze in the Tealium Tag Management interface, and provide the Web SDK API key from your dashboard.

For more details or in-depth Tealium configuration support, check out our [integration documentation](https://www.braze.com/docs/partners/data_and_infrastructure_agility/customer_data_platform/tealium/#about-tealium) or contact your Tealium account manager.

### Vite {#vite}

If you use Vite and see a warning around circular dependencies or `Uncaught TypeError: Class extends value undefined is not a constructor or null`, you may need to exclude the Braze SDK from its [dependency discovery](https://vitejs.dev/guide/dep-pre-bundling.html#customizing-the-behavior):

```
optimizeDeps: {
    exclude: ['@braze/web-sdk']
},
```

### Other tag managers

Braze may also be compatible with other tag management solutions by following our integration instructions within a custom HTML tag. Contact a Braze representative if you need help evaluating these solutions.




## Integrating the Android SDK

### Step 1: Update your `build.gradle`

In your `build.gradle`, add [`mavenCentral()`](https://docs.gradle.org/current/kotlin-dsl/gradle/org.gradle.api.artifacts.dsl/-repository-handler/maven-central.html) to your list of repositories.

```kotlin
repositories {
  mavenCentral()
}
```

Next, add Braze to your dependencies.



If you don't plan on using Braze UI components, add the following code to your `build.gradle`. Replace `SDK_VERSION` with the current version of your Android Braze SDK. For the full list of versions, see [Changelogs](https://www.braze.com/docs/developer_guide/changelogs/?sdktab=android).

```kotlin
dependencies {
    implementation 'com.braze:android-sdk-base:SDK_VERSION' // (Required) Adds dependencies for the base Braze SDK.
    implementation 'com.braze:android-sdk-location:SDK_VERSION' // (Optional) Adds dependencies for Braze location services.
}
```



If you plan on using Braze UI components later, add the following code to your `build.gradle`.  Replace `SDK_VERSION` with the current version of your Android Braze SDK. For the full list of versions, see [Changelogs](https://www.braze.com/docs/developer_guide/changelogs/?sdktab=android).

```kotlin
dependencies {
    implementation 'com.braze:android-sdk-ui:SDK_VERSION' // (Required) Adds dependencies for the Braze SDK and Braze UI components. 
    implementation 'com.braze:android-sdk-location:SDK_VERSION' // (Optional) Adds dependencies for Braze location services.
}
```



### Step 2: Configure your `braze.xml`

**Note:**


As of December 2019, custom endpoints are no longer given out, if you have a pre-existing custom endpoint, you may continue to use it. For more details, refer to our <a href="/docs/api/basics/#endpoints">list of available endpoints</a>.



Create a `braze.xml` file in your project's `res/values` folder. If you are on a specific data cluster or have a pre-existing custom endpoint, you need to specify the endpoint in your `braze.xml` file as well. 

The contents of that file should resemble the following code snippet. Make sure to substitute `YOUR_APP_IDENTIFIER_API_KEY` with the identifier found in the **Manage Settings** page of the Braze dashboard. Log in at [dashboard.braze.com](https://dashboard.braze.com) to find your [cluster address](https://www.braze.com/docs/user_guide/administrative/access_braze/sdk_endpoints). 

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string translatable="false" name="com_braze_api_key">YOUR_APP_IDENTIFIER_API_KEY</string>
  <string translatable="false" name="com_braze_custom_endpoint">YOUR_CUSTOM_ENDPOINT_OR_CLUSTER</string>
</resources>
```

### Step 3: Add permissions to `AndroidManifest.xml`

Next, add the following permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**Note:**


With the release of Android M, Android switched from an install-time to a runtime permissions model. However, both of these permissions are normal permissions and are granted automatically if listed in the app manifest. For more information, visit Android's [permission documentation](https://developer.android.com/training/permissions/index.html).



### Step 4: Enable delayed initialization (optional)

To use delayed initialization, the minimum Braze SDK version is required:

<div id='sdk-versions'><a href='/docs/developer_guide/platforms/android/changelog/#3800' class='sdk-versions--chip android-sdk' target='_blank'><i class='fa-brands fa-android'></i> &nbsp; Android: 38.0.0+ &nbsp;<i class='fa-solid fa-arrow-up-right-from-square'></i></a></div>

**Note:**


While delayed initialization is enabled, all network connections are canceled, preventing the SDK from sending data to the Braze servers.



#### Step 4.1: Update your `braze.xml`

Delayed initialization is disabled by default. To enable, use one of the following options:



In your project's `braze.xml` file, set `com_braze_enable_delayed_initialization` to `true`.

```xml
<bool name="com_braze_enable_delayed_initialization">true</bool>
```



To enable delayed initialization at runtime, use the following method.




```java
Braze.enableDelayedInitialization(context);
```




```kotlin
Braze.enableDelayedInitialization(context)
```






#### Step 4.2: Configure push analytics (optional)

When delayed initialization is enabled, push analytics are queued by default. However, you can choose to [explicitly queue](#explicitly-queue-push-analytics) or [drop](#drop-push-analytics) push analytics instead.

##### Explicitly queue {#explicitly-queue-push-analytics}

To explicitly queue push analytics, choose one of the following options:



In your `braze.xml` file, set `com_braze_delayed_initialization_analytics_behavior` to `QUEUE`:

```xml
<string name="com_braze_delayed_initialization_analytics_behavior">QUEUE</string>
```



Add `QUEUE` to your [`Braze.enableDelayedInitialization()`](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze/-braze/-companion/enable-delayed-initialization.html) method:




```java
Braze.enableDelayedInitialization(context, DelayedInitializationAnalyticsBehavior.QUEUE);
```




```kotlin
Braze.enableDelayedInitialization(context, DelayedInitializationAnalyticsBehavior.QUEUE)
```






##### Drop {#drop-push-analytics}

To drop push analytics, choose one of the following options:



In your `braze.xml` file, set `com_braze_delayed_initialization_analytics_behavior` to `DROP`: 

```xml
<string name="com_braze_delayed_initialization_analytics_behavior">DROP</string>
```



Add `DROP` to the [`Braze.enableDelayedInitialization()`](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze/-braze/-companion/enable-delayed-initialization.html) method:




```java
Braze.enableDelayedInitialization(context, DelayedInitializationAnalyticsBehavior.DROP);
```




```kotlin
Braze.enableDelayedInitialization(context, DelayedInitializationAnalyticsBehavior.DROP)
```






#### Step 4.3: Manually initialize the SDK

After your chosen delay period, use the [`Braze.disableDelayedInitialization()`](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze/-braze/-companion/disable-delayed-initialization.html) method to manually initialize the SDK.




```java
Braze.disableDelayedInitialization(context);
```




```kotlin
Braze.disableDelayedInitialization(context)
```




### Step 5: Enable user session tracking

When you enable user session tracking, calls to `openSession()`, `closeSession()`,[`ensureSubscribedToInAppMessageEvents()`](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze.ui.inappmessage/-braze-in-app-message-manager/ensure-subscribed-to-in-app-message-events.html), and `InAppMessageManager` registration can be handled automatically.

To register activity lifecycle callbacks, add the following code to the `onCreate()` method of your `Application` class. 




```java
public class MyApplication extends Application {
  @Override
  public void onCreate() {
    super.onCreate();
    registerActivityLifecycleCallbacks(new BrazeActivityLifecycleCallbackListener());
  }
}
```




```kotlin
class MyApplication : Application() {
  override fun onCreate() {
    super.onCreate()
    registerActivityLifecycleCallbacks(BrazeActivityLifecycleCallbackListener())
  }
}
```

For the list of available parameters, see [`BrazeActivityLifecycleCallbackListener`](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze/-braze-activity-lifecycle-callback-listener/index.html).




## Testing session tracking

**Tip:**


You can also use the [SDK Debugger](https://www.braze.com/docs/developer_guide/debugging) to diagnose SDK issues.



If you experience issues while testing, enable [verbose logging](#android_enabling-logs), then use logcat to detect missing `openSession` and `closeSession` calls in your activities.

1. In Braze, go to **Overview**, select your app, then in the **Display Data For** dropdown choose **Today**.
    ![The "Overview" page in Braze, with the "Display Data For" field set to "Today".](https://www.braze.com/docs/assets/img_archive/android_sessions.png?a80518af3562397d27154b59f66b87f1)
2. Open your app, then refresh the Braze dashboard. Verify that your metrics have increased by 1.
3. Navigate through your app and verify that only one session has been logged to Braze.
4. Send the app to the background for at least 10 seconds, then bring it to the foreground. Verify that a new session was logged.

## Optional configurations

### Runtime configuration

To set your Braze options in code rather than your `braze.xml` file, use [runtime configuration](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze/-braze/-companion/configure.html). If a value exists in both places, the runtime value will be used instead. After all required settings are supplied at runtime, you can delete your `braze.xml` file.

In the following example, a [builder object](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze.configuration/-braze-config/-builder/index.html) is created and then passed to [`Braze.configure()`](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze/-braze/-companion/configure.html). Note that only some of the available runtime options are shown&#8212;refer to our [KDoc](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze.configuration/-braze-config/-builder/index.html) for the full list.




```java
BrazeConfig brazeConfig = new BrazeConfig.Builder()
        .setApiKey("api-key-here")
        .setCustomEndpoint("YOUR_CUSTOM_ENDPOINT_OR_CLUSTER")
        .setSessionTimeout(60)
        .setHandlePushDeepLinksAutomatically(true)
        .setGreatNetworkDataFlushInterval(10)
        .build();
Braze.configure(this, brazeConfig);
```




```kotlin
val brazeConfig = BrazeConfig.Builder()
        .setApiKey("api-key-here")
        .setCustomEndpoint("YOUR_CUSTOM_ENDPOINT_OR_CLUSTER")
        .setSessionTimeout(60)
        .setHandlePushDeepLinksAutomatically(true)
        .setGreatNetworkDataFlushInterval(10)
        .build()
Braze.configure(this, brazeConfig)
```




**Tip:**


Looking for another example? Check out our [Hello Braze sample app](https://github.com/braze-inc/braze-android-sdk/blob/master/samples/hello-braze/src/main/java/com/braze/helloworld/CustomApplication.java).



### Google Advertising ID

The [Google Advertising ID (GAID)](https://support.google.com/googleplay/android-developer/answer/6048248/advertising-id?hl=en) is an optional user-specific, anonymous, unique, and resettable ID for advertising, provided by Google Play services. GAID gives users the power to reset their identifier, opt-out of interest-based ads within Google Play apps, and provides developers with a simple, standard system to continue to monetize their apps.

The Google Advertising ID is not automatically collected by the Braze SDK and must be set manually via the [`Braze.setGoogleAdvertisingId()`](https://braze-inc.github.io/braze-android-sdk/kdoc/braze-android-sdk/com.braze/-i-braze/set-google-advertising-id.html) method.




```java
new Thread(new Runnable() {
  @Override
  public void run() {
    try {
      AdvertisingIdClient.Info idInfo = AdvertisingIdClient.getAdvertisingIdInfo(getApplicationContext());
      Braze.getInstance(getApplicationContext()).setGoogleAdvertisingId(idInfo.getId(), idInfo.isLimitAdTrackingEnabled());
    } catch (Exception e) {
      e.printStackTrace();
    }
  }
}).start();
```




```kotlin
suspend fun fetchAndSetAdvertisingId(
  context: Context,
  scope: CoroutineScope = GlobalScope
) {
  scope.launch(Dispatchers.IO) {
    try {
      val idInfo = AdvertisingIdClient.getAdvertisingIdInfo(context)
      Braze.getInstance(context).setGoogleAdvertisingId(
        idInfo.id,
        idInfo.isLimitAdTrackingEnabled
      )
    } catch (e: Exception) {
      e.printStackTrace()
    }
  }
}
```




**Important:**


Google requires the Advertising ID to be collected on a non-UI thread.




### Location tracking

To enable Braze location collection, set `com_braze_enable_location_collection` to `true` in your `braze.xml` file:

```xml
<bool name="com_braze_enable_location_collection">true</bool>
```

**Important:**


Starting with Braze Android SDK version 3.6.0, Braze location collection is disabled by default.



### Logging

By default, the Braze Android SDK log level is set to `INFO`. You can [suppress these logs](#android_suppressing-logs) or [set a different log level](#android_enabling-logs), such as `VERBOSE`, `DEBUG`, or `WARN`.

#### Enabling logs

To help troubleshoot issues in your app, or reduce turnaround times with Braze Support, you'll want to enable verbose logs for the SDK. When you send verbose logs to Braze Support, ensure they begin as soon as you launch your application and end far after your issue occurs.

Keep in mind, verbose logs are only intended for your development environment, so you'll want to disable them before releasing your app.

**Important:**


Enable verbose logs before any other calls in `Application.onCreate()` to ensure your logs are as complete as possible.





To enable logs directly in your app, add the following to your application's `onCreate()` method before any other methods.



```java
BrazeLogger.setLogLevel(Log.MIN_LOG_LEVEL);
```



```kotlin
BrazeLogger.logLevel = Log.MIN_LOG_LEVEL
```



Replace `MIN_LOG_LEVEL` with the **Constant** of the log level you'd like to set as your minimum log level. Any logs at a level `>=` to your set `MIN_LOG_LEVEL` will be forwarded to Android's default [`Log`](https://developer.android.com/reference/android/util/Log) method. Any logs `<` your set `MIN_LOG_LEVEL` will be discarded.

| Constant    | Value          | Description                                                               |
|-------------|----------------|---------------------------------------------------------------------------|
| `VERBOSE`   | 2              | Logs the most detailed messages for debugging and development.            |
| `DEBUG`     | 3              | Logs descriptive messages for debugging and development.                  |
| `INFO`      | 4              | Logs informational messages for general highlights.                       |
| `WARN`      | 5              | Logs warning messages for identifying potentially harmful situations.     |
| `ERROR`     | 6              | Logs error messages for indicating application failure or serious issues. |
| `ASSERT`    | 7              | Logs assertion messages when conditions are false during development.     |
{: .reset-td-br-1 .reset-td-br-2 .reset-td-br-3 role="presentation" }

For example, the following code will forward log levels `2`, `3`, `4`, `5`, `6`, and `7` to the `Log` method.



```java
BrazeLogger.setLogLevel(Log.VERBOSE);
```



```kotlin
BrazeLogger.logLevel = Log.VERBOSE
```





To enable logs in the `braze.xml`, add the following to your file:

```xml
<integer name="com_braze_logger_initial_log_level">MIN_LOG_LEVEL</integer>
```

Replace `MIN_LOG_LEVEL` with the **Value** of the log level you'd like to set as your minimum log level. Any logs at a level `>=` to your set `MIN_LOG_LEVEL` will be forwarded to Android's default [`Log`](https://developer.android.com/reference/android/util/Log) method. Any logs `<` your set `MIN_LOG_LEVEL` will be discarded.

| Constant    | Value          | Description                                                               |
|-------------|----------------|---------------------------------------------------------------------------|
| `VERBOSE`   | 2              | Logs the most detailed messages for debugging and development.            |
| `DEBUG`     | 3              | Logs descriptive messages for debugging and development.                  |
| `INFO`      | 4              | Logs informational messages for general highlights.                       |
| `WARN`      | 5              | Logs warning messages for identifying potentially harmful situations.     |
| `ERROR`     | 6              | Logs error messages for indicating application failure or serious issues. |
| `ASSERT`    | 7              | Logs assertion messages when conditions are false during development.     |
{: .reset-td-br-1 .reset-td-br-2 .reset-td-br-3 role="presentation" }

For example, the following code will forward log levels `2`, `3`, `4`, `5`, `6`, and `7` to the `Log` method.

```xml
<integer name="com_braze_logger_initial_log_level">2</integer>
```



#### Verifying verbose logs

To verify that your logs are set to `VERBOSE`, check if `V/Braze` occurs somewhere in your logs. If it does, then verbose logs have been successfully enabled. For example:

```
2077-11-19 16:22:49.591 ? V/Braze v9.0.01 .bo.app.d3: Request started
```

#### Suppressing logs

To suppress all logs for the Braze Android SDK, set the log level to `BrazeLogger.SUPPRESS` in your application's `onCreate()` method _before_ any other methods.



```java
BrazeLogger.setLogLevel(BrazeLogger.SUPPRESS);
```



```kotlin
BrazeLogger.setLogLevel(BrazeLogger.SUPPRESS)
```



### Multiple API keys

The most common use case for multiple API keys is separating API keys for debug and release build variants.

To easily switch between multiple API keys in your builds, we recommend creating a separate `braze.xml` file for each relevant [build variant](https://developer.android.com/studio/build/build-variants.html). A build variant is a combination of build type and product flavor. By default, new Android projects are configured with [`debug` and `release` build types](https://developer.android.com/reference/tools/gradle-api/8.3/null/com/android/build/api/dsl/BuildType) and no product flavors.

For each relevant build variant, create a new `braze.xml` in the `src/<build variant name>/res/values/` directory. When the build variant is compiled, it will use the new API key.

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
<string name="com_braze_api_key">REPLACE_WITH_YOUR_BUILD_VARIANT_API_KEY</string>
</resources>
```

**Tip:**


To learn how to set up the API key in your code, see [Runtime configuration](https://www.braze.com/docs/developer_guide/sdk_initalization/?sdktab=android).



### Exclusive in-app message TalkBack

In adherence to the [Android accessibility guidelines](https://developer.android.com/guide/topics/ui/accessibility), the Braze Android SDK offers Android Talkback by default. To ensure that only the contents of in-app messages are read out loud—without including other screen elements like the app title bar or navigation—you can enable exclusive mode for TalkBack.

To enable exclusive mode for in-app messages:



```xml
<bool name="com_braze_device_in_app_message_accessibility_exclusive_mode_enabled">true</bool>
```



```kotlin
val brazeConfigBuilder = BrazeConfig.Builder()
brazeConfigBuilder.setIsInAppMessageAccessibilityExclusiveModeEnabled(true)
Braze.configure(this, brazeConfigBuilder.build())
```



```java
BrazeConfig.Builder brazeConfigBuilder = new BrazeConfig.Builder()
brazeConfigBuilder.setIsInAppMessageAccessibilityExclusiveModeEnabled(true);
Braze.configure(this, brazeConfigBuilder.build());
```



### R8 and ProGuard

[Code shrinking](https://developer.android.com/build/shrink-code) configuration is automatically included with your Braze integration.

Client apps that obfuscate Braze code must store release mapping files for Braze to interpret stack traces. If you want to continue to keep all Braze code, add the following to your ProGuard file:

```
-keep class bo.app.** { *; }
-keep class com.braze.** { *; }
```




## Integrating the Swift SDK

You can integrate and customize the Braze Swift SDK using the Swift Package Manager (SPM), CocoaPods, or manual integration methods. For more information about the various SDK symbols, see [Braze Swift reference documentation](https://braze-inc.github.io/braze-swift-sdk/documentation/brazekit/).

### Prerequisites

Before you start, verify your environment is supported by the [latest Braze Swift SDK version](https://github.com/braze-inc/braze-swift-sdk#version-information).

### Step 1: Install the Braze Swift SDK

We recommend using the [Swift Package Manager (SwiftPM)](https://swift.org/package-manager/) or [CocoaPods](http://cocoapods.org/) to install the Braze Swift SDK. Alternatively, you can install the SDK manually.



#### Step 1.1: Import SDK version

Open your project and navigate to your project's settings. Select the **Swift Packages** tab and click on the <i class="fas fa-plus"></i> add button below the packages list.

![](https://www.braze.com/docs/assets/img/swiftpackages.png?1987d5a2a722497bf1f2f38ab52aa14a)

**Note:**


Starting in version 7.4.0, the Braze Swift SDK has additional distribution channels as [static XCFrameworks](https://github.com/braze-inc/braze-swift-sdk-prebuilt-static) and [dynamic XCFrameworks](https://github.com/braze-inc/braze-swift-sdk-prebuilt-dynamic). If you'd like to use either of these formats instead, follow the installation instructions from its respective repository.



Enter the URL of our iOS Swift SDK repository `https://github.com/braze-inc/braze-swift-sdk` in the text field. Under the **Dependency Rule** section, select the SDK version. Finally, click **Add Package**.

![](https://www.braze.com/docs/assets/img/importsdk_example.png?38a74eb0e009cc281bd78ac130e2089c)

#### Step 1.2: Select your packages

The Braze Swift SDK separates features into standalone libraries to provide developers with more control over which features to import into their projects.

| Package         | Details                                                                                                                                                         |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `BrazeKit`      | Main SDK library providing support for analytics and push notifications.                                                                                        |
| `BrazeLocation` | Location library providing support for location analytics and geofence monitoring.                                                                              |
| `BrazeUI`       | Braze-provided user interface library for in-app messages, Content Cards, and Banners. Import this library if you intend to use the default UI components. |

{: .ws-td-nw-1}

##### About Extension libraries

**Warning:**


[BrazeNotificationService](https://braze-inc.github.io/braze-swift-sdk/tutorials/braze/b2-rich-push-notifications) and [BrazePushStory](https://braze-inc.github.io/braze-swift-sdk/tutorials/braze/b3-push-stories) are extension modules that provide additional functionality and should not be added directly to your main application target. Instead follow the linked guides to integrate them separately into their respective target extensions.



| Package                    | Details                                                                               |
| -------------------------- | ------------------------------------------------------------------------------------- |
| `BrazeNotificationService` | Notification service extension library providing support for rich push notifications. |
| `BrazePushStory`           | Notification content extension library providing support for Push Stories.            |

{: .ws-td-nw-1}

Select the package that best suits your needs and click **Add Package**. Make sure you select `BrazeKit` at a minimum.

![](https://www.braze.com/docs/assets/img/add_package.png?2fa980e608a800e7e3649f34d79f2ea7)



#### Step 1.1: Install CocoaPods

For a full walkthrough, see CocoaPods' [Getting Started Guide](https://guides.cocoapods.org/using/getting-started.html). Otherwise, you can run the following command to get started quickly:

```bash
$ sudo gem install cocoapods
```

If you get stuck, checkout CocoaPods' [Troubleshooting Guide](http://guides.cocoapods.org/using/troubleshooting.html).

#### Step 1.2: Constructing the Podfile

Next, create a file in your Xcode project directory named `Podfile`.

**Note:**


Starting in version 7.4.0, the Braze Swift SDK has additional distribution channels as [static XCFrameworks](https://github.com/braze-inc/braze-swift-sdk-prebuilt-static) and [dynamic XCFrameworks](https://github.com/braze-inc/braze-swift-sdk-prebuilt-dynamic). If you'd like to use either of these formats instead, follow the installation instructions from its respective repository.



Add the following line to your Podfile:

```
target 'YourAppTarget' do
  pod 'BrazeKit'
end
```

`BrazeKit` contains the main SDK library, providing support for analytics and push notifications.

We suggest you version Braze so pod updates automatically grab anything smaller than a minor version update. This looks like `pod 'BrazeKit' ~> Major.Minor.Build`. If you want to automatically integrate the latest Braze SDK version, even with major changes, you can use `pod 'BrazeKit'` in your Podfile.

##### About additional libraries

The Braze Swift SDK separates features into standalone libraries to provide developers with more control over which features to import into their projects. In addition to `BrazeKit`, you may add the following libraries to your Podfile:

| Library               | Details                                                                                                                                                         |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pod 'BrazeLocation'` | Location library providing support for location analytics and geofence monitoring.                                                                              |
| `pod 'BrazeUI'`       | Braze-provided user interface library for in-app messages, Content Cards, and Banners. Import this library if you intend to use the default UI components. |

{: .ws-td-nw-1}

###### Extension libraries

[BrazeNotificationService](https://braze-inc.github.io/braze-swift-sdk/tutorials/braze/b2-rich-push-notifications) and [BrazePushStory](https://braze-inc.github.io/braze-swift-sdk/tutorials/braze/b3-push-stories) are extension modules that provide additional functionality and should not be added directly to your main application target. Instead, you will need to create separate extension targets for each of these modules and import the Braze modules into their corresponding targets.

| Library                          | Details                                                                               |
| -------------------------------- | ------------------------------------------------------------------------------------- |
| `pod 'BrazeNotificationService'` | Notification service extension library providing support for rich push notifications. |
| `pod 'BrazePushStory'`           | Notification content extension library providing support for Push Stories.            |

{: .ws-td-nw-1}

#### Step 1.3: Install the SDK

To install the Braze SDK CocoaPod, navigate to the directory of your Xcode app project within your terminal and run the following command:
```
pod install
```

At this point, you should be able to open the new Xcode project workspace created by CocoaPods. Make sure to use this Xcode workspace instead of your Xcode project.

![A Braze Example folder expanded to show the new `BrazeExample.workspace`.](https://www.braze.com/docs/assets/img/braze_example_workspace.png?67ad8a74ccb61f01df9949a0a37af957)

#### Updating the SDK using CocoaPods

To update a CocoaPod, simply run the following command within your project directory:

```
pod update
```



#### Step 1.1: Download the Braze SDK

Go to the [Braze SDK release page on GitHub](https://github.com/braze-inc/braze-swift-sdk/releases), then download `braze-swift-sdk-prebuilt.zip`.

!["The Braze SDK release page on GitHub."](https://www.braze.com/docs/assets/img/swift/sdk_integration/download-braze-swift-sdk-prebuilt.png?0498d856a092a68779f1bd3945e685ca)

#### Step 1.2: Choose your frameworks

The Braze Swift SDK contains a variety of standalone XCFrameworks, which gives you the freedom to integrate the features you want&#8212;without needing to integrate them all. Reference the following table to choose your XCFrameworks:

| Package                    | Required? | Description                                                                                                                                                                                                                                                                                                                          |
| -------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `BrazeKit`                 | Yes       | Main SDK library that provides support for analytics and push notifications.                                                                                                                                                                                                                                                         |
| `BrazeLocation`            | No        | Location library that provides support for location analytics and geofence monitoring.                                                                                                                                                                                                                                               |
| `BrazeUI`                  | No        | Braze-provided user interface library for in-app messages, Content Cards, and Banners. Import this library if you intend to use the default UI components.                                                                                                                                                                      |
| `BrazeNotificationService` | No        | Notification service extension library that provides support for rich push notifications. Do not add this library directly to your main application target, instead [add the `BrazeNotificationService` library separately](https://braze-inc.github.io/braze-swift-sdk/tutorials/braze/b2-rich-push-notifications).                 |
| `BrazePushStory`           | No        | Notification content extension library that provides support for Push Stories. Do not add this library directly to your main application target, instead [add the `BrazePushStory` library separately](https://braze-inc.github.io/braze-swift-sdk/tutorials/braze/b3-push-stories).                                                 |
| `BrazeKitCompat`           | No        | Compatibility library containing all the `Appboy` and `ABK*` classes and methods that were available in the `Appboy-iOS-SDK` version 4.X.X. For usage details, refer to the minimal migration scenario in the [migration guide](https://braze-inc.github.io/braze-swift-sdk/documentation/braze/appboy-migration-guide/).            |
| `BrazeUICompat`            | No        | Compatibility library containing all the `ABK*` classes and methods that were available in the `AppboyUI` library from `Appboy-iOS-SDK` version 4.X.X. For usage details, refer to the minimal migration scenario in the [migration guide](https://braze-inc.github.io/braze-swift-sdk/documentation/braze/appboy-migration-guide/). |
| `SDWebImage`               | No        | Dependency used only by `BrazeUICompat` in the minimal migration scenario.                                                                                                                                                                                                                                                           |

{: .ws-td-nw-1 .reset-td-br-1 .reset-td-br-2 role="presentation" }

#### Step 1.3: Prepare your files

Decide whether you want to use **Static** or **Dynamic** XCFrameworks, then prepare your files:

1. Create a temporary directory for your XCFrameworks.
2. In `braze-swift-sdk-prebuilt`, open the `dynamic` directory and move `BrazeKit.xcframework` into your directory. Your directory should be similar to the following:
    ```bash
    temp_dir
    └── BrazeKit.xcframework
    ```
3. Move each of your [chosen XCFrameworks](#swift_step-2-choose-your-frameworks) into your temporary directory. Your directory should be similar to the following:
    ```bash
    temp_dir
    ├── BrazeKit.xcframework
    ├── BrazeKitCompat.xcframework
    ├── BrazeLocation.xcframework
    └── SDWebImage.xcframework
    ```

#### Step 1.4: Integrate your frameworks

Next, integrate the **Dynamic** or **Static** XCFrameworks you [prepared previously](#swift_step-3-prepare-your-files):

In your Xcode project, select your build target, then **General**. Under **Frameworks, Libraries, and Embedded Content**, drag and drop the [files you prepared previously](#swift_step-3-prepare-your-files).

!["An example Xcode project with each Braze library set to 'Embed & Sign.'"](https://www.braze.com/docs/assets/img/swift/sdk_integration/embed-and-sign.png?43e0687cf39aa5ba7d61add4e7cee300)

**Note:**


Starting with the Swift SDK 12.0.0, you should always select **Embed & Sign** for the Braze XCFrameworks for both the static and dynamic variants. This ensures that the frameworks resources are properly embedded in your app bundle.



**Tip:**


To enable GIF support, add `SDWebImage.xcframework`, located in either `braze-swift-sdk-prebuilt/static` or `braze-swift-sdk-prebuilt/dynamic`.



#### Common errors for Objective-C projects

If your Xcode project only contains Objective-C files, you may get "missing symbol" errors when you try to build your project. To fix these errors, open your project and add an empty Swift file to your file tree. This will force your build toolchain to embed [Swift Runtime](https://support.apple.com/kb/dl1998) and link to the appropriate frameworks during build time.

```bash
FILE_NAME.swift
```

Replace `FILE_NAME` with any non-spaced string. Your file should look similar to the following:

```bash
empty_swift_file.swift
```



### Step 2: Set up delayed initialization (optional)

You can choose to delay when the Braze Swift SDK is initialized, which is useful if your app needs to load config or wait for user consent before starting the SDK. Delayed initialization ensures Braze push notifications are queued until the SDK is ready.

To enable this, call `Braze.prepareForDelayedInitialization()` as early as possible—ideally inside or before your `application(_:didFinishLaunchingWithOptions:)`.

**Note:**


This only applies to push notifications from Braze. Other push notifications are handled normally by system delegates.







```swift
func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
  // Prepare the SDK for delayed initialization
  Braze.prepareForDelayedInitialization()

  // ... Additional non-Braze setup code

  return true
}
```



```swift
@main
struct MyApp: App {
  @UIApplicationDelegateAdaptor var appDelegate: AppDelegate

  var body: some Scene {
    WindowGroup {
      ContentView()
    }
  }
}

class AppDelegate: NSObject, UIApplicationDelegate {
  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil) -> Bool {
    // Prepare the SDK for delayed initialization
    Braze.prepareForDelayedInitialization()

    // ... Additional non-Braze setup code

    return true
  }
}
```





```objc
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // Prepare the SDK for delayed initialization
  [Braze prepareForDelayedInitialization];
  
  // ... Additional non-Braze setup code

  return YES;
}
```



**Note:**


[`Braze.prepareForDelayedInitialization(pushAutomation:)`](https://braze-inc.github.io/braze-swift-sdk/documentation/brazekit/braze/preparefordelayedinitialization(pushautomation:)) accepts an optional `pushAutomation` parameter. If set to `nil`, all push automation features are enabled, except requesting push authorization at launch.



### Step 3: Update your app delegate

**Important:**


The following assumes you've already added an `AppDelegate` to your project (which are not generated by default). If you don't plan on using one, be sure to initialize the Braze SDK as early as possible, like during the app's launch.





Add the following line of code to your `AppDelegate.swift` file to import the features included in the Braze Swift SDK:

```swift
import BrazeKit
```

Next, add a static property to your `AppDelegate` class to keep a strong reference to the Braze instance throughout your application's lifetime:

```swift
class AppDelegate: UIResponder, UIApplicationDelegate {
  static var braze: Braze? = nil
}
```

Finally, in `AppDelegate.swift`, add the following snippet to your `application:didFinishLaunchingWithOptions:` method:

```swift
let configuration = Braze.Configuration(
    apiKey: "YOUR-APP-IDENTIFIER-API-KEY",
    endpoint: "YOUR-BRAZE-ENDPOINT"
)
let braze = Braze(configuration: configuration)
AppDelegate.braze = braze
```

Update `YOUR-APP-IDENTIFIER-API-KEY` and `YOUR-BRAZE-ENDPOINT` with the correct value from your **App Settings** page. Check out our [API identifier types](https://www.braze.com/docs/api/identifier_types/?tab=app%20ids) for more information on where to find your app identifier API key.




Add the following line of code to your `AppDelegate.m` file:

```objc
@import BrazeKit;
```

Next, add a static variable to your `AppDelegate.m` file to keep a reference to the Braze instance throughout your application's lifetime:

```objc
static Braze *_braze;

@implementation AppDelegate
+ (Braze *)braze {
  return _braze;
}

+ (void)setBraze:(Braze *)braze {
  _braze = braze;
}
@end
```

Finally, within your `AppDelegate.m` file, add the following snippet within your `application:didFinishLaunchingWithOptions:` method:

```objc
BRZConfiguration *configuration = [[BRZConfiguration alloc] initWithApiKey:"YOUR-APP-IDENTIFIER-API-KEY"
                                                                  endpoint:"YOUR-BRAZE-ENDPOINT"];
Braze *braze = [[Braze alloc] initWithConfiguration:configuration];
AppDelegate.braze = braze;
```

Update `YOUR-APP-IDENTIFIER-API-KEY` and `YOUR-BRAZE-ENDPOINT` with the correct value from your **Manage Settings** page. Check out our [API documentation](https://www.braze.com/docs/api/api_key/#the-app-identifier-api-key) for more information on where to find your app identifier API key.




## Optional configurations

### Logging

#### Log levels

The default log level for the Braze Swift SDK is `.error`&#8212;it's also the minimum supported level when logs are enabled. These are the full list of log levels:

| Swift       | Objective-C              | Description                                                  |
| ----------- | ------------------------ | ------------------------------------------------------------ |
| `.debug`    | `BRZLoggerLevelDebug`    | Log debugging information + `.info` + `.error`.              |
| `.info`     | `BRZLoggerLevelInfo`     | Log general SDK information (user changes, etc.) + `.error`. |
| `.error`    | `BRZLoggerLevelError`    | Log errors.                                                  |
| `.disabled` | `BRZLoggerLevelDisabled` | No logging occurs.                                           |

{: .reset-td-br-1 .reset-td-br-2 .reset-td-br-3 role="presentation" }

#### Setting the log level

You can assign the log level at runtime in your `Braze.Configuration` object. For complete usage details, see [`Braze.Configuration.Logger`](https://braze-inc.github.io/braze-swift-sdk/documentation/brazekit/braze/configuration-swift.class/logger-swift.class).




```swift
let configuration = Braze.Configuration(
  apiKey: "<BRAZE_API_KEY>",
  endpoint: "<BRAZE_ENDPOINT>"
)
// Enable logging of general SDK information (such as user changes, etc.)
configuration.logger.level = .info
let braze = Braze(configuration: configuration)
```




```objc
BRZConfiguration *configuration = [[BRZConfiguration alloc] initWithApiKey:self.APIKey
                                                                  endpoint:self.apiEndpoint];
// Enable logging of general SDK information (such as user changes, etc.)
[configuration.logger setLevel:BRZLoggerLevelInfo];
Braze *braze = [[Braze alloc] initWithConfiguration:configuration];
```







## Integrating the Cordova SDK

### Prerequisites

Before you start, verify your environment is supported by the [latest Braze Cordova SDK version](https://github.com/braze-inc/braze-cordova-sdk?tab=readme-ov-file#minimum-version-requirements).

### Step 1: Add the SDK to your project

**Warning:**


Only add the Braze Cordova SDK using the methods below. Do not attempt to install using other methods as it could lead to a security breach.



If you're on Cordova 6 or later, you can add the SDK directly from GitHub. Alternatively, you can download a ZIP of the [GitHub repository](https://github.com/braze-inc/braze-cordova-sdk) and add the SDK manually.



If you don't plan on using location collection and geofences, use the `master` branch from GitHub.

```bash
cordova plugin add https://github.com/braze-inc/braze-cordova-sdk#master
```



If you plan on using location collection and geofences, use the `geofence-branch` from GitHub.

```bash
cordova plugin add https://github.com/braze-inc/braze-cordova-sdk#geofence-branch
```



**Tip:**


You can switch between `master` and `geofence-branch` at anytime by repeating this step.



### Step 2: Configure your project

Next, adding the following preferences to the `platform` element in your project's `config.xml` file.



```xml
<preference name="com.braze.ios_api_key" value="BRAZE_API_KEY" />
<preference name="com.braze.ios_api_endpoint" value="CUSTOM_API_ENDPOINT" />
```



```xml
<preference name="com.braze.android_api_key" value="BRAZE_API_KEY" />
<preference name="com.braze.android_api_endpoint" value="CUSTOM_API_ENDPOINT" />
```



Replace the following:

| Value                 | Description                                                                                                                      |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `BRAZE_API_KEY`       | Your [Braze REST API key](https://www.braze.com/docs/user_guide/administrative/app_settings/api_settings_tab/#rest-api-keys).              |
| `CUSTOM_API_ENDPOINT` | A custom API endpoint. This endpoint is used to route your Braze instance data to the correct App Group in your Braze dashboard. |
{: .reset-td-br-1 .reset-td-br-2 role="presentation"}

The `platform` element in your `config.xml` file should be similar to the following:



```xml
<platform name="ios">
    <preference name="com.braze.ios_api_key" value="BRAZE_API_KEY" />
    <preference name="com.braze.ios_api_endpoint" value="sdk.fra-01.braze.eu" />
</platform>
```



```xml
<platform name="android">
    <preference name="com.braze.android_api_key" value="BRAZE_API_KEY" />
    <preference name="com.braze.android_api_endpoint" value="sdk.fra-01.braze.eu" />
</platform>
```



## Platform-specific syntax

The following section covers the platform-specific syntax when using Cordova with iOS or Android.

### Integers



Integer preferences are read as string representations, like in the following example:

```xml
<platform name="ios">
    <preference name="com.braze.ios_flush_interval_seconds" value="10" />
    <preference name="com.braze.ios_session_timeout" value="5" />
</platform>
```



Due to how the Cordova 8.0.0+ framework handles preferences, integer-only preferences (such as sender IDs) must be set to strings prepended with `str_`, like in the following example:

```xml
<platform name="android">
    <preference name="com.braze.android_fcm_sender_id" value="str_64422926741" />
    <preference name="com.braze.android_default_session_timeout" value="str_10" />
</platform>
```



### Booleans



Boolean preferences are read by the SDK using `YES` and `NO` keywords as a string representation, like in the following example:

```xml
<platform name="ios">
    <preference name="com.braze.should_opt_in_when_push_authorized" value="YES" />
    <preference name="com.braze.ios_disable_automatic_push_handling" value="NO" />
</platform>
```



Boolean preferences are read by the SDK using `true` and `false` keywords as a string representation, like in the following example:

```xml
<platform name="android">
    <preference name="com.braze.should_opt_in_when_push_authorized" value="true" />
    <preference name="com.braze.is_session_start_based_timeout_enabled" value="false" />
</platform>
```



## Optional configurations {#optional}

You can add any of the following preferences to the `platform` element in your project's `config.xml` file:



| Method                                            | Description                                                                                                                                                                                                                                           |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ios_api_key`                                     | Sets the API key for your application.                                                                                                                                                                                                                |
| `ios_api_endpoint`                                | Sets the [SDK endpoint](https://www.braze.com/docs/api/basics/#endpoints) for your application.                                                                                                                                                                 |
| `ios_disable_automatic_push_registration`         | Sets whether automatic push registration should be disabled.                                                                                                                                                                                          |
| `ios_disable_automatic_push_handling`             | Sets whether automatic push handling should be disabled.                                                                                                                                                                                              |
| `ios_enable_idfa_automatic_collection`            | Sets whether the Braze SDK should automatically collect the IDFA information. For more information, see [the Braze IDFA method documentation](https://braze-inc.github.io/braze-swift-sdk/documentation/brazekit/braze/set(identifierforadvertiser:)/). |
| `enable_location_collection`                      | Sets whether the automatic location collection is enabled (if the user permits). The `geofence-branch`                                                                                                                                                |
| `geofences_enabled`                               | Sets whether geofences are enabled.                                                                                                                                                                                                                   |
| `ios_session_timeout`                             | Sets the Braze session timeout for your application in seconds. Defaults to 10 seconds.                                                                                                                                                               |
| `sdk_authentication_enabled`                      | Sets whether to enable the [SDK Authentication](https://www.braze.com/docs/developer_guide/platform_wide/sdk_authentication#sdk-authentication) feature.                                                                                              |
| `display_foreground_push_notifications`           | Sets whether push notifications should be displayed while the application is in the foreground.                                                                                                                                                       |
| `ios_disable_un_authorization_option_provisional` | Sets whether `UNAuthorizationOptionProvisional` should be disabled.                                                                                                                                                                                   |
| `trigger_action_minimum_time_interval_seconds`    | Sets the minimum time interval in seconds between triggers. Defaults to 30 seconds.                                                                                                                                                                   |
| `ios_push_app_group`                              | Sets the app group ID for iOS push extensions.                                                                                                                                                                                                        |
| `ios_forward_universal_links`                     | Sets if the SDK should automatically recognize and forward universal links to the system methods.                                                                                                                                                     |
| `ios_log_level`                                   | Sets the minimum logging level for `Braze.Configuration.Logger`.                                                                                                                                                                                      |
| `ios_use_uuid_as_device_id`                       | Sets if a randomly generated UUID should be used as the device ID.                                                                                                                                                                                    |
| `ios_flush_interval_seconds`                      | Sets the interval in seconds between automatic data flushes. Defaults to 10 seconds.                                                                                                                                                                  |
| `ios_use_automatic_request_policy`                | Sets whether the request policy for `Braze.Configuration.Api` should be automatic or manual.                                                                                                                                                          |
| `should_opt_in_when_push_authorized`              | Sets if a user’s notification subscription state should automatically be set to `optedIn` when push permissions are authorized.                                                                                                                       |
{: .reset-td-br-1 .reset-td-br-2 role="presentation"}

**Tip:**


For more detailed information, see [GitHub: Braze iOS Cordova plugin](https://github.com/braze-inc/braze-cordova-sdk/blob/master/src/ios/BrazePlugin.m).





| Method                                                            | Description                                                                                                                                                                                   |
| ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `android_api_key`                                                 | Sets the API key for your application.                                                                                                                                                        |
| `android_api_endpoint`                                            | Sets the [SDK endpoint](https://www.braze.com/docs/api/basics/#endpoints) for your application.                                                                                                         |
| `android_small_notification_icon`                                 | Sets the notification small icon.                                                                                                                                                             |
| `android_large_notification_icon`                                 | Sets the notification large icon.                                                                                                                                                             |
| `android_notification_accent_color`                               | Sets the notification accent color using a hexadecimal representation.                                                                                                                        |
| `android_default_session_timeout`                                 | Sets the Braze session timeout for your application in seconds. Defaults to 10 seconds.                                                                                                       |
| `android_handle_push_deep_links_automatically`                    | Sets whether the Braze SDK should automatically handle push deep links.                                                                                                                       |
| `android_log_level`                                               | Sets the log level for your application. The default log level is 4 and will minimally log info. To enable verbose logging for debugging, use log level 2.                                    |
| `firebase_cloud_messaging_registration_enabled`                   | Sets whether to use Firebase Cloud Messaging for push notifications.                                                                                                                          |
| `android_fcm_sender_id`                                           | Sets the Firebase Cloud Messaging sender ID.                                                                                                                                                  |
| `enable_location_collection`                                      | Sets whether the automatic location collection is enabled (if the user permits).                                                                                                              |
| `geofences_enabled`                                               | Sets whether geofences are enabled.                                                                                                                                                           |
| `android_disable_auto_session_tracking`                           | Disable the Android Cordova plugin from automatically tracking sessions. For more information, see [Disabling automatic session tracking](#cordova_disable-automatic-session-tracking) |
| `sdk_authentication_enabled`                                      | Sets whether to enable the [SDK Authentication](https://www.braze.com/docs/developer_guide/platform_wide/sdk_authentication#sdk-authentication) feature.                                      |
| `trigger_action_minimum_time_interval_seconds`                    | Sets the minimum time interval in seconds between triggers. Defaults to 30 seconds.                                                                                                           |
| `is_session_start_based_timeout_enabled`                          | Sets whether the session timeout behavior to be based either on session start or session end events.                                                                                          |
| `default_notification_channel_name`                               | Sets the user-facing name as seen via `NotificationChannel.getName` for the Braze default `NotificationChannel`.                                                                              |
| `default_notification_channel_description`                        | Sets the user-facing description as seen via `NotificationChannel.getDescription` for the Braze default `NotificationChannel`.                                                                |
| `does_push_story_dismiss_on_click`                                | Sets whether a Push Story is automatically dismissed when clicked.                                                                                                                            |
| `is_fallback_firebase_messaging_service_enabled`                  | Sets whether the use of a fallback Firebase Cloud Messaging Service is enabled.                                                                                                               |
| `fallback_firebase_messaging_service_classpath`                   | Sets the classpath for the fallback Firebase Cloud Messaging Service.                                                                                                                         |
| `is_content_cards_unread_visual_indicator_enabled`                | Sets whether the Content Cards unread visual indication bar is enabled.                                                                                                                       |
| `is_firebase_messaging_service_on_new_token_registration_enabled` | Sets whether the Braze SDK will automatically register tokens in `com.google.firebase.messaging.FirebaseMessagingService.onNewToken`.                                                         |
| `is_push_deep_link_back_stack_activity_enabled`                   | Sets whether Braze will add an activity to the back stack when automatically following deep links for push.                                                                                   |
| `push_deep_link_back_stack_activity_class_name`                   | Sets the activity that Braze will add to the back stack when automatically following deep links for push.                                                                                     |
| `should_opt_in_when_push_authorized`                              | Sets if Braze should automatically opt-in the user when push is authorized.                                                                                                                   |
{: .reset-td-br-1 .reset-td-br-2 role="presentation"}

**Tip:**


For more detailed information, see [GitHub: Braze Android Cordova plugin](https://github.com/braze-inc/braze-cordova-sdk/blob/master/src/android/BrazePlugin.kt).





The following is an example `config.xml` file with additional configurations:



```xml
<platform name="ios">
    <preference name="com.braze.ios_disable_automatic_push_registration" value="NO"/"YES" />
    <preference name="com.braze.ios_disable_automatic_push_handling" value="NO"/"YES" />
    <preference name="com.braze.ios_enable_idfa_automatic_collection" value="YES"/"NO" />
    <preference name="com.braze.enable_location_collection" value="NO"/"YES" />
    <preference name="com.braze.geofences_enabled" value="NO"/"YES" />
    <preference name="com.braze.ios_session_timeout" value="5" />
    <preference name="com.braze.sdk_authentication_enabled" value="YES"/"NO" />
    <preference name="com.braze.display_foreground_push_notifications" value="YES"/"NO" />
    <preference name="com.braze.ios_disable_un_authorization_option_provisional" value="NO"/"YES" />
    <preference name="com.braze.trigger_action_minimum_time_interval_seconds" value="30" />
    <preference name="com.braze.ios_push_app_group" value="PUSH_APP_GROUP_ID" />
    <preference name="com.braze.ios_forward_universal_links" value="YES"/"NO" />
    <preference name="com.braze.ios_log_level" value="2" />
    <preference name="com.braze.ios_use_uuid_as_device_id" value="YES"/"NO" />
    <preference name="com.braze.ios_flush_interval_seconds" value="10" />
    <preference name="com.braze.ios_use_automatic_request_policy" value="YES"/"NO" />
    <preference name="com.braze.should_opt_in_when_push_authorized" value="YES"/"NO" />
</platform>
```



```xml
<platform name="android">
    <preference name="com.braze.android_small_notification_icon" value="RESOURCE_ENTRY_NAME_FOR_ICON_DRAWABLE" />
    <preference name="com.braze.android_large_notification_icon" value="RESOURCE_ENTRY_NAME_FOR_ICON_DRAWABLE" />
    <preference name="com.braze.android_notification_accent_color" value="str_ACCENT_COLOR_INTEGER" />
    <preference name="com.braze.android_default_session_timeout" value="str_SESSION_TIMEOUT_INTEGER" />
    <preference name="com.braze.android_handle_push_deep_links_automatically" value="true"/"false" />
    <preference name="com.braze.android_log_level" value="str_LOG_LEVEL_INTEGER" />
    <preference name="com.braze.firebase_cloud_messaging_registration_enabled" value="true"/"false" />
    <preference name="com.braze.android_fcm_sender_id" value="str_YOUR_FCM_SENDER_ID" />
    <preference name="com.braze.enable_location_collection" value="true"/"false" />
    <preference name="com.braze.geofences_enabled" value="true"/"false" />
    <preference name="com.braze.android_disable_auto_session_tracking" value="true"/"false" />
    <preference name="com.braze.sdk_authentication_enabled" value="true"/"false" />
    <preference name="com.braze.trigger_action_minimum_time_interval_seconds" value="str_MINIMUM_INTERVAL_INTEGER" />
    <preference name="com.braze.is_session_start_based_timeout_enabled" value="false"/"true" />
    <preference name="com.braze.default_notification_channel_name" value="DEFAULT_NAME" />
    <preference name="com.braze.default_notification_channel_description" value="DEFAULT_DESCRIPTION" />
    <preference name="com.braze.does_push_story_dismiss_on_click" value="true"/"false" />
    <preference name="com.braze.is_fallback_firebase_messaging_service_enabled" value="true"/"false" />
    <preference name="com.braze.fallback_firebase_messaging_service_classpath" value="FALLBACK_FIREBASE_MESSAGING_CLASSPATH" />
    <preference name="com.braze.is_content_cards_unread_visual_indicator_enabled" value="true"/"false" />
    <preference name="com.braze.is_firebase_messaging_service_on_new_token_registration_enabled" value="true"/"false" />
    <preference name="com.braze.is_push_deep_link_back_stack_activity_enabled" value="true"/"false" />
    <preference name="com.braze.push_deep_link_back_stack_activity_class_name" value="DEEPLINK_BACKSTACK_ACTIVITY_CLASS_NAME" />
    <preference name="com.braze.should_opt_in_when_push_authorized" value="true"/"false" />
</platform>
```



## Disabling automatic session tracking (Android only) {#disable-automatic-session-tracking}

By default, the Android Cordova plugin automatically tracks sessions. To disable automatic session tracking, add the following preference to the `platform` element in your project's `config.xml` file:

```xml
<platform name="android">
    <preference name="com.braze.android_disable_auto_session_tracking" value="true" />
</platform>
```

To start tracking sessions again, call `BrazePlugin.startSessionTracking()`. Keep in mind, only sessions started after the next `Activity.onStart()` will be tracked.




## About the Flutter Braze SDK

After you integrate the Braze Flutter SDK on Android and iOS, you'll be able to use the Braze API within your [Flutter apps](https://flutter.dev/) written in Dart. This plugin provides basic analytics functionality and lets you integrate in-app messages and Content Cards for both iOS and Android with a single codebase.

## Integrating the Flutter SDK

### Prerequisites

Before you integrate the Braze Flutter SDK, you'll need to complete the following:

| Prerequisite | Description |
| --- | --- |
| Braze API app identifier | To locate your app's identifier, go to **Settings** > **APIs and Identifiers** > **App Identifiers**. For more information see, [API Identifier Types](https://www.braze.com/docs/api/identifier_types/#app-identifier).|
| Braze REST endpoint | Your REST endpoint URL. Your endpoint will depend on the [Braze URL for your instance](https://www.braze.com/docs/developer_guide/rest_api/basics/#endpoints).|
| Flutter SDK | Install the official [Flutter SDK](https://docs.flutter.dev/get-started/install) and ensure it meets the Braze Flutter SDK's [minimum supported version](https://github.com/braze-inc/braze-flutter-sdk#requirements). |
{: .reset-td-br-1 .reset-td-br-2 role="presentation" }

### Step 1: Integrate the Braze library

Add the Braze Flutter SDK package from the command line. This will add the appropriate line to your `pubspec.yaml`.

```bash
flutter pub add braze_plugin
```

### Step 2: Complete native SDK setup




To connect to Braze servers, create a `braze.xml` file in your project's `android/res/values` folder. Paste the following code and replace the API identifier key and endpoint with your values:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string translatable="false" name="com_braze_api_key">YOUR_APP_IDENTIFIER_API_KEY</string>
  <string translatable="false" name="com_braze_custom_endpoint">YOUR_CUSTOM_ENDPOINT_OR_CLUSTER</string>
</resources>
```

Add the required permissions to your `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```





Add Braze SDK import at the top of the `AppDelegate.swift` file:
```swift
import BrazeKit
import braze_plugin
```

In the same file, create the Braze configuration object in the `application(_:didFinishLaunchingWithOptions:)` method and replace the API key and endpoint with your app's values. Then, create the Braze instance using the configuration, and create a static property on the `AppDelegate` for easy access:

```swift
static var braze: Braze? = nil

override func application(
  _ application: UIApplication,
  didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
) -> Bool {
  // Setup Braze
  let configuration = Braze.Configuration(
    apiKey: "<BRAZE_API_KEY>",
    endpoint: "<BRAZE_ENDPOINT>"
  )
  // - Enable logging or customize configuration here
  configuration.logger.level = .info
  let braze = BrazePlugin.initBraze(configuration)
  AppDelegate.braze = braze

  return true
}
```


Import `BrazeKit` at the top of the `AppDelegate.m` file:
```objc
@import BrazeKit;
```

In the same file, create the Braze configuration object in the `application:didFinishLaunchingWithOptions:` method and replace the API key and endpoint with your app's values. Then, create the Braze instance using the configuration, and create a static property on the `AppDelegate` for easy access:

```objc
- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // Setup Braze
  BRZConfiguration *configuration =
      [[BRZConfiguration alloc] initWithApiKey:@"<BRAZE_API_KEY>"
                                      endpoint:@"<BRAZE_ENDPOINT>"];
  // - Enable logging or customize configuration here
  configuration.logger.level = BRZLoggerLevelInfo;
  Braze *braze = [BrazePlugin initBraze:configuration];
  AppDelegate.braze = braze;

  [self.window makeKeyAndVisible];
  return YES;
}

#pragma mark - AppDelegate.braze

static Braze *_braze = nil;

+ (Braze *)braze {
  return _braze;
}

+ (void)setBraze:(Braze *)braze {
  _braze = braze;
}
```






### Step 3: Set up the plugin

To import the plugin into your Dart code, use the following:

```dart
import 'package:braze_plugin/braze_plugin.dart';
```

Then, initialize an instance of the Braze plugin by calling `new BrazePlugin()` like in [our sample app](https://github.com/braze-inc/braze-flutter-sdk/blob/master/example/lib/main.dart).

**Important:**


To avoid undefined behaviors, only allocate and use a single instance of the `BrazePlugin` in your Dart code.



## Testing the integration

You can verify that the SDK is integrated by checking session statistics in the dashboard. If you run your application on either platform, you should see a new session in dashboard (in the **Overview** section).

Open a session for a particular user by calling the following code in your app.

```dart
BrazePlugin braze = BrazePlugin();
braze.changeUser("{some-user-id}");
```

Search for the user with `{some-user-id}` in the dashboard under **Audience** > **Search Users**. There, you can verify that session and device data have been logged.





## About the React Native Braze SDK

Integrating the React Native Braze SDK provides basic analytics functionality and lets you integrate in-app messages and Content Cards for both iOS and Android with just one codebase.

## New Architecture compatibility

The following minimum SDK version is compatible with all apps using [React Native's New Architecture](https://reactnative.dev/docs/the-new-architecture/landing-page):

<div id='sdk-versions'><a href='/docs/developer_guide/platforms/react_native/changelog/#201' class='sdk-versions--chip reactnative-sdk' target='_blank'>React Native: 2.0.1+ &nbsp;<i class='fa-solid fa-arrow-up-right-from-square'></i></a></div>

Starting with SDK version 6.0.0, Braze uses a React Native Turbo Module, which is compatible with both the New Architecture and legacy bridge architecture&#8212;meaning no additional setup is required.

**Warning:**


If your iOS app conforms to `RCTAppDelegate` and follows our previous `AppDelegate` setup, review the samples in [Complete native setup](#reactnative_step-2-complete-native-setup) to prevent any crashes from occurring when subscribing to events in the Turbo Module.



## Integrating the React Native SDK

### Prerequisites

To integrate the SDK, React Native version 0.71 or later is required. For the full list of supported versions, see our [React Native SDK GitHub repository](https://github.com/braze-inc/braze-react-native-sdk?tab=readme-ov-file#version-support).

### Step 1: Integrate the Braze library



```bash
npm install @braze/react-native-sdk
```


```bash
yarn add @braze/react-native-sdk
```



### Step 2: Choose a setup option

You can manage the Braze SDK using the Braze Expo plugin or through one of the native layers. With the Expo plugin, you can configure certain SDK features without writing code in any of the native layers. Choose whichever option best meets your app's needs.



#### Step 2.1: Install the Braze Expo plugin

Ensure that your version of the Braze React Native SDK is at least 1.37.0. For the full list of supported versions, check out the [Braze React Native repository](https://github.com/braze-inc/braze-expo-plugin?tab=readme-ov-file#version-support).

To install the Braze Expo plugin, run the following command:

```bash
npx expo install @braze/expo-plugin
```

#### Step 2.2: Add the plugin to your app.json

In your `app.json`, add the Braze Expo Plugin. You can provide the following configuration options:

| Method                                        | Type    | Description                                                                                                                                              |
| --------------------------------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `androidApiKey`                               | string  | Required. The [API key](https://www.braze.com/docs/api/identifier_types/) for your Android application, located in your Braze dashboard under **Manage Settings**. |
| `iosApiKey`                                   | string  | Required. The [API key](https://www.braze.com/docs/api/identifier_types/) for your iOS application, located in your Braze dashboard under **Manage Settings**.     |
| `baseUrl`                                     | string  | Required. The [SDK endpoint](https://www.braze.com/docs/api/basics/#endpoints) for your application, located in your Braze dashboard under **Manage Settings**.    |
| `enableBrazeIosPush`                          | boolean | iOS only. Whether to use Braze to handle push notifications on iOS. Introduced in React Native SDK v1.38.0 and Expo Plugin v0.4.0.                       |
| `enableFirebaseCloudMessaging`                | boolean | Android only. Whether to use Firebase Cloud Messaging for push notifications. Introduced in React Native SDK v1.38.0 and Expo Plugin v0.4.0.             |
| `firebaseCloudMessagingSenderId`              | string  | Android only. Your Firebase Cloud Messaging sender ID. Introduced in React Native SDK v1.38.0 and Expo Plugin v0.4.0.                                    |
| `sessionTimeout`                              | integer | The Braze session timeout for your application in seconds.                                                                                               |
| `enableSdkAuthentication`                     | boolean | Whether to enable the [SDK Authentication](https://www.braze.com/docs/developer_guide/platform_wide/sdk_authentication#sdk-authentication) feature.      |
| `logLevel`                                    | integer | The log level for your application. The default log level is 8 and will minimally log info. To enable verbose logging for debugging, use log level 0.    |
| `minimumTriggerIntervalInSeconds`             | integer | The minimum time interval in seconds between triggers. Defaults to 30 seconds.                                                                           |
| `enableAutomaticLocationCollection`           | boolean | Whether automatic location collection is enabled (if the user permits).                                                                                  |
| `enableGeofence`                              | boolean | Whether geofences are enabled.                                                                                                                           |
| `enableAutomaticGeofenceRequests`             | boolean | Whether geofence requests should be made automatically.                                                                                                  |
| `dismissModalOnOutsideTap`                    | boolean | iOS only. Whether a modal in-app message will be dismissed when the user clicks outside of the in-app message.                                           |
| `androidHandlePushDeepLinksAutomatically`     | boolean | Android only. Whether the Braze SDK should automatically handle push deep links.                                                                         |
| `androidPushNotificationHtmlRenderingEnabled` | boolean | Android only. Sets whether the text content in a push notification should be interpreted and rendered as HTML using `android.text.Html.fromHtml`.        |
| `androidNotificationAccentColor`              | string  | Android only. Sets the Android notification accent color.                                                                                                |
| `androidNotificationLargeIcon`                | string  | Android only. Sets the Android notification large icon.                                                                                                  |
| `androidNotificationSmallIcon`                | string  | Android only. Sets the Android notification small icon.                                                                                                  |
| `iosRequestPushPermissionsAutomatically`      | boolean | iOS only. Whether the user should automatically be prompted for push permissions on app launch.                                                          |
| `enableBrazeIosRichPush`                      | boolean | iOS only. Whether to enable rich push features for iOS.                                                                                                  |
| `enableBrazeIosPushStories`                   | boolean | iOS only. Whether to enable Braze Push Stories for iOS.                                                                                                  |
| `iosPushStoryAppGroup`                        | string  | iOS only. The app group used for iOS Push Stories.                                                                                                       |
| `iosUseUUIDAsDeviceId`                        | boolean | iOS only. Whether the device ID will use a randomly generated UUID.                                                                                       |
{: .reset-td-br-1 .reset-td-br-2 .reset-td-br-3 role="presentation" }

Example configuration:

```json
{
  "expo": {
    "plugins": [
      [
        "@braze/expo-plugin",
        {
          "androidApiKey": "YOUR-ANDROID-API-KEY",
          "iosApiKey": "YOUR-IOS-API-KEY",
          "baseUrl": "YOUR-SDK-ENDPOINT",
          "sessionTimeout": 60,
          "enableGeofence": false,
          "enableBrazeIosPush": false,
          "enableFirebaseCloudMessaging": false,
          "firebaseCloudMessagingSenderId": "YOUR-FCM-SENDER-ID",
          "androidHandlePushDeepLinksAutomatically": true,
          "enableSdkAuthentication": false,
          "logLevel": 0,
          "minimumTriggerIntervalInSeconds": 0,
          "enableAutomaticLocationCollection": false,
          "enableAutomaticGeofenceRequests": false,
          "dismissModalOnOutsideTap": true,
          "androidPushNotificationHtmlRenderingEnabled": true,
          "androidNotificationAccentColor": "#ff3344",
          "androidNotificationLargeIcon": "@drawable/custom_app_large_icon",
          "androidNotificationSmallIcon": "@drawable/custom_app_small_icon",
          "iosRequestPushPermissionsAutomatically": false,
          "enableBrazeIosPushStories": true,
          "iosPushStoryAppGroup": "group.com.example.myapp.PushStories"
        }
      ],
    ]
  }
}
```

#### Step 2.3: Build and run your application

Prebuilding your application will generate the native files necessary for the Braze Expo plugin to work.

```bash
npx expo prebuild
```

Run your application as specified in the [Expo docs](https://docs.expo.dev/workflow/customizing/). Keep in mind, if you make any changes to the configuration options, you'll be required to prebuild and run the application again.




#### Step 2.1: Add our repository

In your top-level project `build.gradle`, add the following under `buildscript` > `dependencies`:

```groovy
buildscript {
    dependencies {
        ...
        // Choose your Kotlin version
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:1.8.10")
    }
}
```

This will add Kotlin to your project.

#### Step 2.2: Configure the Braze SDK

To connect to Braze servers, create a `braze.xml` file in your project's `res/values` folder. Paste the following code and replace the API [key](https://www.braze.com/docs/api/identifier_types/) and [endpoint](https://www.braze.com/docs/api/basics/#endpoints) with your values:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources>
  <string translatable="false" name="com_braze_api_key">YOU_APP_IDENTIFIER_API_KEY</string>
  <string translatable="false" name="com_braze_custom_endpoint">YOUR_CUSTOM_ENDPOINT_OR_CLUSTER</string>
</resources>
```

Add the required permissions to your `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
```

**Tip:**


On Braze SDK version 12.2.0 or later, you can automatically pull in the android-sdk-location library by setting `importBrazeLocationLibrary=true` in your `gradle.properties` file .



#### Step 2.3: Implement user session tracking

The calls to `openSession()` and `closeSession()` are handled automatically.
Add the following code to the `onCreate()` method of your `MainApplication` class:



```java
import com.braze.BrazeActivityLifecycleCallbackListener;

@Override
public void onCreate() {
    super.onCreate();
    ...
    registerActivityLifecycleCallbacks(new BrazeActivityLifecycleCallbackListener());
}
```


```kotlin
import com.braze.BrazeActivityLifecycleCallbackListener

override fun onCreate() {
    super.onCreate()
    ...
    registerActivityLifecycleCallbacks(BrazeActivityLifecycleCallbackListener())
}
```



#### Step 2.4: Handle intent updates

If your MainActivity has `android:launchMode` set to `singleTask`, add the following code to your `MainActivity` class:



```java
@Override
public void onNewIntent(Intent intent) {
    super.onNewIntent(intent);
    setIntent(intent);
}
```


```kotlin
override fun onNewIntent(intent: Intent) {
    super.onNewIntent(intent)
    setIntent(intent)
}
```





#### Step 2.1: (Optional) Configure Podfile for dynamic XCFrameworks

To import certain Braze libraries, such as BrazeUI, into an Objective-C++ file, you will need to use the `#import` syntax. Starting in version 7.4.0 of the Braze Swift SDK, binaries have an [optional distribution channel as dynamic XCFrameworks](https://github.com/braze-inc/braze-swift-sdk-prebuilt-dynamic), which are compatible with this syntax.

If you'd like to use this distribution channel, manually override the CocoaPods source locations in your Podfile. Reference the sample below and replace `{your-version}` with the relevant version you wish to import:

```ruby
pod 'BrazeKit', :podspec => 'https://raw.githubusercontent.com/braze-inc/braze-swift-sdk-prebuilt-dynamic/{your-version}/BrazeKit.podspec'
pod 'BrazeUI', :podspec => 'https://raw.githubusercontent.com/braze-inc/braze-swift-sdk-prebuilt-dynamic/{your-version}/BrazeUI.podspec'
pod 'BrazeLocation', :podspec => 'https://raw.githubusercontent.com/braze-inc/braze-swift-sdk-prebuilt-dynamic/{your-version}/BrazeLocation.podspec'
```

#### Step 2.2: Install pods

Since React Native automatically links the libraries to the native platform, you can install the SDK with the help of CocoaPods.

From the root folder of the project:

```bash
# To install using the React Native New Architecture
cd ios && pod install

# To install using the React Native legacy architecture
cd ios && RCT_NEW_ARCH_ENABLED=0 pod install
```

#### Step 2.3: Configure the Braze SDK




Import the Braze SDK at the top of the `AppDelegate.swift` file:
```swift
import BrazeKit
import braze_react_native_sdk
```

In the `application(_:didFinishLaunchingWithOptions:)` method, replace the API [key](https://www.braze.com/docs/api/identifier_types/) and [endpoint](https://www.braze.com/docs/api/basics/#endpoints) with your app's values. Then, create the Braze instance using the configuration, and create a static property on the `AppDelegate` for easy access:

**Note:**


Our example assumes an implementation of [RCTAppDelegate](https://github.com/facebook/react-native/blob/e64756ae5bb5c0607a4d97a134620fafcb132b3b/packages/react-native/Libraries/AppDelegate/RCTAppDelegate.h), which provides a number of abstractions in the React Native setup. If you are using a different setup for your app, be sure to adjust your implementation as needed.



```swift
func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey : Any]? = nil
) -> Bool {
    // Setup Braze
    let configuration = Braze.Configuration(
        apiKey: "{BRAZE_API_KEY}",
        endpoint: "{BRAZE_ENDPOINT}")
    // Enable logging and customize the configuration here.
    configuration.logger.level = .info
    let braze = BrazeReactBridge.perform(
      #selector(BrazeReactBridge.initBraze(_:)),
      with: configuration
    ).takeUnretainedValue() as! Braze

    AppDelegate.braze = braze

    /* Other configuration */

    return true
}

// MARK: - AppDelegate.braze

static var braze: Braze? = nil
```




Import the Braze SDK at the top of the `AppDelegate.m` file:
```objc
#import <BrazeKit/BrazeKit-Swift.h>
#import "BrazeReactBridge.h"
```

In the `application:didFinishLaunchingWithOptions:` method, replace the API [key](https://www.braze.com/docs/api/identifier_types/) and [endpoint](https://www.braze.com/docs/api/basics/#endpoints) with your app's values. Then, create the Braze instance using the configuration, and create a static property on the `AppDelegate` for easy access:

**Note:**


Our example assumes an implementation of [RCTAppDelegate](https://github.com/facebook/react-native/blob/e64756ae5bb5c0607a4d97a134620fafcb132b3b/packages/react-native/Libraries/AppDelegate/RCTAppDelegate.h), which provides a number of abstractions in the React Native setup. If you are using a different setup for your app, be sure to adjust your implementation as needed.



```objc
- (BOOL)application:(UIApplication *)application
    didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  // Setup Braze
  BRZConfiguration *configuration = [[BRZConfiguration alloc] initWithApiKey:@"{BRAZE_API_KEY}"
                                                                    endpoint:@"{BRAZE_ENDPOINT}"];
  // Enable logging and customize the configuration here.
  configuration.logger.level = BRZLoggerLevelInfo;
  Braze *braze = [BrazeReactBridge initBraze:configuration];
  AppDelegate.braze = braze;

  /* Other configuration */

  return YES;
}

#pragma mark - AppDelegate.braze

static Braze *_braze = nil;

+ (Braze *)braze {
  return _braze;
}

+ (void)setBraze:(Braze *)braze {
  _braze = braze;
}
```







### Step 3: Import the library

Next, `import` the library in your React Native code. For more details, check out our [sample project](https://github.com/braze-inc/braze-react-native-sdk/tree/master/BrazeProject). 

```javascript
import Braze from "@braze/react-native-sdk";
```

### Step 4: Test the integration (optional)

To test your SDK integration, start a new session on either platform for a user by calling the following code in your app.

```javascript
Braze.changeUser("userId");
```

For example, you can assign the user ID at the startup of the app:

```javascript
import React, { useEffect } from "react";
import Braze from "@braze/react-native-sdk";

const App = () => {
  useEffect(() => {
    Braze.changeUser("some-user-id");
  }, []);

  return (
    <div>
      ...
    </div>
  )
```

In the Braze dashboard, go to [User Search](https://www.braze.com/docs/user_guide/engagement_tools/segments/using_user_search#using-user-search) and look for the user with the ID matching `some-user-id`. Here, you can verify that session and device data were logged.




## Integrating the Roku SDK

### Step 1: Add files

Braze SDK files can be found in the `sdk_files` directory in the [Braze Roku SDK repository](https://github.com/braze-inc/braze-roku-sdk).

1. Add `BrazeSDK.brs` to your app in the `source` directory.
2. Add `BrazeTask.brs` and `BrazeTask.xml` to your app in the `components` directory.

### Step 2: Add references

Add a reference to `BrazeSDK.brs` in your main scene using the following `script` element:

```
<script type="text/brightscript" uri="pkg:/source/BrazeSDK.brs"/>
```

### Step 3: Configure

Within `main.brs`, set the Braze configuration on the global node:

```brightscript
globalNode = screen.getGlobalNode()
config = {}
config_fields = BrazeConstants().BRAZE_CONFIG_FIELDS
config[config_fields.API_KEY] = {YOUR_API_KEY}
' example endpoint: "https://sdk.iad-01.braze.com/"
config[config_fields.ENDPOINT] = {YOUR_ENDPOINT}
config[config_fields.HEARTBEAT_FREQ_IN_SECONDS] = 5
globalNode.addFields({brazeConfig: config})
```

You can find your [SDK endpoint](https://www.braze.com/docs/user_guide/administrative/access_braze/sdk_endpoints/) and API key within the Braze dashboard.

### Step 4: Initialize Braze

Initialize the Braze instance:

```brightscript
m.BrazeTask = createObject("roSGNode", "BrazeTask")
m.Braze = getBrazeInstance(m.BrazeTask)
```

## Optional configurations

### Logging

To debug your Braze integration, you can view the Roku debug console for Braze logs. Refer to [Debugging code](https://developer.roku.com/docs/developer-program/debugging/debugging-channels.md) from Roku Developers to learn more.




## About the Unity Braze SDK

For a full list of types, functions, variables, and more, see [Unity Declaration File](https://github.com/braze-inc/braze-unity-sdk/blob/master/Assets/Plugins/Appboy/BrazePlatform.cs). Additionally, if you've already integrated Unity manually for iOS, you can [switch to an automated integration](#unity_automated-integration) instead.

## Integrating the Unity SDK

### Prerequisites

Before you start, verify your environment is supported by the [latest Braze Unity SDK version](https://github.com/braze-inc/braze-unity-sdk/releases).

### Step 1: Choose your Braze Unity package



The Braze [`.unitypackage`](https://docs.unity3d.com/Manual/AssetPackages.html) bundles native bindings for the Android and iOS platforms, along with a C# interface.

There are several Braze Unity packages available for download on the [Braze Unity releases page](https://github.com/Appboy/appboy-unity-sdk/releases):
 
- `Appboy.unitypackage`
    - This package bundles the Braze Android and iOS SDKs and the [SDWebImage](https://github.com/SDWebImage/SDWebImage) dependency for the iOS SDK, which is required for the proper functionality of Braze in-app messaging, and Content Cards features on iOS. The SDWebImage framework is used for downloading and displaying images, including GIFs. If you intend on utilizing full Braze functionality, download and import this package.
- `Appboy-nodeps.unitypackage`
    - This package is similar to `Appboy.unitypackage` except for the [SDWebImage](https://github.com/SDWebImage/SDWebImage) framework is not present. This package is useful if you do not want the SDWebImage framework present in your iOS app.

**Note:**


As of Unity 2.6.0, the bundled Braze Android SDK artifact requires  [AndroidX](https://developer.android.com/jetpack/androidx) dependencies. If you were previously using a `jetified unitypackage`, then you can safely transition to the corresponding `unitypackage`.





The Braze [`.unitypackage`](https://docs.unity3d.com/Manual/AssetPackages.html) bundles native bindings for the Android and iOS platforms, along with a C# interface.

The Braze Unity package is available for download on the [Braze Unity releases page](https://github.com/Appboy/appboy-unity-sdk/releases) with two integration options:

1. `Appboy.unitypackage` only
  - This package bundles the Braze Android and iOS SDKs without any additional dependencies. With this integration method, there will not be proper functionality of Braze in-app messaging, and Content Cards features on iOS. If you intend on utilizing full Braze functionality without custom code, use the option below instead.
  - To use this integration option, ensure that the box next to `Import SDWebImage dependency` is *unchecked* in the Unity UI under "Braze Configuration".
2. `Appboy.unitypackage` with `SDWebImage`
  - This integration option bundles the Braze Android and iOS SDKs and the [SDWebImage](https://github.com/SDWebImage/SDWebImage) dependency for the iOS SDK, which is required for the proper functionality of Braze in-app messaging, and Content Cards features on iOS. The `SDWebImage` framework is used for downloading and displaying images, including GIFs. If you intend on utilizing full Braze functionality, download and import this package.
  - To automatically import `SDWebImage`, be sure to *check* the box next to `Import SDWebImage dependency` in the Unity UI under "Braze Configuration".

**Note:**


To see if you require the [SDWebImage](https://github.com/SDWebImage/SDWebImage) dependency for your iOS project, visit the [iOS in-app message documentation](https://www.braze.com/docs/developer_guide/platform_integration_guides/swift/in-app_messaging/overview/).





### Step 2: Import the package



In the Unity Editor, import the package into your Unity project by navigating to **Assets > Import Package > Custom Package**. Next, click **Import**.

Alternatively, follow the [Unity asset package import](https://docs.unity3d.com/Manual/AssetPackages.html) instructions for a more detailed guide on importing custom Unity packages. 

**Note:**


If you only wish to import the iOS or Android plugin, deselect the `Plugins/Android` or `Plugins/iOS` subdirectory when importing the Braze `.unitypackage`.





In the Unity Editor, import the package into your Unity project by navigating to **Assets > Import Package > Custom Package**. Next, click **Import**.

Alternatively, follow the [Unity asset package import](https://docs.unity3d.com/Manual/AssetPackages.html) instructions for a more detailed guide on importing custom Unity packages. 

**Note:**


If you only wish to import the iOS or Android plugin, deselect the `Plugins/Android` or `Plugins/iOS` subdirectory when importing the Braze `.unitypackage`.





### Step 3: Configure the SDK



#### Step 3.1: Configure `AndroidManifest.xml`

To fullo [`AndroidManifest.xml`](https://docs.unity3d.com/Manual/android-manifest.html) to function. If your app does not have an `AndroidManifest.xml`, you can use the following as a template. Otherwise, if you already have an `AndroidManifest.xml`, ensure that any of the following missing sections are added to your existing `AndroidManifest.xml`.

1. Go to the `Assets/Plugins/Android/` directory and open your `AndroidManifest.xml` file. This is the [default location in the Unity editor](https://docs.unity3d.com/Manual/android-manifest.html).
2. In your `AndroidManifest.xml`, add the required permissions and activities from in the following template.
3. When you're finished, your `AndroidManifest.xml` should only contain a single Activity with `"android.intent.category.LAUNCHER"` present.

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
          package="REPLACE_WITH_YOUR_PACKAGE_NAME">

  <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
  <uses-permission android:name="android.permission.INTERNET" />

  <application android:icon="@drawable/app_icon" 
               android:label="@string/app_name">

    <!-- Calls the necessary Braze methods to ensure that analytics are collected and that push notifications are properly forwarded to the Unity application. -->
    <activity android:name="com.braze.unity.BrazeUnityPlayerActivity" 
      android:theme="@style/UnityThemeSelector"
      android:label="@string/app_name" 
      android:configChanges="fontScale|keyboard|keyboardHidden|locale|mnc|mcc|navigation|orientation|screenLayout|screenSize|smallestScreenSize|uiMode|touchscreen" 
      android:screenOrientation="sensor">
      <meta-data android:name="android.app.lib_name" android:value="unity" />
      <meta-data android:name="unityplayer.ForwardNativeEventsToDalvik" android:value="true" />
      <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
      </intent-filter>
    </activity>

    <!-- A Braze specific FirebaseMessagingService used to handle push notifications. -->
    <service android:name="com.braze.push.BrazeFirebaseMessagingService"
      android:exported="false">
      <intent-filter>
        <action android:name="com.google.firebase.MESSAGING_EVENT" />
      </intent-filter>
    </service>
  </application>
</manifest>
```

**Important:**


All Activity classes registered in your `AndroidManifest.xml` file should be fully integrated with the Braze Android SDK, otherwise your analytics won't be collected. If you add your own Activity class, be sure you [extend the Braze Unity player](#unity_extend-unity-player) so you can prevent this.



#### Step 3.2: Update `AndroidManifest.xml` with your package name

To find your package name, click **File > Build Settings > Player Settings > Android Tab**.

![](https://www.braze.com/docs/assets/img_archive/UnityPackageName.png?f672b49d7a69b2d915c7fef6571dac94)

In your `AndroidManifest.xml`, all instances of `REPLACE_WITH_YOUR_PACKAGE_NAME` should be replaced with your `Package Name` from the previous step.

#### Step 3.3: Add gradle dependencies

To add gradle dependencies to your Unity project, first enable ["Custom Main Gradle Template"](https://docs.unity3d.com/Manual/class-PlayerSettingsAndroid.html#Publishing) in your Publishing Settings. This will create a template gradle file that your project will use. A gradle file handles setting dependencies and other build-time project settings. For more information, check out the Braze Unity sample app's [mainTemplate.gradle](https://github.com/braze-inc/braze-unity-sdk/blob/master/unity-samples/Assets/Plugins/Android/mainTemplate.gradle).

The following dependencies are required:

```groovy
implementation 'com.google.firebase:firebase-messaging:22.0.0'
implementation "androidx.swiperefreshlayout:swiperefreshlayout:1.1.0"
implementation "androidx.recyclerview:recyclerview:1.2.1"
implementation "org.jetbrains.kotlin:kotlin-stdlib:1.6.0"
implementation "org.jetbrains.kotlinx:kotlinx-coroutines-android:1.6.1"
implementation 'androidx.core:core:1.6.0'
```

You may also set these dependencies using the [External Dependency Manager](https://github.com/googlesamples/unity-jar-resolver).

#### Step 3.4: Automate the Unity Android integration

Braze provides a native Unity solution for automating the Unity Android integration. 

1. In the Unity Editor, open the Braze Configuration Settings by navigating to **Braze > Braze Configuration**.
2. Check the **Automate Unity Android Integration** box.
3. In the **Braze API Key** field, input your application's API key found in **Manage Settings** from the Braze dashboard.

**Note:**


This automatic integration should not be used with a manually created `braze.xml` file since the configuration values may conflict during project building. If you require a manual `braze.xml`, disable the automatic integration.





#### Step 3.1: Set your API key

Braze provides a native Unity solution for automating the Unity iOS integration. This solution modifies the built Xcode project using Unity's [`PostProcessBuildAttribute`](http://docs.unity3d.com/ScriptReference/Callbacks.PostProcessBuildAttribute.html) and subclasses the `UnityAppController` using the `IMPL_APP_CONTROLLER_SUBCLASS` macro.

1. In the Unity Editor, open the Braze Configuration Settings by navigating to **Braze > Braze Configuration**.
2. Check the **Automate Unity iOS Integration** box.
3. In the **Braze API Key** field, input your application's API key found in **Manage Settings**.

![](https://www.braze.com/docs/assets/img_archive/unity-ios-appboyconfig.png?c5f9508c68a8b4486761374b9ac78841)

If your application is already using another `UnityAppController` subclass, you will need to merge your subclass implementation with `AppboyAppDelegate.mm`.



## Customizing the Unity package

### Step 1: Clone the repository

In your terminal, clone the [Braze Unity SDK GitHub repository](https://github.com/braze-inc/braze-unity-sdk), then navigate to that folder:



```bash
git clone git@github.com:braze-inc/braze-unity-sdk.git
cd ~/PATH/TO/DIRECTORY/braze-unity-sdk
```



```powershell
git clone git@github.com:braze-inc/braze-unity-sdk.git
cd C:\PATH\TO\DIRECTORY\braze-unity-sdk
```



### Step 2: Export package from repository

First, launch Unity and keep it running in the background. Then, in the repository root, run the following command to export the package to `braze-unity-sdk/unity-package/`.



```bash
/Applications/Unity/Unity.app/Contents/MacOS/Unity -batchmode -nographics -projectPath "$(pwd)" -executeMethod Appboy.Editor.Build.ExportAllPackages -quit
```



```powershell
"%UNITY_PATH%" -batchmode -nographics -projectPath "%PROJECT_ROOT%" -executeMethod Appboy.Editor.Build.ExportAllPackages -quit	
```



**Tip:**


If you experience any issues after running these commands, refer to [Unity: Command Line Arguments](https://docs.unity3d.com/2017.2/Documentation/Manual/CommandLineArguments.html).



### Step 3: Import package into Unity

1. In Unity, import the desired package into your Unity project by navigating to **Assets** > **Import Package** > **Custom Package**.
2. If there's any files you don't want want to import, deselect them now.
3. Customize the exported Unity package located in `Assets/Editor/Build.cs`.

## Switch to an automated integration (Swift only) {#automated-integration}

To take advantage of the automated iOS integration offered in the Braze Unity SDK, follow these steps on transitioning from a manual to an automated integration.

1. Remove all Braze-related code from your Xcode project's `UnityAppController` subclass.
2. Remove Braze iOS libraries from your Unity or Xcode project (such as `Appboy_iOS_SDK.framework` and `SDWebImage.framework`).
3. Import the Braze Unity package into your project again. For a full walkthrough, see [Step 2: Import the package](#unity_step-2-import-the-package).
4. Set your API key again. For a full walkthrough, see [Step 3.1: Set your API key](#unity_step-31-set-your-api-key).

## Optional configurations

### Verbose logging

To enable verbose logging in the Unity Editor, do the following:

1. Open the Braze Configuration Settings by navigating to **Braze** > **Braze Configuration**.
2. Click the **Show Braze Android Settings** dropdown.
3. In the **SDK Log Level** field, input the value "0".

### Prime 31 compatibility

To use the Braze Unity plugin with Prime31 plugins, edit your project's `AndroidManifest.xml` to use the Prime31 compatible Activity classes. Change all references of
`com.braze.unity.BrazeUnityPlayerActivity` to `com.braze.unity.prime31compatible.BrazeUnityPlayerActivity`

### Amazon Device Messaging (ADM)

Braze supports integrating [ADM push](https://developer.amazon.com/public/apis/engage/device-messaging) into Unity apps. If you want to integrate ADM push, create a file called `api_key.txt` containing your ADM API key and place it in the `Plugins/Android/assets/` folder.  For more information on integrating ADM with Braze, visit our [ADM push integration instructions](https://www.braze.com/docs/developer_guide/push_notifications/?sdktab=unity).

### Extending the Braze Unity player (Android only) {#extend-unity-player}

The example `AndroidManifest.xml` file provided has one Activity class registered, [`BrazeUnityPlayerActivity`](https://github.com/braze-inc/braze-android-sdk/blob/e804cb3a10ae68364b354b52abf1bef8a0d1a9dc/android-sdk-unity/src/main/java/com/braze/unity/BrazeUnityPlayerActivity.kt). This class is integrated with the Braze SDK and extends `UnityPlayerActivity` with session handling, in-app message registration, push notification analytics logging, and more. See [Unity](https://docs.unity3d.com/Manual/AndroidUnityPlayerActivity.html) for more information on extending the `UnityPlayerActivity` class.

If you are creating your own custom `UnityPlayerActivity` in a library or plugin project, you will need to extend our `BrazeUnityPlayerActivity` to integrate your custom functionality with Braze. Before beginning work on extending `BrazeUnityPlayerActivity`, follow our instructions for integrating Braze into your Unity project.

1. Add the Braze Android SDK as a dependency to your library or plugin project as described in the [Braze Android SDK integration instructions](https://www.braze.com/docs/developer_guide/sdk_integration/?sdktab=android).
2. Integrate our Unity `.aar`, which contains our Unity-specific functionality, to your Android library project you are building for Unity. The `appboy-unity.aar` is available from our [public repo](https://github.com/braze-inc/braze-unity-sdk/tree/master/Assets/Plugins/Android). After our Unity library is successfully integrated, modify your `UnityPlayerActivity` to extend `BrazeUnityPlayerActivity`.
3. Export your library or plugin project and drop it into `/<your-project>/Assets/Plugins/Android` as normal. Do not include any Braze source code in your library or plugin as they will already be present in `/<your-project>/Assets/Plugins/Android`.
4. Edit your `/<your-project>/Assets/Plugins/Android/AndroidManifest.xml` to specify your `BrazeUnityPlayerActivity` subclass as the main activity.

You should now be able to package an `.apk` from the Unity IDE that is fully integrated with Braze and contains your custom `UnityPlayerActivity` functionality.

## Troubleshooting

### Error: "File could not be read"

Errors resembling the following may be safely ignored. Apple software uses a proprietary PNG extension called CgBI, which Unity does not recognize. These errors will not affect your iOS build or the proper display of the associated images in the Braze bundle.

```
Could not create texture from Assets/Plugins/iOS/AppboyKit/Appboy.bundle/...png: File could not be read
```




## Integrating the .NET MAUI SDK

Integrating the Braze .NET MAUI (formerly Xamarin) SDK will provide you with basic analytics functionality as well as working in-app messages with which you can engage your users. 

### Prerequisites

Before you can integrate the .NET MAUI Braze SDK, be sure you meet the following requirements:

- Starting in `version 3.0.0`, this SDK requires using .NET 6+ and removes support for projects using the Xamarin framework.
- Starting in `version 4.0.0`, this SDK dropped support for Xamarin & Xamarin.Forms and added support for .NET MAUI. See [Microsoft's policy](https://dotnet.microsoft.com/en-us/platform/support/policy/xamarin) around the end of support for Xamarin.

### Step 1: Get the .NET MAUI binding



A .NET MAUI binding is a way to use native libraries in .NET MAUI apps. The implementation of a binding consists of building a C# interface to the library, and then using that interface in your application.  See the [.NET MAUI documentation](http://developer.xamarin.com/guides/android/advanced_topics/java_integration_overview/binding_a_java_library_%28.jar%29/). There are two ways to include the Braze SDK binding: using NuGet or compiling from source.



The simplest integration method involves getting the Braze SDK from the [NuGet.org](https://www.nuget.org/) central repository. In the Visual Studio sidebar, right click `Packages` folder and click `Add Packages...`.  Search for 'Braze' and install the [`BrazePlatform.BrazeAndroidBinding`](https://www.nuget.org/packages/BrazePlatform.BrazeAndroidBinding/) package into your project.



The second integration method is to include the [binding source](https://github.com/braze-inc/braze-xamarin-sdk). Under [`appboy-component/src/androidnet6`](https://github.com/braze-inc/braze-xamarin-sdk/tree/master/appboy-component/src/androidnet6/BrazeAndroidNet6Binding) you will find our binding source code; adding a project reference to the ```BrazeAndroidBinding.csproj``` in your .NET MAUI application will cause the binding to be built with your project and provide you access to the Braze Android SDK.





**Important:**


The iOS bindings for .NET MAUI SDK version 4.0.0 and later use the [Braze Swift SDK](https://github.com/braze-inc/braze-swift-sdk/), while previous versions use the [legacy AppboyKit SDK](https://github.com/Appboy/Appboy-ios-sdk).



A .NET MAUI binding is a way to use native libraries in .NET MAUI apps. The implementation of a binding consists of building a C# interface to the library and then using that interface in your application. There are two ways to include the Braze SDK binding: using NuGet or compiling from source.



The simplest integration method involves getting the Braze SDK from the [NuGet.org](https://www.nuget.org/) central repository. In the Visual Studio sidebar, right-click `Packages` folder and click `Add Packages...`.  Search for 'Braze' and install the latest .NET MAUI iOS NuGet packages: [Braze.iOS.BrazeKit](https://www.nuget.org/packages/Braze.iOS.BrazeKit), [Braze.iOS.BrazeUI](https://www.nuget.org/packages/Braze.iOS.BrazeUI), and [Braze.iOS.BrazeLocation](https://www.nuget.org/packages/Braze.iOS.BrazeLocation) into your project.

We also provide the compatibility libraries packages: [Braze.iOS.BrazeKitCompat](https://www.nuget.org/packages/Braze.iOS.BrazeKitCompat) and [Braze.iOS.BrazeUICompat](https://www.nuget.org/packages/Braze.iOS.BrazeUICompat), to help make your migration to .NET MAUI easier.



The second integration method is to include the [binding source](https://github.com/braze-inc/braze-xamarin-sdk). Under [`appboy-component/src/iosnet6`](https://github.com/braze-inc/braze-xamarin-sdk/tree/master/appboy-component/src/iosnet6/BrazeiOSNet6Binding) you will find our binding source code; adding a project reference to the ```BrazeiOSBinding.csproj``` in your .NET MAUI application will cause the binding to be built with your project and provide you access to the Braze iOS SDK. Make sure `BrazeiOSBinding.csproj` is showing in your project's "Reference" folder.





### Step 2: Configure your Braze instance



#### Step 2.1: Configure the Braze SDK in Braze.xml

Now that the libraries have been integrated, you have to create an `Braze.xml` file in your project's `Resources/values` folder. The contents of that file should resemble the following code snippet:

**Note:**


Be sure to substitute `YOUR_API_KEY` with the API key located at **Settings** > **API Keys** in the Braze dashboard.
<br><br>
If you are using the [older navigation](https://www.braze.com/docs/user_guide/administrative/access_braze/navigation/), you can find API keys at **Developer Console** > **API Settings**..



```xml
  <?xml version="1.0" encoding="utf-8"?>
  <resources>
    <string translatable="false" name="com_braze_api_key">YOUR_API_KEY</string>
    <string translatable="false" name="com_braze_custom_endpoint">YOUR_CUSTOM_ENDPOINT_OR_CLUSTER</string>
    <string-array name="com_braze_internal_sdk_metadata">
      <item>XAMARIN</item>
      <item>NUGET</item>
    </string-array>
  </resources>
```
If you are including the binding source manually, remove `<item>NUGET</item>` from your code.

**Tip:**


To see an example `Braze.xml`, check out our [Android MAUI sample app](https://github.com/braze-inc/braze-xamarin-sdk/blob/master/appboy-component/samples/android-net-maui/BrazeAndroidMauiSampleApp/BrazeAndroidMauiSampleApp/Resources/values/Braze.xml).



#### Step 2.2: Add required permissions to Android manifest

Now that you've added your API key, you need to add the following permissions to your `AndroidManifest.xml` file:

```xml
<uses-permission android:name="android.permission.INTERNET" />
```
For an example of your `AndroidManifest.xml`, see the [Android MAUI](https://github.com/braze-inc/braze-xamarin-sdk/blob/master/appboy-component/samples/android-net-maui/BrazeAndroidMauiSampleApp/BrazeAndroidMauiSampleApp/AndroidManifest.xml) sample application.

#### Step 2.3: Track user sessions and registering for in-app messages

To enable user session tracking and register your app for in-app messages, add the following call to the `OnCreate()` lifecycle method of the `Application` class in your app:

```kotlin
RegisterActivityLifecycleCallbacks(new BrazeActivityLifecycleCallbackListener());
```



When setting up your Braze instance, add the following snippet to configure your instance:

**Note:**


Be sure to substitute `YOUR_API_KEY` with the API key located at **Settings** > **API Keys** in the Braze dashboard.

If you are using the [older navigation](https://www.braze.com/docs/user_guide/administrative/access_braze/navigation/), you can find API keys at **Developer Console** > **API Settings**..



```csharp
var configuration = new BRZConfiguration("YOUR_API_KEY", "YOUR_ENDPOINT");
configuration.Api.AddSDKMetadata(new[] { BRZSDKMetadata.Xamarin });
braze = new Braze(configuration);
```

See the `App.xaml.cs` file in the [iOS MAUI](https://github.com/braze-inc/braze-xamarin-sdk/blob/master/appboy-component/samples/ios-net-maui/BrazeiOSMauiSampleApp/BrazeiOSMauiSampleApp/App.xaml.cs) sample application.



### Step 3: Test the integration



Now you can launch your application and see sessions being logged to the Braze dashboard (along with device information and other analytics). For a more in-depth discussion of best practices for the basic SDK integration, consult the [Android integration instructions](https://www.braze.com/docs/developer_guide/sdk_integration/?sdktab=android).



Now you can launch your application and see sessions being logged to the Braze dashboard. For a more in-depth discussion of best practices for the basic SDK integration, consult the [iOS integration instructions](https://www.braze.com/docs/developer_guide/sdk_integration/?sdktab=swift).

**Important:**


Our current public .NET MAUI binding for the iOS SDK does not connect to the iOS Facebook SDK (linking social data) and does not include sending the IDFA to Braze.








# ChatGPT app integration

## Setup

### Step 1: Get the Braze integration file

Copy the `braze.js` file from our [ChatGPT apps integration repository](https://github.com/braze-inc/chatgpt-apps-braze-integration/blob/main/src/braze/braze.ts) to your project. This file contains all the necessary Braze SDK configuration and helper functions.

### Step 2: Install dependencies

Install our Web SDK for Braze's most up-to-date set of features:

**For client-side integration:**
```bash
npm install @braze/web-sdk
```

<!-- **For server-side integration:**
```bash
npm install @braze/javascript-sdk
``` -->

<!-- The Braze JavaScript SDK is primarily designed for headless (server-side) environments and is currently in [beta](https://www.braze.com/company/legal/beta-terms). -->

## Implementation

There are two ways to integrate Braze with your ChatGPT app depending on your use case:

### Client-side integration (custom widgets)

**Tip:**


**Recommended Approach:** This method enables rich messaging experiences and real-time user interaction tracking within your ChatGPT app widgets.



For displaying Braze messaging and tracking user interactions within your custom ChatGPT app widgets, use the Web SDK integration. A full messaging example can be found in our sample repository [here](https://github.com/braze-inc/chatgpt-apps-braze-integration/tree/main/src/inbox).

#### Configure widget metadata

Add the following metadata to your MCP server file to allow Braze domains, ensuring to update the CDN domain based on [your region](https://www.braze.com/docs/developer_guide/platforms/web/content_security_policy):

```javascript
"openai/widgetCSP": {
  connect_domains: ["https://YOUR-SDK-ENDPOINT"],
  resource_domains: [
    "https://appboy-images.com",
    "https://braze-images.com",
    "https://cdn.braze.eu",
    "https://use.fontawesome.com"
  ],
}
```

Replace `YOUR-SDK-ENDPOINT` with your actual Braze SDK endpoint.

#### Set up the useBraze hook

```javascript
import { useBraze } from "./utils/braze";

function YourWidget() {
  const braze = useBraze({
    apiKey: "your-braze-api-key",
    baseUrl: "your-braze-endpoint.braze.com",
  });

  useEffect(() => {
    if (!braze.isInitialized) {
      return;
    }

    // Set user identity
    braze.changeUser("user-id-123");
    
    // Log widget interactions
    braze.logCustomEvent("viewed_pizzaz_list");
  }, [braze.isInitialized]);

  return (
    // Your widget JSX
  );
}
```

#### Display Braze Content Cards

```javascript
const [cards, setCards] = useState([]);

useEffect(() => {
  // Get cached content cards
  setCards(braze.getCachedContentCards()?.cards ?? []);

  // Subscribe to content card updates
  braze.subscribeToContentCardsUpdates((contentCards) => {
    setCards(contentCards.cards);
  });

  // Open session
  braze.openSession();

  return () => {
    braze.removeAllSubscriptions();
  }
}, []);
```

#### Track widget events

```javascript
// Track user interactions within your widget
const handleButtonClick = () => {
  braze.logCustomEvent("widget_button_clicked", {
    button_type: "save_list",
    widget_name: "pizza_list"
  });
};

const handleItemInteraction = (itemId) => {
  braze.logCustomEvent("item_interacted", {
    item_id: itemId,
    interaction_type: "view_details"
  });
};
```

### Server-side integration (MCP server)

<!-- For tracking events and purchases from your MCP server, add these code snippets to your server file (typically `server.js` or `server.ts`) where you handle ChatGPT app requests and tool calls. -->
For tracking events and purchases from your MCP server, use our [REST API](https://www.braze.com/docs/api/home). If you also need messaging functionality on your MCP server, open a [support case](https://support.braze.com/login).

<!-- #### Import the Braze functions

```javascript
// Import the desired methods from wherever you saved the file
import { BrazeSessionInfo, logCustomEvent, logPurchase } from "./braze/braze.js";
```

#### Set up session information

```javascript
// Create session info for Braze
const brazeSessionInfo: BrazeSessionInfo = {
  userId: userId,
  sessionId: sessionId || "default-session"
};
```

#### Track user interactions

```javascript
// Log custom events for user interactions
await logCustomEvent(brazeSessionInfo, "chatgpt_app_interaction", {
  app_id: "your_chatgpt_app_id",
  tool_name: request.params.name,
  user_authenticated: userId !== "anonymous",
  timestamp: new Date().toISOString()
});
```

#### Track purchases and transactions

```javascript
// Calculate order details for purchases
const totalPrice = examplePriceMethod(args.size, args.quantity);
const orderId = `ORDER-${Date.now()}`;

// Define the purchase properties you'd like to use
const purchaseProperties = {
  orderId,
  customerName: args.customerName,
  size: args.size,
  quantity: args.quantity,
  deliveryAddress: args.deliveryAddress,
  specialInstructions: args.specialInstructions,
  estimatedTime,
  totalPrice
};

// Log the purchase to Braze
await logPurchase(
  brazeSessionInfo, 
  "pizza", 
  totalPrice, 
  "USD", 
  args.quantity, 
  purchaseProperties
);
```

**Tip:**


Use the [SDK debugger](https://www.braze.com/docs/developer_guide/sdk_integration/debugging) to verify your integration and troubleshoot any issues.

 -->




## About the Braze Vega SDK

The Braze Vega SDK lets you collect analytics and display rich in-app messages to your users. Most methods in the Braze Vega SDK are asynchronous and return promises that should be awaited or resolved.

## Integrating the Braze Vega SDK

### Step 1: Install the Braze library

Install the Braze Vega SDK using your preferred package manager.



If your project uses NPM, you can add the Braze Vega SDK as a dependency.

```bash
npm install @braze/vega-sdk --save
```

After installation, you can import the methods you need:

```javascript
import { initialize, changeUser, openSession } from "@braze/vega-sdk";
```



If your project uses Yarn, you can add the Braze Vega SDK as a dependency.

```bash
yarn add @braze/vega-sdk
```

After installation, you can import the methods you need:

```javascript
import { initialize, changeUser, openSession } from "@braze/vega-sdk";
```



### Step 2: Initialize the SDK

After the Braze Vega SDK is added to your project, initialize the library with the API key and [SDK endpoint URL](https://www.braze.com/docs/user_guide/administrative/access_braze/sdk_endpoints) found in **Settings** > **App Settings** within your Braze dashboard.

**Important:**


You must await or resolve the `changeUser` promise before calling other Braze methods, or events and attributes may be set on the incorrect user.



```javascript
import { useEffect } from "react-native";
import {
  initialize,
  changeUser,
  logCustomEvent,
  openSession,
  setCustomUserAttribute,
  setUserCountry
} from "@braze/vega-sdk";

const App = () => {
  useEffect(() => {
    const initBraze = async () => {
      // Initialize the SDK
      await initialize("YOUR-API-KEY", "YOUR-SDK-ENDPOINT", {
        sessionTimeoutInSeconds: 60,
        appVersionNumber: "1.2.3.4",
        enableLogging: true, // set to `true` for debugging
      });

      // Change user
      await changeUser("user-id-123");
      
      // Start a session
      await openSession();
      
      // Log custom events and set user attributes
      logCustomEvent("visited-page", { pageName: "home" });
      setCustomUserAttribute("my-attribute", "my-attribute-value");
      setUserCountry("USA");
    };
    
    initBraze();
  }, []);
  
  return (
    // Your app components
  );
};
```

**Important:**


Anonymous users may be counted towards your [MAU](https://www.braze.com/docs/user_guide/data_and_analytics/reporting/understanding_your_app_usage_data/#monthly-active-users). As a result, you may want to conditionally load or initialize the SDK to exclude these users from your MAU count.



## Optional configurations

### Logging

You can enable SDK logging to help with debugging and troubleshooting. There are multiple ways to enable logging.

#### Enable logging during initialization

Pass `enableLogging: true` to `initialize()` to log debugging messages to the console:

```javascript
initialize("YOUR-API-KEY", "YOUR-SDK-ENDPOINT", {
  enableLogging: true
});
```

**Important:**


Basic logs are visible to all users, so consider disabling logging before releasing your code to production.



#### Enable logging after initialization

Use `toggleLogging()` to enable or disable SDK logging after initialization:

```javascript
import { toggleLogging } from "@braze/vega-sdk";

// Enable logging
toggleLogging();
```

#### Custom logging

Use `setLogger()` to provide a custom logger function for more control over how SDK logs are handled:

```javascript
import { setLogger } from "@braze/vega-sdk";

setLogger((message) => {
  console.log("Braze Custom Logger: " + message);
  // Add your custom logging logic here
});
```

### Configuration options

You can pass additional configuration options to `initialize()` to customize the SDK behavior:

```javascript
await initialize("YOUR-API-KEY", "YOUR-SDK-ENDPOINT", {
  sessionTimeoutInSeconds: 60,        // Configure session timeout (default is 30 seconds)
  appVersionNumber: "1.2.3.4",        // Set your app version
  enableLogging: true,                 // Enable SDK logging
});
```

## Upgrading the SDK

When you reference the Braze Vega SDK from NPM or Yarn, you can upgrade to the latest version by updating your package dependency:

```bash
npm update @braze/vega-sdk
# or, using yarn:
yarn upgrade @braze/vega-sdk
```

## Testing your integration

To verify your SDK integration is working correctly:

1. Initialize the SDK with `enableLogging: true` to see debug messages in the console
2. Ensure you `await changeUser()` before calling other SDK methods
3. Call `await openSession()` to start a session
4. Check your Braze dashboard under **Overview** to verify that session data is being recorded
5. Test logging a custom event and verify it appears in your dashboard






**Note:**


While performing QA on your SDK integration, use the [SDK Debugger](https://www.braze.com/docs/developer_guide/sdk_integration/debugging) to get troubleshoot issues without turning on verbose logging for your app.


