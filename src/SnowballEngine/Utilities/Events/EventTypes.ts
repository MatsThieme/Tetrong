import { Camera } from 'GameObject/Components/Camera';
import { Component } from 'GameObject/Components/Component';
import { Transform } from 'GameObject/Components/Transform/Transform';
import { GameObject } from 'GameObject/GameObject';
import { Engine, IEventCollision } from 'matter-js';

export type ComponentEventTypes = {
    awake: [],
    start: [],
    enable: [],
    disable: [],
    destroy: [],
    prerender: [camera: Camera],
    postrender: [camera: Camera],
    earlyupdate: [],
    update: unknown[],
    lateupdate: []
};

export type RenderableEventTypes = {} & ComponentEventTypes;

export type BehaviourEventTypes = {
    collisionenter: [collision: IEventCollision<Engine>],
    collisionactive: [collision: IEventCollision<Engine>],
    collisionexit: [collision: IEventCollision<Engine>],
    triggerenter: [collision: IEventCollision<Engine>],
    triggeractive: [collision: IEventCollision<Engine>],
    triggerexit: [collision: IEventCollision<Engine>]
} & ComponentEventTypes;

export type AnimatedSpriteEventTypes = {} & RenderableEventTypes;
export type AudioListenerEventTypes = {} & ComponentEventTypes;
export type AudioSourceEventTypes = {} & ComponentEventTypes;
export type CameraEventTypes = {} & ComponentEventTypes;
export type ColliderEventTypes = {} & ComponentEventTypes;
export type ParallaxBackgroundEventTypes = {} & RenderableEventTypes;
export type ParticleSystemEventTypes = {} & RenderableEventTypes;
export type RigidbodyEventTypes = {} & ComponentEventTypes;
export type TextEventTypes = {} & ComponentEventTypes;
export type TextureEventTypes = {} & RenderableEventTypes;
export type TileMapEventTypes = {} & RenderableEventTypes;
export type TransformEventTypes = {
    /** Triggered when position, rotation or scale were modified by the engine */
    modifiedinternal: [transform: Transform, positionDifference?: Readonly<IVector2>, rotationDifference?: Readonly<IAngle>, scaleDifference?: Readonly<IVector2>],
    /** Triggered when position, rotation or scale of the parent transform were modified by the engine */
    parentmodifiedinternal: [transform: Transform, positionDifference?: Readonly<IVector2>, rotationDifference?: Readonly<IAngle>, scaleDifference?: Readonly<IVector2>],
    /** Triggered when position, rotation or scale were modified, excluding changes made by the engine */
    modified: [transform: Transform, positionDifference?: Readonly<IVector2>, rotationDifference?: Readonly<IAngle>, scaleDifference?: Readonly<IVector2>],
    /** Triggered when position, rotation or scale of the parent transform were modified, excluding changes made by the engine */
    parentmodified: [transform: Transform, positionDifference?: Readonly<IVector2>, rotationDifference?: Readonly<IAngle>, scaleDifference?: Readonly<IVector2>],
    /** Triggered when position, rotation or scale were modified */
    change: [transform: Transform, positionDifference?: Readonly<IVector2>, rotationDifference?: Readonly<IAngle>, scaleDifference?: Readonly<IVector2>],
    /** Triggered when position, rotation or scale of the parent transform were modified */
    parentchange: [transform: Transform, positionDifference?: Readonly<IVector2>, rotationDifference?: Readonly<IAngle>, scaleDifference?: Readonly<IVector2>]
} & ComponentEventTypes;
export type VideoEventTypes = { end: [] } & RenderableEventTypes;



export type GameObjectEventTypes = {
    componentadd: [component: Component<ComponentEventTypes>],
    componentremove: [component: Component<ComponentEventTypes>],
    childadd: [child: GameObject],
    childremove: [child: GameObject],
    parentchanged: [newParent: GameObject | undefined]
};

