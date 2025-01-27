window.onload = () => {

const xhr = new XMLHttpRequest();

xhr.open('GET', document.head.dataset.dir + '/api/user/list');

xhr.setRequestHeader('Content-Type', 'application/json');
xhr.responseType = 'json';

const params = {}

window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (match, key, value) => {
  params[key] = decodeURI(value)
})

xhr.onload = e => {

  if (e.target.status !== 200) return;

  const userTable = new Tabulator(
    document.getElementById('userTable'),
    {
      rowFormatter: row => {
    
        const user = row.getData()

        console.log(user.email)

        row.getElement().style.backgroundColor = user.email === params.email && '#fff9c4'
    
        row.getElement().style.backgroundColor = user.blocked && '#ef9a9a'

      },
      columns: [
        {
          field: 'email',
          headerTooltip: 'Account EMail',
          titleFormatter: ()=> '<div class="icon-face xyz-icon"></div>',
        },
        {
          field: 'verified',
          align: 'center',
          headerTooltip: 'The account email has been verified through a token sent to the email address.',
          titleFormatter: ()=> '<div class="icon-tick-done xyz-icon"></div>',
          formatter: 'tickCross',
          cellClick: cellToggle,
        },
        {
          field: 'approved',
          align: 'center',
          headerTooltip: 'The account has been approved by a site administrator and is permitted to access the application.',
          titleFormatter: ()=> '<div class="icon-tick-done-all xyz-icon"></div>',
          formatter: 'tickCross',
          cellClick: cellToggle,
        },
        {
          field: 'admin',
          align: 'center',
          headerTooltip: 'The account is an admin account which can access this page and change other account credentials.',
          titleFormatter: ()=> '<div class="xyz-icon icon-supervisor-account"></div>',
          formatter: 'tickCross',
          cellClick: cellToggle,
        },
        {
          field: 'api',
          align: 'center',
          headerTooltip: 'The account has priviliges to create API keys.',
          titleFormatter: ()=> '<div class="xyz-icon icon-key"></div>',
          formatter: 'tickCross',
          cellClick: cellToggle,
        },
        {
          field: 'failedattempts',
          align: 'center',
          headerTooltip: 'Failed login attempts.',
          titleFormatter: ()=> '<div class="xyz-icon icon-warning"></div>',
          formatter: (cell, formatterParams) => '<span style="color:red; font-weight:bold;">' + cell.getValue() + '</span>',
        },
        {
          field: 'language',
          align: 'center',
          headerTooltip: 'Account language',
          titleFormatter: () => '<div class="xyz-icon icon-translate"></div>',
        },
        {
          field: 'roles',
          title: 'Roles',
          headerTooltip: 'Account roles',
          headerSort: false,
          editor: roleEdit,
        },
        {
          field: 'access_log',
          title: 'Access Log',
          headerTooltip: 'Click last access log entry for full access log array.',
          cellClick: getAccessLog,
        },
        {
          field: 'approved_by',
          title: 'Approved by',
          headerTooltip: 'Admin who approved last modification to this account.',
        },
        {
          field: 'blocked',
          align: 'center',
          headerTooltip: 'Blocked accounts can no longer login or reset their password.',
          titleFormatter: ()=> '<div class="icon-lock-closed xyz-icon"></div>',
          formatter: 'tickCross',
          cellClick: cellToggle,
        },
        {
          field: 'delete',
          headerSort: false,
          formatter: ()=> '<span style="color:red; font-weight:bold;">DELETE</span>',
          cellClick: rowDelete,
        }
      ],
      resizableColumns: false,
      resizableRows: false,
      layout: 'fitDataFill',
    });

  userTable.setData(e.target.response.length && e.target.response || [e.target.response]);

  userTable.redraw(true);

};

xhr.send();

function cellToggle(e, cell) {

  const user = cell.getData();

  const col = cell.getColumn();

  xhr.open('GET', document.head.dataset.dir + 
    '/api/user/update' + 
    '?email=' + user.email +
    '&field=' + col.getField() +
    '&value=' + !cell.getValue());

  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onload = () => {
    if (xhr.status !== 200) return alert(xhr.response.message);
    cell.setValue(!cell.getValue());

    const row = cell.getRow()

    row.reformat()

  };

  xhr.send();

};

function getAccessLog(e, cell) {

  const user = cell.getData();

  xhr.open('GET', `${document.head.dataset.dir}/api/user/log?email=${user.email}`);

  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.responseType = 'json';

  xhr.onload = e => {
    if (xhr.status === 500) alert('Soz. It\'s me not you.');
    if (xhr.status === 200) alert(e.target.response.access_log.join('\n'));
  };

  xhr.send();
};

function rowDelete(e, cell) {

  const user = cell.getData();

  const row = cell.getRow();

  if (confirm('Delete account ' + user.email)) {

    xhr.open('GET', document.head.dataset.dir +
      '/api/user/delete?' +
      'email=' + user.email);

    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onload = e => {
      if (e.target.status === 500) alert('Soz. It\'s me not you.');
      if (e.target.status === 200) row.delete();
    };

    xhr.send();
  }
};

function roleEdit(cell, onRendered, success, cancel, editorParams){

  const editor = document.createElement('input');

  editor.style.padding = '4px';
  editor.style.width = '100%';

  editor.value = cell.getValue();

  onRendered(()=>editor.focus());

  const user = cell.getData();

  editor.addEventListener('keyup', e => {
    let key = e.keyCode || e.charCode;

    if (key === 13) {

      editor.blur();

      xhr.open('GET', document.head.dataset.dir + 
        '/api/user/update' + 
        '?email=' + user.email +
        '&field=roles' +
        '&value=' + editor.value);
    
      xhr.setRequestHeader('Content-Type', 'application/json');
    
      xhr.onload = () => {
        if (xhr.status !== 200) return alert(xhr.response.message);
        success(editor.value);
      };
    
      xhr.send();

    }

  });

  editor.addEventListener('blur', ()=>success(editor.value));

  return editor;
};

}