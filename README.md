# HAFHAD
  HAFHAD is a smart voice assistant operated on the thai language which can control your electronic appliances, perform daily online chores and assist you with analysis of power consumption. With the combination of speech technologies and machine learning HAFHAD can control home appliances, perform online tasks with users voice commands. In addition, HAFHAD can detect anomalies of energy consumptions in users homes and acquire knowledge of patterns of usage of electronic appliances by users with the help of machine learning. HAFHAD also provides visualization of energy consumptions, appliances status and notifications through its dashboard. 

#### SETUP
  
  If you dont have the source files.
  ```
  git clone https://github.com/saket404/HAFHAD.git
  ```

**Requirements (Modules)** 
  ```
  Install the modules required in package_requirement.txt
  ```

**For dashboard**
  ```
  cd HAFHAD/hafhad-dashboard
  npm install
  ```

**For power pushing**
  ```
  cd HAFHAD/hafhad-power
  npm install
  ```
**If you run into Swig or Snowboy Error (.so) file**
  ```
  git clone https://github.com/Kitt-AI/snowboy.git
  cd snowboy/swig/Python3 
  make
  ```
    Then copy the .so file to the main HAFHAD directory. 
    
 Run Voice bot
  ```
  cd HAFHAD/HAFHAD
  python3 Wakeword.py
  ```
 Run Web Application/Dashboard
   ```
   npm start
   ```
    go to `localhost:3000` on browser
  
