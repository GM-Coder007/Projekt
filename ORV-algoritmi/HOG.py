import cv2
import numpy as np
import matplotlib.pyplot as plt
from skimage import color

# IMPLEMENTACIJA HOG ALGORITMA 
# POMOČ IZ TUTORIALOV

slika = cv2.imread('lenna.jpg') # naložimo sliko
sivinska = color.rgb2gray(slika) # pretvorimo sliko v sivinsko

def izracunaj_gradient(slika: np.ndarray): # FUNKCIJA ZA IZRAČUN GRADIENTA
    
    gy, gx = np.gradient(slika) # izracunamo gradient x in y osi podane slike

    return gx, gy # vrnemo vrednosti


gx, gy = izracunaj_gradient(sivinska) # izracunamo gradient slike (test)


# FUNKCIJA ZA IZRAČUN HOG ZNAČILNICE ENE CELICE
def izracunaj_hog_celico(st_orientacij: int, magnituda: np.ndarray, orientacije: np.ndarray) -> np.ndarray:
    
    # Izračunamo 1 HOG značilnico celice. Vrnemo vektor vrstice velikosti st_orientacij 
   
    bin_sirina = int(180 / st_orientacij) # binarna širina 
    hog = np.zeros(st_orientacij) # naredi polje/vektor vrednosti 0, enake velikosti kot st_orientacij
    
    for i in range(orientacije.shape[0]): # sprehodimo se čez orientacijo
        for j in range(orientacije.shape[1]): # sprehodimo se čez orientacijo

            orientacija = orientacije[i, j] # shranimo vrednost orientacije
            najmanjsi_bin = int(orientacija / bin_sirina) # shranimo najmanjšo vrednost
            hog[najmanjsi_bin] += magnituda[i, j] # dodamo magnitudo

    return hog / (magnituda.shape[0] * magnituda.shape[1]) # vrnemo hog značilnico celice


# FUNKCIJA ZA NORMALIZACIJO VEKTORJA
def normaliziraj_vektor(v, varnost=1e-5): 
    
    # Vrnemo normaliziran vektor (norm2 = 1) 
    # Spremenljivko varnost uporabljamo da preprečimo deljenje z 0 (če bi bilo v==0), varnost je zelo majhna vrednost in ne vpliva na razultat
      
    return v / np.sqrt(np.sum(v ** 2) + varnost ** 2) # formula za normalizacijo vektorja

# GLAVNA FUNKCIJA ZA IZRAČUN HOG ZNAČILNIC
def izracunaj_hog_znacilnice(sivinska: np.ndarray, 
                         st_orientacij: int = 9, piksli_celica: (int, int) = (8, 8),
                         celice_blok: (int, int) = (1, 1)) -> np.ndarray:
    
  
    # Izračuna HOG značilnice sivinske slike. Vrne vektor značilnic
    
    gx, gy = izracunaj_gradient(sivinska) # izračun gradientov
    sy, sx = gx.shape # shranimo velikost x osi gradienta
    cx, cy = piksli_celica # shranimo število pikslov na celico za obe osi
    bx, by = celice_blok # shranimo število celic za blok, za x in y os

    magnitude = np.hypot(gx, gy) # = np.sqrt(gx**2 + gy**2) # izračun magnitude gradienta po formuli
    orientacije = np.rad2deg(np.arctan2(gy, gx)) % 180 # izračun orientacije gradienta po formuli

    st_celice_x = int(sx / cx) # število celic na x osi
    st_celice_y = int(sy / cy) # število celic na y osi
    st_bloki_x = int(st_celice_x - bx) + 1 # število blokov na x osi
    st_bloki_y = int(st_celice_y - by) + 1 # število blokov na y osi

    hog_celice = np.zeros((st_celice_x, st_celice_y, st_orientacij)) # naredimo prazno polje/vektor dimenzij st_celice_x, st_celice_y, st_orientacij

    prejsnji_x = 0 # prejšnja celica vrstice  (prva vrstica = index 0)
    # Izračunaj HOG za vsako celico
    for it_x in range(st_celice_x): # sprehodimo se čez celice na x osi
        prejsnji_y = 0 # prejšna celica stolpca (prvi stolpec = index 0)
        for it_y in range(st_celice_y): # sprehodimo se čez celice na y osi

            magnitude_posodobi = magnitude[prejsnji_y:prejsnji_y + cy, prejsnji_x:prejsnji_x + cx] # izračunamo maginutudo
            orientacije_posodobi = orientacije[prejsnji_y:prejsnji_y + cy, prejsnji_x:prejsnji_x + cx] # izračunamo orientacijo

            hog_celice[it_y, it_x] = izracunaj_hog_celico(st_orientacij, magnitude_posodobi, orientacije_posodobi) # izračunamo hog za celico

            prejsnji_y += cy # dodamo število pikslov na osi y
        prejsnji_x += cx # dodamo število pikslov na osi x

    hog_normalizirani_bloki = np.zeros((st_bloki_x, st_bloki_y, st_orientacij)) # pripravimo prazno polje/vektor dimenzij st_bloki_x, st_bloki_y, st_orientacij

    # Normaliziramo HOG po bloku
    for bloki_x in range(st_bloki_x): # sprehodimo se ćez bloke na x osi
        for bloki_y in range(st_bloki_y): # sprehodimo se ćez bloke na y osi

            hog_blok = hog_celice[bloki_y:bloki_y + by, bloki_x:bloki_x + bx].ravel() # nastavimo blok, dodamo mu celice, spremenimo v 1D
            hog_normalizirani_bloki[bloki_y, bloki_x] = normaliziraj_vektor(hog_blok) # normaliziramo blok

    return hog_normalizirani_bloki.ravel() # vrnemo vektor normaliziranih blokov (vektor značilnic), uporabimo ravel da pretvorimo v 1D


# KLIC GLAVNE FUNKCIJE ZA IZRAČUN HOG ZNAČILNIC
hog_znacilnice = izracunaj_hog_znacilnice(
    sivinska, st_orientacij=9,
    piksli_celica=(8, 8),
    celice_blok=(1, 1)) # nastavimo podatke (st pikslov na celico in st celic na blok, st orientacij, podamo sliko), dobimo 1D polje/vektor

print(hog_znacilnice.shape) # izpis velikosti vektorja značilnic


#####################################################################
import matplotlib.pyplot as plt 
import numpy as np 

# FUNKCIJA ZA SPREMEMBO VELIKOSTI VEKTORJA ZNAČILNIC
def izrisi_hog_znacilnice(hog_znacilnica, sivinska): 
  hog_znacilnica = hog_znacilnica.reshape(150,150) 
  plt.imshow(hog_znacilnica) 
  plt.show()

# IZRIS ZNAČILNIC
izrisi_hog_znacilnice(hog_znacilnice,slika)


# FUNKCIJA ZA SPREMEMBO VELIKOSTI VEKTORJA ZNAČILNIC
def izrisi_hog_sliko(znacilnica_vektor): 
  znacilnica_vektor = np.reshape(znacilnica_vektor, (150, 150)) 
  plt.imshow(znacilnica_vektor, cmap='gray') 
  plt.show()

# IZRIS ZNAČILNIC
izrisi_hog_sliko(hog_znacilnice)


