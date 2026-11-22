// Keyboard state, polled by the frame loop.
const down = new Set();
const pressed = new Set();

addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) e.preventDefault();
  if (!down.has(e.code)) pressed.add(e.code);
  down.add(e.code);
});
addEventListener('keyup', (e) => down.delete(e.code));

export const keys = {
  held: (code) => down.has(code),
  tapped: (code) => pressed.has(code),
  axis() {
    const x = (this.held('KeyD') || this.held('ArrowRight') ? 1 : 0)
            - (this.held('KeyA') || this.held('ArrowLeft') ? 1 : 0);
    const y = (this.held('KeyS') || this.held('ArrowDown') ? 1 : 0)
            - (this.held('KeyW') || this.held('ArrowUp') ? 1 : 0);
    return { x, y };
  },
  endFrame() { pressed.clear(); },
};
