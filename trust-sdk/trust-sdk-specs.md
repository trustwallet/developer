## URL Specifications

TrustSDK works by calling deeplinks between apps, this document describes URL formats for each command. TrustSDK is highly customizable, clients and wallets can adapt the URLs to their own needs. 

All commands follow the URL format below:

```shell
[scheme]://[command]?[params]&[app]&[id]&[callback]
```

Where: 
* `[scheme]` is the wallet's deeplink scheme. Default to `trust`
* `[command]` is the command to be executed
* `[params]` is the command parameters encoded as url query items.
* `[id]` is the unique command id. The value is later used to resolve the callback for the command. Can be any incrementing integer.
* `[app]` callback URL scheme. 
* `[callback]`callback path. Default to `sgn_sign_result`

### Sign

Sign command is used to sign and broadcast transactions leveraging [wallet core](/wallet-core/wallet-core.md) protobuf models (encoded in base64).

#### Command
* Command: `sdk_sign`
* Parameters:
  * `coin`: BIP44 coin code
  * `data`: wallet core protobuf model binary encoded in base64
  * `send`: flag that indicates if the wallet should broadcast the transaction. Valid values: `true`, `false`.
  * `meta`: transaction metadata. This attribute is optional and encoded as a dictionary. Check how it's encoded in [Dictionary Encoding](#dictionary-encoding).
    * `meta.__name`: transaction metadata type. Valid values: `dapp`
    * `meta.name`: dapp name
    * `meta.url`: dap url encoded

##### Example

```shell
trust://sdk_sign?coin=60&data=ChQAAAAAAAAAAAAAAAAAAAAAAAAAARIUAAAAAAAAAAAAAAAAAAAAAAAAA
d0aFAAAAAAAAAAAAAAAAAAAAAB94pAAIhQAAAAAAAAAAAAAAAAAAAAAAABSCCoqMHg3MjhCMDIzNzcyMzBiNWRm
NzNBYTRFMzE5MkU4OWI2MDkwREQ3MzEyMhQAAAAAAAAAAAAAAAAAAFrzEHpAAA&meta.__name=dapp
&meta.name=Test&meta.url=https://dapptest.com&send=false
&app=sampleapp&callback=sdk_sign_result&id=1
```

#### Response
* Parameters:
  * `coin`: BIP44 coin code
  * `data`: transaction signed as base64 or the transaction hash if `send` is `true`

##### Example

```shell
sampleapp://sdk_sign_result?coin=60&data=Cm34a4IB3YR94pAAglIIlHKLAjdyMLXfc6pOMZLom2CQ3XMSh
lrzEHpAAIAmoB0Yegc2ZqxtkSkXlYo_TEg4eBrjopGUj9ySxJh6JlfToGqR7yNKzV8cD_yN_jVR5YrVaTANO05X2_
9HleO8htQqEgEmGiAdGHoHNmasbZEpF5WKP0xIOHga46KRlI_cksSYeiZX0yIgapHvI0rNXxwP_I3-NVHlitVpMA0
7Tlfb_0eV47yG1Co&id=4
```

### Sign Message

#### Command
* Command: `sdk_sign_message`
* Parameters:
  * `coin`: BIP44 coin code
  * `data`: message to sign, caller must encode or (hash it) as hex string
  * `meta`: dapp metadata. This attribute is optional and encoded as a dictionary. Check how it's encoded in [Dictionary Encoding](#dictionary-encoding).

##### Example

```shell
sampleapp://sdk_sign_message?coin=60&data=4fe61e1a9fb1d18a78977ad1e9611e8c546d54743cf2ff1836fc6933df9f1a54&app=trustsdk&callback=sdk_sign_result&id=1
```

#### Response
* Parameters:
  * `signature`: hex encoded signature

### Get Accounts

#### Command

* Command: `sdk_get_accounts`
* Parameters:
  * `coins`: BIP44 code array encoded as URL params. Check how it's encoded in [Dictionary Encoding](#dictionary-encoding).

##### Example

```shell
trust://sdk_get_accounts?coins.0=60&coins.1=714&app=sampleapp&callback=sdk_sign_result&id=2
```

#### Response
* Parameters:
  * `accounts`: Public addresses joined by `,`.

##### Example

```shell
sampleapp://sdk_sign_result?accounts=0xFC6CD054fAc48Df3744B42ea82E1Dd0fa7027086,
bnb16cddarwr2gnf825fx5gyf676rakc4mwcnxzs7c&id=2
```

### Error Handling

Command may fail for any reason. To handle command failure, TrustSDK has some predefined errors handled automatically:

* Error types:
  * `not_initialized`: The SDK war not itialized properly
  * `coin_not_supported`: coin is not supported for the command
  * `invalid_response`: the response from wallet was in a invalid format
  * `rejected_by_user`: the command was rejected by the user
  * `sign_error`: sign failed
  * `unknown`: unknown error

* Parameters:
  * `error`: error type
  * `message`: error message (optional).

### Dictionary Encoding

Some URLs may contain a multi-level dictionary structure encoded as query parameters. TrustSDK create a list of query parameters by joining the dictionary keys with a `.` separator. If the structure is an array, the key is a integer starting with **0**. Take the data structure below:

```json
[
  "key1": "value1"
  "key2": [
    "subkey1": "value2"
    "subkey2": "value3"
  ],
  "key3": [ 
    "value4", 
    "value5"
  ]
]
```

Will be encoded as:

```shell
key1=value1&key2.subkey1=value2&key2.subkey2=value3&key3.0=value4&key3.1=value5
```
