import { Assets, Color, GameObject, RectangleCollider, Rigidbody, Texture } from 'SE';

export function PlatformPrefab(gameObject: GameObject): void {
    gameObject.addComponent(Texture, texture => {
        texture.asset = Assets.get('platform');
        texture.tint = Color.yellow;
    });

    gameObject.addComponent(RectangleCollider, c => {
        c.mass = Infinity;
    });
    gameObject.addComponent(Rigidbody, rb => {
        rb.ignoreGravity = true;
    });

    gameObject.transform.scale.x = 0.3;
    gameObject.transform.scale.y = 2;
}