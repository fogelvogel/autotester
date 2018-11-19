const ipc = require('electron').ipcRenderer;

function getPathTo(element) {
  if (element.tagName === 'HTML') {
    return '/HTML[1]';
  }

  if (element === document.body) {
    return '/HTML[1]/BODY[1]';
  }

  let ix = 0;
  const siblings = element.parentNode.childNodes;

  for (let i = 0; i < siblings.length; i += 1) {
    const sibling = siblings[i];
    if (sibling === element) {
      const path = `${getPathTo(element.parentNode)}/${element.tagName}[${ix +
        1}]`;
      return path;
    }

    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix += 1;
    }
  }
}
console.log('this script was injected');

window.onclick = e => {
  const tmp = getPathTo(e.target);
  const testingParams = [
    e.target.innerText,
    `${e.target.clientHeight} ${e.target.clientWidth}`,
    e.target.className
  ];
  ipc.send(
    'new-mouse-click-event',
    Object.assign(
      {},
      {
        actionName: 'click',
        attributes: ['left'],
        paths: [tmp],
        testParams: testingParams
      }
    )
  );
};
window.ondblclick = e => {
  const tmp = getPathTo(e.target);
  const testingParams = [
    e.target.innerText,
    `${e.target.clientHeight} ${e.target.clientWidth}`,
    e.target.className
  ];
  ipc.send(
    'new-mouse-doubleclick-event',
    Object.assign(
      {},
      {
        actionName: 'click',
        attributes: ['left', 'double'],
        paths: [tmp],
        testParams: testingParams
      }
    )
  );
};
window.onresize = () => {
  ipc.send(
    'new-resize',
    Object.assign(
      {},
      {
        actionName: 'resize',
        attributes: [`${window.outerHeight} ${window.outerWidth}`],
        paths: []
      }
    )
  );
};
window.onscroll = e => {
  const scrollDown = window.scrollY;
  ipc.send(
    'new-scroll',
    Object.assign(
      {},
      {
        actionName: 'scroll',
        attributes: [scrollDown, e.target.className],
        paths: []
      }
    )
  );
};
window.onkeydown = e => {
  let tmp = getPathTo(e.target);
  const params = e.key;
  tmp = `${tmp} ${params}`;

  ipc.send('keydown', tmp);
};
window.onkeyup = e => {
  let tmp = getPathTo(e.target);
  const params = e.key;
  tmp = `${tmp} ${params}`;

  ipc.send('keyup', tmp);
};
