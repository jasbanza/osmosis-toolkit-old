import { Keplr } from "@keplr-wallet/types";

(async () => {
  // initialize
  await getKeplr();
  await isKeplrConnected().then((isConnected) => {
    if (isConnected) {
      updateUI_setAddressStatus();
    }
  });
})();

async function connectKeplr(): Promise<void> {
  // connect Keplr wallet extension
  await window.keplr
    ?.enable("osmosis-1")
    .then(() => {
      // Connected
      updateUI_setAddressStatus();
    })
    .catch(() => {
      // Rejected
      updateUI_setAddressStatus();
    });
}

// get osmosis wallet address from keplr extension
async function getWalletAddress(): Promise<
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

//

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

// UI FUNCTIONS:
async function isKeplrConnected(): Promise<boolean> {
  const connected = await window.keplr?.getKey("osmosis-1").then((res) => {
    return res;
  });
  return !!connected;
}

async function updateUI_setAddressStatus() {
  await getWalletAddress().then((wallet) => {
    if (wallet) {
      document.querySelector(
        "#wallet-status"
      )!.innerHTML = `${wallet.bech32Address} - ${wallet.name}`;
    } else {
      document.querySelector(
        "#wallet-status"
      )!.innerHTML = `WALLET NOT CONNECTED`;
    }
  });
}
