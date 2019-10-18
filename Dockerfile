FROM alpine:3

ENV APP_DIR=/app

RUN mkdir $APP_DIR
RUN mkdir $APP_DIR/dist
WORKDIR $APP_DIR

ADD dist $APP_DIR/dist
