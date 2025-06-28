FROM mcr.microsoft.com/devcontainers/typescript-node:18

# パッケージのインストール
RUN apt update
RUN apt install -y locales curl ffmpeg
RUN locale-gen ja-JP.UTF-8 
RUN localedef -f UTF-8 -i ja_JP ja_JP
WORKDIR /workspace

# ロケール設定（日本語対応）
# RUN locale-gen ja_JP.UTF-8
# ENV LANG=ja_JP.UTF-8
# ENV LANGUAGE=ja_JP:ja
# ENV LC_ALL=ja_JP.UTF-8

ENV LANG=ja_JP.UTF-8
ENV LANGUAGE=ja_JP:jp
ENV LC_ALL=ja_JP.UTF-8

RUN curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared \
  && chmod +x /usr/local/bin/cloudflared

RUN corepack enable && corepack prepare pnpm@latest --activate