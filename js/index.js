import { PreventDragClick } from './PreventDragClick.js';

const preventDragClick = new PreventDragClick(window);
const emoInfo = document.querySelector('.emoInfo');
let v = 0;

window.addEventListener('click', () => {
    if (preventDragClick.mouseMoved) return;

    if (v == 0) {
        setTimeout(() => {
            emoInfo.style.display = "block"
        }, 1500)
        v = 1;
    } else {
        emoInfo.style.display = "none";
        v = 0;
    }
})



