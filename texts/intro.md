# Einleitung

Die Saferpay JSON API (**J**ava**S**cript **O**bject **N**otation **A**pplication **P**rogramming **I**nterface), in der Folge auch JA genannt, ist eine moderne schlanke Schnittstelle, die unabhängig von Programmiersprachen ist. 
Die JA unterstützt alle Saferpay Methoden und ist für alle Shop-Systeme, Callcenter-Lösungen, Warenwirtschafts-, ERP-, CRM-Systeme sowie alle anderen Einsatzgebiete geeignet, in denen Online-Zahlungen verarbeitet werden müssen.
Dieser Integrationsguide beschäftigt sich mit den Grundlagen der Saferpay JSON-API und dient als Hilfestellung für Programmierer und Integratoren. Er soll gängige Abläufe beschreiben und Gängige Fragen beantworten.

## <a name="intro-requirement"></a> Voraussetzungen

Die Nutzung der JA setzt Folgendes voraus:

* Eine entsprechende Lizenz für das Saferpay Modul.
* Das Vorhandensein einer gültigen Kennung mit Benutzername und Passwort für das Saferpay Backoffice.
* Mindestens ein aktives Saferpay Terminal, über das die Zahlungen durchgeführt werden können ist vorhanden und die dazugehörige 
* Saferpay Terminalnummer sowie die Saferpay Kundennummer liegen vor.
* Ein gültiger Akzeptanzvertrag für Kreditkarten oder ein anderes Zahlungsmittel liegt vor.

## <a name="pci"></a>  Datensicherheit und PCI DSS

Die Kreditkartenorganisationen haben das Sicherheitsprogramm PCI DSS (Payment Card Industry Data Security Standard) ins Leben gerufen, um Betrug mit Kreditkarten und deren Missbrauch vorzubeugen.

Bitte beachten Sie bei der Gestaltung des Zahlungsprozesses und dem Einsatz von Saferpay die PCI DSS Richtlinien. 

Bei Nutzung des Saferpay Hosted Register Form zusammen mit dem optionalen Dienst Saferpay Secure Card Data, abgekürzt SCD, können Sie die Zahlungsprozesse so sicher gestalten, dass keine Kreditkartennummern auf Ihren (Web)Servern verarbeitet, weitergeleitet oder gespeichert werden. 

Bei Nutzung der Saferpay Payment Page erfasst der Karteninhaber seine Kreditkartennummer und das Verfalldatum nicht innerhalb der E-Commerce-Applikation des Händlers, sondern innerhalb der Saferpay Payment Page. Da die E-Commerce-Applikation und Saferpay auf physisch getrennten Plattformen betrieben werden, besteht keine Gefahr, dass die Kreditkartendaten in der Datenbank des Händlersystems gespeichert werden können. 

Das Risiko eines Missbrauchs der Kreditkartendaten wird durch die Nutzung von Saferpay Secure Card Data oder der Saferpay Payment Page deutlich reduziert und der Aufwand der PCI DSS Zertifizierung verringert sich für den Händler deutlich.

