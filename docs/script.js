let currentLanguage = 'fa';

function generateTable() {
    const columns = document.getElementById('columns').value;
    const rows = document.getElementById('rows').value;
    const tableContainer = document.getElementById('table-container');
    tableContainer.innerHTML = '';

    let table = document.createElement('table');
    for (let i = 0; i < rows; i++) {
        let tr = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            let td = document.createElement('td');
            td.contentEditable = true;
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
    tableContainer.appendChild(table);

    addCopyButtons(columns);
}

function addCopyButtons(columns) {
    const tableContainer = document.getElementById('table-container');
    const copyButtonsContainer = document.createElement('div');
    copyButtonsContainer.classList.add('copy-buttons');

    for (let j = 0; j < columns; j++) {
        let copyButton = document.createElement('button');
        copyButton.innerText = `${currentLanguage === 'fa' ? 'کپی ستون ' : 'Copy Column '} ${j + 1}`;
        copyButton.classList.add('copy-button');
        copyButton.onclick = () => copyColumn(j);
        copyButtonsContainer.appendChild(copyButton);
    }
    tableContainer.appendChild(copyButtonsContainer);
}

function copyColumn(columnIndex) {
    const table = document.querySelector('table');
    let columnData = [];
    
    for (let i = 0; i < table.rows.length; i++) {
        const cellContent = table.rows[i].cells[columnIndex].innerText;
        columnData.push(cellContent);
    }

    const textToCopy = columnData.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert(currentLanguage === 'fa' ? 'محتوا کپی شد!' : 'Content copied!');
    }).catch(err => console.error('Error copying text: ', err));
}

function resetTable() {
    document.getElementById('table-container').innerHTML = '';
    document.getElementById('rows').value = '';
    document.getElementById('columns').value = '';
}

function randomFill() {
    const columns = document.getElementById('columns').value;
    const rows = document.getElementById('rows').value;
    const tableContainer = document.getElementById('table-container');

    if (!tableContainer.firstChild) {
        alert('جدولی ایجاد نشده است!');
        return;
    }

    const table = tableContainer.querySelector('table');

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            if (j === 0) {
                table.rows[i].cells[j].innerText = currentLanguage === 'fa' ? 'نام تیم' : 'Team Name';
            } else {
                table.rows[i].cells[j].innerText = Math.floor(Math.random() * 20);
            }
        }
    }
}

function saveTableToFile() {
    const table = document.querySelector('table');
    if (!table) {
        alert('جدولی برای ذخیره وجود ندارد!');
        return;
    }
    const rows = Array.from(table.rows).map(row => Array.from(row.cells).map(cell => cell.innerText));
    const blob = new Blob([JSON.stringify(rows)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tableData.json'; // نام فایل
    a.click();
    URL.revokeObjectURL(url);
    alert('فایل با موفقیت ذخیره شد!');
}

function loadTableFromFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    if (file.type !== 'application/json') { // چک کردن نوع فایل
        alert('لطفاً یک فایل JSON معتبر انتخاب کنید.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const tableData = JSON.parse(e.target.result);
        const tableContainer = document.getElementById('table-container');
        tableContainer.innerHTML = '';

        let table = document.createElement('table');
        tableData.forEach(rowData => {
            let tr = document.createElement('tr');
            rowData.forEach(cellData => {
                let td = document.createElement('td');
                td.contentEditable = true;
                td.innerText = cellData;
                tr.appendChild(td);
            });
            table.appendChild(tr);
        });
        tableContainer.appendChild(table);
        addCopyButtons(tableData[0].length); // اضافه کردن دکمه‌های کپی
    };
    
    reader.readAsText(file);
}
