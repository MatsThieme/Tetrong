import { AlignH, AlignV, UIMenu, UIText } from 'SE';

export function ScoreDisplayPrefab(menu: UIMenu) {
    menu.active = true;
    menu.pauseScene = false;

    menu.addUIElement('Score', UIText, text => {
        text.alignH = AlignH.Center;
        text.alignV = AlignV.Top;

        text.position.x = 50;

        text.text = 'Score: 0';


        text.font = 'Red-Normal';
    });
}