// Learn TypeScript:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/2.4/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';


    @property
    speed:number=100;

    @property(cc.SpriteAtlas)
    splitAtlas:cc.SpriteAtlas=null

    currentCat:number=0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.schedule(()=>{
            if(this.splitAtlas==null){
                return;
            }
            this.currentCat++;
            if(this.currentCat>this.splitAtlas.getSpriteFrames().length-1){
                this.currentCat=1;
            }
            let nodeSplit=this.node.getChildByName("runcat").getComponent(cc.Sprite);
            nodeSplit.spriteFrame=this.splitAtlas.getSpriteFrame(""+this.currentCat);
        },0.2)
    }

    update (dt) {
        
    }
}
