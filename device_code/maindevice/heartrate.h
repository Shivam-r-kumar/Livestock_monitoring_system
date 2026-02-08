#ifndef HEARTRATE_H
#define HEARTRATE_H

#include <Arduino.h>
#include "MAX30100_PulseOximeter.h"

/* ---------------- CONFIG ---------------- */
#define SAMPLE_COUNT          100          // max valid samples
#define SAMPLE_INTERVAL_MS    500         // 0.5 sec gap
#define COLLECTION_TIME_MS    30000       // 30 sec window

/* ----------- Result Structure ----------- */
struct VitalSigns {
  float heartRate;
  float spO2;
  bool success;
};

/* ----------- Main Reader Class ---------- */
class VitalSignsReader {
  public:
    VitalSignsReader(PulseOximeter* sensor);
    VitalSigns read();

  private:
    PulseOximeter* pox;

    float hrSamples[SAMPLE_COUNT];
    float spo2Samples[SAMPLE_COUNT];

    bool isValidSample(float hr, float spo2);
};

#endif
