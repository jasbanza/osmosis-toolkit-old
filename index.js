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
Object.defineProperty(exports, "__esModule", { value: true });
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
        const wallet = yield ((_a = window.keplr) === null || _a === void 0 ? void 0 : _a.getKey("osmosis-1").then((user_key) => {
            console.log(user_key);
            return user_key;
        }));
        return wallet;
    });
}
// get osmosis balances
// display osmosis balances
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
        const wallet = yield getOsmosisWallet();
        ui_setWallet(wallet);
        // update UI
        // register event handler: if user changes account:
        window.addEventListener("keplr_keystorechange", keplr_keystore_onChange);
        //const offlineSigner = window.getOfflineSigner(chainId);
    });
}
function keplr_chains_onRejected() {
    return __awaiter(this, void 0, void 0, function* () {
        ui_setWallet(undefined);
    });
}
function keplr_keystore_onChange(e) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet = yield getOsmosisWallet();
        ui_setWallet(wallet);
    });
}
// utilized in inline html
function btnConnectKeplr_onClick() {
    return __awaiter(this, void 0, void 0, function* () {
        // connect Keplr wallet extension
        keplr_connectOsmosis();
        // TODO: remove connect button, and show disconnect button
    });
}
// UI FUNCTIONS
function ui_setWallet(wallet) {
    if (wallet) {
        document.querySelector("#wallet-status").innerHTML = `${wallet.bech32Address} - ${wallet.name}`;
    }
    else {
        document.querySelector("#wallet-status").innerHTML = `WALLET NOT CONNECTED`;
    }
}
