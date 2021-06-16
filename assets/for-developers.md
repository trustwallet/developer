# For Developers

## Accessing Files

> **Warning:**
>
> Do *NOT* access files from GitHub hosting directly from production projects!
>
> GitHub may cut access without further notice.  Roll out your own CDN layer!
> 
> GitHub hosted content should be used for testing purposes only.

## Logo Paths

The path for token logos is structured like this:
```
blockchains/<blockchain>/assets/<token-id>/logo.png
```

For native coins it is:
```
blockchains/<blockchain>/info/logo.png
```

Below are some examples:
```
Bitcoin (coin):
  blockchains/bitcoin/info/logo.png

An ERC20 token:
  blockchains/ethereum/assets/0x006BeA43Baa3f7A6f765F14f10A1a1b08334EF45/logo.png

A BEP-20 token:
  blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/logo.png

A BEP-2 token:
  blockchains/binance/assets/ANKR-E97/logo.png

A TRC-10 token:
  blockchains/tron/assets/1002000/logo.png

A TRC-20 token:
  blockchains/tron/assets/TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t/logo.png
```

Here is a full URL example (do not use from GitHub directly in production)

```
https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0x4B0F1812e5Df2A09796481Ff14017e6005508003/logo.png
```
