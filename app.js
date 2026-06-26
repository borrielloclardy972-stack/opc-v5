
const data=[
{t:"抖音引流课程",tag:"引流"},
{t:"销售SOP",tag:"销售"},
{t:"交付流程",tag:"交付"}
];

function enter(){
 document.querySelector('.login').classList.add('hidden');
 document.getElementById('app').classList.remove('hidden');
 render(data);
 go('home');
}

function go(id){
 document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
 document.getElementById(id).classList.add('active');
}

function toggle(id){
 const el=document.getElementById(id);
 el.style.display = el.style.display==='block'?'none':'block';
}

function filter(tag){
 go('content');
 render(data.filter(i=>i.tag.includes(tag)));
}

function render(list){
 document.getElementById('list').innerHTML=list.map(i=>`<div>${i.t}</div>`).join('');
}
