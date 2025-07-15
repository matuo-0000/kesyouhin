# ベースイメージとして node を使用
FROM node:20-alpine

# 作業ディレクトリ作成
WORKDIR /app

# package.jsonとlockファイルを先にコピーして依存関係だけ先にインストール
COPY package*.json ./

# 依存関係のインストール
RUN npm install

# 残りのファイルをコピー
COPY . .

# デフォルトコマンド（docker-compose.ymlで上書きされる）
CMD ["npm", "run", "dev", "--", "--host"]