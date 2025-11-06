import { _decorator, Component, EditBox, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NewComponent')
export class NewComponent extends Component {
    account:EditBox;
    password:EditBox;
    onLoad(): void {
        this.account = this.node.getChildByName("Account").getComponent(EditBox);
        this.password = this.node.getChildByName("Password").getComponent(EditBox);
    }

    register(): void {
        const account = this.account.string;
        const password = this.password.string;
        
        console.log(account);
        console.log(password);
        
    }

    update(deltaTime: number) {
        
    }
}


