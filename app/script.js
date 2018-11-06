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
// let getPath = null;

// ipc.on('ready-to-write-clicks', (event, args) => {
//     console.log('ipcRenderer');
//     getPath = args;
//     console.log(event);
//     console.log(args);
// });

// function getFunction(message) {
//     console.log('ipcRenderer');
// getPath = message;
// }

console.log('this script was injected');

window.onclick = e => {
  // TODO: посылать сообщение только если прога находится во втором состоянии
  if (e.eventPhase === 3) {
    let tmp = getPathTo(e.target);
    const params = `left`;
    tmp = `${tmp} ${params}`;
    ipc.send('new-mouse-click-event', tmp);
  }
};
window.ondblclick = e => {
  let tmp = getPathTo(e.target);
  const params = `left double`;
  tmp = `${tmp} ${params}`;
  ipc.send('new-mouse-doubleclick-event', tmp);
};
window.onresize = e => {
  console.log(e.detail);
};
window.onscroll = e => {
  console.log(e.detail);
};
// window.onclick = (e) => {
//     if (e.target === document.body) {
//        console.log(e.target, document.body);
//     }
// };
window.onkeydown = function(e) {
  ipc.send('keydown', e.key);
};
