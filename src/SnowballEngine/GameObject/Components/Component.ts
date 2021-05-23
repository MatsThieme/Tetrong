import { ComponentType } from 'GameObject/ComponentType';
import { Destroyable } from 'GameObject/Destroy';
import { GameObject } from 'GameObject/GameObject';
import { Debug } from 'SnowballEngine/Debug';
import { EventHandler } from 'Utility/Events/EventHandler';
import { EventTarget } from 'Utility/Events/EventTarget';
import { ComponentEventTypes } from 'Utility/Events/EventTypes';
import { Camera } from './Camera';

/** @category Component */
export abstract class Component<EventTypes extends ComponentEventTypes> extends EventTarget<EventTypes> implements Destroyable {
    private static _nextCID = 0;
    public static readonly components: Component<ComponentEventTypes>[] = [];

    /**
     * 
     * A reference to the owning GameObject.
     * 
     */
    public readonly gameObject: GameObject;
    public readonly type: ComponentType;
    public readonly componentID: number;

    public readonly __destroyed__: boolean;

    private _active: boolean;

    public constructor(gameObject: GameObject, type: ComponentType = ComponentType.Component) {
        super();

        this.gameObject = gameObject;
        this.type = type;
        this.componentID = Component._nextCID++;

        this.__destroyed__ = false;

        this._active = true;

        Component.components.push(this);

        if (this.awake) this.addListener('awake', new EventHandler(this.awake, this));
        if (this.start) this.addListener('start', new EventHandler(this.start, this));
        if (this.onPreRender) this.addListener('prerender', new EventHandler(this.onPreRender, this));
        if (this.onPostRender) this.addListener('postrender', new EventHandler(this.onPostRender, this));
        if (this.onEnable) this.addListener('enable', new EventHandler(this.onEnable, this));
        if (this.onDisable) this.addListener('disable', new EventHandler(this.onDisable, this));
        if (this.earlyUpdate) this.addListener('earlyupdate', new EventHandler(this.earlyUpdate, this));
        if (this.update) this.addListener('update', new EventHandler(this.update, this));
        if (this.lateUpdate) this.addListener('lateupdate', new EventHandler(this.lateUpdate, this));
        if (this.onDestroy) this.addListener('destroy', new EventHandler(this.onDestroy, this));
    }

    /**
     * 
     * Enable or disable the functionality of this component.
     *
     */
    public get active(): boolean {
        return this._active;
    }
    public set active(val: boolean) {
        if (this._active === val) return;

        if (this.type === ComponentType.Transform) {
            Debug.warn('A Component of type Transform may can not be inactive');
            return;
        }

        this._active = val;

        if (val) this.dispatchEvent('enable');
        else this.dispatchEvent('disable');
    }

    /**
     * 
     * Remove this from this.gameObject and delete all references.
     * 
     */
    public destroy(): void {
        this.dispatchEvent('destroy');

        if (!this.__destroyed__) {
            (<Mutable<Component<ComponentEventTypes>>>this).__destroyed__ = true;
            this.gameObject.removeComponent(this);
        }

        Component.components.splice(Component.components.findIndex(c => c.componentID === this.componentID), 1);
    }

    public static async earlyupdate(): Promise<void> {
        for (const component of Component.components) {
            if (component.gameObject.active && component.active && component.type !== ComponentType.Behaviour) await component.dispatchEvent('earlyupdate');
        }
    }

    public static async update(): Promise<void> {
        for (const component of Component.components) {
            if (component.gameObject.active && component.active && component.type !== ComponentType.Behaviour) await component.dispatchEvent('update');
        }
    }

    public static async lateupdate(): Promise<void> {
        for (const component of Component.components) {
            if (component.gameObject.active && component.active && component.type !== ComponentType.Behaviour) await component.dispatchEvent('lateupdate');
        }
    }


    /**
     *
     * Called after the behavior has been added to the GameObject.
     *
     */
    protected awake?(): Promise<void> | void;

    /**
     * 
     * Called on scene start, if scene is running it's called by the constructor.
     * 
     */
    protected start?(): Promise<void> | void;

    /**
     *
     * Called after component.active is set to false.
     *
     */
    protected onEnable?(): void;
    /**
     *
     * Called after component.active is set to true.
     *
     */
    protected onDisable?(): void;

    /**
     *
     * Called before camera renders.
     *
     */
    protected onPreRender?(renderingCamera: Camera): void | Promise<void>;

    /**
    *
    * Called after camera rendered.
    *
    */
    protected onPostRender?(renderingCamera: Camera): void | Promise<void>;

    /**
    *
    * Called before any GameObject is updated.
    *
    */
    protected earlyUpdate?(): void | Promise<void>;

    /**
    *
    * Called once every frame.
    *
    */
    protected update?(...args: unknown[]): void | Promise<void>;

    /**
    *
    * Called after all GameObjects are updated.
    *
    */
    protected lateUpdate?(): void | Promise<void>;

    /**
     * 
     * Called before this is destroyed.
     * 
     */
    protected onDestroy?(): void;
}

export interface Component<EventTypes extends ComponentEventTypes> extends Destroyable { }