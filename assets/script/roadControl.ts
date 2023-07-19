
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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start () {

    }

    update (dt) {
        let nodes=this.node.children;
        for(let node of nodes){
            node.x-=dt*this.speed;
            if(node.x<(-1)*node.width){
                node.x+=node.width*2;
                if(this.splitAtlas==null){
                    continue;
                }
                console.debug(this.splitAtlas);
                let maximum=this.splitAtlas.getSpriteFrames().length-1;
                let minimum=0;
                //随机加载房屋背景资源
                let randNumber=Math.floor(Math.random() * (maximum-minimum+1))+minimum;
                let nodeSplit=node.getChildByName("houses").getComponent(cc.Sprite);
                nodeSplit.spriteFrame=this.splitAtlas.getSpriteFrame("houses_"+randNumber);
            }
        }
        
    }
}
