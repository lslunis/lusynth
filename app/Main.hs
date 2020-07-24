module Main where
import Data.Text (Text)
import Network.Wai.Handler.WebSockets (websocketsOr)
import Network.Wai.Handler.Warp (defaultSettings, setPort, runSettings)
import Network.WebSockets.Connection
    ( sendTextData
    , acceptRequest
    , defaultConnectionOptions
    , defaultPermessageDeflate
    , connectionCompressionOptions
    , CompressionOptions(PermessageDeflateCompression)
    )
import Network.Wai (responseLBS)
import Network.HTTP.Types (status400)

main = runSettings (setPort 1225 defaultSettings) app

app = websocketsOr
    options
    ((flip sendTextData ("hi" :: Text) =<<) . acceptRequest)
    (const ($ responseLBS status400 [] "WebSocket required"))
  where
    options = defaultConnectionOptions
        { connectionCompressionOptions = PermessageDeflateCompression
            defaultPermessageDeflate
        }
