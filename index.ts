// import { chain, assets, asset_list, testnet, testnet_assets } from '@chain-registry/osmosis';
import { Keplr } from "@keplr-wallet/types";
import Long from "long";
import Big from "big.js"; // long library looses precision with dividing

// import { WalletManager } from '@cosmos-kit/core';
// import { osmosis, FEES, getSigningOsmosisClient } from "osmojs";
import { osmosis, FEES, getSigningOsmosisClient } from "osmojs";
// import { PageRequest } from "osmojs/types/codegen/cosmos/base/query/v1beta1/pagination";
import { Coin } from "osmojs/types/codegen/cosmos/base/v1beta1/coin";
import { Duration } from "osmojs/types/codegen/google/protobuf/duration";
import { MsgLockTokens } from "osmojs/types/codegen/osmosis/lockup/tx";
// import {coin} from ""

const { lockTokens } = osmosis.lockup.MessageComposer.withTypeUrl;
const { exitPool } = osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;
// console.log(chain);

// const wm = new WalletManager("")

// import { createApp } from "vue";
// import App from "./src/App.vue";

(async () => {
  // waits for window.keplr to exist (if extension is installed, enabled and injecting its content script)
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
  ui_resetForms();
  const wallet = await window.keplr?.getKey("osmosis-1").then((user_key) => {
    return user_key;
  });
  ui_showElementById("container_unbondedLPs");
  return wallet;
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
  ui_resetMenuSelections();
  // connect Keplr wallet extension
  await keplr_connectOsmosis();
}

let selectedGamm: {
  denom: string | undefined;
  amount: string | undefined;
} = { denom: "", amount: "0" };

export function tabButton_onClick(callee: HTMLButtonElement, tabId: string) {
  // set menu buttons
  ui_resetTabButtons();
  callee.classList.add("active");

  // set tabs
  ui_resetTabs();
  ui_showElementById(tabId);
}

// bonding functions

export function select_gamms_onChange(el: HTMLSelectElement) {
  //if selected is gamm, then show bonding durations
  if (el.value == "") {
    ui_hideElementById("gammActions");
  } else {
    const option_selectedGamm = el.options[el.selectedIndex];
    selectedGamm = <Coin>{
      denom: option_selectedGamm?.dataset.denom,
      amount: option_selectedGamm?.dataset.amount,
    };

    // set input field's max value:
    if (
      option_selectedGamm?.dataset.amount &&
      parseInt(option_selectedGamm?.dataset.amount) > 0
    ) {
      let input_gammAmount = <HTMLInputElement>(
        document.getElementById("input_gammAmount")
      );
      input_gammAmount.max = option_selectedGamm?.dataset.amount;
    }
    ui_hideElementById("container_gammOptions");
    ui_showElementById("gammActions");
  }

  clear_gammAmount();
}

export async function btn_bond_onClick(duration_days: number) {
  const gammAmount = ui_gammAmount_getValue();
  const gammAmountSanitized = new Big(gammAmount).toString();
  if (parseInt(gammAmount) > 0) {
    await doBond({
      gamm: selectedGamm,
      amount: gammAmountSanitized,
      durationDays: duration_days,
    });
  }
}

export function btn_gammAmountMax_onClick() {
  let input_gammAmount = <HTMLInputElement>(
    document.getElementById("input_gammAmount")
  );
  if (selectedGamm.amount) {
    // const amount = Long.fromString(selectedGamm.amount);
    const amount = new Big(selectedGamm.amount);
    input_gammAmount.value = amount.toString();
    input_gammAmount_onInput();
    // set % field...
    let input_gammPercent = <HTMLInputElement>(
      document.getElementById("input_gammPercent")
    );
    input_gammPercent.value = "100";
    // input_gammAmount.value = Math.floor(amount.toNumber()).toString();
  }
}

export function btn_gammAmountHalf_onClick() {
  let input_gammAmount = <HTMLInputElement>(
    document.getElementById("input_gammAmount")
  );
  if (selectedGamm.amount) {
    // const amount = Long.fromString(selectedGamm.amount);
    const amount = new Big(selectedGamm.amount);
    input_gammAmount.value = amount.div(2).toFixed(0).toString();
    input_gammAmount_onInput();
    // set % field...
    let input_gammPercent = <HTMLInputElement>(
      document.getElementById("input_gammPercent")
    );
    input_gammPercent.value = "50";
  }
}


export function input_gammAmount_onInput(directInput: boolean = true) {
  let input_gammAmount = <HTMLInputElement>(
    document.getElementById("input_gammAmount")
  );
  if (parseInt(input_gammAmount.value) == 0 || input_gammAmount.value == "") {
    ui_hideElementById("container_gammOptions");
  } else if (parseInt(input_gammAmount.value) > 0) {
    ui_showElementById("container_gammOptions");
  }
  if (directInput) {
    let input_gammPercent = <HTMLInputElement>(
      document.getElementById("input_gammPercent")
    );
    input_gammPercent.value = "";
  }
}

export function input_gammAmountPercent_onInput() {
  let input_gammPercent = <HTMLInputElement>(
    document.getElementById("input_gammPercent")
  );
  let input_gammAmount = <HTMLInputElement>(
    document.getElementById("input_gammAmount")
  );
  if (selectedGamm.amount) {
    // const amount = Long.fromString(selectedGamm.amount);
    const amount = new Big(selectedGamm.amount);
    const percent = parseFloat(input_gammPercent.value);
    // const percent = Long.fromString(input_gammPercent.value);
    if (percent > 100) {
      input_gammAmount.value = amount.toString();
    } else if (percent > 0) {
      input_gammAmount.value = amount
        .div(100 / percent)
        .toFixed(0)
        .toString();
    } else {
      input_gammAmount.value = "";
    }
    input_gammAmount_onInput(false);
  }
}

async function doBond({
  gamm,
  amount,
  durationDays,
}: {
  gamm: { amount: string | undefined; denom: string | undefined };
  amount: string;
  durationDays: number;
}) {
  if (window.getOfflineSignerOnlyAmino) {
    const offlineSigner = window.getOfflineSignerOnlyAmino("osmosis-1");
    const accounts = await offlineSigner.getAccounts();
    const walletAddress = await getOsmosisWallet().then((wallet) => {
      return wallet!.bech32Address;
    });
    const client = await getSigningOsmosisClient({
      rpcEndpoint: "https://rpc.osmosis.interbloc.org",
      signer: offlineSigner,
    });
    //@ts-ignore
    const fee = FEES.osmosis.lockTokens("low"); // failing ts build

    // const msgDuration = 86400 * durationDays * 1_000_000_000;
    const msgDuration = 86400 * durationDays; // keplr expects seconds, not nanoseconds!
    const msg = lockTokens({
      coins: [
        {
          amount: amount,
          denom: <string>gamm.denom,
        },
      ],
      // @ts-ignore duration workaround
      duration: msgDuration.toString(),
      //  {
      //     // @ts-ignore
      //     seconds: Long.fromNumber(Math.floor(msgDuration / 1_000_000_000)),
      //     nanos: msgDuration % 1_000_000_000,
      // },
      owner: walletAddress,
    });

    ui_toggleMask("Broadcasting Transaction...");
    try {
      const result = await client.signAndBroadcast(walletAddress, [msg], fee);
      ui_updateLastTx(result);
    } catch (error: any) {
      ui_hideElementById("lastTxHash");
      ui_showError(error.message);
    }
    ui_toggleMask();
  }
}

// remove liquidity functions
export async function btn_remove_onClick() {
  const gammAmount = ui_gammAmount_getValue();
  const gammAmountSanitized = new Big(gammAmount).toString();
  if (parseInt(gammAmount) > 0) {
    await doExit({
      gamm: selectedGamm,
      amount: gammAmountSanitized,
    });
  }
}

async function doExit({
  gamm,
  amount,
}: {
  gamm: { amount: string | undefined; denom: string | undefined };
  amount: string;
}) {
  if (window.getOfflineSignerOnlyAmino) {
    const offlineSigner = window.getOfflineSignerOnlyAmino("osmosis-1");
    const accounts = await offlineSigner.getAccounts();
    const walletAddress = await getOsmosisWallet().then((wallet) => {
      return wallet!.bech32Address;
    });
    const client = await getSigningOsmosisClient({
      rpcEndpoint: "https://rpc.osmosis.interbloc.org",
      signer: offlineSigner,
    });

    // const fee = FEES.osmosis.lockTokens('low'); // failing ts build
    const fee = {
      amount: [
        {
          denom: "uosmo",
          amount: "0",
        },
      ],
      gas: "450000",
    };
  }
}

// common
export async function listLPs_onclick() {
  ui_toggleMask("Fetching your pools...");
  await getGamms().then((gamms) => {
    if (gamms) {
      ui_renderGamms(gamms);
    }
  });

  ui_toggleMask();
}

async function getGamms() {
  const { createRPCQueryClient } = osmosis.ClientFactory;
  const client = await createRPCQueryClient({
    rpcEndpoint: "https://rpc.osmosis.interbloc.org",
  });
  let address: string | undefined;
  await getOsmosisWallet().then((res) => {
    address = res?.bech32Address;
  });
  if (address) {
    const response = await client.cosmos.bank.v1beta1.allBalances({
      address: address,
      pagination: {
        key: new Uint8Array(1),
        offset: new (Long as any).fromString("0"),
        limit: new (Long as any).fromString("1000"),
        countTotal: true,
        reverse: false,
      },
    });
    const arrCoins = response.balances;
    const gamms: Coin[] = [];
    for (const coin of arrCoins) {
      if (coin.denom.indexOf("gamm") == 0) {
        gamms.push(coin);
      }
    }
    return gamms;
  }
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

function ui_resetMenuSelections() {
  ui_resetTabButtons();
  ui_resetTabs();
}

function ui_resetForms() {
  // remove liquidity form
  ui_hideElementById("container_exitPool"); //step 1

  // bond pool form
  ui_hideElementById("container_unbondedLPs"); //step 1
  //   ui_hideElementById("container_select_gamms"); //step 2

  // ui_hideElementById("select_gamms"); //step 2
  //   ui_hideElementById("container_bondingdurations"); //step 3
  //   ui_clearGamms();
}

function ui_renderGamms(gamms: Coin[]) {
  ui_clearGamms();
  const el_selectGamms = document.querySelector("#select_gamms");
  if (gamms.length == 0) {
    //todo set message

    ui_showElementById("msg_gammsEmpty");
    return;
  }
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.innerHTML = `Select a Pool`;
  el_selectGamms?.append(defaultOption);

  for (const coin of gamms) {
    const option = document.createElement("option");
    option.innerHTML = `<b>${coin.denom}</b> - ${coin.amount}`;
    if (option instanceof HTMLOptionElement) {
      option.value = coin.denom;
      option.dataset.denom = coin.denom;
      option.dataset.amount = coin.amount;
    }
    el_selectGamms?.append(option);
  }
  ui_hideElementById("msg_gammsEmpty");

  ui_showElementById("container_select_gamms");
}

function ui_gammAmount_getValue(): string {
  let input_gammAmount = <HTMLInputElement>(
    document.getElementById("input_gammAmount")
  );
  return input_gammAmount.value;
}

function ui_toggleMask(text: string = "Loading...") {
  document.querySelector("#mask")?.classList.toggle("hidden");
  document.querySelector("#mask div")!.innerHTML = text;
}

function ui_clearGamms() {
  ui_hideElementById("container_select_gamms");
  ui_reinitialize();
  document.querySelector("#select_gamms")!.innerHTML = "";
  clear_gammAmount();
}

function clear_gammAmount() {
  const input = <HTMLInputElement>document.querySelector("#input_gammAmount");
  input.value = "";

  const input_gammPercent = <HTMLInputElement>(
    document.getElementById("input_gammPercent")
  );
  input_gammPercent.value = "0";
}

function ui_reinitialize() {
  ui_hideElementById("gammActions");
  ui_resetMenuSelections();
  ui_resetForms();
}

function ui_resetTabButtons() {
  const tabButtons = <NodeListOf<HTMLButtonElement>>(
    document.querySelectorAll("#gammActions button")
  );
  for (const tabButton of tabButtons) {
    tabButton.classList.remove("active");
  }
}

function ui_resetTabs() {
  ui_resetForms();
  const tabs = <NodeListOf<HTMLDivElement>>document.querySelectorAll(".tab");
  for (const tab of tabs) {
    ui_hideElementById(tab.id);
  }
}

function ui_showElementById(elId: string) {
  document.querySelector(`#${elId}`)?.classList.remove("hidden");
}

function ui_hideElementById(elId: string) {
  document.querySelector(`#${elId}`)?.classList.add("hidden");
}

function ui_updateLastTx(result: any) {
  const a = <HTMLAnchorElement>document.querySelector("#lastTxHash a");
  if (a && a.href) {
    a.href = "https://www.mintscan.io/osmosis/txs/" + result.transactionHash;
    a.innerHTML =
      "https://www.mintscan.io/osmosis/txs/" + result.transactionHash;
    ui_showElementById("lastTxHash");
    ui_hideElementById("errorMsg");
  }
}

function ui_showError(msg: string) {
  document.querySelector("#errorMsg")!.innerHTML = `Error: ${msg}`;
  ui_hideElementById("lastTxHash");
  ui_showElementById("errorMsg");
}
