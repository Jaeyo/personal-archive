<h1 align="center">🗄 Personal Archive</h1>

![Docker Image Size (latest semver)](https://img.shields.io/docker/image-size/lastiverse/personal-archive)
![GitHub repo size](https://img.shields.io/github/repo-size/Jaeyo/personal-archive)
![Lines of code](https://img.shields.io/tokei/lines/github/Jaeyo/personal-archive)
![GitHub go.mod Go version](https://img.shields.io/github/go-mod/go-version/Jaeyo/personal-archive)
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/jaeyo/personal-archive)
![GitHub Release Date](https://img.shields.io/github/release-date/jaeyo/personal-archive)
![GitHub last commit](https://img.shields.io/github/last-commit/jaeyo/personal-archive)

> Personal-Archive keeps track of things you learn / discover everyday!

## 💡 Why

I face tons of articles every day. Via googling or RSS or email newsletter or blog. Among them, some useful article go into Pocket or Instapaper, but I didn't bring them out again. I completely forgot.

Oh, I thought I needed to organize these things. I had to sort out the important ones and sort them properly so that I could find them again later. I needed something like an article database, an article management tool, and second brain. I looked for a suitable tool for me, but nothing found. So I made it.

## 📋 Features

- You just throw an URL for article. It will automatically **convert them into markdown** and save them.
  - You can read all of those articles in same UI which is optimized for reading. without **any distraction like ads.**
  - Of course, you can edit them. There's a **VI editor** for you.
- You can add **multiple tags** on article.
- Did you get an insight from article? You can create some note that has a reference to that article.
- **Full text search** also supported.
- Tired of entering an URL manually? It can **integrates with [Pocket](https://getpocket.com/)**. All the article in your Pocket will be synced automatically.
- **No external database, specific language runtime or dependency.** All you need is an machine which can launch docker image. 
  - All of data is stored in embedded sqlite3 database. 
- **Lightweight**. Thanks for golang.

## 🖥 Demo

// TODO
![screenshot](/docs/screenshot-01.png)

## 🕹 Quick Start

```
$ docker run -td -v ~/.personal-archive:/data -p 1121:1121 --name personal-archive lastiverse/personal-archive:latest
```
