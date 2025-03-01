// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script, console} from "forge-std/Script.sol";
import {HotPotato} from "../src/HotPotato.sol";

contract Deploy is Script {
    function run() public {
        vm.startBroadcast();

        HotPotato hotPotato = new HotPotato();

        console.logString("HotPotato deployed at:");
        console.logAddress(address(hotPotato));

        vm.stopBroadcast();
    }
}
