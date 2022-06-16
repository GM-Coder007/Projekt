from skimage.io import imread
from skimage.transform import resize
from skimage.feature import hog
from skimage import exposure
import matplotlib.pyplot as plt

img = imread('lenna.jpg') # naložimo sliko
plt.axis("off")
plt.imshow(img) # prikažemo sliko
print(img.shape)

# pretvorba iz RGB slike v sivinsko (enokanalno)
#sivinska = cv2.cvtColor(img,
#                        cv2.COLOR_BGR2GRAY)

spremenjena_slika = resize(img, (128*4, 64*4)) # spremenimo velikost slike
plt.axis("off")
plt.imshow(spremenjena_slika)
#print(spremenjena_img.shape)

fd, hog_slika = hog(spremenjena_slika, orientations=9, pixels_per_cell=(8, 8),
                    cells_per_block=(2, 2), visualize=True, multichannel=True)
plt.axis("off")
plt.imshow(hog_slika, cmap="gray")
plt.show()