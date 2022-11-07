 import { Keplr } from "@keplr-wallet/types";
import Long from "long";
import Big from "big.js";
import { osmosis, FEES, getSigningOsmosisClient } from "osmojs";
import { Coin } from "osmojs/src/codegen/cosmos/base/v1beta1/coin";
import { coin } from "@cosmjs/amino";

const { lockTokens, beginUnlocking } =
  osmosis.lockup.MessageComposer.withTypeUrl;
const {
  joinPool,
  exitPool,
  exitSwapExternAmountOut,
  exitSwapShareAmountIn,
  joinSwapExternAmountIn,
  joinSwapShareAmountOut,
  swapExactAmountIn,
  swapExactAmountOut,
} = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;



