# BUILDER
FROM golang:1.15.6-alpine3.12 as builder

ARG VERSION

RUN apk --update add yarn make musl-dev gcc util-linux-dev

RUN mkdir /build
WORKDIR /build
COPY . .

RUN echo $VERSION > /build/VERSION.txt

RUN make build build-webui

#RUNNING
FROM alpine:3.12.3

RUN apk add python2

RUN mkdir -p /app/static
RUN mkdir -p /app/bin
COPY --from=builder /build/VERSION.txt /app/
COPY --from=builder /build/out/personal-archive /app/
COPY --from=builder /build/webui/build /app/static/
COPY --from=builder /build/bin/html2text.py /app/bin/
WORKDIR /app
CMD ["/app/personal-archive"]
