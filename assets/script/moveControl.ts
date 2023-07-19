
const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';


    /**
     * 手指部分
     */
    @property(cc.Sprite)
    thumbnail: cc.Sprite | null = null;

    /**
     * 摇杆的背景
     */
    @property(cc.Sprite)
    joyStickBg: cc.Sprite | null = null;

    @property
    banJin:number=100;

        /**
     * 摇杆初始化的位置
     */
    initJoyStickBgPosition: cc.Vec2 = cc.v2()

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.initJoyStickBgPosition = this.getWorldPos(this.joyStickBg.node);
    }

    // update (dt) {}


    getWorldPos(node:cc.Node):cc.Vec2{
        return this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    setWorldPos(nodeL:cc.Node, pos:cc.Vec2){
        this.node.setPosition(this.node.parent.convertToNodeSpaceAR(pos));
    }

    onTouchStart(eventTouch: cc.Event.EventTouch) {
        let x = eventTouch.touch.getLocationX();
        let y = eventTouch.touch.getLocationY();
        this.setWorldPos(this.node,new cc.Vec2(x,y));
    }

    /**
     * 触摸移动
     * @param touchEvent 
     */
    onTouchMove(touchEvent: cc.Event.EventTouch) {
        // 获取摇杆在 UI 的位置
        let x = touchEvent.touch.getLocationX();
        let y = touchEvent.touch.getLocationY();

        let worldPosition = new cc.Vec2(x, y);
        let localPosition = cc.v2();

        // 转化摇杆的位置到背景图的本地坐标
        this.joyStickBg.node.inverseTransformPoint(localPosition, worldPosition);
        let thumbnailPosition = cc.v2();
        let len = localPosition.length();
        localPosition.normalize();
        cc.Vec2.scaleAndAdd(thumbnailPosition, cc.v2(), localPosition, Math.clamp(len, 0, this.radius));

        this.thumbnail.node.setPosition(thumbnailPosition);

        // 将计算的结果赋予给 Input
        VirtualInput.horizontal = this.thumbnail.node.position.x / this.radius;
        VirtualInput.vertical = this.thumbnail.node.position.y / this.radius;
        //console.log(VirtualInput.horizontal, VirtualInput.vertical);
    }

    /**
     * 触摸结束
     * @param touchEvent 
     */
    onTouchEnd(touchEvent: cc.Event.EventTouch) {
        this.thumbnail.node.setPosition(cc.v2());
        VirtualInput.horizontal = 0;
        VirtualInput.vertical = 0;

        // 摇杆的位置回归到初始化位置
        this.joyStickBg.node.worldPosition = this.initJoyStickBgPosition;
    }
}
