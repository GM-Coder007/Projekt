# VIRI:

# VIDEO VIR: https://www.videezy.com/people/46300-funny-man-doing-faces
# VIR KODE: https://realpython.com/face-detection-in-python-using-a-webcam/


import cv2 # vstavimo opencv knjižnico
# import numpy as np

detekcija = cv2.CascadeClassifier('frontalface.xml') # podamo knjižnico za detekcijo obrazov

video = cv2.VideoCapture(0) # odpremo video (nastavimo vir videa) ali pa vključimo kamero

while True: # dokler ne vgasnemo programa prebiramo po en frame na en krog (loop)
    
    ret, frame = video.read() # beremo slikico po slikico (frame-by-frame)
    
    # sirina = int(320)
    # visina = int(240)
    # dim = (sirina, visina)
    # frame = cv2.resize(frame, dim)

    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY) # pretvorimo v barvno sivino saj nekatere operacije/metode v opencv delajo samo s sivinskimi barvami

    # nastavimo parametre za detekcijo obraza
    obrazi = detekcija.detectMultiScale( # detectMultiScale metoda zaznava objekte (v našem primeru obraze)
        gray, # sivina
        scaleFactor=1.1, # kompenzira velikost obrazov v ospredju in ozadju videa, tako da so enakovredni
        minNeighbors=5, # minimalno 5 objektov okoli frama da zazna obraz (da ugotovi da je to obraz)
        minSize=(30, 30), # minimalna velikost okna 
    )

  #  print ("Nasli smo {0} obrazev!".format(len(obrazi)) 
    
    # rišemo kvadrate okoli najdenih obrazev v videu
    for (x, y, w, h) in obrazi: # x,y predstavljata koordinati, w in h pa sirino in visino
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2) # s pomočjo vgrajene funkcije rectangle in z parametri x,y,w,h narišemo kvadrat okoli obraza

    # prikažemo slikico/frame
    cv2.imshow('Video', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'): # če kliknemo q končamo z programom (alternativa: ctrl+c v bashu)
    # if cv2.waitKey(100) & 0xFF == ord('q'): 
        break


video.release() # sprostimo video
cv2.destroyAllWindows() # zapremo video/program
