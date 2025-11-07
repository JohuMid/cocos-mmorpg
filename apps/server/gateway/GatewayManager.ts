import { RpcFunc } from "../common";
import { Singleton } from "../common/common/base"
import { WebSocketServer, WebSocket } from "ws";

export class GatewayManager extends Singleton {
    static get Instance() {
        return super.GetInstance<GatewayManager>();
    }
    init() {
        console.log("GatewayManager init");
        const wss = new WebSocketServer({ port: 4000 });
        wss.on("connection", (ws) => {
            ws.onerror = (err) => {
                console.log("ws error:", err);
            }
            ws.on("message", (buffer: Buffer) => {
                this.handleMessage(ws, buffer);
            });
        });
    }
    handleMessage(ws: WebSocket, buffer: Buffer) {
        console.log("收到消息:", buffer.toString());

        const { name, data } = JSON.parse(buffer.toString());

        if (name === RpcFunc.enterGame) {
            //  TODO 验证token

        } else {
            // TODO 跟game服务通信
        }

        ws.send(buffer.toString());
    }
}