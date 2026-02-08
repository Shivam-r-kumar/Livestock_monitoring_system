# Smart Livestock Health Monitoring System

## Problem
Livestock farmers often fail to detect animal health issues at an early stage due to:
- Lack of continuous monitoring  
- Manual observation  
- Delayed veterinary intervention  
- Sudden productivity loss  

Existing solutions are either expensive, non-wearable, or do not provide real-time actionable insights.

## Solution
The **Smart Livestock Health Monitoring System** uses **dual IoT wearable devices per animal** and a **real-time web dashboard**. It continuously monitors animal health and activity, enabling early disease detection and preventive healthcare.

## How It Works
Each animal is monitored using **two low-power IoT devices**:

### 1. Main Health Device (Chest Mounted)
- Measures **body temperature**  
- Measures **heart rate**  
- Measures **SpO2 (oxygen level)**  
- Sends **real-time data to the cloud**

### 2. Step Counter Device (Leg Mounted)
- Counts **steps** using motion sensor  
- Tracks **activity and inactivity**  
- Helps detect **illness, stress, or injury**

All collected data is sent to the cloud and displayed on a **live web dashboard**.

## Technology Stack

**Hardware**
- ESP32 / ESP32-C3  
- Temperature sensor (LM75A or similar)  
- Pulse & SpO2 sensor  
- MPU6050 for step counting  
- Battery-powered wearable devices  

**Software**
- HTML, CSS, JavaScript for web dashboard  
- Firebase Realtime Database  
- Embedded C++ for ESP32 firmware  
- Git and GitHub  

## Dashboard Features
- Live animal health monitoring  
- Activity and step tracking  
- Risk indication based on abnormal patterns  
- Real-time cloud updates  
- Responsive design for mobile and desktop browsers  

## Project Structure
```
 Smart-Livestock-Health-Monitoring-System/
 ├── index.html # Web dashboard
 ├── style.css # Dashboard styling
 ├── script.js # Dashboard logic
 ├── device_code/
 │ ├── main_device/ # ESP32 code for health monitoring device
 │ │ └── main_device.ino
 │ └── stepcounter_device/ # ESP32 code for step counter device
 │ └── stepcounter_device.ino
 └── README.md # Project documentation
```

## Target Audience
- Livestock and dairy farmers  
- Veterinary professionals  
- Smart agriculture startups  
- Rural healthcare initiatives  
- Government livestock monitoring programs  

## Impact
- Early disease detection  
- Reduced livestock mortality  
- Lower veterinary costs  
- Increased productivity  
- Affordable and scalable solution for rural farms  

## Uniqueness
- Dual-device wearable architecture per animal  
- Real-time health and activity monitoring  
- Focus on preventive livestock healthcare  
- Low-cost, scalable, hackathon-ready prototype  

## Future Scope
- AI-based disease prediction  
- Heat cycle and fertility detection  
- SMS or voice alerts for farmers  
- Mobile app integration  
- Large-scale farm analytics  

## Author
**Shivam Kumar**  
Electronics | IoT | Full Stack  

---

