# Developer
## Code Style

This repository use the [Uber Go Style Guide](https://github.com/uber-go/guide/blob/master/style.md), which documents
patterns and conventions used in Go code at Uber.

## Tests

All new implementations need to be cover from unit and integration tests. 

### Unit
To run the unit tests: `make test`

### Integration

To run the unit tests: `make integration`

You can find the integration  tests inside the folder `pkg/tests/integration`. The tests use a different build constraint, named `integration`.

### Functional

The functional tests are generated automatically and make a health check test in all API's provided from Blockatlas. You only need to set the environment for your coin in the config file.
The tests use a different build constraint, named `functional`.

You can find the functional tests inside the folder `pkg/tests/functional`.  

To run the integration tests: `make functional` 

##### Fixtures

- If you need to change the parameters used in our tests, you can update the fixtures files inside the folder `pkg/tests/functional/testdata`

	- `body_fixtures.json` - Body fixtures for POST requests.
	- `coin_fixtures.json` - Coin fixtures for path parameters.
	- `query_fixtures.json` - Query string for GET requests.
 
- To exclude an API from integration tests, you need to add the route inside the file `pkg/tests/functional/testdata/exclude.json`

e.g.:

```json
[
  "/v2/ethereum/collections/:owner",
  "/v2/ethereum/collections/:owner/collection/:collection_id"
]
```


## Error
Use the package `pkg/errors` for create a new error.
An error in Go is any implementing interface with an Error() string method. We overwrite the error object by our error struct:

```
type Error struct {
	Err   error
	Type  Type
	meta  map[string]interface{}
	stack []string
}
```

To be easier the error construction, the package provides a function named E, which is short and easy to type:

`func E(args ...interface{}) *Error`

E.g.:
- just error:
`errors.E(err)`

- error with message:
`errors.E(err, "new message to append")`

- error with type:
`errors.E(err, errors.TypePlatformReques)`

- error with type and message:
`errors.E(err, errors.TypePlatformReques, "new message to append")`

- error with type and meta:
```
errors.E(err, errors.TypePlatformRequest, errors.Params{
			"coin":   "Ethereum",
			"method": "CurrentBlockNumber",
		})
```

- error with meta:
```
errors.E(err, errors.Params{
			"coin":   "Ethereum",
			"method": "CurrentBlockNumber",
		})
```

- error with type and meta:
```
errors.E(err, errors.TypePlatformRequest, errors.Params{
			"coin":   "Ethereum",
			"method": "CurrentBlockNumber",
		})
```

- error with type, message and meta:
```
errors.E(err, errors.TypePlatformRequest, "new message to append", errors.Params{
			"coin":   "Ethereum",
			"method": "CurrentBlockNumber",
		})
```


- You can send the errors to sentry using `.PushToSentry()`
`errors.E(err, errors.TypePlatformReques).PushToSentry()`


*All fatal errors emitted by logger package already send the error to Sentry*

### Types

```
const (
	TypeNone Type = iota
	TypePlatformUnmarshal
	TypePlatformNormalize
	TypePlatformUnknown
	TypePlatformRequest
	TypePlatformClient
	TypePlatformError
	TypePlatformApi
	TypeLoadConfig
	TypeLoadCoins
	TypeObserver
	TypeStorage
	TypeAssets
	TypeUtil
	TypeCmd
	TypeUnknown
)
```


## Logs
Use the package `pkg/logger` for logs.

E.g.:

- Log message:
`logger.Info("Loading Observer API")`

- Log message with params:
`logger.Info("Running application", logger.Params{"bind": bind})`

- Fatal with error:
`logger.Fatal("Application failed", err)`

- The method parameters don't have a sort. You just need to pass them to the method:
`logger.Fatal(err, "Application failed")`

- Create a simple error log:
`logger.Error(err)`

- Create an error log with a message:
`logger.Error("Failed to initialize API", err)`

- Create an error log, with error, message, and params:
```
p := logger.Params{
	"platform": handle,
	"coin":     platform.Coin(),
}
err := platform.Init()
if err != nil {
	logger.Error("Failed to initialize API", err, p)
}
```

- Debug log:
`logger.Debug("Loading Observer API")`
 or 
`logger.Debug("Loading Observer API", logger.Params{"bind": bind})`

- Warning log:
`logger.Warn("Warning", err)`
 or 
`logger.Warn(err, "Warning")`
 or 
`logger.Warn("Warning", err, logger.Params{"bind": bind})`
