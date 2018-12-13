const ipc = require('electron').ipcRenderer;
// const fs = require('fs');
// const path = require('path');

let confObject = null;

ipc.on('config object', (event, args) => {
  console.log(args);
  confObject = args;
});

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

function assembleMessage(tmp, e, arg1 = null, arg2 = null) {
  const testingParams = [
    e.target.innerText,
    `${e.target.offsetHeight} ${e.target.offsetWidth}`,
    e.target.className,
    arg1,
    arg2
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
}

window.onclick = e => {
  const path = e.target.href;
  if (path !== undefined) {
    console.log(path);
    e.stopPropagation();
    e.preventDefault();
    ipc.send('path to go', path);
  }
  const tmp = getPathTo(e.target);
  switch (e.target.tagName) {
    case confObject.INPUT.name: {
      for (let i = 0; i < confObject.INPUT.type.length; i += 1) {
        if (e.target.type === confObject.INPUT.type[i]) {
          console.log('this is checkbox', e.target.type);
        }
      }

      break;
    }
    default:
      break;
  }
  assembleMessage(tmp, e);
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
