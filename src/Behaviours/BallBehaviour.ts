import { Behaviour, ComponentType, GameObject, GameTime, Rigidbody, Scene, Vector2 } from 'SE';
import { SaveScore } from './Tetris/SaveScore';
import { TetrominoSpawnBehaviour } from './TetrominoSpawnBehaviour';

export class BallBehaviour extends Behaviour {
    rigidbody!: Rigidbody;
    speed: number = 8;

    start() {
        this.rigidbody = this.gameObject.getComponent(ComponentType.Rigidbody)!;

        if (!this.rigidbody) throw new Error('ball rigidbody not found');
    }

    update() {
        if (this.rigidbody.velocity.equal(new Vector2())) this.rigidbody.velocity = new Vector2(1, 0);

        const speed = this.speed * GameTime.deltaTimeSeconds;

        const xthreshold = speed / 2;
        const ythreshold = speed / 10;

        if (Math.abs(this.rigidbody.velocity.x) < xthreshold) this.rigidbody.velocity = new Vector2(Math.sign(this.rigidbody.velocity.x) * xthreshold || xthreshold, this.rigidbody.velocity.y);
        if (Math.abs(this.rigidbody.velocity.y) < ythreshold) this.rigidbody.velocity = new Vector2(this.rigidbody.velocity.x, Math.sign(this.rigidbody.velocity.y) * ythreshold || ythreshold);

        this.rigidbody.velocity = this.rigidbody.velocity.setLength(speed);

        if (this.gameObject.transform.position.x > 8 || this.gameObject.transform.position.x < -8) {
            Scene.sceneManager.load('Main Menu Scene');

            const camera = GameObject.find('Camera')!;
            const bh = camera.getComponent(TetrominoSpawnBehaviour)!;

            SaveScore.highScore = SaveScore.lastScore = bh.tetris.score;
        }
    }
}