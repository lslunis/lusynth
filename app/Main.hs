module Main where

import Control.Concurrent.Async (race_)
import Lib
import Network.HTTP.Types (status400)
import Network.Wai (responseLBS)
import Network.Wai.Handler.Warp (defaultSettings, runSettings, setPort, setTimeout)
import Network.Wai.Handler.WebSockets (websocketsOr)
import Network.WebSockets.Connection
    ( CompressionOptions(PermessageDeflateCompression)
    , acceptRequest
    , connectionCompressionOptions
    , defaultConnectionOptions
    , defaultPermessageDeflate
    , receiveData
    , sendTextData
    , withPingThread
    )
import Relude
import System.Environment (lookupEnv)

main = do
    port <- fromMaybe 1225 . (readMaybe =<<) <$> lookupEnv "VIRTUAL_PORT"
    runSettings (setPort port $ setTimeout 60 defaultSettings) app

app = websocketsOr
    options
    (\r -> do
        c <- acceptRequest r
        withPingThread c 20 (pure ()) $ withEvaluator
            (\(put, get) -> race_
                (forever $ put =<< receiveData c)
                (forever $ sendTextData @Text c =<< get)
            )
    )
    (const ($ responseLBS status400 [] "WebSocket required"))
  where
    options = defaultConnectionOptions
        { connectionCompressionOptions = PermessageDeflateCompression
            defaultPermessageDeflate
        }
