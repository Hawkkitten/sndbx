# F.A.Q

## Can I use my test account on the live system?

No, the test and live systems are completely separate from each other. No data exchange takes place.

## Can I use real card details in the test environment?

No, the use of real card details is not possible and will generate an error.

## Which functions are available in the test system?

On the test system, all Saferpay functions are available. Saferpay Business is usually switched off for test accounts. For this reason, it is important that you decide in advance whether or not you will also be using the business features in live operations later on.

## Which payment methods can I test?

Currently, the following payment methods are available:

+ SEPA Direct Debit (Currency EUR only)
+	PayPal
+	American Express
+	Diners Club
+	JCB
+	Mastercard
+	myOne
+	Shopping Bonus Card
+	VISA
+	Masterpass Wallet 
+ Additional payment methods can be made available on demand. For this, please contact the [Saferpay Integration Team](mailto:integration.saferpay@six-payment-services.com?subject=Additional%20payment%20methods).

## What currencies are available in the test system?

By default, EUR and CHF are enabled on test accounts. Other currencies can be activated on demand. For this, please contact the [Saferpay Integration Team](mailto:integration.saferpay@six-payment-services.com?subject=Test%20Account%20Currencies).

## I have already a shop system. Do you offer an extension for it?

Ready-to-use Saferpay payment extensions for several shop systems are offered by our partner [Customweb](https://www.sellxed.com/shop/en/eur/extensions/module/payment-service-provider/saferpay.html). You get 1 year support and where required integration service.

## I have finished my testing. What are the next steps? How do i go live?

We will activate the things necessary for you and will send you the respective logins and Ids (like Customer-and TerminalId), in order to go live.
However, there are things you need to change with the Go-Live, before you can start accepting payments:

* As mentioned, you will get new Logins and IDs with your live account. Those have to be changed inside your application.
* The JSON-API user and password need to be changed. Once you have recieved your live Backoffice user, you need to log into [This site here | Link zum BO]. Then you need to create your own credentials under [Administration > JSON API | Link dorthin]. Those credentials have to be entered inside your application.

* Lastly, you need to change the request-gateway URL from https://test.saferpay.com/api/[...] to https://www.saferpay.com/api/[...] in order  to send your requests to the Saferpay live-system, instead of the test-system.
