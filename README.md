# stocks-checklist

App for creating custom stocks categories and price checks

## Features

- Saving user's data (categories, stocks) by mongodb document id as cookie token
- Adding and removing stocks category
- Searching, adding and removing stocks from the selected category
- Opening page with company profile (name, price, price change, description)

## Application run

### Pre-Installion
Before running app locally, you must run MongoDB server on port 27017:
- Install https://www.mongodb.com/try/download/community
- Run mongod from the terminal, for example, `"C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\data\db"`

### Installion

```bash
git clone https://github.com/asdasd-dev/stocks-checklist.git
cd stocks-checklist
npm install
npm run dev
```

After that server will be loaded on `localhost:8080` and client on `localhost:3000`


Open built project with [Github Pages](https://asdasd-dev.github.io/stocks-checklist) (not actual version)
