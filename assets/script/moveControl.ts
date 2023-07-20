
import { VirtualInput } from './VirtualInput';
const {ccclass, property} = cc._decorator;


@ccclass
export default class NewClass extends cc.Component {
/**
     * 手指部分
     */
    @property(cc.Sprite)
    thumbnail = null;

    /**
     * 摇杆的背景
     */
    @property(cc.Sprite)
    joyStickBg = null;

    /**
     * 摇杆的半径
     */
    @property(cc.Float)
    radius = 130;

    /**
     * 摇杆初始化的位置
     */
    initJoyStickBgPosition = cc.v2();

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.initJoyStickBgPosition = this.joyStickBg.node.getPosition();
    }

    onDestroy() {
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
    }

    onTouchStart(eventTouch) {
        console.debug("开始触摸");
        let touch = eventTouch.touch;
        let touchPos = this.node.convertToNodeSpaceAR(touch.getLocation());
        this.joyStickBg.node.setPosition(touchPos);
    }

    /**
     * 触摸移动
     * @param touchEvent 
     */
    onTouchMove(touchEvent) {
        
        // 获取摇杆在 UI 的位置
        let touch = touchEvent.touch;
        let x = touch.getLocationX();
        let y = touch.getLocationY();

        let worldPosition = new cc.Vec2(x, y);
        let localPosition = cc.v2();

        // 转化摇杆的位置到背景图的本地坐标
        this.joyStickBg.node.parent.convertToNodeSpaceAR(worldPosition, localPosition);
        let thumbnailPosition = cc.v2();
        let len = localPosition.mag();
        localPosition.normalizeSelf();
        console.debug("len="+len);
        cc.Vec2.scaleAndAdd(thumbnailPosition, cc.v2(), localPosition, cc.misc.clampf(len, 0, this.radius));

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
    onTouchEnd(touchEvent) {
        console.debug("触摸结束");
        this.thumbnail.node.setPosition(cc.v2());
        VirtualInput.horizontal = 0;
        VirtualInput.vertical = 0;

        // 摇杆的位置回归到初始化位置
        this.joyStickBg.node.setPosition(this.initJoyStickBgPosition);
    }
}