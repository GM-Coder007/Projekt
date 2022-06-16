import os
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
from skimage.feature import local_binary_pattern
from skimage.feature import hog
import cv2 as cv
import pickle
import numpy as np

from hog import izracunaj_hog_znacilnice
from lbp import calcLBPHist

# read video file and extract features

pixels_per_cell = 8
cells_per_image = 8
limit = 1000

useScikit = True


def read_data(file):
    fd = open(file, "rb")
    data = pickle.load(fd)
    fd.close()
    return data


def write_data(file, data):
    fd = open(file, "wb")
    pickle.dump(data, fd)
    fd.close()


def face_crop(gray):
    cascade = cv.CascadeClassifier('haarcascade_frontalface_default.xml')
    # obrazi = detekcija.detectMultiScale(gray)

    faces = cascade.detectMultiScale(gray)

    # crop first face
    if len(faces) > 0:
        print("Found " + str(len(faces)) + " faces")
        x, y, w, h = faces[0]
        return gray[y:y+h, x:x+w]
    # rišemo kvadrate okoli najdenih obrazev v videu
    # for (x, y, w, h) in obrazi:  # x,y predstavljata koordinati, w in h pa sirino in visino
        # s pomočjo vgrajene funkcije rectangle in z parametri x,y,w,h narišemo kvadrat okoli obraza
        # cv.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    return None


def generateFeature(gray):
    image = cv.resize(
        gray, (pixels_per_cell*cells_per_image, pixels_per_cell*cells_per_image))
    # gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

    if useScikit:
        lbp = local_binary_pattern(image, 24, 8, method="uniform")
        n_bins = int(lbp.max() + 1)
        hist, _ = np.histogram(
            lbp, density=True, bins=n_bins, range=(0, n_bins))
        histLPB = hist
    else:
        histLPB = calcLBPHist(image, cells_per_image)

    if useScikit:
        histHOG = hog(image)
    else:
        histHOG = izracunaj_hog_znacilnice(
            image, st_orientacij=9, piksli_celica=(8, 8), celice_blok=(1, 1))

    return np.concatenate((histLPB, histHOG))


def images_to_train_data(imagesPath):
    features = []
    labels = []
    if os.path.exists("features.pickle"):
        data = read_data("features.pickle")
        features = data[0]
        labels = data[1]
    else:
        readCounter = 0
        for imageName in os.listdir(imagesPath):
            imagePath = os.path.join(imagesPath, imageName)
            if imagePath.lower().endswith(('.png', '.jpg', '.jpeg')):
                print("Processing image " + str(readCounter) + ": " + imagePath)
                image = cv.imread(imagePath)
                if image is None:
                    print("Can't read image: " + path)
                else:
                    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
                    feature = generateFeature(gray)

                    features.append(feature)
                    labels.append(0)

                    readCounter += 1
                    if limit != 0 and readCounter >= limit:
                        break
        data = [features, labels]
        write_data("features.pickle", data)
    return features, labels


def video_to_train_data(video_path):
    features = []
    labels = []
    vid_capture = cv.VideoCapture(video_path)

    if vid_capture.isOpened():
        frame_count = vid_capture.get(7)

        readCounter = 0
        while(vid_capture.isOpened()):
            ret, frame = vid_capture.read()
            print("Processing frame " + str(readCounter) +
                  " of " + str(frame_count))
            if not ret:
                print("Can't read frame " + str(readCounter) +
                      " of " + str(frame_count))
                break
            else:
                gray = cv.cvtColor(frame, cv.COLOR_BGR2GRAY)
                cropped = face_crop(gray)
                if cropped is not None:
                    feature = generateFeature(cropped)
                    #cv.imshow("cropped", cropped)

                    features.append(feature)
                    labels.append(1)

                readCounter += 1
                if limit != 0 and readCounter >= limit:
                    break

    vid_capture.release()
    # cv.destroyAllWindows()
    return features, labels


def combineFeatures(video_path):
    features_video, labels_video = video_to_train_data(video_path)
    features_images, labels_images = images_to_train_data("train")

    print(labels_video)
    print(labels_images)
    features = np.concatenate((features_video, features_images))

    labels = np.concatenate((labels_video, labels_images))
    return features, labels


def train(user_id):
    video_path = os.path.join("uploads", "videos", user_id + ".mp4")
    model_path = os.path.join("models", user_id + ".pickle")

    features, labels = combineFeatures(video_path)
    model = SVC()
    model.fit(features, labels)
    write_data(model_path, model)


def is_trained(user_id):
    model_path = os.path.join("models", user_id + ".pickle")
    return os.path.exists(model_path)


def predict(user_id, imagePath):
    model_path = os.path.join("models", user_id + ".pickle")

    image = cv.imread(imagePath)
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)
    feature = generateFeature(gray)

    model = read_data(model_path)
    prediction = model.predict([feature])
    return prediction[0]
