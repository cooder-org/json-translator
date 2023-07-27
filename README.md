
<h1 align="center">Json Translator</h1>
Translate the input of natural language into a specified structure.

![](./public/snapshot.png)

- powered by [microsoft/TypeChat](https://github.com/microsoft/TypeChat)

## Online Demo
https://nts.cooder.org/

## Getting Started

First, copy `.env.template` to `.env.local`, and set your environment variable(OpenAI API key...) in `.env.local`:

```bash
cp .env.template .env.local
```

Second, import the `conf/db/nts.sql` into your database.

At last, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API ENDPOINT

 - /api/translate

```bash
curl -X 'POST' \
  'http://127.0.0.1:3000/api/translate' \
  -H 'accept: */*' \
  -H 'Content-Type: application/json' \
  -d '{
  "schema": "// The following is a schema definition for determining whether a user wants to share a post or not:\nexport interface ShareOrNot {\nisShare: boolean;\nurl: string;\ncomment: string;\n}",
  "typeName": "ShareOrNot",
  "prompt": "https://github.com/shengxia/RWKV_Role_Playing_API 一个基于Flask实现的RWKV角色扮演API"
}'

```

- /api/endpoint/[id]

```bash
curl -X 'POST' 'http://127.0.0.1:3000/api/endpoint/2dafcb4800ec144356799d5f4da07f32' \
  -H 'Content-Type: application/json' \
  -d '{"prompt": "it is very rainy outside"}'
```