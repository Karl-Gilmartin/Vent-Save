///// Librairies /////
#include <WiFiNINA.h>                          //        Wi-Fi       //
#include "secret.h"                            // Passwords and ID'S //
#include "ThingSpeak.h"                        //     Thing Speak    //
#include <DFRobot_DHT11.h>                     //  DHT11(Temp&Humid) //
#include "Firebase_Arduino_WiFiNINA.h"         //        Firebase    //
#include <Servo.h>                             //  Servo(180 degree  //





///// DEFINITIONS   ///
DFRobot_DHT11 DHT;
FirebaseData fbdo;                          //        Start Frirebase       //
WiFiClient  client;                         //          Start Wi-Fi        //
Servo Servo1;




/////  PINS ////
#define         DHT11_PIN                    (A0)
#define         smoke_pin                    (A1)
#define         carbon_pin                   (A2)
#define         servoPin                     (6)
#define         motorPin                     (4)
#define         MG_PIN                       (A3)

////  READINGS  ///
#define         BOOL_PIN                     (2)
#define         DC_GAIN                      (8.5)
#define         READ_SAMPLE_TIMES            (5) 
#define         READ_SAMPLE_INTERVAL         (50) 
#define         ZEROO_POINT_VOLTAGE          (0.346) 
#define         REACTION_VOLTGAE             (0.030)





float           CO2Curve[3]  =  {2.602,ZEROO_POINT_VOLTAGE,(REACTION_VOLTGAE/(2.602-3))};   
                                     //two points are taken from the curve. 
                                     //with these two points, a line is formed which is
                                     //"approximately equivalent" to the original curve.
                                     //data format:{ x, y, slope}; point1: (lg400, 0.324), point2: (lg4000, 0.280) 
                                     //slope = ( reaction voltage ) / (log400 –log1000) 


char ssid[] = SECRET_SSID;
   
char pass[] = SECRET_PASS;

unsigned long myChannelNumber = SECRET_CH_ID;
const char * myWriteAPIKey = SECRET_WRITE_APIKEY;

///// INITIALIZE VALUES /// 

float temp = 0;
float humid = 0;
String myStatus = "";
int smoke = 0;
float carbon = 0;
float co2 = 0;
int keyIndex = 0; 
String jsonStr;
String Fan_status = ""; 
String sample = "";




void setup() {
  pinMode(motorPin, OUTPUT);
  Servo1.attach(servoPin);
  Serial.begin(9600);      // Initialize serial
  
// Module check  //
  if (WiFi.status() == WL_NO_MODULE) {
    Serial.println("Communication with WiFi module failed!");
    // don't continue
    while (true);
  }
// Firmware check //
  String fv = WiFi.firmwareVersion();
  if (fv != "1.4.8") {             // check for firmware
    Serial.println("Please upgrade the firmware");
  }
    
  ThingSpeak.begin(client);  //Initialize ThingSpeak
  Firebase.begin(SECRET_DATABASE_URL, SECRET_DATABASE_SECRET, SECRET_SSID, SECRET_PASS);    //Connect to my Firebase
}






