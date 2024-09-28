
#  e-commerce

**Sample e-commerce app** that uses [big-basket](https://www.bigbasket.com/) dataset as products inventory. The search is powered by [Algolia](https://www.algolia.com/) and checkout process is managed by [Razorpay](https://razorpay.com/). To view the complete list of libraries used, check [PackagesUsed.md](/PackagesUsed.md).

- Project uses monorepo style powered by [Turborepo](https://turbo.build/).
- Replace environment variables by your own set of values to get started.
- Dev and prod [Docker](https://hub.docker.com/) images configured alongside github actions.

###  Get Started

- Install `node_modules`
```
	yarn
```

- Build the common folder shared across client & server.
```
	yarn lib:build
```

- Now run the `client` and `server` apps.
```
	yarn run-apps
```

###  Support Me
If you found this template helpful and saved your valuable time, consider [buying me a coffee](https://www.buymeacoffee.com/nish1896)