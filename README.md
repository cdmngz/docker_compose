# Docker Compose

This is an React Node App with the intention to try docker componse. Includes some crypto references and a limiter petition with Redis.

## Run the container

To start the magic

```bash
docker compose build
docker compose run
```

## Front

The front is a fetch consuming app with a list of crypto availables in an exchange.

## Back

The back consumes the public apis of 3 important exchanges, to see the best actual prices of BTC buy/sell in the moment.

## License

[GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html)
