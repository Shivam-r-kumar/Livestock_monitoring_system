#ifndef ex_temp_H
#define ex_temp_H

#include <Arduino.h>
#include "DHT.h"

class DHTSensor {
public:
    DHTSensor(uint8_t pin, uint8_t type = DHT11);

    void begin();                  
    float readTemperature();       
    float readHumidity();          

private:
    DHT* dht;
    uint8_t _pin;
    uint8_t _type;
};


#endif