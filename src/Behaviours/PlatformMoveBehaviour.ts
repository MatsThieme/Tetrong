import { Behaviour, clamp, ComponentType, GameObject, GameTime, Input, Rigidbody, Vector2 } from 'SE';

export class PlatformMoveBehaviour extends Behaviour {
    platform1!: GameObject;
    platform2!: GameObject;
    rigidBody1!: Rigidbody;
    rigidBody2!: Rigidbody;

    maxY: number = 0;
    minY: number = 0;

    start() {
        this.platform1 = GameObject.find('Platform 1')!;
        this.platform2 = GameObject.find('Platform 2')!;

        if (!this.platform1) throw new Error('platform1 not found');
        if (!this.platform2) throw new Error('platform2 not found');

        this.rigidBody1 = this.platform1.getComponent(ComponentType.Rigidbody)!;
        this.rigidBody2 = this.platform2.getComponent(ComponentType.Rigidbody)!;

        if (!this.rigidBody1) throw new Error('rigidBody1 not found');
        if (!this.rigidBody2) throw new Error('rigidBody2 not found');


        this.platform1.transform.position.x = -6.5;
        this.platform2.transform.position.x = 6.5;


        this.maxY = 4.5 - this.platform1.transform.scale.y / 2;
        this.minY = -this.maxY;
    }

    update() {
        const pointer = Input.getAxis('PointerPosition');

        if (pointer.values.length) {
            const wantedy1 = clamp(this.minY, this.maxY, this.scene.cameraManager.cameras[0].cameraToWorldPoint(pointer.v2).y);
            const currenty1 = this.platform1.transform.position.y;

            this.rigidBody1.velocity = new Vector2(0, (wantedy1 - currenty1) * GameTime.deltaTime / 40);

            const wantedy2 = clamp(this.minY, this.maxY, this.scene.cameraManager.cameras[0].cameraToWorldPoint(pointer.v2).y);
            const currenty2 = this.platform2.transform.position.y;

            this.rigidBody2.velocity = new Vector2(0, (wantedy2 - currenty2) * GameTime.deltaTime / 40);
        }

        this.platform1.transform.position.x = -6.5;
        this.platform2.transform.position.x = 6.5;
    }
}