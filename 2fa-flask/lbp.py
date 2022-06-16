import cv2 as cv
import numpy as np

# https://www.geeksforgeeks.org/create-local-binary-pattern-of-an-image-using-opencv-python/


def get_pixel(img, center, x, y):
    new_value = 0
    try:
        if img[x][y] >= center:
            new_value = 1
    except:
        pass
    return new_value


def lbp_calculated_pixel(img, x, y):
    center = img[x][y]
    neighbour = []

    # top_left
    neighbour.append(get_pixel(img, center, x-1, y-1))

    # top
    neighbour.append(get_pixel(img, center, x-1, y))

    # top_right
    neighbour.append(get_pixel(img, center, x-1, y + 1))

    # right
    neighbour.append(get_pixel(img, center, x, y + 1))

    # bottom_right
    neighbour.append(get_pixel(img, center, x + 1, y + 1))

    # bottom
    neighbour.append(get_pixel(img, center, x + 1, y))

    # bottom_left
    neighbour.append(get_pixel(img, center, x + 1, y-1))

    # left
    neighbour.append(get_pixel(img, center, x, y-1))

    power = [1, 2, 4, 8, 16, 32, 64, 128]
    val = 0
    for i in range(len(neighbour)):
        val += neighbour[i] * power[i]
    return val


def calcLBPHist(img, cells_per_image):
    # if useScikit:
    #    lbp = local_binary_pattern(img, 24, 8, method="uniform")
    #    n_bins = int(lbp.max() + 1)
    #    hist, _ = np.histogram(
    #        lbp, density=True, bins=n_bins, range=(0, n_bins))
    #    return hist
    # else:
    height, width = img.shape

    img_lbp = np.zeros((height, width), np.uint8)

    for i in range(0, height):
        for j in range(0, width):
            img_lbp[i, j] = lbp_calculated_pixel(img, i, j)

    hist_lbp = []
    for i in range(0, cells_per_image):
        for j in range(0, cells_per_image):
            new_height = int(height/cells_per_image)
            new_width = int(width/cells_per_image)

            block = img[i*new_height:i*new_height + new_height,
                        j*new_width:j*new_width + new_width]
            hist = cv.calcHist(block, [0], None, [256], (0, 256))
            cv.normalize(hist, hist, norm_type=cv.NORM_MINMAX)
            hist_lbp = np.concatenate((hist_lbp, hist.flatten()))
    return hist_lbp
