// Node functions
import Utils from "../Utils.js"
import {ctx} from "../graph.js"
export default class Node {
    constructor(name = "", wallet = 0, x = 0, y = 0) {
        this.name = name;
        if (Number(wallet) == NaN) {
            this.wallet = 0;
        }
        else {
            this.wallet = Utils.round_value(Number(wallet));
        }
        this.x = x;
        this.y = y;
        
        this.draw_node = function(x = this.x, y = this.y) {
            var xText;
            var yText;
            this.x = x;
            this.y = y;
            ctx.drawImage(imageNode, x - NODE_R, y - NODE_R, NODE_R * 2, NODE_R * 2);
            // Node name
            ctx.fillStyle = "#FFFFFF";
            xText = this.x - 10 * this.getName().length / 4;
            yText = this.y;
            ctx.fillText(this.getName(), xText, yText + 25);
            // Node wallet
            ctx.fillStyle = "#000000";
            var wallet = this.getWallet().toString() + unit;
            xText = this.x - 10 * wallet.length / 4;
            ctx.fillText(wallet, xText, yText + 12);
        }
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    setWallet(wallet) {
        this.wallet = wallet;
    }
    getWallet() {
        return this.wallet;
    }
}