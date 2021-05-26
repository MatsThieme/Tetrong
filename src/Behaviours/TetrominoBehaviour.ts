import { Behaviour, ComponentType, Destroy, Rigidbody, Vector2 } from 'SE';
import { Tetris } from './Tetris/Tetris';

export class TetrominoBehaviour extends Behaviour {
    rigidbody!: Rigidbody;
    xpos!: number;
    isDestroyed = false;
    tetrominoHeight = 0.7;
    startY = -4.5;

    id!: number; // assigned by Tetris
    tetris!: Tetris; // assigned by Tetris

    start() {
        this.rigidbody = this.gameObject.getComponent(ComponentType.Rigidbody)!;

        if (!this.rigidbody) throw new Error('rigidbody not found');

        this.xpos = this.gameObject.transform.position.x;
    }

    update() {
        this.gameObject.transform.position.x = this.xpos;
    }

    onCollisionEnter(collision: CollisionEvent) {
        if (collision.otherCollider.gameObject.name === 'Ball') {
            if (!this.isDestroyed) {
                Destroy(this.gameObject);
                this.isDestroyed = true;
                this.tetris.removeTetromino(this.id);
            }
        } else {
            this.rigidbody.velocity = new Vector2();
            this.gameObject.transform.position.y = (this.startY + Math.round((this.rigidbody.body.bounds.min.y - this.startY) / this.tetrominoHeight * 10) * this.tetrominoHeight / 10 + (this.rigidbody.body.position.y - this.rigidbody.body.bounds.min.y));
        }
    }
}