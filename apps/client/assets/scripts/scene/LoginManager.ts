import { _decorator, Component, EditBox, Node } from 'cc';
import Crypto from 'jsencrypt';
import { PublicKey, RpcFunc } from '../common';
import NetworkManager from '../global/NetworkManager';
const { ccclass, property } = _decorator;

const Crypt = new Crypto();

Crypt.setKey(PublicKey)

@ccclass('NewComponent')
export class NewComponent extends Component {
    account:EditBox;
    password:EditBox;
    onLoad(): void {
        this.account = this.node.getChildByName("Account").getComponent(EditBox);
        this.password = this.node.getChildByName("Password").getComponent(EditBox);
    }

    async register() {
        const account = Crypt.encrypt(this.account.string);
        const password = Crypt.encrypt(this.password.string);
        
        console.log(account);
        console.log(password);

        const res = await fetch("http://localhost:3000/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account,
                password,
            }),
        }).then((res) => res.json());
        console.log('res',res);
        
    }

    async login() {
        const account = Crypt.encrypt(this.account.string);
        const password = Crypt.encrypt(this.password.string);

        console.log(account);
        console.log(password);

        const res = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                account,
                password,
            }),
        }).then((res) => res.json());
        console.log('res', res);

        this.connect(res.token)

    }

    async connect(token:string){
        await NetworkManager.Instance.connect();
        const res = await NetworkManager.Instance.call(RpcFunc.enterGame,{token});
        console.log('connect',res);
    }

    update(deltaTime: number) {
        
    }
}


