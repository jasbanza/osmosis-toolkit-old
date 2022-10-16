import { Keplr } from "@keplr-wallet/types";

(async () => {
  // waits for window.keplr to exist (if extension is installed, enabled and injecting it's content script)
  await getKeplr();
  // ok keplr is present... enable chain
  await keplr_connectOsmosis();
  //

  // await getOsmosisWallet().then((wallet) => {
  //   if (wallet) {
  //     // keplr_onAfterConnected();
  //     //const offlineSigner = window.getOfflineSigner(chainId);
  //   }
  // });

  // keplr extension installed and enabled
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
  const wallet = await window.keplr?.getKey("osmosis-1").then((user_key) => {
    console.log(user_key);
    return user_key;
  });
  return wallet;
}

// get osmosis balances

// display osmosis balances

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

// EVENT HANDLERS
async function keplr_chains_onConnected(): Promise<void> {
  const wallet = await getOsmosisWallet();
  ui_setWallet(wallet);
  // update UI

  // register event handler: if user changes account:
  window.addEventListener("keplr_keystorechange", keplr_keystore_onChange);

  //const offlineSigner = window.getOfflineSigner(chainId);
}

async function keplr_chains_onRejected(): Promise<void> {
  ui_setWallet(undefined);
}

async function keplr_keystore_onChange(e: any): Promise<void> {
  const wallet = await getOsmosisWallet();
  ui_setWallet(wallet);
}

// utilized in inline html
async function btnConnectKeplr_onClick(): Promise<void> {
  // connect Keplr wallet extension
  keplr_connectOsmosis();
  // TODO: remove connect button, and show disconnect button
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
  if (wallet) {
    document.querySelector(
      "#wallet-status"
    )!.innerHTML = `${wallet.bech32Address} - ${wallet.name}`;
  } else {
    document.querySelector(
      "#wallet-status"
    )!.innerHTML = `WALLET NOT CONNECTED`;
  }
}
