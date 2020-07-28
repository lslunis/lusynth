module Lib (withEvaluator) where

import Control.Concurrent.Async (race_)
import Control.Concurrent.STM.TChan (newTChan, readTChan, writeTChan)
import Relude

withEvaluator f = do
    [(putInput, getInput), (putOutput, getOutput)] <- replicateM 2 $ atomically new
    race_ (f (putInput, getOutput)) (forever $ putOutput =<< getInput)
    where new = ((atomically .) . writeTChan &&& atomically . readTChan) <$> newTChan
