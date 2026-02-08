#include "heartrate.h"


VitalSignsReader::VitalSignsReader(PulseOximeter* sensor) {
  pox = sensor;
}

bool VitalSignsReader::isValidSample(float hr, float spo2) {
  return (hr > 40 && hr < 180 && spo2 > 80 && spo2 <= 100);
}

VitalSigns VitalSignsReader::read() {

  VitalSigns result = { -1, -1, false };

  int sampleIndex = 0;
  unsigned long startTime = millis();
  unsigned long lastSampleTime = 0;

  Serial.println("Collecting samples (30 sec)...");

  // -------- Sample collection --------
  while (millis() - startTime < COLLECTION_TIME_MS &&
         sampleIndex < SAMPLE_COUNT) {

    pox->update();

    if (millis() - lastSampleTime >= SAMPLE_INTERVAL_MS) {
      lastSampleTime = millis();

      float hr = pox->getHeartRate();
      float spo2 = pox->getSpO2();

      if (isValidSample(hr, spo2)) {
        hrSamples[sampleIndex] = hr;
        spo2Samples[sampleIndex] = spo2;
        sampleIndex++;
      }
    }

    delay(1);  // watchdog safety (ESP8266)
  }

  if (sampleIndex == 0) {
    Serial.println("No valid samples collected!");
    return result;
  }

  // -------- Frequency analysis --------
  int freqHR[200] = {0};
  int freqSpO2[101] = {0};

  for (int i = 0; i < sampleIndex; i++) {
    int hrIdx = constrain((int)round(hrSamples[i]), 0, 199);
    int spo2Idx = constrain((int)round(spo2Samples[i]), 0, 100);

    freqHR[hrIdx]++;
    freqSpO2[spo2Idx]++;
  }

  // -------- Dominant value --------
  int dominantHR = 0;
  int dominantSpO2 = 0;

  for (int i = 1; i < 200; i++) {
    if (freqHR[i] > freqHR[dominantHR])
      dominantHR = i;
  }

  for (int i = 1; i < 101; i++) {
    if (freqSpO2[i] > freqSpO2[dominantSpO2])
      dominantSpO2 = i;
  }

  // -------- Averaging near dominant --------
  float hrSum = 0, spo2Sum = 0;
  int hrCount = 0, spo2Count = 0;

  for (int i = 0; i < sampleIndex; i++) {
    if (abs(hrSamples[i] - dominantHR) <= 1) {
      hrSum += hrSamples[i];
      hrCount++;
    }
    if (abs(spo2Samples[i] - dominantSpO2) <= 1) {
      spo2Sum += spo2Samples[i];
      spo2Count++;
    }
  }

  if (hrCount > 0 && spo2Count > 0) {
    result.heartRate = hrSum / hrCount;
    result.spO2 = spo2Sum / spo2Count;
    result.success = true;
  }

  Serial.println("===== FINAL RESULT =====");
  Serial.print("HR: "); Serial.print(result.heartRate); Serial.println(" BPM");
  Serial.print("SpO2: "); Serial.print(result.spO2); Serial.println(" %");
  Serial.println("Done. Remove finger.");

  return result;
}
