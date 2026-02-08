#ifndef temp_h
#define temp_h

#include "config.h"
#include <OneWire.h>
#include <DallasTemperature.h>

class bodytempSensor {

public:
  bodytempSensor(uint8_t pin);
  void begin();
  float readbodytemp();

private:
  OneWire onewire;
  DallasTemperature bodySensor;
};

#endif