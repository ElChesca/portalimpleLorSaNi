'use strict';
const $ = id => document.getElementById(id);
const key = 'lorsani-baboons-v1';
const earlierPhases = ['Arranque · hasta 30/11','Estabilización · diciembre','Adopción · plan trimestral'];
const defaultLaunchDate = '2026-12-01';
const stages = [
  {name:'Piloto',detail:'Pruebas con operadores, datos y circuitos reales antes de salir en vivo.'},
  {name:'Salida en vivo',detail:'Inicio previsto de la operación en Baboons, sujeto a la validación de los circuitos críticos.'},
  {name:'Soporte intensivo',detail:'Seguimiento diario, atención de incidentes y coordinación del soporte.'},
  {name:'Adopción y cierre',detail:'Completar la capacitación, revisar el uso autónomo y cerrar pendientes.'}
];
function defaultStageDates(launchDate) {
  return [
    {from:'2026-11-23',to:'2026-11-30'},
    {from:launchDate,to:launchDate},
    {from:'2026-12-01',to:'2026-12-31'},
    {from:'2027-01-01',to:'2027-02-28'},
  ];
}
const phases = stages.map(stage=>stage.name);
const phaseMigration = new Map(earlierPhases.map((name,index)=>[name,phases[[0,2,3][index]]]));
const modules = ['Logística','Preventa','POS de venta (sucursales)','Stock','Administración','Proveedores','Gestión de clientes','BOND · Recursos Humanos'];
const unassigned = 'Sin asignar';
['Piloto | Pilot','Salida en vivo | Go-live','Soporte intensivo | Hypercare'].forEach((name,index)=>phaseMigration.set(name,phases[index]));
const statuses = ['Pendiente','En curso','Bloqueado','Validado'];
const branches = ['Av. Italia','Av. Lafinur','La Punta','Ruta / todas las sucursales'];
const roles = ['Administración','Mostrador y caja','Preventista','Despacho','Repartidor','Supervisión'];
const training = ['Pendiente de acceso','Acceso probado','Capacitación realizada','Práctica validada','Uso autónomo'];
const videoStatus = ['Por preparar','En producción','Disponible'];
const logTypes = ['Avance operativo','Capacitación','Prueba técnica','Incidencia','Decisión'];
const seedTasks = [
  [0,'Datos iniciales y saldos','23','Administración / Baboons','Conciliar clientes, productos, unidades, listas, stock inicial y saldos de cuenta corriente.'],
  [0,'Accesos y puestos en las tres sucursales','24','Implementación / Baboons','Probar permisos, inicio de sesión y dispositivos de cada rol.'],
  [0,'Mostrador mayorista y minorista','26','Referentes de sucursal','Validar venta al peso, por pieza y por promoción, cobro, comprobante y cierre de caja en las tres sucursales.'],
  [0,'Preventa y pase a despacho','27','Preventa','Probar pedido con entrega al día siguiente y confirmar su disponibilidad para despacho.'],
  [0,'Hoja de ruta, entregas y cobranzas','28','Reparto / administración','Armar la hoja de ruta y confirmar que el repartidor ve los pedidos. Conciliar cobro del pedido y de deuda previa. Probar ambos juntos, entrega parcial y rendición.'],
  [0,'Ensayo y decisión de arranque','30','Gerencia / Implementación / Baboons','Validar punta a punta, correcciones, soporte, contingencia y visto bueno antes de la salida en vivo.'],
  [1,'Seguimiento de la primera semana','07','Implementación / referentes','Revisar incidentes, cajas y conciliación de pedidos, entregas y cobranzas.'],
  [1,'Cobertura de soporte','21','Gerencia / Baboons','Acordar responsables y canales de soporte durante la etapa de estabilización.'],
  [2,'Capacitación y adopción sostenida','28','Implementación / Baboons','Completar videos y prácticas, cerrar ajustes, medir uso autónomo y entregar informe final.'],
  [0,'Stock inicial por sucursal','25','Stock / sucursales','Conciliar existencias, unidades y presentaciones de productos prioritarios. Verificar lotes, fechas de vencimiento y rotación FIFO (primero en entrar, primero en salir).']
  ,[0,'Proveedores y recepción','26','Compras / stock','Verificar proveedores activos, formas de pago y cuentas corrientes. Probar la carga de facturas y una recepción que actualice existencias.']
  ,[0,'Clientes, condiciones y rutas','25','Administración / preventa','Validar clientes activos, listas de precios, condiciones comerciales, ruta asignada y cuentas corrientes.']
];
const seedModules = [4,4,2,1,0,4,4,4,4,3,5,6];
const seedVideos = [
  [0,'Preparar datos para operar'],[2,'Cargar un pedido para mañana'],[2,'Cobrar una deuda anterior'],
  [3,'Revisar la hoja de ruta'],[4,'Entregar y cobrar el pedido del día'],[4,'Cobrar una cuenta corriente en ruta'],
  [1,'Vender al peso y por pieza'],[1,'Registrar el cobro y cerrar caja']
];
const newMilestones = [
  {id:'milestone-go-live',phase:phases[1],module:modules[4],title:'Confirmar salida en vivo',owner:'Gerencia / Implementación / Baboons',notes:'Revisar las pruebas del piloto, registrar el visto bueno y confirmar el canal de soporte.',status:statuses[0],date:defaultLaunchDate,evidence:''},
  {id:'milestone-bond',phase:phases[2],module:modules[7],title:'Preparar e instalar BOND',owner:'Recursos Humanos / Implementación',notes:'Acordar alcance y fecha, configurar accesos por rol y probar el ingreso con un grupo piloto.',status:statuses[0],date:'2026-12-15',evidence:''}
];
const fresh = {
  launchDate:defaultLaunchDate,
  stageDates:defaultStageDates(defaultLaunchDate),
  tasks:seedTasks.map(([phase,title,day,owner,notes],index)=>({id:'t'+index, phase:phases[[0,2,3][phase]],module:modules[seedModules[index]],title, owner, notes,status:statuses[0],date:(phase===0?'2026-11-':phase===1?'2026-12-':'2027-02-')+day,evidence:''})).concat(newMilestones),
  people:[], logs:[],
  videos:seedVideos.map(([role,title],index)=>({id:'v'+index,title,role:roles[role],status:videoStatus[0],url:'',notes:''})),
};
const fields = {
  tasks:[['title','Tarea'],['module','Módulo',modules],['phase','Etapa',phases],['date','Fecha objetivo','date'],['owner','Responsable'],['status','Estado',statuses],['notes','Qué hay que comprobar','area'],['evidence','Resultado o evidencia','area',false]],
  people:[['name','Nombre y apellido'],['role','Rol','roles'],['branch','Sucursal o ruta',branches],['status','Estado',training],['notes','Observaciones','area',false]],
  videos:[['title','Título'],['role','Rol','roles'],['status','Estado',videoStatus],['url','Enlace al video','url',false],['notes','Descripción','area',false]],
  logs:[['date','Fecha','date'],['type','Tipo',logTypes],['title','Actividad'],['owner','Responsable'],['notes','Resultado / próximo paso','area']],
};
const labels = {tasks:'tarea',people:'operador',videos:'video',logs:'avance'};
const columns = {tasks:['Etapa / tarea','Fecha','Responsable','Estado',''],people:['Operador','Rol','Sucursal','Estado',''],logs:['Fecha','Actividad','Responsable','']};
const storageHint = $('notice').textContent;
let state = structuredClone(fresh);
let edit;
const previousTaskCopy = {
  t7: {title: 'Cobertura de Navidad y Año Nuevo', notes: 'Acordar responsables y canales de soporte durante las fiestas.'},
  t9: {notes: 'Conciliar existencias, unidades y presentaciones de productos prioritarios.'},
  t10: {notes: 'Verificar proveedores activos y probar una recepción que actualice existencias.'},
  t11: {notes: 'Validar clientes activos, listas de precios, condiciones comerciales y ruta asignada.'},
};
function migrate(data) {
  if (!Array.isArray(data?.tasks) || data.tasks.some(row=>!row || typeof row!=='object')) return data;
  const legacyOwners = new Map([
    ['Rodrigo / Baboons','Implementación / Baboons'],
    ['Lorena / Rodrigo / Federico','Gerencia / Implementación / Baboons'],
    ['Rodrigo / referentes','Implementación / referentes'],
    ['Lorena / Federico','Gerencia / Baboons'],
  ]);
  const tasks=data.tasks.map(row=>{
    const seed=fresh.tasks.find(t=>t.id===row.id);
    const previous=previousTaskCopy[row.id];
    const updatedCopy=Object.fromEntries(Object.entries(previous??{})
      .filter(([field,value])=>row[field]===value)
      .map(([field])=>[field,seed[field]]));
    return {...row,...updatedCopy,phase:phaseMigration.get(row.phase) ?? row.phase,module:row.module ?? seed?.module ?? unassigned,owner:legacyOwners.get(row.owner) ?? row.owner};
  });
  const missing=newMilestones.filter(task=>!tasks.some(row=>row.id===task.id));
  const launchDate=data.launchDate ?? defaultLaunchDate;
  return {...data,launchDate,stageDates:data.stageDates ?? defaultStageDates(launchDate),tasks:tasks.concat(missing)};
}
function validLaunchDate(value) {
  if (typeof value!=='string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed=new Date(value+'T00:00:00Z');
  return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0,10)===value;
}
function validBackup(data) {
  return data && validLaunchDate(data.launchDate) &&
    Array.isArray(data.stageDates) && data.stageDates.length===stages.length &&
    data.stageDates.every(range=>range && validLaunchDate(range.from) && validLaunchDate(range.to) && range.from<=range.to) &&
    data.stageDates[1].from===data.launchDate && Object.entries(fields).every(([kind,schema])=>Array.isArray(data[kind]) &&
    new Set(data[kind].map(row=>row?.id)).size===data[kind].length &&
    data[kind].every(row=>row && typeof row.id==='string' && schema.every(([name,,type,required=true])=>
      typeof row[name]==='string' && (!required || row[name].trim()) &&
      (!Array.isArray(type) || type.includes(row[name]) || (name==='module' && row[name]===unassigned)) &&
      (type!=='date' || /^\d{4}-\d{2}-\d{2}$/.test(row[name])) &&
      (type!=='url' || !row[name] || safeUrl(row[name])))));
}
try {
  const saved = migrate(JSON.parse(localStorage.getItem(key)));
  if (validBackup(saved)) state = saved;
  else if (saved) $('notice').textContent = 'El registro guardado no tiene un formato válido. Revisá el respaldo antes de editar.';
} catch {
  $('notice').textContent = 'No se pudo leer el registro de este navegador.';
}
function save(next) {
  try {
    localStorage.setItem(key,JSON.stringify(next));
    state = next;
    $('notice').textContent = storageHint;
    render();
    return true;
  } catch {
    alert('El navegador no pudo guardar el cambio. Revisá el almacenamiento e intentá de nuevo.');
    return false;
  }
}
function safeUrl(value) {
  try {const url=new URL(value);return ['https:','http:'].includes(url.protocol) ? url.href : '';} catch {return '';}
}
function today() {return new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Argentina/San_Luis'}).format(new Date());}
function date(value) {return value ? value.split('-').reverse().join('/') : '—';}
function esc(value) {return String(value??'').replace(/[&<>"']/g, char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);}
function pill(value) {
  const tone=['Validado','Disponible','Uso autónomo','Práctica validada'].includes(value)?'green':value==='Bloqueado'?'red':['En curso','En producción'].includes(value)?'amber':'';
  return '<span class="pill '+tone+'">'+esc(value)+'</span>';
}
function editButton(kind,row) {
  return '<button class="secondary" data-edit="'+kind+'" data-id="'+esc(row.id)+'">Editar</button>';
}
function table(kind,rows) {
  if (!rows.length) return '<p>Todavía no hay registros.</p>';
  return '<div class="tableWrap"><table><thead><tr>'+columns[kind].map(c=>'<th scope="col">'+c+'</th>').join('')+'</tr></thead><tbody>'+rows.map(cells=>'<tr>'+cells.map(cell=>'<td>'+cell+'</td>').join('')+'</tr>').join('')+'</tbody></table></div>';
}
function renderTimeline() {
  $('timeline').innerHTML=stages.map((stage,index)=>{
    const tasks=state.tasks.filter(task=>task.phase===stage.name);
    const validated=tasks.filter(task=>task.status==='Validado' && task.evidence.trim()).length;
    const range=state.stageDates[index];
    const dateInputs=[['from','Desde'],['to','Hasta']].map(([field,label])=>
      '<label>'+label+'<input type="date" required data-stage-date="'+index+'" data-field="'+field+'" aria-label="'+esc(stage.name+' · '+label)+'" value="'+esc(range[field])+'"></label>'
    ).join('');
    return '<article><h3>'+esc(stage.name)+'</h3><div class="stageDate">'+dateInputs+'</div><p>'+esc(stage.detail)+'</p><button type="button" class="secondary" data-stage="'+esc(stage.name)+'">'+validated+' / '+tasks.length+' validadas · Ver tareas</button></article>';
  }).join('');
}
function render() {
  $('launchDate').value=state.launchDate;
  renderTimeline();
  const critical=state.tasks.filter(t=>t.phase===phases[0]);
  const ready=critical.filter(t=>t.status==='Validado' && t.evidence.trim()).length;
  const blockers=critical.filter(t=>t.status==='Bloqueado').length;
  const trained=state.people.filter(p=>training.indexOf(p.status)>=2).length;
  $('metrics').innerHTML=[[ready+' / '+critical.length,'Circuitos críticos validados'],[blockers,'Bloqueos críticos'],[trained+' / '+state.people.length,'Operadores capacitados']].map(([n,label])=>'<div class="metric"><strong>'+n+'</strong>'+label+'</div>').join('');
  renderTasks();
  $('people').innerHTML=table('people',state.people.map(p=>[esc(p.name)+'<small>'+esc(p.notes)+'</small>',esc(p.role),esc(p.branch),pill(p.status),editButton('people',p)]));
  $('logs').innerHTML=table('logs',[...state.logs].sort((a,b)=>b.date.localeCompare(a.date)).map(l=>[date(l.date),pill(l.type)+' <b>'+esc(l.title)+'</b><small>'+esc(l.notes)+'</small>',esc(l.owner),editButton('logs',l)]));
  renderVideos();
}
function renderTasks() {
  const selected=$('taskModule').value;
  const stage=$('taskStage').value;
  const groups=[...modules,...(state.tasks.some(t=>t.module===unassigned)?[unassigned]:[])];
  $('tasks').innerHTML=groups.filter(module=>!selected||module===selected).map(module=>{
    const rows=state.tasks.filter(t=>t.module===module&&(!stage||t.phase===stage)).sort((a,b)=>phases.indexOf(a.phase)-phases.indexOf(b.phase)||a.date.localeCompare(b.date));
    const critical=rows.filter(t=>t.phase===phases[0]);
    const passed=critical.filter(t=>t.status==='Validado'&&t.evidence.trim()).length;
    return '<section class="moduleGroup"><div class="head"><h3>'+esc(module)+'</h3><span class="pill">'+passed+' / '+critical.length+' críticos validados</span></div>'+table('tasks',rows.map(t=>[
    '<span class="pill">'+esc(t.phase)+'</span><br><b>'+esc(t.title)+'</b><small>'+esc(t.notes)+'</small>'+(t.evidence?'<small><b>Evidencia</b> · '+esc(t.evidence)+'</small>':''),date(t.date),esc(t.owner),pill(t.status),editButton('tasks',t)
    ]))+'</section>';
  }).join('');
}
function updateTaskFilters() {
  const previous=$('taskModule')?.value;
  const previousStage=$('taskStage')?.value;
  const options=[...modules,...(state.tasks.some(t=>t.module===unassigned)?[unassigned]:[])];
  $('taskFilters').innerHTML='<label>Módulo <select id="taskModule"><option value="">Todos los módulos</option>'+options.map(m=>'<option>'+esc(m)+'</option>').join('')+'</select></label>';
  $('taskFilters').insertAdjacentHTML('beforeend','<label>Etapa <select id="taskStage"><option value="">Todas las etapas</option>'+phases.map(phase=>'<option>'+esc(phase)+'</option>').join('')+'</select></label>');
  if (phases.includes(previousStage)) $('taskStage').value=previousStage;
  $('taskStage').addEventListener('change',renderTasks);
  if (options.includes(previous)) $('taskModule').value=previous;
  $('taskModule').addEventListener('change',renderTasks);
}
function renderVideos() {
  const role=$('videoRole').value;
  const videos=state.videos.filter(v=>!role || v.role.toLowerCase()===role.toLowerCase());
  $('videoRows').innerHTML=videos.map(v=>'<article class="tile">'+pill(v.status)+'<h3>'+esc(v.title)+'</h3><p>'+esc(v.role)+'<br>'+esc(v.notes)+'</p><div class="barTile">'+editButton('videos',v)+(safeUrl(v.url)?' <a href="'+esc(safeUrl(v.url))+'" target="_blank" rel="noopener noreferrer">Ver video</a>':'')+'</div></article>').join('')||'<p class="empty">Todavía no hay videos para este rol.</p>';
}
function openEditor(kind,id) {
  const row=state[kind].find(item=>item.id===id);
  edit={kind,id};
  $('formTitle').textContent=(row?'Editar ':'Agregar ')+labels[kind];
  $('fields').innerHTML=fields[kind].map(([name,label,type,required=true])=>{
    const marker=required?' required':'';
    const value=row?.[name]??(name==='module'?$('taskModule').value:name==='phase'?$('taskStage').value:type==='date'?today():'');
    let input;
    if (Array.isArray(type)) input='<select name="'+name+'"'+marker+'>'+(name==='module'?['',...type]:type).map(item=>'<option value="'+esc(item)+'"'+(item===value?' selected':'')+'>'+esc(item||'Elegí un módulo')+'</option>').join('')+'</select>';
    else if(type==='area') input='<textarea name="'+name+'"'+marker+'>'+esc(value)+'</textarea>';
    else input='<input name="'+name+'" type="'+(type==='roles'?'text':type||'text')+'"'+(type==='roles'?' list="roles"':'')+' value="'+esc(value)+'"'+marker+'>';
    return '<label>'+label+input+'</label>';
  }).join('')+(kind==='people'||kind==='videos'?'<datalist id="roles">'+roleList().map(role=>'<option value="'+esc(role)+'"></option>').join('')+'</datalist>':'');
  $('editor').showModal();
}
function roleList() {return [...new Set([...roles,...state.people.map(p=>p.role),...state.videos.map(v=>v.role)])];}
function updateFilters() {
  const previous=$('videoRole')?.value;
  $('filters').innerHTML='<label>Rol <select id="videoRole"><option value="">Todos los roles</option>'+roleList().map(r=>'<option>'+esc(r)+'</option>').join('')+'</select></label>';
  if (roleList().includes(previous)) $('videoRole').value=previous;
  $('videoRole').addEventListener('change',renderVideos);
}
$('editForm').addEventListener('submit',event=>{
  event.preventDefault();
  const {kind,id}=edit;
  const row=Object.fromEntries([...new FormData(event.target)].map(([field,value])=>[field,value.trim()]));
  if (fields[kind].some(([name,,,required=true])=>required&&!row[name])) return alert('Completá los campos obligatorios.');
  if (kind==='tasks'&&row.status==='Validado'&&!row.evidence) return alert('Registrá el resultado o la evidencia de la validación.');
  if (kind==='videos'&&((row.url&&!safeUrl(row.url))||(row.status==='Disponible'&&!safeUrl(row.url)))) return alert('Ingresá un enlace HTTP o HTTPS válido para el video.');
  row.id=id||crypto.randomUUID();
  const next={...state,[kind]:id?state[kind].map(x=>x.id===id?row:x):[...state[kind],row]};
  if (save(next)) {$('editor').close();updateFilters();updateTaskFilters();render();}
});
function validated(task) {
  return task.status==='Validado' && Boolean(task.evidence.trim());
}
function progress(title,done,total,tone,detail='') {
  const percentage=total?Math.round(done*100/total):0;
  return '<div class="reportProgress '+tone+'"><div><b>'+esc(title)+'</b><strong>'+done+' / '+total+'</strong></div>'+
    '<progress max="100" value="'+percentage+'" aria-label="'+esc(title)+'">'+percentage+'%</progress>'+
    (detail?'<small>'+esc(detail)+'</small>':'')+'</div>';
}
function reportHeading(title,recipient,from,to) {
  return '<header class="reportHeading"><span>'+recipient+'</span><h2>'+title+'</h2>'+
    '<p>Lorsani · '+date(from)+' al '+date(to)+'</p><p>Salida en vivo prevista · '+date(state.launchDate)+'</p></header>';
}
function managementReport(from,to,logs) {
  const critical=state.tasks.filter(task=>task.phase===phases[0]);
  const done=state.tasks.filter(validated);
  const completed=phases.filter(phase=>{
    const tasks=state.tasks.filter(task=>task.phase===phase);
    return tasks.length>0 && tasks.every(validated);
  }).length;
  const blocked=state.tasks.filter(task=>task.status==='Bloqueado');
  const trained=state.people.filter(person=>training.indexOf(person.status)>=2);
  const metrics=[
    ['Circuitos críticos listos',critical.filter(validated).length+' / '+critical.length,'azure'],
    ['Etapas concluidas',completed+' / '+phases.length,'violet'],
    ['Operadores capacitados',trained.length+' / '+state.people.length,'mint'],
    ['Tareas bloqueadas',blocked.length,'amber'],
  ];
  const stageBars=phases.map((phase,index)=>{
    const tasks=state.tasks.filter(task=>task.phase===phase);
    const range=state.stageDates[index];
    return progress(phase,tasks.filter(validated).length,tasks.length,metrics[index][2],date(range.from)+' al '+date(range.to));
  });
  const moduleBars=[...modules,...(state.tasks.some(task=>task.module===unassigned)?[unassigned]:[])].map(module=>{
    const tasks=state.tasks.filter(task=>task.module===module);
    return progress(module,tasks.filter(validated).length,tasks.length,'azure');
  });
  const branchBars=branches.map(branch=>{
    const people=state.people.filter(person=>person.branch===branch);
    return progress(branch,trained.filter(person=>person.branch===branch).length,people.length,'mint');
  });
  const next=state.tasks.filter(task=>!validated(task)&&task.status!=='Bloqueado')
    .sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5);
  const operational=logs.filter(log=>['Avance operativo','Capacitación','Decisión'].includes(log.type));
  const taskItems=tasks=>tasks.length?'<ul>'+tasks.map(task=>'<li><b>'+esc(task.title)+'</b> · '+date(task.date)+' · '+esc(task.owner)+'</li>').join('')+'</ul>':'<p>Sin tareas registradas.</p>';
  return reportHeading('Tablero de implementación','Gerencia',from,to)+
    '<div class="reportKpis">'+metrics.map(([title,value,tone])=>'<div class="reportKpi '+tone+'"><strong>'+value+'</strong><span>'+title+'</span></div>').join('')+'</div>'+
    '<p>'+done.length+' de '+state.tasks.length+' tareas validadas con evidencia al generar este informe.</p>'+
    '<section class="reportSection"><h3>Avance por etapa</h3><div class="reportGrid">'+stageBars.join('')+'</div></section>'+
    '<section class="reportSection"><h3>Avance por módulo</h3><div class="reportGrid">'+moduleBars.join('')+'</div></section>'+
    '<section class="reportSection"><h3>Capacitación por sucursal y ruta</h3><div class="reportGrid">'+branchBars.join('')+'</div></section>'+
    '<section class="reportSection"><h3>Bloqueos que requieren atención</h3>'+taskItems(blocked)+'</section>'+
    '<section class="reportSection"><h3>Próximos vencimientos</h3>'+taskItems(next)+'</section>'+
    '<section class="reportSection"><h3>Avances operativos del período</h3>'+
    (operational.length?'<ul>'+operational.map(log=>'<li><b>'+date(log.date)+' · '+esc(log.title)+'</b><br>'+esc(log.notes)+'</li>').join('')+'</ul>':'<p>Sin avances registrados para el período.</p>')+'</section>';
}
function technicalReport(from,to,logs) {
  const tasks=[...state.tasks].sort((a,b)=>phases.indexOf(a.phase)-phases.indexOf(b.phase)||a.module.localeCompare(b.module)||a.date.localeCompare(b.date));
  const blocked=tasks.filter(task=>task.status==='Bloqueado');
  const critical=tasks.filter(task=>task.phase===phases[0]);
  const ready=critical.filter(validated).length;
  const related=logs.filter(log=>['Prueba técnica','Incidencia','Decisión'].includes(log.type));
  const taskRows=tasks.map(task=>'<tr><td><b>'+esc(task.title)+'</b><small>'+esc(task.phase)+' · '+esc(task.module)+'</small></td>'+
    '<td>'+pill(task.status)+'<small>'+date(task.date)+' · '+esc(task.owner)+'</small></td>'+
    '<td>'+esc(task.notes)+'<small><b>Evidencia o resultado</b> · '+(task.evidence.trim()?esc(task.evidence):'Sin evidencia registrada')+'</small></td></tr>');
  return reportHeading('Informe técnico de implementación','Equipo de Baboons',from,to)+
    '<p class="techSummary"><b>Estado al generar el informe</b><br>'+ready+'/'+critical.length+' circuitos críticos validados · '+tasks.filter(validated).length+'/'+tasks.length+' tareas validadas · '+blocked.length+' bloqueos</p>'+
    '<section class="reportSection"><h3>Bloqueos y responsables</h3>'+
    (blocked.length?'<ul>'+blocked.map(task=>'<li><b>'+esc(task.module)+' · '+esc(task.title)+'</b> · '+esc(task.owner)+' · '+date(task.date)+(task.evidence.trim()?'<br>'+esc(task.evidence):'')+'</li>').join('')+'</ul>':'<p>Sin bloqueos registrados.</p>')+'</section>'+
    '<section class="reportSection"><h3>Bitácora técnica del período</h3>'+
    (related.length?'<ul>'+related.map(log=>'<li><b>'+date(log.date)+' · '+esc(log.type)+' · '+esc(log.title)+'</b><br>'+esc(log.owner)+' · '+esc(log.notes)+'</li>').join('')+'</ul>':'<p>Sin pruebas técnicas, incidencias ni decisiones registradas para el período.</p>')+'</section>'+
    '<section class="reportSection"><h3>Matriz de verificación por etapa y módulo</h3><div class="tableWrap"><table><thead><tr><th scope="col">Tarea / módulo</th><th scope="col">Estado / responsable</th><th scope="col">Criterio y evidencia</th></tr></thead><tbody>'+taskRows.join('')+'</tbody></table></div></section>';
}
function report(audience) {
  const from=$('from').value,to=$('through').value;
  if (!from||!to||from>to) return alert('Elegí un período válido.');
  const logs=state.logs.filter(log=>log.date>=from&&log.date<=to).sort((a,b)=>a.date.localeCompare(b.date));
  const technical=audience==='baboons';
  $('reportBody').className=technical?'technicalReport':'managementReport';
  $('reportBody').innerHTML=technical?technicalReport(from,to,logs):managementReport(from,to,logs);
  $('report').showModal();
}
document.addEventListener('click',event=>{
  const button=event.target.closest('button');
  if (!button) return;
  if ('close' in button.dataset) button.closest('dialog').close();
  if (button.dataset.stage) {
    $('taskModule').value='';
    $('taskStage').value=button.dataset.stage;
    renderTasks();
    $('plan').scrollIntoView({behavior:'smooth'});
  }
  if (button.dataset.add) openEditor(button.dataset.add);
  if (button.dataset.edit) openEditor(button.dataset.edit,button.dataset.id);
  if (button.dataset.report) report(button.dataset.report);
});
function updateStageDate(index,field,input) {
  const current=state.stageDates[index];
  const value=input.value;
  if (!validLaunchDate(value)) {
    input.value=current[field];
    return;
  }
  const range={...current,[field]:value};
  const updatesLaunch=index===1 && field==='from';
  if (updatesLaunch && (current.from===current.to || value>range.to)) range.to=value;
  if (range.from>range.to) {
    alert('La fecha Desde debe ser anterior o igual a la fecha Hasta.');
    input.value=current[field];
    return;
  }
  const stageDates=state.stageDates.map((dates,i)=>i===index?range:dates);
  const launchDate=updatesLaunch?value:state.launchDate;
  const tasks=updatesLaunch?state.tasks.map(task=>task.id==='milestone-go-live'&&task.date===state.launchDate
    ? {...task,date:launchDate} : task):state.tasks;
  if (!save({...state,stageDates,launchDate,tasks})) input.value=current[field];
}
$('launchDate').addEventListener('change',event=>updateStageDate(1,'from',event.target));
$('timeline').addEventListener('change',event=>{
  const {stageDate,field}=event.target.dataset;
  if (stageDate!==undefined) updateStageDate(Number(stageDate),field,event.target);
});
$('through').value=today();
$('print').addEventListener('click',()=>window.print());
$('backup').addEventListener('click',()=>{
  const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='Lorsani-respaldo-'+today()+'.json';link.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
});
$('restore').addEventListener('click',()=>$('file').click());
$('file').addEventListener('change',async event=>{
  const file=event.target.files[0];
  event.target.value='';
  if (!file) return;
  let backup;
  try {backup=migrate(JSON.parse(await file.text()));} catch {return alert('No se pudo leer el respaldo.');}
  if (!validBackup(backup)) return alert('El archivo no coincide con el formato de respaldo de Lorsani.');
  if (confirm('¿Reemplazar los registros actuales con el respaldo seleccionado?')&&save(backup)) {
    updateFilters();
    updateTaskFilters();
    render();
  }
});
updateFilters();
updateTaskFilters();
render();
