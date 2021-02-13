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

Oh, I thought I needed to organize these things. I had to sort out the important ones and sort them properly so that I could find them again later. I needed something like an article database, an article management tool, and second brain. I looked for a suitable tool for me, but nothing found. So I made it myself.

## 📋 Features

- You just throw a URL for an article. It will automatically **convert them into markdown** and save them.
  - You can read all of those articles in same UI which is optimized for reading. without **any distraction like ads.**
  - Of course, you can edit them. There's a **VI editor** for you.
- You can add **multiple tags** on an article.
- Did you get an insight from article? You can create some note that has a reference to that article.
- **Full text search** also supported.
- Tired of entering a URL manually? It can **integrates with [Pocket](https://getpocket.com/)**. All the article in your Pocket will be synced automatically.
- **No external database, specific language runtime or dependency required.** All you need is just a machine with docker.
  - All data is stored in embedded sqlite3 database. 
- **Lightweight**. Thanks for golang.
- Support **mobile** with responsive design.
- Support **Syntax-highlighting** from [react-syntax-highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter). (thanks for [@illusionist-osmin](https://github.com/illusionist-osmin))

## 🖥 Screenshot

![screenshot](/docs/screenshot-01.png)

## ✒️ How do I use it?
[How do I use it](/docs/how-do-i-use-it.md)

## 🕹 Quick Start

```
$ docker run -td -v ~/.personal-archive:/data -p 1121:1121 --name personal-archive lastiverse/personal-archive:latest
```

## 🔨 Development

Run backend:
```
$ make run-local
```

Run frontend:
```
$ make run-webui
```

## 🔭 Future work
- Dark mode.
- Authentication.
- Nested tag tree.
- Personalized reader configuration (e.g. font family / size ...)
