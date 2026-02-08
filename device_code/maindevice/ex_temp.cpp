#include "ex_temp.h"
#include <Arduino.h>

DHTSensor::DHTSensor(uint8_t pin, uint8_t type)
    : _pin(pin), _type(type)
{
    dht = new DHT(_pin, _type);
}

void DHTSensor::begin() {
    dht->begin();
}

float DHTSensor::readTemperature() {
    float temp = dht->readTemperature();
    if (isnan(temp)) return -127;
    return temp;
}

float DHTSensor::readHumidity() {
    float hum = dht->readHumidity();
    if (isnan(hum)) return -1; 
    return hum;
}
