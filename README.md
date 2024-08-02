# VCrypto API

This REST API lets you manage your Bitcoin transactions effortlessly. You can buy and sell Bitcoin, and track your investments in USD.

## 🛠️ Requirements

To run VCrypto API, you’ll need:
- Git
- Docker
- Docker Compose

## 🚀 Getting Started

Follow these steps to get the API up and running:

1. **Clone the Repository:**
   ```bash
   git clone git@github.com:dleloutre/volt-crypto-api.git
   ```
2. **Build and Run with Docker Compose:**
    ```bash
    docker compose up -d --build
    ```

3. **Run Migrations:**
    ```bash
    docker exec -it volt-crypto-app npm run migrate:up
    ```
   
4. **Seed the Database:**
    ```bash
    docker exec -it volt-crypto-app npm run seed:all
    ```

    This will initialize your wallets with $50,000 USD and 0 BTC.

5. **Run Tests:**
    ```bash
    docker exec -it volt-crypto-app npm run test
    ```


## 🌐 API Endpoints


### 1. POST /api/buy
   Buy Bitcoin using your USD wallet.

Example Curl:

```
curl --location 'http://localhost:8080/api/buy' \
--header 'Content-Type: application/json' \
--data '{
"amount": 0.0001,
"currency": "btc"
}'
```

### 2. POST /api/sell
   Sell Bitcoin and receive USD in return.

Example Curl:

```
curl --location 'http://localhost:8080/api/sell' \
--header 'Content-Type: application/json' \
--data '{
"amount": 0.0001,
"currency": "btc"
}'
```

### 3. GET /api/portfolio
   Check how much you have invested in Bitcoin, converted to USD.

Example Curl:
```
curl --location 'http://localhost:8080/api/portfolio'
```

## 📝 Future Enhancements
To make VCrypto API more scalable and robust, consider the following improvements:

* **Asynchronous Processing:** Leverage JavaScript’s asynchronous capabilities to handle multiple processes and queries concurrently.
* **Caching:** Implement caching for frequently accessed data to improve performance.
* **User Authentication:** Add user sessions with authentication and authorization strategies like OAuth.
* **Rate Limiting:** Introduce rate limiting to ensure fair usage and prevent abuse