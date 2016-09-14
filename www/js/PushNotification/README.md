# AngularJs Cordova Push Notification Plugin

##Plugin by Scorchsoft.com

This is licenced under the MIT open source licence http://opensource.org/licenses/MIT

## Requirements

- Cordova 3
- AngularJs

## Android Pre-requisites

Google Cloud Messaging Project ID

Google Cloud Messaging API Key for above Project ID (need for server)


## iOS Pre-requisites

App ID configured for Push Notifications on Apple Developer Portal

SSL Certificate and private key (need for server)


## Install Required Plugins

  `cordova plugin add org.apache.cordova.device org.apache.cordova.vibration org.apache.cordova.dialogs org.apache.cordova.media https://github.com/phonegap-build/PushPlugin.git`

## Include external scripts

Include following script lines to your `index.html` to reference the PushNotification plugin.

  `<script type="text/javascript" src="push.js"></script>`
  `<script type="text/javascript" src="pushnotification.js"></script>`

## AngularJs modifications

Initialise Push Plugin in AngularJs by adding module `pushNotify`

## To register device on Angular App initialise, add following lines in your angular app:

  `pushNotification.registerPush();`

Store the returned device registration ID to send future notifications to device

## To send send push notifications

For android push notifications, use included `android-erver.php` file.

Make sure to replace Google API key, and add array for devices to which you want to send notifications.

## Example

AngularJs example included with file named `angular-example.js`.
