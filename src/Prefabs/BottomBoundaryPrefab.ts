import { GameObject, RectangleCollider } from 'SE';

export function BottomBoundaryPrefab(gameObject: GameObject): void {
    gameObject.addComponent(RectangleCollider);

    gameObject.transform.scale.x = 16;
    gameObject.transform.position.y = -5;
}