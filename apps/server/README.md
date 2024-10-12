# server-mongo

Start Redis Server

```
docker run -p 6379:6379 -it redis/redis-stack-server:latest
```

or [install locally by following this guide](https://redis.io/docs/install/install-redis/install-redis-on-mac-os/)

Create Redis roles and user on [https://app.redislabs.com/#/data-access-control/users](https://app.redislabs.com/#/data-access-control/users) and then add the user credentials in the connection string.

### Dataset Limitations

Since the **BigBasket.csv** dataset has some missing fields, I've added the `sku`, `product-handle` and `inStock` fields while syncing this data in the database, for easier identification and querying of data. 


`@types/express-serve-static-core` & `@types/express` v5.0.0 is being installed with express v4, which breaks, hence specified the exact versions to install in package.json.