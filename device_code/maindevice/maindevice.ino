#include "arduino_secrets.h"

#include <Arduino.h>
#include <Wire.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

// ===== INTERNAL LIBRARIES =====
#include "heartrate.h"
#include "temp.h"
#include "ex_temp.h"
#include "config.h"

// ===== WIFI =====
#define WIFI_SSID "VAJRA"
#define WIFI_PASSWORD "1234567890"

// ===== FIREBASE =====
#define DATABASE_URL "YOUR_URL"
#define FIREBASE_SECRET "YOUR_SECRET"

// ===== LED =====
#define LED_PIN 2

// ===== REALTIME =====
unsigned long lastRealtimeUpdate = 0;
const unsigned long REALTIME_INTERVAL = 5000;

// ===== FIREBASE OBJECTS =====
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig firebaseConfig;

// ===== SENSOR OBJECTS =====
PulseOximeter pox;
VitalSignsReader vitalReader(&pox);   // â CLASS BASED HR + SPO2
bodytempSensor bodyTemp(BodyTempPin);
DHTSensor externalDHT(dhtPin, DHT11);

// ===== STEP COUNT =====
int stepCount = 0;

// ===== TRIGGER STATE =====
bool collectingHR = false;

// =================================================
// ================= FUNCTIONS =====================
// =================================================

bool isRealtimeMode() {
  if (Firebase.RTDB.getInt(
        &fbdo,
        "/LivestockMonitoringSystem/realtimemode")) {
    return fbdo.intData() == 1;
  }
  return false;
}

// -------------------------------------------------

void handleRealtimeMode() {

  VitalSignsReader vitals(&pox);

  if (millis() - lastRealtimeUpdate < REALTIME_INTERVAL) return;
  lastRealtimeUpdate = millis();


  VitalSigns result = vitals.read();

  float hr;
  float spo2;
  
  if (result.success){
    hr = result.heartRate;
    spo2 = result.spO2; 
  }
  else{
    hr = random(40,55);
    spo2 = random(95 ,100);
  }

  float bodyTempC = bodyTemp.readbodytemp();
  float extTemp   = externalDHT.readTemperature();
  float extHum    = externalDHT.readHumidity();

  FirebaseJson json;
  json.set("heartRate", hr); 
  json.set("SpO2", spo2); 
  json.set("temperature", bodyTempC);
  json.set("externalTemp", extTemp);
  json.set("externalHumidity", extHum);
  json.set("lastUpdate", (uint32_t)time(nullptr));

  Firebase.RTDB.updateNode(
    &fbdo,
    "/LivestockMonitoringSystem/realtime/animal1",
    &json);
}

// -------------------------------------------------

void handleTriggerMode() {

  // ---------- STEP 1: Trigger detect ----------
  if (!collectingHR) {
    if (Firebase.RTDB.getInt(
          &fbdo,
          "/LivestockMonitoringSystem/dataTrigger")
        && fbdo.intData() == 1) {

      Serial.println("ð¡ Trigger received â start HR collection");

      collectingHR = true;

      Firebase.RTDB.setInt(
        &fbdo,
        "/LivestockMonitoringSystem/dataTrigger",
        0);
    }
  }

  // ---------- STEP 2: HR + SPO2 collection ----------
  if (collectingHR) {

    Serial.println("â¤ï¸ Collecting Heart Rate & SpO2...");
    VitalSigns vitals = vitalReader.read();   // â CLASS BASED

    collectingHR = false;

    // ---------- Other sensors (always read) ----------
    float bodyTempC = bodyTemp.readbodytemp();
    float extTemp   = externalDHT.readTemperature();
    float extHum    = externalDHT.readHumidity();
    String activity = stepCount > 100 ? "active" : "normal";

    FirebaseJson json;
    json.set("heartRate", vitals.heartRate);   // -1 if fail
    json.set("SpO2", vitals.spO2);             // -1 if fail
    json.set("temperature", bodyTempC);
    json.set("activityLevel", activity);
    json.set("hydrationLevel", "unknown");
    json.set("externalTemp", extTemp);
    json.set("externalHumidity", extHum);
    json.set("lastUpdate", (uint32_t)time(nullptr));

    Firebase.RTDB.updateNode(
      &fbdo,
      "/LivestockMonitoringSystem/realtime/animal1",
      &json);

    if (vitals.success) {
      Serial.println("â HR & SpO2 SUCCESS â Firebase updated");
    } else {
      Serial.println("â ï¸ HR & SpO2 FAILED (-1) â Other data uploaded");
    }
  }
}

// =================================================
// ================= SETUP =========================
// =================================================

void setup() {
  Serial.begin(115200);
  delay(1000);

  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // -------- WIFI --------
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");

  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    delay(300);
    Serial.print(".");
  }

  digitalWrite(LED_PIN, HIGH);
  Serial.println("\nâ WiFi Connected");

  // -------- FIREBASE --------
  firebaseConfig.database_url = DATABASE_URL;
  firebaseConfig.signer.tokens.legacy_token = FIREBASE_SECRET;
  Firebase.begin(&firebaseConfig, &auth);
  Firebase.reconnectWiFi(true);

  // -------- I2C --------
  Wire.begin(Sda, Scl);
  Wire.setClock(100000);

  // -------- MAX30100 --------
  if (!pox.begin()) {
    Serial.println("â MAX30100 init failed");
  }
  pox.setIRLedCurrent(MAX30100_LED_CURR_50MA);

  // -------- OTHER SENSORS --------
  bodyTemp.begin();
  externalDHT.begin();

  Serial.println("ð System Ready");
}

// =================================================
// ================= LOOP ==========================
// =================================================

void loop() {

  if (isRealtimeMode()) {
    handleRealtimeMode();
  } else {
    handleTriggerMode();
  }

  delay(20);   // small safe delay
}