Fragen zu PCI DSS kann Ihnen Ihr Verarbeiter oder ein [darauf spezialisiertes Unternehmen](https://www.pcisecuritystandards.org) beantworten.

## <a name="3ds"></a> 3D Secure

3-D Secure, abgekürzt 3DS, wird von Visa (Verified by Visa), MasterCard (MasterCard SecureCode), American Express (SafeKey) und Diners Club (ProtectBuy) unterstützt. Händler, die das 3-D Secure Verfahren anbieten profitieren von der erhöhten Sicherheit bei der Kreditkartenakzeptanz und weniger Zahlungsausfällen durch die Haftungsumkehr („Liability Shift“). Es ist dabei nicht von Bedeutung, ob die Karteninhaber (KI) an dem Verfahren teilnehmen oder nicht.

Das 3-D Secure Verfahren kann ausschließlich für Zahlungen im Internet eingesetzt werden. Der KI muss, sofern er an dem Verfahren teilnimmt, sich während der Zahlung gegenüber seiner kartenausgebenden Bank (Issuer) ausweisen.
Zahlungen, die der Händler mit 3-D Secure abwickelt, sind speziell zu kennzeichnen. Nur wenn die entsprechenden Merkmale mit der Autorisierung an die Kreditkartengesellschaft gesendet werden, gilt die Haftungsumkehr.
Das Saferpay Merchant Plug-In, abgekürzt MPI, unterstützt die notwendigen Interaktionen und den sicheren Datenaustausch zwischen den beteiligten Systemen. Die JSON API wickelt diesen Schritt automatisiert über das Transaction Interface (Initialize) und über die Payment Page ab, sodass kein zusätzlicher Integrationsaufwand anfällt. Die Authentifizierung des KI erfolgt über ein Webformular, das der Issuer oder ein von ihm beauftragter Dienstleister bereitstellt. Für eine 3-D Secure Authentifizierung benötigt der KI daher zwingend einen Internet Browser.

1. Der Händler sendet die Kreditkartendaten zusammen mit den relevanten Zahlungsdaten an Saferpay.
2. Saferpay prüft, ob der KI an dem 3-D Secure Verfahren teilnimmt oder nicht. Nimmt er teil, muss er sich gegenüber seiner Bank authentifizieren. Falls nicht, kann die Zahlung ohne Authentifizierung durchgeführt werden.
3. Über den Internet Browser des KI wird die 3-D Secure Anfrage an die kartenausgebende Bank weitergeleitet. Der KI muss sich dort mit einem Passwort, Zertifikat oder einer anderen Methode ausweisen.
4. Das Ergebnis dieser Überprüfung (Authentifizierung) wird über den Internet Browser des Kunden zurück an Saferpay gesendet. 
5. Saferpay prüft das Resultat und stellt sicher, dass keine Manipulation vorliegt. Die Zahlung kann fortgeführt werden, wenn die Authentifizierung erfolgreich verlaufen ist.
6. Saferpay bindet die MPI-Daten an den von der JSON API verwendeten Token und fragt diese bei der Autorisierung der Karte automatisch ab.

## <a name="dcc"></a> Dynamic Currency Conversion

Dynamic Currency Conversion, abgekürzt DCC, steht nur für SIX Akzeptanzverträge mit DCC-Erweiterung zur Verfügung. Das für die Zahlungsanfragen zugrunde liegende Terminal erhält hierbei eine Basiswährung, in der alle Transaktionen abgerechnet werden. Internationalen Kunden wird mittels DCC der Kaufbetrag in der Basiswährung und zum aktuellen Wechselkurs in ihrer Landeswährung angezeigt. Der Kunde kann selbst entscheiden, in welcher Währung die Zahlung stattfinden soll.
Eine gesonderte Implementierung auf Seiten des Händlers ist für DCC nicht notwendig. Saferpay behandelt diesen Schritt während des Redirect automatisch. 

## <a name="paymentmethods"></a> Unterstützte Zahlungsmittel

<table class="table table-striped table-hover">
  <thead>
    <tr>
      <th>Zahlungsmittel</th>
      <th class="text-center">Transaction Interface</th>
      <th class="text-center">Payment Page</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Visa</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>V PAY</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>MasterCard</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Maestro International</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>American Express</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Bancontact</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Diners Club</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>JCB</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Bonus Card</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Postfinance E-Finance</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>PostFinance Card</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>MyOne</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>SEPA Lastschrift (Nur DE!)</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>PayPal</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>ePrzelewy</td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Homebanking AT (eps)</td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>GiroPay</td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>iDeal</td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>BillPay Kauf auf Rechnung</td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>BillPay Lastschrift</td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
  </tbody>
</table>

## <a name="licenses"></a> Lizenzen

Für den Einsatz im E-Commerce unterscheidet Saferpay zwischen zwei Lizenzen:
+ Saferpay eCommerce
+ Saferpay Business

Es ist von äußerster Wichtigkeit bereits vor der Integration zu klären, ob eine eCommerce- oder Business-Lizenz genutzt werden soll.
Im Wesentlichen stellt Saferpa Business eine Erweiterung zur Saferpay eCommerce-Lizenz dar, die mit zusätzlichen Kosten verbunden ist.
Bei vertraglichen Fragen, auch zu Kosten, wenden sie sich bitte an Ihren Sales Partner.

Die folgende Tabelle zeigt, welche Funtionen in den Lizenzmodellen enthalten sind:


<table class="table table-striped table-hover">
  <thead>
    <tr>
      <th>Interface</th>
      <th class="text-center">eCommerce</th>
      <th class="text-center">Business</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th><b>PaymentPage Interface</b></th>
      <th></th>
      <th></th>
    </tr>
    <tr>
      <td>Initialize Payment Page</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Assert Payment Page</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <th><b>Transaction Interface</b></th>
      <th></th>
      <th></th>
    </tr>
    <tr>
      <td>Transaction Initialize</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Authorize</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction QueryPaymentMeans</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction AdjustAmount</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Authorize Direct</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Authorize Referenced</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Capture</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Cancel</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Refund</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Refund Direct</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Redirect Payment</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Transaction Assert Redirect Payment</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <th><b>Secure Alias Store</b></th>
      <th></th>
      <th></th>
    </tr>
    <tr>
      <td>Alias Insert</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Alias Assert Insert</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Alias Insert Direct</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Alias Delete</td>
      <td></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <th><b>Batch</b></th>
      <th class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></th>
      <th class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></th>
    </tr>
    <tr>
      <td>Close</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
  </tbody>
</table>



## <a name="pm-functions"></a> Zahlungsmittelfunktionen

Saferpay unterstützt viele Zahlungsmittel, darunter auch 3rd-Party Anbieter, wie zum Beispiel PayPal. Diese müssen aber nicht zwingend sämtliche Saferpayfunktionen unterstützen.
Die folgende Tabelle soll dabei helfen eine Übersicht zu bekommen, welche Funktionen die einzelnen Zahlungsmittel unterstützen:

<p></p>

<table class="table table-striped table-hover">
  <thead>
    <tr>
      <th>Zahlungsmittel</th>
      <th class="text-center">Capture</th>
      <th class="text-center">Batch</th>
      <th class="text-center">SCD</th>
      <th class="text-center">Refund</th>
      <th class="text-center">Recurring</th>
      <th class="text-center">DCC</th>
      <th class="text-center">3-D Secure</th>
      <th class="text-center">MOTO</th>
    </tr>
  </thead>
  <tbody>
      <tr>
      <td>American Express</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
        <tr>
      <td>BillPay Lastschrift</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>BillPay Rechnung</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>Bonus Card</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Diners Club</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>ePrzelewy</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>eps</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>giropay</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>iDEAL</td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>  
    <tr>
      <td>JCB</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>Maestro Int.</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
    </tr>    
    <tr>
      <td>MasterCard</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>MyOne</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>PayPal</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>PostFinance Card</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>PostFinance eFinance</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td> </td>
      <td> </td>
    </tr>
    <tr>
      <td>SEPA Lastschrift</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td> </td>
      <td> </td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
    <tr>
      <td>VISA</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>
        <tr>
      <td>VPay</td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
      <td class="text-center"><span class="glyphicon glyphicon-ok" style="color: #5cb85c"></span></td>
    </tr>    
  </tbody>
</table>

--->>>

<dl class="dl-horizontal">
  <dt>Capture</dt>
  <dd>Capture notwendig</dd>
  <dt>Batch</dt>
  <dd>Tagesabschluss notwendig</dd>
  <dt>SCD</dt>
  <dd>Secure Alias Store verfügbar</dd>
  <dt>Refund</dt>
  <dd>Gutschriften durchführbar</dd>
  <dt>Recurring</dt>
  <dd>Wiederkehrende Zahlungen</dd>
  <dt>DCC</dt>
  <dd>DCC verfügbar</dd>
  <dt>3-D Secure</dt>
  <dd>3-D Secure verfügbar</dd>
  <dt>MOTO</dt>
  <dd>Mail Phone Order verfügbar</dd>
</dl>

<<<---


## <a name="capture-batch"></a> Capture (Verbuchung) und der Tagesabschluss

Diese beiden Funktionen gehören wohl zu den weniger beachteten, aber äußerst wichtigen Saferpay-Funktionen. Beide stehen im direkten Zusammenhang und werden sie nicht ausgelöst, so wird es keine Auszahlung an das Händlerkonto geben.

### Der Capture

[Der Capture](https://saferpay.github.io/jsonapi/#Payment_v1_Transaction_Capture) ist dafür gedacht eine Zahlung zu finalisieren.
Solange eine Transaktion nicht durch den Capture gelaufen ist, wird der Betrag für sie reserviert, aber nicht ausgezahlt.
API seitig erhalten sie über den parameter „Status“ Auskunft (Beachten sie dass dies nur ein Ausschnitt der Daten ist):

--->>>

```json
"Transaction": {
  "Type": "PURCHASE",
  "Status": "AUTHORIZED",
  "Id": "MUOGAWA9pKr6rAv5dUKIbAjrCGYA",
  "Date": "2015-09-18T09:19:27.078Z",
  "Amount": {
    "Value": "100",
    "CurrencyCode": "CHF"
  },
  "AcquirerName": "AcquirerName",
  "AcquirerReference": "Reference"
}
```

<<<---

Analog hierzu erhalten solche Transaktion im Saferpay Backoffice den Status “Reservation“.
Ist eine Transaktion bereits durch den Capture gelaufen, so verändert sich auch der Status:

--->>>
```json
"Transaction": {
  "Type": "PURCHASE",
  "Status": "CAPTURED",
  "Id": "MUOGAWA9pKr6rAv5dUKIbAjrCGYA",
  "Date": "2015-09-18T09:19:27.078Z",
  "Amount": {
    "Value": "100",
    "CurrencyCode": "CHF"
  },
  "AcquirerName": "AcquirerName",
  "AcquirerReference": "Reference"
}
```
<<<---

Dies ist z.B. bei Zahlungsmitteln so, die keinen Capture brauchen bzw. können. [Siehe hier](https://saferpay.github.io/sndbx/General.html#pm-functions).

WICHTIG: Eine Reservation wird nicht ewig für sie vorgehalten. Ist eine bestimmte Zeit verstrichen, wird der für sie autorisierte und reservierte Betrag wieder freigegebenund sie können das Geld nicht mehr einfordern.
Besonders PayPal behält es sich vor die Auszahlung zu verweigern. Aus diesem Grund empfehlen wir den Capture sofort durchzuführen. Sollte das nicht möglich sein, so muss er innerhalb von 48 Stunden geschehen. Entweder per API, oder manuell im Saferpay Backoffice.

### Der Tagesabschluss
Der Tagesabschluss folgt dem Capture einmal täglich, automatisiert um 22 Uhr MEST.
Hierbei werden alle Transaktionen, welche durch den Capture gelaufen sind, beim Zahlungsverarbeiter eingereicht, um das Geld vom Kunden- auf das Händlerkonto zu übertragen.

Dieser Schritt lässt sich, falls gewünscht, über die Saferpay API auch selber auslösen. Der hierzu notwendige Request heisst [Batch Close](https://saferpay.github.io/jsonapi/#Payment_v1_Batch_Close).

Bevor sie jedoch die API nutzen können, müssen sie den automatischen Tagesabschluss zunächst im Backoffice unter Administration > Terminals für das betreffende Terminal deaktivieren. Der Abschluss sollte nur einmal täglich durchgeführt werden.

### Sonderfälle
#### PayPal und Postfinance
Bei diesen Anbietern wird mit dem Capture auch gleich ein mini-Tagesabschluss ausgelöst. Wenn sie also den Capture auslösen, wird sofort der Geldfluss eingeleitet.
Bei PayPal wird dies getan aus dem oben genannten grund, dass sich PayPal vorbehält die Auszahlung zu verweigern. Aus diesem Grunde fordern wir das Geld für sie sofort ein.
Bei Postfinance ist dies schlicht im von Postfinance genutzten Protokoll begründet.

#### Onlinebanking 
Zahlungsanbieter, wie GiroPay, oder iDeal gehören zu den Onlinebanking Anbietern. Diese lösen mit der Autorisation sofort den Geldfluss aus. Sobald die Transaktion also erfolgreich war, ist die Transaktion zu 100% abgeschlossen.

## <a name="cancel-refund"></a> Wann Storno (Cancel) und wann Gutschrift?

Dass Kunden Ihre Bestellungen stornieren, oder waren zurückgeben wollen ist nicht selten. Natürlich ist es als Händler wichtig die im Hintergrund stehende Transaktion entweder zu stornieren, oder eine Gutschrift zu machen.
Auf Zahlungsmittelebene kann es jedoch zu komplikationen kommen, wenn man nicht genau weiss, was wann genau zu tun ist. Auch gibt es Zahlungsmittel, die hier schlichtweg keinerlei Funktionalität bieten.
Dieses Kapitel soll Ihnen dabei helfen eine Übersicht über dieses Thema zu bekommen. Dabei helfen soll auch die im Kapitel 5.2 stehende Matrix.

Generell gilt: Solange Zahlungen nicht durch den Tagesabschluss eingereicht wurden, steht immer ein Storno (Cancel) zur Verfügung. Danach muss eine Gutschrift durchgeführt werden, falls verfügbar.

WICHTIG: Beachten sie die [hier](https://saferpay.github.io/sndbx/General.html#pm-functions) genannten Sonderfälle! Besonders beim Onlinebanking stehen weder Stornos, noch Gutschriften zur Verfügung.
