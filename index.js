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
exports.listLPs_onclick = exports.btn_remove_onClick = exports.input_gammAmountPercent_onInput = exports.input_gammAmount_onInput = exports.btn_gammAmountHalf_onClick = exports.btn_gammAmountMax_onClick = exports.btn_bond_onClick = exports.select_gamms_onChange = exports.tabButton_onClick = exports.btnConnectKeplr_onClick = void 0;
const long_1 = __importDefault(require("long"));
const big_js_1 = __importDefault(require("big.js")); // long library looses precision with dividing
// import { WalletManager } from '@cosmos-kit/core';
// import { osmosis, FEES, getSigningOsmosisClient } from "osmojs";
const osmojs_1 = require("osmojs");
// import {coin} from ""
const { lockTokens } = osmojs_1.osmosis.lockup.MessageComposer.withTypeUrl;
const { exitPool } = osmojs_1.osmosis.gamm.v1beta1.MessageComposer.withTypeUrl;
// console.log(chain);
// const wm = new WalletManager("")
// import { createApp } from "vue";
// import App from "./src/App.vue";
(() => __awaiter(void 0, void 0, void 0, function* () {
    // waits for window.keplr to exist (if extension is installed, enabled and injecting its content script)
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
        ui_resetForms();
        const wallet = yield ((_a = window.keplr) === null || _a === void 0 ? void 0 : _a.getKey("osmosis-1").then((user_key) => {
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
        ui_reinitialize();
        const wallet = yield getOsmosisWallet();
        ui_setWallet(wallet);
        // update UI
        ui_showElementById("form_gamms");
        // register event handler: if user changes account:
        window.addEventListener("keplr_keystorechange", keplr_keystore_onChange);
    });
}
function keplr_chains_onRejected() {
    return __awaiter(this, void 0, void 0, function* () {
        ui_resetForms();
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
        ui_resetMenuSelections();
        // connect Keplr wallet extension
        yield keplr_connectOsmosis();
    });
}
exports.btnConnectKeplr_onClick = btnConnectKeplr_onClick;
let selectedGamm = { denom: "", amount: "0" };
function tabButton_onClick(callee, tabId) {
    // set menu buttons
    ui_resetTabButtons();
    callee.classList.add("active");
    // set tabs
    ui_resetTabs();
    ui_showElementById(tabId);
}
exports.tabButton_onClick = tabButton_onClick;
// bonding functions
function select_gamms_onChange(el) {
    //if selected is gamm, then show bonding durations
    if (el.value == "") {
        ui_hideElementById("gammActions");
    }
    else {
        const option_selectedGamm = el.options[el.selectedIndex];
        selectedGamm = {
            denom: option_selectedGamm === null || option_selectedGamm === void 0 ? void 0 : option_selectedGamm.dataset.denom,
            amount: option_selectedGamm === null || option_selectedGamm === void 0 ? void 0 : option_selectedGamm.dataset.amount,
        };
        // set input field's max value:
        if ((option_selectedGamm === null || option_selectedGamm === void 0 ? void 0 : option_selectedGamm.dataset.amount) &&
            parseInt(option_selectedGamm === null || option_selectedGamm === void 0 ? void 0 : option_selectedGamm.dataset.amount) > 0) {
            let input_gammAmount = (document.getElementById("input_gammAmount"));
            input_gammAmount.max = option_selectedGamm === null || option_selectedGamm === void 0 ? void 0 : option_selectedGamm.dataset.amount;
        }
        ui_hideElementById("container_gammOptions");
        ui_showElementById("gammActions");
    }
    clear_gammAmount();
}
exports.select_gamms_onChange = select_gamms_onChange;
function btn_bond_onClick(duration_days) {
    return __awaiter(this, void 0, void 0, function* () {
        const gammAmount = ui_gammAmount_getValue();
        const gammAmountSanitized = new big_js_1.default(gammAmount).toString();
        if (parseInt(gammAmount) > 0) {
            yield doBond({
                gamm: selectedGamm,
                amount: gammAmountSanitized,
                durationDays: duration_days,
            });
        }
    });
}
exports.btn_bond_onClick = btn_bond_onClick;
function btn_gammAmountMax_onClick() {
    let input_gammAmount = (document.getElementById("input_gammAmount"));
    if (selectedGamm.amount) {
        // const amount = Long.fromString(selectedGamm.amount);
        const amount = new big_js_1.default(selectedGamm.amount);
        input_gammAmount.value = amount.toString();
        input_gammAmount_onInput();
        // set % field...
        let input_gammPercent = (document.getElementById("input_gammPercent"));
        input_gammPercent.value = "100";
        // input_gammAmount.value = Math.floor(amount.toNumber()).toString();
    }
}
exports.btn_gammAmountMax_onClick = btn_gammAmountMax_onClick;
function btn_gammAmountHalf_onClick() {
    let input_gammAmount = (document.getElementById("input_gammAmount"));
    if (selectedGamm.amount) {
        // const amount = Long.fromString(selectedGamm.amount);
        const amount = new big_js_1.default(selectedGamm.amount);
        input_gammAmount.value = amount.div(2).toFixed(0).toString();
        input_gammAmount_onInput();
        // set % field...
        let input_gammPercent = (document.getElementById("input_gammPercent"));
        input_gammPercent.value = "50";
    }
}
exports.btn_gammAmountHalf_onClick = btn_gammAmountHalf_onClick;
function input_gammAmount_onInput(directInput = true) {
    let input_gammAmount = (document.getElementById("input_gammAmount"));
    if (parseInt(input_gammAmount.value) == 0 || input_gammAmount.value == "") {
        ui_hideElementById("container_gammOptions");
    }
    else if (parseInt(input_gammAmount.value) > 0) {
        ui_showElementById("container_gammOptions");
    }
    if (directInput) {
        let input_gammPercent = (document.getElementById("input_gammPercent"));
        input_gammPercent.value = "";
    }
}
exports.input_gammAmount_onInput = input_gammAmount_onInput;
function input_gammAmountPercent_onInput() {
    let input_gammPercent = (document.getElementById("input_gammPercent"));
    let input_gammAmount = (document.getElementById("input_gammAmount"));
    if (selectedGamm.amount) {
        // const amount = Long.fromString(selectedGamm.amount);
        const amount = new big_js_1.default(selectedGamm.amount);
        const percent = parseFloat(input_gammPercent.value);
        // const percent = Long.fromString(input_gammPercent.value);
        if (percent > 100) {
            input_gammAmount.value = amount.toString();
        }
        else if (percent > 0) {
            input_gammAmount.value = amount
                .div(100 / percent)
                .toFixed(0)
                .toString();
        }
        else {
            input_gammAmount.value = "";
        }
        input_gammAmount_onInput(false);
    }
}
exports.input_gammAmountPercent_onInput = input_gammAmountPercent_onInput;
function doBond({ gamm, amount, durationDays, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.getOfflineSignerOnlyAmino) {
            const offlineSigner = window.getOfflineSignerOnlyAmino("osmosis-1");
            const accounts = yield offlineSigner.getAccounts();
            const walletAddress = yield getOsmosisWallet().then((wallet) => {
                return wallet.bech32Address;
            });
            const client = yield (0, osmojs_1.getSigningOsmosisClient)({
                rpcEndpoint: "https://rpc.osmosis.interbloc.org",
                signer: offlineSigner,
            });
            //@ts-ignore
            const fee = osmojs_1.FEES.osmosis.lockTokens("low"); // failing ts build
            // const msgDuration = 86400 * durationDays * 1_000_000_000;
            const msgDuration = 86400 * durationDays; // keplr expects seconds, not nanoseconds!
            const msg = lockTokens({
                coins: [
                    {
                        amount: amount,
                        denom: gamm.denom,
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
                const result = yield client.signAndBroadcast(walletAddress, [msg], fee);
                ui_updateLastTx(result);
            }
            catch (error) {
                ui_hideElementById("lastTxHash");
                ui_showError(error.message);
            }
            ui_toggleMask();
        }
    });
}
// remove liquidity functions
function btn_remove_onClick() {
    return __awaiter(this, void 0, void 0, function* () {
        const gammAmount = ui_gammAmount_getValue();
        const gammAmountSanitized = new big_js_1.default(gammAmount).toString();
        if (parseInt(gammAmount) > 0) {
            yield doExit({
                gamm: selectedGamm,
                amount: gammAmountSanitized,
            });
        }
    });
}
exports.btn_remove_onClick = btn_remove_onClick;
function doExit({ gamm, amount, }) {
    return __awaiter(this, void 0, void 0, function* () {
        if (window.getOfflineSignerOnlyAmino) {
            const offlineSigner = window.getOfflineSignerOnlyAmino("osmosis-1");
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
        }
    });
}
// common
function listLPs_onclick() {
    return __awaiter(this, void 0, void 0, function* () {
        ui_toggleMask("Fetching your pools...");
        yield getGamms().then((gamms) => {
            if (gamms) {
                ui_renderGamms(gamms);
            }
        });
        ui_toggleMask();
    });
}
exports.listLPs_onclick = listLPs_onclick;
function getGamms() {
    return __awaiter(this, void 0, void 0, function* () {
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
            return gamms;
        }
    });
}
// UI FUNCTIONS
function ui_setWallet(wallet) {
    ui_reinitialize();
    if (wallet) {
        document.querySelector("#wallet-status").innerHTML = `${wallet.bech32Address} - ${wallet.name}`;
        document.getElementById("btnConnectKeplr_text").textContent = "Reconnect";
        ui_showElementById("form_gamms");
    }
    else {
        document.querySelector("#wallet-status").innerHTML = `WALLET NOT CONNECTED`;
        document.getElementById("btnConnectKeplr_text").textContent = "Connect";
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
    defaultOption.innerHTML = `Select a Pool`;
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
function ui_gammAmount_getValue() {
    let input_gammAmount = (document.getElementById("input_gammAmount"));
    return input_gammAmount.value;
}
function ui_toggleMask(text = "Loading...") {
    var _a;
    (_a = document.querySelector("#mask")) === null || _a === void 0 ? void 0 : _a.classList.toggle("hidden");
    document.querySelector("#mask div").innerHTML = text;
}
function ui_clearGamms() {
    ui_hideElementById("container_select_gamms");
    ui_reinitialize();
    document.querySelector("#select_gamms").innerHTML = "";
    clear_gammAmount();
}
function clear_gammAmount() {
    const input = document.querySelector("#input_gammAmount");
    input.value = "";
    const input_gammPercent = (document.getElementById("input_gammPercent"));
    input_gammPercent.value = "0";
}
function ui_reinitialize() {
    ui_hideElementById("gammActions");
    ui_resetMenuSelections();
    ui_resetForms();
}
function ui_resetTabButtons() {
    const tabButtons = (document.querySelectorAll("#gammActions button"));
    for (const tabButton of tabButtons) {
        tabButton.classList.remove("active");
    }
}
function ui_resetTabs() {
    ui_resetForms();
    const tabs = document.querySelectorAll(".tab");
    for (const tab of tabs) {
        ui_hideElementById(tab.id);
    }
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
        a.innerHTML =
            "https://www.mintscan.io/osmosis/txs/" + result.transactionHash;
        ui_showElementById("lastTxHash");
        ui_hideElementById("errorMsg");
    }
}
function ui_showError(msg) {
    document.querySelector("#errorMsg").innerHTML = `Error: ${msg}`;
    ui_hideElementById("lastTxHash");
    ui_showElementById("errorMsg");
}
