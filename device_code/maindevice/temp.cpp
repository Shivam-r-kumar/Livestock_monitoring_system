// internal library
#include "temp.h"
#include <Arduino.h>


bodytempSensor::bodytempSensor(uint8_t pin)
  : onewire(pin), bodySensor(&onewire) {
}

void bodytempSensor::begin() {
  bodySensor.begin();
}

float bodytempSensor::readbodytemp() {
  bodySensor.requestTemperatures();
  float tempc = bodySensor.getTempCByIndex(0);

  if (tempc == DEVICE_DISCONNECTED_C) {
    return -127;
  }
  return tempc;
}