void loop() {
 
// Connect to Internet  //
  if(WiFi.status() != WL_CONNECTED){
    Serial.print("Attempting to connect to SSID: ");
    Serial.println(SECRET_SSID);
    while(WiFi.status() != WL_CONNECTED){
      WiFi.begin(ssid, pass); // Connect to WPA2 network. 
      Serial.print(".");
      delay(5000);     
    } 
    Serial.println("\nConnected.");
  }
  DHT.read(DHT11_PIN);

// Long values required for firebase   //
  unsigned long  temp = DHT.temperature;
  unsigned long  humid = DHT.humidity;
  unsigned long  smoke = analogRead(smoke_pin);
  unsigned long  carbon = analogRead(carbon_pin);

// Varaibles for thing speak  //
  int temp_val = DHT.temperature;
  int humid_val = DHT.humidity;
  int smoke_val = analogRead(smoke_pin);
  int carbon_val = analogRead(carbon_pin);
//  Serial.println(carbon_val);
  int speed = Serial.parseInt();   // Speed for motor fan


// Co2 value  //
  float volts;
  volts = MGRead(MG_PIN);
//  Serial.print( "SEN0159:" );
//  Serial.print(volts);
   int percentage = MGGetPercentage(volts,CO2Curve);
    Serial.print("CO2:");
    if (percentage == -1) {
        Serial.print( "<400" );
        percentage = 0; 
    } 
    else {
        Serial.print(percentage);
    }

    Serial.print( "ppm" );  
    Serial.print("\n");
    

////////// Thing Speak  //////////


  ThingSpeak.setField(1, temp_val);
  ThingSpeak.setField(2, humid_val);
  ThingSpeak.setField(3, smoke_val);
  ThingSpeak.setField(4, carbon_val);
  ThingSpeak.setField(5, volts);
  ThingSpeak.setField(6, percentage);

  

  
  int x = ThingSpeak.writeFields(myChannelNumber, myWriteAPIKey);
  if(x == 200){
    Serial.println("Channel update successful.");
  }
  else{
    Serial.println("Problem updating channel. HTTP error code " + String(x));
  }

//Serial.print("Its working so far");




////////// Firebase //////////

// Pushing Data  //
// Temperature //
  if (Firebase.setInt(fbdo, "/Temperature", temp)) 
  {
    if (fbdo.dataType() == "int")
      Serial.println(fbdo.intData());
    else
    {
    Serial.println("error with temperature reading");
    Serial.println("error, " + fbdo.errorReason());
    }
  }
  
// Humidity //
  if (Firebase.setInt(fbdo, "/Humidity", humid)) 
  {
    if (fbdo.dataType() == "int")
      Serial.println(fbdo.intData());
    else
    {
     Serial.println("error with humidity reading");
    Serial.println("error, " + fbdo.errorReason());
    }
  }
// Smoke //
    if (Firebase.setInt(fbdo, "/Smoke", smoke)) 
  {
    if (fbdo.dataType() == "int")
      Serial.println(fbdo.intData());
    else
    {
    Serial.println("error with smoke reading");
    Serial.println("error, " + fbdo.errorReason());
    }
  }
     
// Carbon //    
     if (Firebase.setInt(fbdo, "/Carbon", carbon)) //support large number
  {
    if (fbdo.dataType() == "int")
      Serial.println(fbdo.intData());
    else
    {
    Serial.println("error with carbon reading");
    Serial.println("error, " + fbdo.errorReason());
    }
  }




// Getting Fan Status  //
  if (Firebase.getString(fbdo, "Fan_Status" )){
        String sample = fbdo.stringData();
        if (sample == "Off" ){
          analogWrite(motorPin, 0);
          Serial.println("Fan is off");
         }
         else if(sample =="Override") {
          analogWrite(motorPin, 0);
          Serial.println("Fan is off");
          Firebase.setString(fbdo,"/Fan_Status", "Off");
          }
         else if(sample =="On" || smoke>400) {
          analogWrite(motorPin, 300);
          Serial.println("Fan is on");
          Firebase.setString(fbdo,"/Fan_Status", "On");
          }
          
         else{
          Serial.println("Else statment");
        }   
  }
// Vent Open/Close  //
  if(temp_val <= 18){
    Servo1.write(90);
    Serial.println("Vent Closed");
  }
  else{
    Servo1.write(180);
    }
        delay(15000);   // 15s delay required Thing Speak  //
        }


       
        
        
        
// Co2 calibration //      
        float MGRead(int mg_pin)
{
    int i;
    float v=0;

    for (i=0;i<READ_SAMPLE_TIMES;i++) {
        v += analogRead(mg_pin);
        delay(READ_SAMPLE_INTERVAL);
    }
    v = (v/READ_SAMPLE_TIMES) *5/1024 ;
    return v;
}


// Co2 Slope //
int  MGGetPercentage(float volts, float *pcurve)
{
   if ((volts/DC_GAIN )>=ZEROO_POINT_VOLTAGE) {
      return -1;
   } else { 
      return pow(10, ((volts/DC_GAIN)-pcurve[1])/pcurve[2]+pcurve[0]);
   }
}
