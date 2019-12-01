# WalletConsole utility

The *Wallet Core* library comes with an interactive command-line utility, for accessing key- and address management functionality of the library. 

## Quick Start

    $ ./build/walletconsole/walletconsole 
    Wallet-Core Console                          (c) TrustWallet
    Type 'help' for list of commands.
    > help
    Commands:
      . . .
      newKey                  Create new pseudo-random 32-byte key (secret!)
      . . .
    > coin btc
    Set active coin to: bitcoin
    > addrDefault
    Result:  bc1q2kecrqfvzj7l6phet956whxkvathsvsgn7twav

## Starting

The utility builds together with the library and can be started from: *build/walletconsole/walletconsole* .

## Commands

Here is a snapshot of the commands:

    Commands:
    exit                    Exit
    quit                    Exit
    help                    This help
    Inputs, buffer:
    #                       Take last result
    #<n>                    Take nth previous result
    buffer                  Take buffer values
    Coins:
    coins                   List known coins
    coin <coin>             Set active coin, selected by its ID or symbol or name
    Keys:
    newKey                  Create new pseudo-random 32-byte key (secret!)
    pubPri <priKey>         Derive public key from a secret private key (type is coin-dependent)
    priPub <pubKey>         Derive private key from public key :)
    setMnemonic <word1> ... Set current mnemonic, several words (secret!)
    newMnemonic <strength>  Create and store a new mnemonic, of strength (128 -- 256) (secret!)
    dumpSeed                Dump the seed of the current mnemonic (secret!)
    dumpMnemonic            Dump the current mnemonic (secret!)
    dumpDP                  Dump the default derivation path of the current coin (ex.: m/84'/0'/0'/0/0)
    priDP [<derivPath>]     Derive a new private key for the coin, from the current mnemonic and given derivation path.
                            If derivation path is missing, the default one is used (see dumpDP).
    Addresses:
    addrPub <pubKey>        Create <coin> address from public key
    addrPri <priKey>        Create <coin> address from private key
    addr <addr>             Check string <coin> address
    addrDefault             Derive default address, for current coin, fom current mnemonic; see dumpDP
    addrDP <derivPath>      Derive a new address with the given derivation path (using current coin and mnemonic)
    Coin-specific methods:
    tonInitMsg <priKey>     Build TON account initialization message.
    Transformations:
    hex <inp>               Encode given string to hex
    base64Encode <inp>      Encode given hex data to Base64
    base64Decode <inp>      Decode given Base64 string to hex data
    File methods:
    fileW <fileName> <data> Write data to a (new) binary file.
    fileR <fileName>        Read data from a binary file.

## Examples

> coin bitcoin
Set active coin to: bitcoin    Use 'coin' to change.  (name: 'bitcoin'  symbol: btc  numericalid: 0)
> newKey
Result:  4e8c1773ce1ca447594fa23a445d9952236c7a15e96802b880aab4d918bdcfd9
> addrPri #
Result:  bc1qvjf93nc80f3fu7j2ehqv6xw6zqa5cny32hl90y
> fileW btcaddr.txt #
Written to file 'btcaddr.txt', 21 bytes.

> newKey
Result:  ef8f76035c4d4dd29ed4bbe3fc7c0db45d81cd616f2ac8b038cb982bec2a63ad
> pubPri #
Result:  0381277ec943a6cd4033171da547bbe93585a8905fb3dad108e8e51e88a4e136ea
> addrPub #
Result:  bc1qvf6gzfhcelpugw84ks677x5zuke46jm946dtpx


> coin algo
Set active coin to: algorand    Use 'coin' to change.  (name: 'algorand'  symbol: algo  numericalid: 283)
> addr LCSUSBOLNVT6BND6DWWGM4DLVUYJN3PGBT4T7LTCMDMKS7TR7FZAOHOVPE
Address is a valid algorand address:  LCSUSBOLNVT6BND6DWWGM4DLVUYJN3PGBT4T7LTCMDMKS7TR7FZAOHOVPE



> coin btc <Enter> dumpDP <Enter> pridb <Enter> priDP m/84'/0'/0'/0/1 <Enter> pubPri # <Enter> addrPub # <Enter> addr #
> coin nano <Enter> dumpDP <Enter> setMnemonic word1 word2 ... word12 <Enter> addrDefault <Enter> addrDP m/44'/165'/0' <Enter> addrDP m/44'/165'/1'
> hex Hello <Enter> base64Encode # <Enter> base64Decode # <Enter> buffer
