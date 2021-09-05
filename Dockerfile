# BACKEND BUILDER
FROM golang:1.17-alpine3.13 as backend-builder

ARG VERSION

RUN apk --update add make musl-dev gcc util-linux-dev

RUN mkdir /build
WORKDIR /build

# pre-isntall for caching
COPY Makefile go.mod ./
RUN make deps

RUN echo $VERSION > /build/VERSION.txt

COPY . .
RUN make build

#FRONTEND BUILDER
FROM node:16 as frontend-builder

RUN mkdir -p /build/webui
WORKDIR /build

# pre-install for caching
COPY Makefile ./
COPY webui/package.json ./webui/yarn.lock ./webui/
RUN make deps-webui

COPY . .
RUN make build-webui

#RUNNING
FROM alpine:3.12.3

RUN apk add python2

RUN mkdir -p /app/static
RUN mkdir -p /app/bin
COPY --from=backend-builder /build/VERSION.txt /app/
COPY --from=backend-builder /build/out/personal-archive /app/
COPY --from=backend-builder /build/bin/html2text.py /app/bin/
COPY --from=frontend-builder /build/webui/build /app/static/
WORKDIR /app
CMD ["/app/personal-archive"]
