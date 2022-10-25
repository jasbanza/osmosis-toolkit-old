"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.btnCheckUnbondedGammAmounts = exports.btn_gammAmountHalf_onClick = exports.btn_gammAmountMax_onClick = exports.btn_bond_onClick = exports.select_gamms_onChange = exports.btnConnectKeplr_onClick = void 0;
const long_1 = __importDefault(require("long"));
// import { WalletManager } from '@cosmos-kit/core';
const osmojs_1 = require("osmojs");
// import {coin} from ""
const { lockTokens } = osmojs_1.osmosis.lockup.MessageComposer.withTypeUrl;
// console.log(chain);
// const wm = new WalletManager("")
// import { createApp } from "vue";
// import App from "./src/App.vue";
(() => __awaiter(void 0, void 0, void 0, function* () {
    // waits for window.keplr to exist (if extension is installed, enabled and injecting it's content script)
    yield getKeplr();
    // ok keplr is present... enable chain
    yield keplr_connectOsmosis();
    //
    // await getOsmosisWallet().then((wallet) => {
    //   if (wallet) {
    //     // keplr_onAfterConnected();
    //     //const offlineSigner = window.getOfflineSigner(chainId);
    //   }
    // });
    // keplr extension installed and enabled
}))();
function keplr_connectOsmosis() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        yield ((_a = window.keplr) === null || _a === void 0 ? void 0 : _a.enable("osmosis-1").then(() => __awaiter(this, void 0, void 0, function* () {
            // Connected
            keplr_chains_onConnected();
        })).catch(() => {
            // Rejected
            keplr_chains_onRejected();
        }));
    });
}
// get osmosis wallet from user's selected account in keplr extension
function getOsmosisWallet() {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        ui_resetForm();
        const wallet = yield ((_a = window.keplr) === null || _a === void 0 ? void 0 : _a.getKey("osmosis-1").then((user_key) => {
            console.log(user_key);
            return user_key;
        }));
        ui_showElementById("container_unbondedLPs");
        return wallet;
    });
}
// INITIALIZATION:
function getKeplr() {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.keplr) {
            return window.keplr;
        }
        if (document.readyState === "complete") {
            return window.keplr;
        }
        return new Promise((resolve) => {
            const documentStateChange = (event) => {
                if (event.target &&
                    event.target.readyState === "complete") {
                    resolve(window.keplr);
                    document.removeEventListener("readystatechange", documentStateChange);
                }
            };
            document.addEventListener("readystatechange", documentStateChange);
        });
    });
}
// EVENT HANDLERS
function keplr_chains_onConnected() {
    return __awaiter(this, void 0, void 0, function* () {
        ui_resetForm();
        const wallet = yield getOsmosisWallet();
        ui_setWallet(wallet);
        // update UI
        ui_showElementById("container_unbondedLPs");
        // register event handler: if user changes account:
        window.addEventListener("keplr_keystorechange", keplr_keystore_onChange);
        //const offlineSigner = window.getOfflineSigner(chainId);
    });
}
function keplr_chains_onRejected() {
    return __awaiter(this, void 0, void 0, function* () {
        ui_resetForm();
        ui_setWallet(undefined);
    });
}
function keplr_keystore_onChange(e) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield getOsmosisWallet();
        ui_setWallet(wallet);
    });
}
// EXPORTED TO A GLOBAL "module" OBJECT FOR INLINE HTML DOM EVENT LISTENERS
function btnConnectKeplr_onClick() {
    return __awaiter(this, void 0, void 0, function* () {
        // connect Keplr wallet extension
        yield keplr_connectOsmosis();
    });
}
exports.btnConnectKeplr_onClick = btnConnectKeplr_onClick;
let selectedGamm = { denom: "", amount: "0" };
function select_gamms_onChange(el) {
    //if selected is gamm, then show bonding durations
    if (el.value == "") {
        ui_hideElementById("container_bondingdurations");
    }
    else {
        const option_selectedGamm = el.options[el.selectedIndex];
        selectedGamm = {
            denom: option_selectedGamm === null || option_selectedGamm === void 0 ? void 0 : option_selectedGamm.dataset.denom,
            amount: option_selectedGamm === null || option_selectedGamm === void 0 ? void 0 : option_selectedGamm.dataset.amount,
        };
        ui_showElementById("container_bondingdurations");
    }
}
exports.select_gamms_onChange = select_gamms_onChange;
function btn_bond_onClick(duration_days) {
    return __awaiter(this, void 0, void 0, function* () {
        const gammAmountToBond = ui_gammAmountToBond_getValue();
        yield doBond({
            gamm: selectedGamm,
            amount: gammAmountToBond,
            durationDays: duration_days,
        });
    });
}
exports.btn_bond_onClick = btn_bond_onClick;
function btn_gammAmountMax_onClick() {
    let input_gammAmountToBond = (document.getElementById("input_gammAmountToBond"));
    if (selectedGamm.amount) {
        const amount = long_1.default.fromString(selectedGamm.amount);
        input_gammAmountToBond.value = amount.toString();
        // input_gammAmountToBond.value = Math.floor(amount.toNumber()).toString();
    }
}
exports.btn_gammAmountMax_onClick = btn_gammAmountMax_onClick;
function btn_gammAmountHalf_onClick() {
    let input_gammAmountToBond = (document.getElementById("input_gammAmountToBond"));
    if (selectedGamm.amount) {
        const amount = long_1.default.fromString(selectedGamm.amount);
        input_gammAmountToBond.value = Math.floor(amount.div(2).toNumber()).toString();
    }
}
exports.btn_gammAmountHalf_onClick = btn_gammAmountHalf_onClick;
function btnCheckUnbondedGammAmounts() {
    return __awaiter(this, void 0, void 0, function* () {
        ui_toggleMask("Loading unbonded LP balances...");
        const { createRPCQueryClient } = osmojs_1.osmosis.ClientFactory;
        const client = yield createRPCQueryClient({
            rpcEndpoint: "https://rpc.osmosis.interbloc.org",
        });
        let address;
        yield getOsmosisWallet().then((res) => {
            address = res === null || res === void 0 ? void 0 : res.bech32Address;
        });
        if (address) {
            const response = yield client.cosmos.bank.v1beta1.allBalances({
                address: address,
                pagination: {
                    key: new Uint8Array(1),
                    offset: new long_1.default.fromString("0"),
                    limit: new long_1.default.fromString("1000"),
                    countTotal: true,
                    reverse: false,
                },
            });
            const arrCoins = response.balances;
            const gamms = [];
            for (const coin of arrCoins) {
                if (coin.denom.indexOf("gamm") == 0) {
                    gamms.push(coin);
                }
            }
            ui_renderGamms(gamms);
        }
        ui_toggleMask();
    });
}
exports.btnCheckUnbondedGammAmounts = btnCheckUnbondedGammAmounts;
function doBond({ gamm, amount, durationDays, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.getOfflineSigner) {
            const offlineSigner = window.getOfflineSigner("osmosis-1");
            const accounts = yield offlineSigner.getAccounts();
            const walletAddress = yield getOsmosisWallet().then((wallet) => {
                return wallet.bech32Address;
            });
            const client = yield (0, osmojs_1.getSigningOsmosisClient)({
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
            // duration workaround as per symphonia guy
            const msgDuration = 86400 * durationDays * 1000000000;
            const msg = lockTokens({
                coins: [
                    {
                        amount: amount,
                        denom: gamm.denom,
                    },
                ],
                duration: {
                    // @ts-ignore
                    seconds: long_1.default.fromNumber(Math.floor(msgDuration / 1000000000)),
                    nanos: msgDuration % 1000000000,
                },
                owner: walletAddress,
            });
            ui_toggleMask("Broadcasting Transaction...");
            try {
                const result = yield client.signAndBroadcast(walletAddress, [msg], fee);
                ui_updateLastTx(result);
            }
            catch (error) {
                ui_updateLastTx_failed();
            }
            ui_toggleMask();
        }
    });
}
// UI FUNCTIONS
function ui_setWallet(wallet) {
    ui_resetForm();
    if (wallet) {
        document.querySelector("#wallet-status").innerHTML = `${wallet.bech32Address} - ${wallet.name}`;
        document.getElementById("btnConnectKeplr_text").textContent =
            "Reconnect Keplr Wallet";
        ui_showElementById("container_unbondedLPs");
    }
    else {
        document.querySelector("#wallet-status").innerHTML = `WALLET NOT CONNECTED`;
        document.getElementById("btnConnectKeplr_text").textContent =
            "Connect Keplr Wallet";
    }
}
function ui_resetForm() {
    ui_hideElementById("container_unbondedLPs"); //step 1
    ui_hideElementById("container_select_gamms"); //step 2
    // ui_hideElementById("select_gamms"); //step 2
    ui_hideElementById("container_bondingdurations"); //step 3
    ui_clearGamms();
}
function ui_renderGamms(gamms) {
    ui_clearGamms();
    const el_selectGamms = document.querySelector("#select_gamms");
    if (gamms.length == 0) {
        //todo set message
        ui_showElementById("msg_gammsEmpty");
        return;
    }
    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.innerHTML = `2. Select an LP from this list`;
    el_selectGamms === null || el_selectGamms === void 0 ? void 0 : el_selectGamms.append(defaultOption);
    for (const coin of gamms) {
        const option = document.createElement("option");
        option.innerHTML = `<b>${coin.denom}</b> - ${coin.amount}`;
        if (option instanceof HTMLOptionElement) {
            option.value = coin.denom;
            option.dataset.denom = coin.denom;
            option.dataset.amount = coin.amount;
        }
        el_selectGamms === null || el_selectGamms === void 0 ? void 0 : el_selectGamms.append(option);
    }
    ui_hideElementById("msg_gammsEmpty");
    ui_showElementById("container_select_gamms");
}
function ui_gammAmountToBond_getValue() {
    let input_gammAmountToBond = (document.getElementById("input_gammAmountToBond"));
    return input_gammAmountToBond.value;
}
function ui_toggleMask(text = "Loading...") {
    var _a;
    (_a = document.querySelector("#mask")) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
    document.querySelector("#mask div").innerHTML = text;
}
function ui_clearGamms() {
    ui_hideElementById("container_select_gamms");
    document.querySelector("#select_gamms").innerHTML = "";
    const input = (document.querySelector("#input_gammAmountToBond"));
    input.value = "";
}
function ui_showElementById(elId) {
    var _a;
    (_a = document.querySelector(`#${elId}`)) === null || _a === void 0 ? void 0 : _a.classList.remove("hidden");
}
function ui_hideElementById(elId) {
    var _a;
    (_a = document.querySelector(`#${elId}`)) === null || _a === void 0 ? void 0 : _a.classList.add("hidden");
}
function ui_updateLastTx(result) {
    const a = document.querySelector("#lastTxHash a");
    if (a && a.href) {
        a.href = "https://www.mintscan.io/osmosis/txs/" + result.transactionHash;
        a.innerHTML = "https://www.mintscan.io/osmosis/txs/" + result.transactionHash;
        ui_showElementById("lastTxHash");
    }
}
function ui_updateLastTx_failed() {
    const a = document.querySelector("#lastTxHash a");
    if (a && a.href) {
        a.href = "";
        a.innerHTML = "FAILED... check console log";
        ui_showElementById("lastTxHash");
    }
}
