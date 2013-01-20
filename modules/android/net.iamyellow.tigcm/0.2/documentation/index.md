<h1>GCM Module</h1>
<hr>
<h3>Initial Setup</h3>

You will have to register for GCM services on Google's website here:
<http://developer.android.com/guide/google/gcm/gs.html>

After you register you will need the **project ID** that will be used to identify the app in the registration moment.


The module uses a service that starts when the app starts (if not already started) that runs a pure js file where you will setup what needs to happen when a notification arrives to the device.


To setup the module in the project the best way is to unzip it into the path:

<code>
app_root_folder/modules/android/
</code>


We will have to set few things into **tiapp.xml** and in the javascript file that will be run as a service to make the module funcional.

<h3>tiapp.xml</h3>

<pre><code>
    &lt;android xmlns:android="http://schemas.android.com/apk/res/android">
	    &lt;services>
            &lt;service android:process=":gcmnotification" url="gcm.js"/>
        &lt;/services>
	&lt;/android>
    &lt;modules>
	    <module platform="android" version="0.2">net.iamyellow.tigcm</module>
	&lt;/modules>
	

	
    &lt;property name="tigcm.service_filename" type="string">gcm&lt;/property>
    &lt;property name="tigcm.sender_id" type="string">project_ID&lt;/property>

</code></pre>

**Explanations:**

* The service that will run is like any other Titnaium service only that it needs to be identified by using <code>android:process=":gcmnotification"</code>. The name of the process can be any string **as long as it starts with a column** ( eg. <code>android:process=":my_gcm_service"</code>)

* The first property named **tigcm.service_filename** is the same file from the service only without extension. If you change the service filename you will have to chnage here the name too.

* The second property named **tigcm.sender_id** isthe **project_ID** you were assigned when you set up your application with Google GCM service in the **Intitial Setup** step.


<h3>GCM Module events, methods and properties</h3>
**Events:**


* **registered** - the application registered with success with the Google's GCM service
* **unregistered** - the application unregistered with success from the Google's GCM service (when you want to disable push for example )
* **error** - there is an error with the registration
* **recoverableError** - there is an error inisde the application but is not fatal
* **message** - the application receives an message whioe in foreground. This event triggers only if **fireEventWhenInFg** is set to true (read below)*


**Properties:**

* **fireEventWhenInFg** - setting this to true will trigger the **message** event while the app is in foreground and will NOT execute gcm.js. If the app is in background or stopped the gcm.js file will execute. This is usefull for example when we want the application to be updated witout the user interaction when in foreground.


**Methods:**

* **registerDevice()** - the app register with GCM servers to receive notifications.
* **unregisterDevice()** - the app unregister from GCM services and will not receive notifications.

<h3>gcm.js</h3>

This is the file that will run as a service and will be executed when a notification arrives 

In the example we setup a local notification to alert the user when a "push" notification arrives.
To setup the intents we need to set the following parameters:

<pre><code>
	className: 'info.rborn.gcmmp.GcmmpActivity',
	packageName: 'info.rborn.gcmmp'
</code></pre>

The **packageName** is the **id** of your application visible in tiapp.xml  (eg. <code>&lt;id>info.rborn.gcmmp&lt;/id></code>)

The **className** is the main activity if the aplication and can be found after a first build in the 
<code>
app_root_folder/build/android/AndroidManifest.xml
</code> file. it will look similar to the below code:
<pre><code>
		&lt;activity android:name=".GcmmpActivity"
			android:label="gcmmp" android:theme="@style/Theme.Titanium"
			android:configChanges="keyboardHidden|orientation">
			&lt;intent-filter>
				&lt;action android:name="android.intent.action.MAIN" />
				&lt;category android:name="android.intent.category.LAUNCHER" />
			&lt;/intent-filter>
		&lt;/activity>
</code></pre>


You will have to join the **app id**(info.rborn.gcmmp) and the **activity name** (.GcmmpActivity) to obtain the className parameter.

Keep in mind that this is only if you use local notifications intents. If you application doesn't need an intent to wake up the application when a push arrives and you only want to write into a database you won't need all this. More info about local notifications in android here: <http://docs.appcelerator.com/titanium/2.1/index.html#!/guide/Android_Notifications>





