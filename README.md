# Docker-Next.js Test Environment
Next.js environment with Docker. To be used at the hackathon.

## Config
![image](https://github.com/Hajime12349/docker-next.js_test-environment/assets/51946324/c2c38c60-c400-42de-8498-772efb842dec)

## SetUp
### Environment
前提環境のセットアップは省略します。わからなければ遠慮なく聞いてください。
- Node.js
- Docker Desktop
- Git
- Vscode or Cursor
  
### Process
1.リポジトリをクローン

2.ローカルリポジトリに移動

3..env.localを追加
```
# Google OAuth設定
GOOGLE_CLIENT_ID=Your Client Id
GOOGLE_CLIENT_SECRET=Your Client Secret

# NextAuth設定
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=Set Own Secret
```

3.`docker-compose up`



