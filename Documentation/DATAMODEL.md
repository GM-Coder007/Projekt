# Data model



## Data received from Android app

1s interval: Accelerometer, GPS coordinates, Gyroscope


## Data from scraper
- Accident locations
- Road blocks



# Collections

## User
- app uuid
- "registration" date
- last "login"

## Images
- Image is uploaded as a file
- Empty images (without detected objects) get deleted after some time
- Filtering images with detected objects, so there's not too many similar ones

- path
- uploaded datetime
- drive id

## Detected Face
- image id
- x, y coordinates
- detection_strength
- type of sign
- text on sign

## Drive
- user id
- start datetime
- end datetime

## Positional data
- drive id
- timestamp
- accelerometer
- gps_coords
- gyroscope

## Parsed
1: https://www.promet.si/portal/sl/razmere.aspx

2: https://www.amzs.si/na-poti/stanje-na-slovenskih-cestah

3: https://www.rtvslo.si/stanje-na-cestah#

4: https://www.24ur.com/novice/ceste


