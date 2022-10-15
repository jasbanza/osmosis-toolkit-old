import { Keplr } from "@keplr-wallet/types";

(async () => {
  // initialize
  await getKeplr();
})();

async function connectKeplr(): Promise<void> {
  // connect Keplr wallet extension
  await window.keplr
    ?.enable("osmosis-1")
    .then(() => {
      // Connected
    })
    .catch(() => {
      // Rejected
    });
}

// get osmosis wallet address from keplr extension
async function getWalletAddress(): Promise<void> {
  await window.keplr?.getKey("osmosis-1").then((user_key) => {
    console.log(user_key);
  });
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
