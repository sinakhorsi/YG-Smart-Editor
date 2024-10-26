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
        tr.draggable = true; // Enable dragging
        tr.addEventListener('dragstart', dragStart);
        tr.addEventListener('dragover', dragOver);
        tr.addEventListener('drop', drop);
        table.appendChild(tr);
    }
    tableContainer.appendChild(table);

    // Add copy buttons for each column
    addCopyButtons(columns);
}

function addCopyButtons(columns) {
    const tableContainer = document.getElementById('table-container');
    const copyButtonsContainer = document.createElement('div');

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
        columnData.push(table.rows[i].cells[columnIndex].innerText);
    }
    const textToCopy = columnData.join('\n');
    navigator.clipboard.writeText(textToCopy).then(() => {
        alert(currentLanguage === 'fa' ? 'محتوا کپی شد!' : 'Content copied!');
    });
}

function resetTable() {
    document.getElementById('table-container').innerHTML = '';
    document.getElementById('rows').value = '';
    document.getElementById('columns').value = '';
    document.getElementById('fileInput').value = ''; // Reset file input
    document.getElementById('fileInput').setAttribute('placeholder', 'Choose a file...'); // Reset placeholder
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

function changeLanguage(lang) {
    currentLanguage = lang;
    resetTable();
    const title = document.getElementById('tableTitle');
    const rowsLabel = document.querySelector('label[for="rows"]');
    const columnsLabel = document.querySelector('label[for="columns"]');
    const registerButton = document.querySelector('button:nth-of-type(1)');
    const resetButton = document.querySelector('button:nth-of-type(2)');
    const randomButton = document.querySelector('button:nth-of-type(3)');
    const saveButton = document.querySelector('button:nth-of-type(4)');

    if (lang === 'en') {
        title.innerText = 'YG Smart Table Editor';
        rowsLabel.innerText = 'Rows';
        columnsLabel.innerText = 'Columns';
        registerButton.innerText = 'Create Table';
        resetButton.innerText = 'Reset';
        randomButton.innerText = 'Random Fill';
        saveButton.innerText = 'Save Table';
    } else {
        title.innerText = 'ویرایشگر جدول هوشمند';
        rowsLabel.innerText = 'ردیف‌ها';
        columnsLabel.innerText = 'ستون‌ها';
        registerButton.innerText = 'ساخت جدول';
        resetButton.innerText = 'ریست';
        randomButton.innerText = 'پر کردن تصادفی';
        saveButton.innerText = 'ذخیره جدول';
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
    reader.onload = function (e) {
        try {
            const tableData = JSON.parse(e.target.result);
            renderTable(tableData);
        } catch (error) {
            alert('فایل JSON معتبر نیست.');
        }
    };
    reader.readAsText(file);
}
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const tableData = JSON.parse(e.target.result);
        const tableContainer = document.getElementById('table-container');
        tableContainer.addEventListener('paste', handlePaste);
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
            tr.draggable = true; // Enable dragging
            tr.addEventListener('dragstart', dragStart);
            tr.addEventListener('dragover', dragOver);
            tr.addEventListener('drop', drop);
            table.appendChild(tr);
        });
        tableContainer.appendChild(table);

        addCopyButtons(tableData[0].length); // اضافه کردن دکمه‌های کپی
    };
    
    reader.readAsText(file);
}
function handlePaste(event) {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain').split('\n').map(line => line.trim()).filter(line => line);
    const table = document.querySelector('table');
    
    if (table) {
        let columnCount = table.rows[0].cells.length;

        for (let j = 0; j < columnCount; j++) {
            for (let i = 0; i < text.length; i++) {
                if (i < table.rows.length) {
                    table.rows[i].cells[j].innerText = text[i];
                }
            }
        }
    }
}
// Drag and drop functions
function dragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.rowIndex);
    e.target.classList.add('dragging');
}

function dragOver(e) {
    e.preventDefault();
}

function drop(e) {
    e.preventDefault();
    const draggedRowIndex = e.dataTransfer.getData('text/plain');
    const targetRow = e.target.closest('tr');
    const table = targetRow.closest('table');

    if (targetRow && draggedRowIndex !== targetRow.rowIndex) {
        const draggedRow = table.rows[draggedRowIndex];
        table.insertBefore(draggedRow, targetRow);
    }
}
