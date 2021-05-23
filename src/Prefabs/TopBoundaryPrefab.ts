import { GameObject, RectangleCollider } from 'SE';

export function TopBoundaryPrefab(gameObject: GameObject): void {
    gameObject.addComponent(RectangleCollider, c => {
        c.collisionFilterCategory = 0b10;
    });

    gameObject.transform.scale.x = 16;
    gameObject.transform.position.y = 5;
}