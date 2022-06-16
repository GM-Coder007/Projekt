# LBP ALGORITEM
import cv2 # vključimo cv2 knjižnico
import numpy as np # vključimo numpy modul
from matplotlib import pyplot as plt # vključimo matplot knjižnico za izris slik
   
# ALGORITEM      
def piksel(slika, center, x, y):
      
    nova_vrednost = 0 # privzeto nastavimo vrednost na 0, uporabi se kadar je vrednost lokalnega sosednega piksla manjša od centra
      
    try:
        # če je vrednost lokalnega sosednega piksla večja ali enaka od centra, potem dobi vrednost 1
        if slika[x][y] >= center:
            nova_vrednost = 1
              
    except:
        # če je vrednost izven obsega, ju spustimo (robni piksli)
        pass
      
    return nova_vrednost
   
# Funkcija za izračun LBP vrednosti
def lbp(slika, x, y):
   
    center = slika[x][y] # trenutni piksel, center
   
    vr_sosedov = [] # polje sosednih pikslov
    
    # PIKSLE NASTAVLJAMO V SMERI URINEGA KAZALCA
    # UPORABIMO 8 SOSEDOV

    # zgoraj_levo
    vr_sosedov.append(piksel(slika, center, x-1, y-1))
      
    # zgoraj
    vr_sosedov.append(piksel(slika, center, x-1, y))
      
    # zgoraj_desno
    vr_sosedov.append(piksel(slika, center, x-1, y + 1))
      
    # desno
    vr_sosedov.append(piksel(slika, center, x, y + 1))
      
    # spodaj_desno
    vr_sosedov.append(piksel(slika, center, x + 1, y + 1))
      
    # spodaj
    vr_sosedov.append(piksel(slika, center, x + 1, y))
      
    # spodaj_levo
    vr_sosedov.append(piksel(slika, center, x + 1, y-1))
      
    # levo
    vr_sosedov.append(piksel(slika, center, x, y-1))
       
    # Za pretvorbo binarnih vrednosti v decimalne
    decimalne = [1, 2, 4, 8, 16, 32, 64, 128]
   
    lbp_vrednost = 0 # privzeta vrednost piksla je 0
      
    for i in range(len(vr_sosedov)): # zanka za izračun vrednosti piksla (sosedne piksle pretvorimo v decimalne in jih seštejemo)
        lbp_vrednost += vr_sosedov[i] * decimalne[i]
    
   # print(lbp_vrednost) 
    return lbp_vrednost # vrnemo lbp vrednost piksla


# PRIMER UPORABE

img = cv2.imread('lenna.jpg') # naložimo sliko
   
visina, sirina, _ = img.shape # shranimo višino in širino slike
   
# pretvorba iz RGB slike v sivinsko (enokanalno)
sivinska = cv2.cvtColor(img,
                        cv2.COLOR_BGR2GRAY)
   
# predpripravimo polje za lbp sliko, iste velikosti kot originalna slika
slika_lbp = np.zeros((visina, sirina),
                   np.uint8)
   
for i in range(0, visina): # sprehodimo se čez celotno sliko
    for j in range(0, sirina):
        slika_lbp[i, j] = lbp(sivinska, i, j) # kličemo funkcijo za izračun lbp vrednosti piksla, katerega dodamo novi sliki

# prikaz originalne slike  
plt.imshow(img)
plt.show()

# prikaz LBP slike  
plt.imshow(slika_lbp, cmap ="gray")
plt.show()