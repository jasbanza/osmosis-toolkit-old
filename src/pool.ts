// import { chain, assets, asset_list, testnet, testnet_assets } from '@chain-registry/osmosis';
import { Keplr } from "@keplr-wallet/types";
import Long from "long";
import Big from "big.js"; // long library looses precision with dividing

import { osmosis, FEES, getSigningOsmosisClient } from "osmojs";
import { Coin } from "osmojs/src/codegen/cosmos/base/v1beta1/coin";
import { coin } from '@cosmjs/amino';
// import { MsgSwapExactAmountIn } from "osmojs/src/codegen/osmosis/gamm/v1beta1/tx";

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

const example_MsgJoinPool = [
  {
    "@type": "/osmosis.gamm.v1beta1.MsgJoinPool",
    "sender": "osmo1vwrruj48vk8q49a7g8z08284wlvm9s6el6c7ej",
    "pool_id": "815",
    "share_out_amount": "28547067918022866861920",
    "token_in_maxs": [
      {
        "denom": "ibc/EB7FB9C8B425F289B63703413327C2051030E848CE4EAAEA2E51199D6D39D3EC",
        "amount": "1057076962"
      },
      {
        "denom": "uosmo",
        "amount": "242053032"
      }
    ]
  }
];

const example_MsgJoinSwapExternAmountIn =  [
  {
    "@type": "/osmosis.gamm.v1beta1.MsgJoinSwapExternAmountIn",
    "sender": "osmo1vwrruj48vk8q49a7g8z08284wlvm9s6el6c7ej",
    "pool_id": "833",
    "token_in": {
      "denom": "uosmo",
      "amount": "500000000"
    },
    "share_out_min_amount": "362722610014969880"
  }
];

(async () => {
  // waits for window.keplr to exist (if extension is installed, enabled and injecting its content script)
  await getKeplr();
  // ok keplr is present... enable chain
  await keplr_connectOsmosis();
})();

async function keplr_connectOsmosis(): Promise<void> {
  await window.keplr
    ?.enable("osmosis-1")
    .then(async () => {
      // Connected
      keplr_chains_onConnected();
    })
    .catch(() => {
      // Rejected
      keplr_chains_onRejected();
    });
}

// INITIALIZATION:
async function getKeplr(): Promise<Keplr | undefined> {
  if (window.keplr) {
    return window.keplr;
  }

  if (document.readyState === "complete") {
    return window.keplr;
  }

  return new Promise((resolve) => {
    const documentStateChange = (event: Event) => {
      if (
        event.target &&
        (event.target as Document).readyState === "complete"
      ) {
        resolve(window.keplr);
        document.removeEventListener("readystatechange", documentStateChange);
      }
    };

    document.addEventListener("readystatechange", documentStateChange);
  });
}

// get osmosis wallet from user's selected account in keplr extension
async function getOsmosisWallet(): Promise<
  | {
      name: string;
      algo: string;
      pubKey: Uint8Array;
      address: Uint8Array;
      bech32Address: string;
    }
  | undefined
> {
  ui_resetForms();
  const wallet = await window.keplr?.getKey("osmosis-1").then((user_key) => {
    return user_key;
  });
  return wallet;
}


// EVENT HANDLERS
async function keplr_chains_onConnected(): Promise<void> {
  ui_reinitialize();
  const wallet = await getOsmosisWallet();
  ui_setWallet(wallet);
  // update UI
  ui_showElementById("form_gamms");

  // register event handler: if user changes account:
  window.addEventListener("keplr_keystorechange", keplr_keystore_onChange);
}

async function keplr_chains_onRejected(): Promise<void> {
  ui_resetForms();
  ui_setWallet(undefined);
}

async function keplr_keystore_onChange(e: any): Promise<void> {
  const wallet = await getOsmosisWallet();
  ui_setWallet(wallet);
}

// EXPORTED TO A GLOBAL "module" OBJECT FOR INLINE HTML DOM EVENT LISTENERS

export async function btnConnectKeplr_onClick(): Promise<void> {
  // connect Keplr wallet extension
  await keplr_connectOsmosis();
}

let selectedGamm: {
  denom: string | undefined;
  amount: string | undefined;
} = { denom: "", amount: "0" };

export async function btn_join_onClick() {
  // const gammAmount = ui_gammAmount_getValue();
  // const gammAmountSanitized = new Big(gammAmount).toString();
  // if (parseInt(gammAmount) > 0) {
  //   await doBond({
  //     gamm: selectedGamm,
  //     amount: gammAmountSanitized,
  //     durationDays: duration_days,
  //   });
  // }
  
}


// UI FUNCTIONS

function ui_setWallet(
  wallet:
    | {
        name: string;
        algo: string;
        pubKey: Uint8Array;
        address: Uint8Array;
        bech32Address: string;
      }
    | undefined
): void {
  ui_reinitialize();
  if (wallet) {
    document.querySelector(
      "#wallet-status"
    )!.innerHTML = `${wallet.bech32Address} - ${wallet.name}`;
    document.getElementById("btnConnectKeplr_text")!.textContent = "Reconnect";
    ui_showElementById("form_gamms");
  } else {
    document.querySelector(
      "#wallet-status"
    )!.innerHTML = `WALLET NOT CONNECTED`;
    document.getElementById("btnConnectKeplr_text")!.textContent = "Connect";
  }
}

function ui_resetForms() {
  throw new Error("Function not implemented.");
}

function ui_reinitialize() {
  throw new Error("Function not implemented.");
}

function ui_showElementById(elId: string) {
  document.querySelector(`#${elId}`)?.classList.remove("hidden");
}

function ui_hideElementById(elId: string) {
  document.querySelector(`#${elId}`)?.classList.add("hidden");
}