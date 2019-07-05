// ここにJavaScriptコードを書く
const tarea = document.getElementById('tarea');
const input1 = document.getElementById('input1');
const input2 = document.getElementById('input2');
const btn = document.getElementById('btn');
const result = document.getElementById('result');

btn.addEventListener('click',()=>{
    let findtxt = input1.value;
    let repttxt = input2.value;
    let tagtxt = tarea.value;

    findtxt = new RegExp(findtxt,'g');
    tagtxt = tagtxt.replace(findtxt,repttxt);

    result.innerText = tagtxt;
});