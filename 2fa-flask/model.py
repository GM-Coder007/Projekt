import os
from sklearn.svm import SVC
from sklearn.model_selection import train_test_split
import cv2 as cv
import pickle
import numpy as np

from hog import izracunaj_hog_znacilnice
from lbp import calcLBPHist

# read video file and extract features

pixels_per_cell = 8
cells_per_image = 8
limit = 1000


def read_data(file):
    fd = open(file, "rb")
    data = pickle.load(fd)
    fd.close()
    return data


def write_data(file, data):
    fd = open(file, "wb")
    pickle.dump(data, fd)
    fd.close()


def generateFeature(image):
    gray = cv.cvtColor(image, cv.COLOR_BGR2GRAY)

    histLPB = calcLBPHist(gray, cells_per_image)
    # histHOG = calcHOGHist(gray)
    histHOG = izracunaj_hog_znacilnice(
        gray, st_orientacij=9, piksli_celica=(8, 8), celice_blok=(1, 1))

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
                    imageRes = cv.resize(
                        image, (pixels_per_cell*cells_per_image, pixels_per_cell*cells_per_image))

                    feature = generateFeature(imageRes)

                    features.append(feature)
                    labels.append(1)

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
            if frame is None:
                print("Can't read frame.")
            else:
                image = cv.resize(
                    frame, (pixels_per_cell*cells_per_image, pixels_per_cell*cells_per_image))

                feature = generateFeature(image)

                features.append(feature)
                labels.append(0)

                readCounter += 1
                if limit != 0 and readCounter >= limit:
                    break

    vid_capture.release()
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

    features_train, labels_train = combineFeatures(video_path)
    model = SVC()
    model.fit(features, labels)
    write_data(model_path, model)


def is_trained(user_id):
    model_path = os.path.join("models", user_id + ".pickle")
    return os.path.exists(model_path)


def predict(user_id, imagePath):
    model_path = os.path.join("models", user_id + ".pickle")

    image = cv.imread(imagePath)
    feature = generateFeature(image)

    model = read_data(model_path)
    prediction = model.predict([feature])
    return prediction[0]
