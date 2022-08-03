#FROM python:3.10.6
#WORKDIR /usr/src/app
#COPY requirements.txt ./
#RUN pip install --no-cache-dir -r requirements.txt
#RUN pip install --no-cache-dir pyuwsgi
#COPY . .
#CMD [ "uwsgi --http 0.0.0.0:5000 --master -p 4 -w wsgi:app" ]

FROM tiangolo/uwsgi-nginx-flask:python3.8
WORKDIR /app
RUN apt-get update
RUN apt-get install ffmpeg libsm6 libxext6  -y
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .