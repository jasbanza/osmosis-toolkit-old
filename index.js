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
(() => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // initialize
    yield getKeplr();
    // connect Keplr wallet extension
    yield ((_a = window.keplr) === null || _a === void 0 ? void 0 : _a.enable("osmosis-1"));
    // get user address from Keplr wallet extension
    yield ((_b = window.keplr) === null || _b === void 0 ? void 0 : _b.getKey("osmosis-1").then((user_key) => {
        console.log(user_key);
    }));
}))();
// get osmosis wallet address from keplr extension
// get osmosis balances
// display osmosis balances
//
