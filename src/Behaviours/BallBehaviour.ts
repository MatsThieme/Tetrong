import { Assets, AudioSource, Behaviour, ComponentType, GameObject, GameTime, Rigidbody, Scene, Vector2 } from 'SE';
import { Score } from './Tetris/SaveScore';
import { TetrominoSpawnBehaviour } from './TetrominoSpawnBehaviour';

export class BallBehaviour extends Behaviour {
    rigidbody!: Rigidbody;
    speed: number = 8.5;

    start() {
        this.rigidbody = this.gameObject.getComponent(ComponentType.Rigidbody)!;
        const [bounce, hit] = this.gameObject.getComponents(ComponentType.AudioSource)!;

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

            Score.highScore = Score.lastScore = bh.tetris.score;
        }

        this.rigidbody.angularVelocity *= 1 - (0.06 / ((1000 / 60) / GameTime.deltaTime));
    }

    onCollisionEnter(collision: CollisionEvent) {
        if (collision.otherCollider.gameObject.name.includes('Tetromino')) {
            const go = new GameObject('destroy audiosource');
            go.transform.position = new Vector2(collision.contacts[0].vertex.x, collision.contacts[0].vertex.y);
            go.addComponent(AudioSource, source => {
                source.asset = Assets.get('ball_hit.mp3');
                source.play();
            });
        } else {
            const go = new GameObject('bounce audiosource');
            go.transform.position = new Vector2(collision.contacts[0].vertex.x, collision.contacts[0].vertex.y);
            go.addComponent(AudioSource, source => {
                source.asset = Assets.get('ball_bounce.mp3');
                source.play();
            });
        }
    }
}