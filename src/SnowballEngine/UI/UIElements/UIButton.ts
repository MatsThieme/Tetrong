import { UIElementType } from 'UI/UIElementType';
import { UIMenu } from 'UI/UIMenu';
import { UIText } from './UIText';

/** @category UI */
export class UIButton extends UIText {
    public constructor(menu: UIMenu, name: string) {
        super(menu, name, UIElementType.Button);
    }

    public override update(): void {
        if (!this.active) return;

        super.update();

        if (this.click && this.onInput) {
            this.onInput(this);
        }
    }
}