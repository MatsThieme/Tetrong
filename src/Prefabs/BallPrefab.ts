import { BallBehaviour } from 'Behaviours/BallBehaviour';
import { Assets, CircleCollider, GameObject, Rigidbody, Texture, Vector2 } from 'SE';

export function BallPrefab(gameObject: GameObject): void {
    gameObject.addComponent(Rigidbody, rb => {
        rb.restitution = 1;
        rb.friction = 0.2;
        rb.ignoreGravity = true;
        rb.collisionFilterMask = 0b11;
    });

    gameObject.addComponent(CircleCollider);
    gameObject.addComponent(BallBehaviour);
    gameObject.addComponent(Texture, texture => {
        texture.asset = Assets.get('ball');
    });

    gameObject.transform.scale = new Vector2(0.9, 0.9);
}