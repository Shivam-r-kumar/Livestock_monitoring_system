#include "arduino_secrets.h"

#include <Wire.h>
#include <math.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <addons/TokenHelper.h>
#include <addons/RTDBHelper.h>

// ====================== WIFI ======================
#define WIFI_SSID "VAJRA"
#define WIFI_PASSWORD "1234567890"

// ====================== FIREBASE ======================
#define dbUrl "YOUR_URL"
#define key "YOUR_SECRET"

// ====================== MPU6050 ======================
#define MPU_ADDR 0x68
#define PWR_MGMT_1 0x6B
#define ACCEL_XOUT_H 0x3B

// ====================== LED ======================
#define LED_PIN 8

// ====================== STEP LOGIC ======================
float threshold_up = 1.15;    // tweak according to your setup
float threshold_down = 0.9;
bool stateUp = false;
int stepCount = 0;
unsigned long lastStepTime = 0;
const unsigned long STEP_DEBOUNCE = 300; // ms

// ====================== FIREBASE ======================
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

// =========================================================
// =========================== SETUP ========================
void setup() {
  Serial.begin(115200);
  pinMode(LED_PIN, OUTPUT);
  digitalWrite(LED_PIN, LOW);

  // ---------- MPU6050 ----------
  Wire.begin(4  , 10); // SDA, SCL
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(PWR_MGMT_1);
  Wire.write(0x00);
  Wire.endTransmission();
  Serial.println("MPU6050 Ready");

  // ---------- WIFI ----------
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    digitalWrite(LED_PIN, !digitalRead(LED_PIN));
    delay(300);
    Serial.print(".");
  }
  digitalWrite(LED_PIN, HIGH);
  Serial.println("\nWiFi Connected");

  // ---------- FIREBASE ----------
  config.signer.tokens.legacy_token = key;
  config.database_url = dbUrl;
  config.token_status_callback = tokenStatusCallback;
  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  // ---------- INITIAL STEP COUNT READ ----------
  if (Firebase.RTDB.getInt(&fbdo,
      "/LivestockMonitoringSystem/realtime/animal1/steps")) {
    stepCount = fbdo.intData();
    Serial.print("Initial step count loaded: ");
    Serial.println(stepCount);
  } else {
    stepCount = 0;
    Serial.println("Firebase read failed, starting from 0");
  }
}

// =========================================================
// ===================== MPU HELPERS ========================
int16_t read16(uint8_t reg) {
  Wire.beginTransmission(MPU_ADDR);
  Wire.write(reg);
  Wire.endTransmission(false);
  Wire.requestFrom(MPU_ADDR, (uint8_t)2);
  int16_t val = (Wire.read() << 8) | Wire.read();
  return val;
}

float readAccelMag() {
  float ax = read16(ACCEL_XOUT_H) / 16384.0;
  float ay = read16(ACCEL_XOUT_H + 2) / 16384.0;
  float az = read16(ACCEL_XOUT_H + 4) / 16384.0;
  return sqrt(ax * ax + ay * ay + az * az);
}

// =========================================================
// ===================== CONNECTION HANDLER =================
void ensureConnection() {
  // WiFi check
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("WiFi disconnected! Reconnecting...");
    WiFi.disconnect();
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < 10000) {
      delay(500);
      Serial.print(".");
    }
    if (WiFi.status() == WL_CONNECTED)
      Serial.println("WiFi reconnected â");
    else
      Serial.println("WiFi reconnect failed â");
  }

  // Firebase reconnect
  if (!Firebase.ready()) {
    Serial.println("Firebase reconnecting...");
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
    Serial.println("Firebase reconnected â");
  }
}

// =========================================================
// =========================== LOOP =========================
void loop() {

  // -------- Ensure connectivity --------
  ensureConnection();

  if (Firebase.RTDB.getInt(&fbdo, "/LivestockMonitoringSystem/reset")) {
    if (fbdo.intData() == 1) {
      stepCount = 0;
      Firebase.RTDB.setInt(&fbdo, "/LivestockMonitoringSystem/realtime/animal1/steps", stepCount);
      Firebase.RTDB.setInt(&fbdo, "/LivestockMonitoringSystem/reset", 0);
      Serial.println("Steps reset done");
    }
  }

  // READ ACCEL
  float accel = readAccelMag();
  Serial.println(accel); // debug

  unsigned long now = millis();

  // STEP DETECTION: peak above threshold + debounce
  if (accel > threshold_up && now - lastStepTime > STEP_DEBOUNCE) {
    stepCount++;
    lastStepTime = now;

    Serial.print("Step: ");
    Serial.println(stepCount);

    Firebase.RTDB.setInt(&fbdo, "/LivestockMonitoringSystem/realtime/animal1/steps", stepCount);
  }

  delay(50); // ~20Hz
}
