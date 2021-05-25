import { Engine, IEventCollision } from 'matter-js';
import { AudioSource, Behaviour, ComponentType, GameObject, GameTime, Rigidbody, Scene, Vector2 } from 'SE';
import { Score } from './Tetris/SaveScore';
import { TetrominoSpawnBehaviour } from './TetrominoSpawnBehaviour';

export class BallBehaviour extends Behaviour {
    rigidbody!: Rigidbody;
    speed: number = 7;
    audioSource1!: AudioSource;
    audioSource2!: AudioSource;

    start() {
        this.rigidbody = this.gameObject.getComponent(ComponentType.Rigidbody)!;
        const [bounce, hit] = this.gameObject.getComponents(ComponentType.AudioSource)!;

        this.audioSource1 = bounce;
        this.audioSource2 = hit;

        if (!this.rigidbody) throw new Error('ball rigidbody not found');
        if (!this.audioSource1) throw new Error('ball audioSource1 not found');
        if (!this.audioSource2) throw new Error('ball audioSource2 not found');
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

            Score.highScore = Score.lastScore = bh.tetris.score;
        }

        this.rigidbody.angularVelocity *= 0.985;
    }

    onCollisionEnter(matterCollisionEvent: IEventCollision<Engine>) {
        const otherBody = (<any>matterCollisionEvent.pairs[0].bodyA).gameObject.name === this.gameObject.name ? matterCollisionEvent.pairs[0].bodyB : matterCollisionEvent.pairs[0].bodyA;

        if ((<any>otherBody).gameObject.name.includes('Tetromino')) {
            this.audioSource2.stop();
            this.audioSource2.play();
        } else {
            this.audioSource1.stop();
            this.audioSource1.play();
        }
    }
}