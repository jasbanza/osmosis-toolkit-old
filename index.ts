import { Keplr } from "@keplr-wallet/types";

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

(async () => {
  // initialize
  await getKeplr();
  // connect keplr wallet extension
  await window.keplr?.enable("osmosis-1").then((keplr_enable_response) => {
    console.log(keplr_enable_response);
  });
})();

// get osmosis wallet address from keplr extension

// get osmosis balances

// display osmosis balances

//
