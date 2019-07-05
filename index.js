// ここにJavaScriptコードを書く

const tarea = document.getElementById('tarea');

const btn = document.getElementById('btn');
const result = document.getElementById('result');

btn.addEventListener('click',()=>{

    let tagtxt = tarea.value;

    let re = new RegExp("(。)",'g');
    tagtxt = tagtxt.replace(re,'$1だが男だ。');

    result.innerText = tagtxt;
});