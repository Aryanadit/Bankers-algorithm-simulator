// Global variables
let currentStep = 1;
let isProcessing = false;
let simulationHistory = [];
let currentData = {};

// Utility functions
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = type === 'success' ? 'fas fa-check-circle' :
                 type === 'error' ? 'fas fa-exclamation-circle' :
                 type === 'warning' ? 'fas fa-exclamation-triangle' : 'fas fa-info-circle';
    
    toast.innerHTML = `
        <i class="${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
    isProcessing = true;
}

function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
    isProcessing = false;
}

function updateProgress(step) {
    const steps = document.querySelectorAll('.step');
    steps.forEach((stepEl, index) => {
        if (index + 1 < step) {
            stepEl.classList.add('completed');
            stepEl.classList.remove('active');
        } else if (index + 1 === step) {
            stepEl.classList.add('active');
            stepEl.classList.remove('completed');
        } else {
            stepEl.classList.remove('active', 'completed');
        }
    });
}

function toggleInstructions() {
    const panel = document.getElementById('instructionsPanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// New Feature: Sample Data Loading
function loadSampleData() {
    const sampleData = {
        processes: 5,
        resources: 3,
        totalInstances: [10, 5, 7],
        allocation: [
            [0, 1, 0],
            [2, 0, 0],
            [3, 0, 2],
            [2, 1, 1],
            [0, 0, 2]
        ],
        maximum: [
            [7, 5, 3],
            [3, 2, 2],
            [9, 0, 2],
            [2, 2, 2],
            [4, 3, 3]
        ]
    };
    
    document.getElementById('numProcess').value = sampleData.processes;
    document.getElementById('numResource').value = sampleData.resources;
    
    createTables();
    
    // Fill in the data after tables are created
    setTimeout(() => {
        // Fill Total Instances
        for (let i = 1; i <= sampleData.resources; i++) {
            document.getElementById('r' + i).value = sampleData.totalInstances[i - 1];
        }
        
        // Fill Allocation Matrix
        for (let i = 1; i <= sampleData.processes; i++) {
            for (let j = 1; j <= sampleData.resources; j++) {
                document.getElementById('a' + i + j).value = sampleData.allocation[i - 1][j - 1];
            }
        }
        
        // Fill Maximum Matrix
        for (let i = 1; i <= sampleData.processes; i++) {
            for (let j = 1; j <= sampleData.resources; j++) {
                document.getElementById('m' + i + j).value = sampleData.maximum[i - 1][j - 1];
            }
        }
        
        showToast('Sample data loaded successfully!', 'success');
    }, 600);
}

// New Feature: Export Data
function exportData() {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;
    
    if (!process || !resource) {
        showToast('Please create tables first!', 'error');
        return;
    }
    
    const data = {
        processes: Number(process),
        resources: Number(resource),
        totalInstances: [],
        allocation: [],
        maximum: [],
        need: [],
        available: []
    };
    
    // Export Total Instances
    for (let i = 1; i <= resource; i++) {
        data.totalInstances.push(Number(document.getElementById('r' + i).value));
    }
    
    // Export Allocation Matrix
    for (let i = 1; i <= process; i++) {
        const row = [];
        for (let j = 1; j <= resource; j++) {
            row.push(Number(document.getElementById('a' + i + j).value));
        }
        data.allocation.push(row);
    }
    
    // Export Maximum Matrix
    for (let i = 1; i <= process; i++) {
        const row = [];
        for (let j = 1; j <= resource; j++) {
            row.push(Number(document.getElementById('m' + i + j).value));
        }
        data.maximum.push(row);
    }
    
    // Export Need Matrix (if calculated)
    const needTable = document.getElementById('needTable');
    if (needTable) {
        for (let i = 1; i <= process; i++) {
            const row = [];
            for (let j = 1; j <= resource; j++) {
                row.push(Number(document.getElementById('n' + i + j).value));
            }
            data.need.push(row);
        }
    }
    
    // Export Available Resources (if calculated)
    const availableTable = document.getElementById('availableTable');
    if (availableTable) {
        for (let i = 1; i <= resource; i++) {
            data.available.push(Number(document.getElementById('av' + i).value));
        }
    }
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bankers_algorithm_data.json';
    link.click();
    
    URL.revokeObjectURL(url);
    showToast('Data exported successfully!', 'success');
}

// New Feature: Import Data
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    document.getElementById('numProcess').value = data.processes;
                    document.getElementById('numResource').value = data.resources;
                    
                    createTables();
                    
                    setTimeout(() => {
                        // Fill Total Instances
                        for (let i = 1; i <= data.resources; i++) {
                            document.getElementById('r' + i).value = data.totalInstances[i - 1];
                        }
                        
                        // Fill Allocation Matrix
                        for (let i = 1; i <= data.processes; i++) {
                            for (let j = 1; j <= data.resources; j++) {
                                document.getElementById('a' + i + j).value = data.allocation[i - 1][j - 1];
                            }
                        }
                        
                        // Fill Maximum Matrix
                        for (let i = 1; i <= data.processes; i++) {
                            for (let j = 1; j <= data.resources; j++) {
                                document.getElementById('m' + i + j).value = data.maximum[i - 1][j - 1];
                            }
                        }
                        
                        showToast('Data imported successfully!', 'success');
                    }, 600);
                } catch (error) {
                    showToast('Error importing data. Please check the file format.', 'error');
                }
            };
            reader.readAsText(file);
        }
    };
    
    input.click();
}

// New Feature: Resource Request Simulation
function simulateResourceRequest() {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;
    
    if (!process || !resource) {
        showToast('Please create tables first!', 'error');
        return;
    }
    
    // Create request dialog
    const requestDialog = document.createElement('div');
    requestDialog.className = 'modal-overlay';
    requestDialog.innerHTML = `
        <div class="modal-content">
            <h3><i class="fas fa-hand-paper"></i> Resource Request Simulation</h3>
            <p>Select a process and enter the resource request:</p>
            <div class="form-group">
                <label>Process:</label>
                <select id="requestProcess">
                    ${Array.from({length: process}, (_, i) => `<option value="${i + 1}">Process ${i + 1}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label>Resource Request:</label>
                <div id="requestResources">
                    ${Array.from({length: resource}, (_, i) => `
                        <div class="resource-input">
                            <label>Resource ${String.fromCharCode("A".charCodeAt(0) + i)}:</label>
                            <input type="number" id="requestResource${i + 1}" min="0" value="0">
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-buttons">
                <button onclick="processResourceRequest()" class="btn btn-primary">Process Request</button>
                <button onclick="closeRequestDialog()" class="btn btn-secondary">Cancel</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(requestDialog);
}

function processResourceRequest() {
    const process = Number(document.getElementById('requestProcess').value);
    const resource = document.getElementById("numResource").value;
    
    const request = [];
    for (let i = 1; i <= resource; i++) {
        request.push(Number(document.getElementById('requestResource' + i).value));
    }
    
    // Check if request is valid
    for (let j = 1; j <= resource; j++) {
        const need = Number(document.getElementById('n' + process + j).value);
        if (request[j - 1] > need) {
            showToast(`Request exceeds need for Resource ${String.fromCharCode("A".charCodeAt(0) + j - 1)}`, 'error');
            return;
        }
    }
    
    // Check if resources are available
    for (let j = 1; j <= resource; j++) {
        const available = Number(document.getElementById('av' + j).value);
        if (request[j - 1] > available) {
            showToast(`Request exceeds available resources for Resource ${String.fromCharCode("A".charCodeAt(0) + j - 1)}`, 'error');
            return;
        }
    }
    
    // Simulate the request
    let tempAllocation = [];
    let tempAvailable = [];
    
    // Create temporary arrays
    for (let i = 1; i <= process; i++) {
        const row = [];
        for (let j = 1; j <= resource; j++) {
            row.push(Number(document.getElementById('a' + i + j).value));
        }
        tempAllocation.push(row);
    }
    
    for (let j = 1; j <= resource; j++) {
        tempAvailable.push(Number(document.getElementById('av' + j).value));
    }
    
    // Apply the request
    for (let j = 0; j < resource; j++) {
        tempAllocation[process - 1][j] += request[j];
        tempAvailable[j] -= request[j];
    }
    
    // Check if the new state is safe
    const isSafe = checkSafetyWithData(tempAllocation, tempAvailable);
    
    closeRequestDialog();
    
    if (isSafe) {
        showToast('Resource request granted! New state is safe.', 'success');
        // Update the actual data
        for (let j = 1; j <= resource; j++) {
            document.getElementById('a' + process + j).value = tempAllocation[process - 1][j - 1];
            document.getElementById('av' + j).value = tempAvailable[j - 1];
        }
        // Recalculate need
        calculateNeed();
    } else {
        showToast('Resource request denied! New state would be unsafe.', 'warning');
    }
}

function closeRequestDialog() {
    const dialog = document.querySelector('.modal-overlay');
    if (dialog) {
        dialog.remove();
    }
}

// New Feature: Safety Check with Custom Data
function checkSafetyWithData(allocation, available) {
    const process = allocation.length;
    const resource = available.length;
    
    // Calculate need matrix
    const need = [];
    for (let i = 0; i < process; i++) {
        const row = [];
        for (let j = 0; j < resource; j++) {
            const max = Number(document.getElementById('m' + (i + 1) + (j + 1)).value);
            row.push(max - allocation[i][j]);
        }
        need.push(row);
    }
    
    // Banker's Algorithm
    const finish = Array(process).fill(false);
    const safeSequence = [];
    let count = 0;
    
    while (count < process) {
        let found = false;
        for (let i = 0; i < process; i++) {
            if (!finish[i]) {
                let canProceed = true;
                for (let j = 0; j < resource; j++) {
                    if (need[i][j] > available[j]) {
                        canProceed = false;
                        break;
                    }
                }
                if (canProceed) {
                    for (let j = 0; j < resource; j++) {
                        available[j] += allocation[i][j];
                    }
                    safeSequence.push(i + 1);
                    finish[i] = true;
                    found = true;
                    count++;
                }
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
}

// New Feature: Statistics and Analysis
function showStatistics() {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;
    
    if (!process || !resource) {
        showToast('Please create tables first!', 'error');
        return;
    }
    
    let totalResources = 0;
    let totalAllocated = 0;
    let totalAvailable = 0;
    let utilizationRate = 0;
    
    // Calculate statistics
    for (let i = 1; i <= resource; i++) {
        const total = Number(document.getElementById('r' + i).value);
        totalResources += total;
        
        let allocated = 0;
        for (let j = 1; j <= process; j++) {
            allocated += Number(document.getElementById('a' + j + i).value);
        }
        totalAllocated += allocated;
        
        const available = Number(document.getElementById('av' + i).value || 0);
        totalAvailable += available;
    }
    
    utilizationRate = (totalAllocated / totalResources) * 100;
    
    const statsDialog = document.createElement('div');
    statsDialog.className = 'modal-overlay';
    statsDialog.innerHTML = `
        <div class="modal-content">
            <h3><i class="fas fa-chart-bar"></i> System Statistics</h3>
            <div class="stats-grid">
                <div class="stat-item">
                    <h4>Total Resources</h4>
                    <p>${totalResources}</p>
                </div>
                <div class="stat-item">
                    <h4>Total Allocated</h4>
                    <p>${totalAllocated}</p>
                </div>
                <div class="stat-item">
                    <h4>Total Available</h4>
                    <p>${totalAvailable}</p>
                </div>
                <div class="stat-item">
                    <h4>Utilization Rate</h4>
                    <p>${utilizationRate.toFixed(2)}%</p>
                </div>
            </div>
            <div class="resource-breakdown">
                <h4>Resource Breakdown:</h4>
                ${Array.from({length: resource}, (_, i) => {
                    const total = Number(document.getElementById('r' + (i + 1)).value);
                    let allocated = 0;
                    for (let j = 1; j <= process; j++) {
                        allocated += Number(document.getElementById('a' + j + (i + 1)).value);
                    }
                    const available = Number(document.getElementById('av' + (i + 1)).value || 0);
                    const rate = (allocated / total) * 100;
                    return `
                        <div class="resource-stat">
                            <span>Resource ${String.fromCharCode("A".charCodeAt(0) + i)}:</span>
                            <span>${allocated}/${total} (${rate.toFixed(1)}%)</span>
                            <span>Available: ${available}</span>
                        </div>
                    `;
                }).join('')}
            </div>
            <button onclick="closeStatsDialog()" class="btn btn-primary">Close</button>
        </div>
    `;
    
    document.body.appendChild(statsDialog);
}

function closeStatsDialog() {
    const dialog = document.querySelector('.modal-overlay');
    if (dialog) {
        dialog.remove();
    }
}

// New Feature: Step-by-Step Visualization
function showStepByStep() {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;
    
    if (!process || !resource) {
        showToast('Please create tables first!', 'error');
        return;
    }
    
    // Read current data
    let allocation = Array.from({ length: process }, () => Array(resource).fill(0));
    let max = Array.from({ length: process }, () => Array(resource).fill(0));
    let need = Array.from({ length: process }, () => Array(resource).fill(0));
    let available = Array(resource).fill(0);
    
    for (let i = 0; i < process; i++) {
        for (let j = 0; j < resource; j++) {
            allocation[i][j] = Number(document.getElementById('a' + (i + 1) + (j + 1)).value);
            max[i][j] = Number(document.getElementById('m' + (i + 1) + (j + 1)).value);
            need[i][j] = Number(document.getElementById('n' + (i + 1) + (j + 1)).value);
        }
    }
    for (let j = 0; j < resource; j++) {
        available[j] = Number(document.getElementById('av' + (j + 1)).value);
    }
    
    const stepDialog = document.createElement('div');
    stepDialog.className = 'modal-overlay';
    stepDialog.innerHTML = `
        <div class="modal-content step-by-step-modal">
            <h3><i class="fas fa-play-circle"></i> Step-by-Step Safety Algorithm</h3>
            <div id="stepContent">
                <div class="step-info">
                    <h4>Initial State:</h4>
                    <p>Available: [${available.join(', ')}]</p>
                    <p>Need Matrix:</p>
                    <div class="matrix-display">
                        ${need.map((row, i) => `
                            <div class="matrix-row">
                                <span>P${i + 1}:</span>
                                <span>[${row.join(', ')}]</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            <div class="step-controls">
                <button onclick="nextStep()" class="btn btn-primary">Next Step</button>
                <button onclick="closeStepDialog()" class="btn btn-secondary">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(stepDialog);
    
    // Store data for step-by-step execution
    window.stepData = {
        allocation: allocation,
        need: need,
        available: [...available],
        finish: Array(process).fill(false),
        sequence: [],
        currentStep: 0,
        process: process,
        resource: resource
    };
}

function nextStep() {
    const data = window.stepData;
    if (!data) return;
    
    const stepContent = document.getElementById('stepContent');
    data.currentStep++;
    
    if (data.currentStep === 1) {
        stepContent.innerHTML += `
            <div class="step-info">
                <h4>Step ${data.currentStep}: Finding Safe Sequence</h4>
                <p>Looking for a process that can be allocated resources...</p>
            </div>
        `;
    } else {
        // Simulate one step of the algorithm
        let found = false;
        for (let i = 0; i < data.process; i++) {
            if (!data.finish[i]) {
                let canProceed = true;
                for (let j = 0; j < data.resource; j++) {
                    if (data.need[i][j] > data.available[j]) {
                        canProceed = false;
                        break;
                    }
                }
                if (canProceed) {
                    data.sequence.push(i + 1);
                    data.finish[i] = true;
                    found = true;
                    
                    // Update available resources
                    for (let j = 0; j < data.resource; j++) {
                        data.available[j] += data.allocation[i][j];
                    }
                    
                    stepContent.innerHTML += `
                        <div class="step-info">
                            <h4>Step ${data.currentStep}: Process ${i + 1} Selected</h4>
                            <p>Process ${i + 1} can be allocated resources.</p>
                            <p>Need: [${data.need[i].join(', ')}] ≤ Available: [${data.available.map((v, idx) => v - data.allocation[i][idx]).join(', ')}]</p>
                            <p>New Available: [${data.available.join(', ')}]</p>
                            <p>Safe Sequence so far: [${data.sequence.join(' → ')}]</p>
                        </div>
                    `;
                    break;
                }
            }
        }
        
        if (!found) {
            stepContent.innerHTML += `
                <div class="step-info error">
                    <h4>Step ${data.currentStep}: No Safe Sequence Found</h4>
                    <p>The system is in an unsafe state!</p>
                </div>
            `;
            return;
        }
        
        // Check if all processes are done
        if (data.sequence.length === data.process) {
            stepContent.innerHTML += `
                <div class="step-info success">
                    <h4>Algorithm Complete!</h4>
                    <p>Safe Sequence: [${data.sequence.join(' → ')}]</p>
                    <p>The system is in a safe state.</p>
                </div>
            `;
        }
    }
}

function closeStepDialog() {
    const dialog = document.querySelector('.modal-overlay');
    if (dialog) {
        dialog.remove();
    }
    window.stepData = null;
}

// Table creation functions - preserving original logic
function columnTable(ch, tableName, tableId, divId) {
    const resource = document.getElementById("numResource").value;
    const myTableDiv = document.getElementById(divId);

    const tableSection = document.createElement('div');
    tableSection.className = 'table-section';

    const tableTitle = document.createElement('div');
    tableTitle.className = 'table-title';
    tableTitle.innerHTML = `<i class="fas fa-cube"></i> ${tableName}`;
    tableSection.appendChild(tableTitle);

    const tableContent = document.createElement('div');
    tableContent.className = 'table-content';

    const table = document.createElement('table');
    table.id = tableId;

    const tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    for (let i = 1; i <= resource; i++) {
        const tr = document.createElement('tr');
        tableBody.appendChild(tr);

        const td1 = document.createElement('td');
        td1.textContent = `Resource ${String.fromCharCode("A".charCodeAt(0) + (i - 1))}`;
        tr.appendChild(td1);

        const td2 = document.createElement('td');
        const input = document.createElement("input");
        input.type = "text";
        input.id = ch + i;
        input.placeholder = "0";
        td2.appendChild(input);
        tr.appendChild(td2);
    }

    tableContent.appendChild(table);
    tableSection.appendChild(tableContent);
    myTableDiv.appendChild(tableSection);
}

function gridTable(ch, tableName, tableId, divId) {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;

    const myTableDiv = document.getElementById(divId);

    const tableSection = document.createElement('div');
    tableSection.className = 'table-section';

    const tableTitle = document.createElement('div');
    tableTitle.className = 'table-title';
    tableTitle.innerHTML = `<i class="fas fa-table"></i> ${tableName}`;
    tableSection.appendChild(tableTitle);

    const tableContent = document.createElement('div');
    tableContent.className = 'table-content';

    const table = document.createElement('table');
    table.id = tableId;

    const tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    for (let i = 0; i <= process; i++) {
        const tr = document.createElement('tr');
        tableBody.appendChild(tr);

        for (let j = 0; j <= resource; j++) {
            const td = document.createElement('td');

            if (i === 0 && j === 0) {
                td.textContent = "Resource / Process";
            } else if (i === 0) {
                td.textContent = String.fromCharCode("A".charCodeAt(0) + (j - 1));
            } else if (j === 0) {
                td.textContent = `Process ${i}`;
            } else {
                const input = document.createElement("input");
                input.type = "text";
                input.id = ch + i + j;
                input.placeholder = "0";
                td.appendChild(input);
            }
            tr.appendChild(td);
        }
    }

    tableContent.appendChild(table);
    tableSection.appendChild(tableContent);
    myTableDiv.appendChild(tableSection);
}

function safeSequenceTable(ch, tableName, tableId, divId) {
    const process = document.getElementById("numProcess").value;

    const myTableDiv = document.getElementById(divId);

    const tableSection = document.createElement('div');
    tableSection.className = 'table-section';

    const tableTitle = document.createElement('div');
    tableTitle.className = 'table-title';
    tableTitle.innerHTML = `<i class="fas fa-shield-check"></i> ${tableName}`;
    tableSection.appendChild(tableTitle);

    const tableContent = document.createElement('div');
    tableContent.className = 'table-content';

    const table = document.createElement('table');
    table.id = tableId;

    const tableBody = document.createElement('tbody');
    table.appendChild(tableBody);

    const tr = document.createElement('tr');
    tableBody.appendChild(tr);

    for (let i = 1; i <= process; i++) {
        const td = document.createElement('td');
        const input = document.createElement("input");
        input.type = "text";
        input.id = ch + i;
        input.placeholder = "0";
        input.disabled = true;
        td.appendChild(input);
        tr.appendChild(td);
    }

    tableContent.appendChild(table);
    tableSection.appendChild(tableContent);
    myTableDiv.appendChild(tableSection);
}

// Main functions - preserving original logic
function createTables() {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;

    if (!process || process < 1 || process > 10) {
        showToast('Please enter a valid number of processes (1-10)', 'error');
        return;
    }

    if (!resource || resource < 1 || resource > 10) {
        showToast('Please enter a valid number of resource types (1-10)', 'error');
        return;
    }

    showLoading();

    setTimeout(() => {
        try {
            cleanChilds('allTables');
            
            // Add Total Instances table (preserving original logic)
            columnTable('r', 'Total Instances', 'resourceTable', 'allTables');
            gridTable('a', 'Allocation Matrix', 'allocationTable', 'allTables');
            gridTable('m', 'Maximum Matrix', 'maximumTable', 'allTables');

            document.getElementById("createTables").disabled = true;
            document.getElementById("findNeed").disabled = false;
            document.getElementById("actionButtons").style.display = "grid";
            document.getElementById("progressContainer").style.display = "block";

            updateProgress(1);
            showToast('Tables created successfully! Please fill in the data.', 'success');
        } catch (error) {
            showToast('Error creating tables. Please try again.', 'error');
        } finally {
            hideLoading();
        }
    }, 500);
}

// Preserving original isValid logic exactly
function isValid() {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;

    for (let i = 1; i <= resource; i++) {
        const res = document.getElementById('r' + i).value;

        if (!res || isNaN(res) || res < 0) {
            return false;
        }

        let allocate1 = 0;

        for (let j = 1; j <= process; j++) {
            const allocate2 = document.getElementById('a' + j + i).value;
            const max = document.getElementById('m' + j + i).value;

            if (!allocate2 || !max || isNaN(allocate2) || isNaN(max) || allocate2 < 0 || max < 0) {
                return false;
            }

            allocate1 += Number(allocate2);

            if (Number(max) < Number(allocate2)) {
                return false;
            }
        }

        if (allocate1 > Number(res)) {
            return false;
        }
    }

    return true;
}

// Preserving original calculateNeed logic exactly
function calculateNeed() {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;

    for (let i = 1; i <= process; i++) {
        for (let j = 1; j <= resource; j++) {
            const max = Number(document.getElementById('m' + i + j).value);
            const allocate = Number(document.getElementById('a' + i + j).value);
            const need = max - allocate;
            document.getElementById('n' + i + j).value = need;
            document.getElementById('n' + i + j).disabled = true;
        }
    }
}

function findNeed() {
    if (isProcessing) return;

    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;

    if (!isValid()) {
        showToast('Invalid data! Please check your inputs.', 'error');
        return;
    }

    showLoading();

    setTimeout(() => {
        try {
            gridTable('n', 'Need Matrix', 'needTable', 'allTables');
            calculateNeed();

            const allTables = document.getElementById('allTables');
            
            // Preserving original detailed output logic
            for (let i = 1; i <= process; i++) {
                const data = document.createElement('div');
                data.className = 'result-item';
                data.id = 'needData' + i;

                let str = `Need (Process ${i}) = `;
                str += "Max (";

                for (let j = 1; j <= resource; j++) {
                    str += document.getElementById('m' + i + j).value;
                    if (j != resource)
                        str += ","
                    else
                        str += ") - ";
                }

                str += "Allocation (";

                for (let j = 1; j <= resource; j++) {
                    str += document.getElementById('a' + i + j).value;
                    if (j != resource)
                        str += ","
                    else
                        str += ") = (";
                }

                for (let j = 1; j <= resource; j++) {
                    str += document.getElementById('n' + i + j).value;
                    if (j != resource)
                        str += ","
                    else
                        str += ")";
                }

                data.innerHTML = `<h4>Process ${i} Need Calculation</h4><p>${str}</p>`;
                allTables.appendChild(data);
            }

            document.getElementById("findNeed").disabled = true;
            document.getElementById("findAvailable").disabled = false;
            updateProgress(2);
            showToast('Need matrix calculated successfully!', 'success');
        } catch (error) {
            showToast('Error calculating need matrix.', 'error');
        } finally {
            hideLoading();
        }
    }, 500);
}

// Preserving original calculateAvailable logic exactly
function calculateAvailable() {
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;

    for (let i = 1; i <= resource; i++) {
        const res = Number(document.getElementById('r' + i).value);
        let allocate = 0;

        for (let j = 1; j <= process; j++) {
            allocate += Number(document.getElementById('a' + j + i).value);
        }

        const available = res - allocate;
        document.getElementById('av' + i).value = available;
        document.getElementById('av' + i).disabled = true;
    }
}

function findAvailable() {
    if (isProcessing) return;

    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;

    if (!isValid()) {
        showToast('Invalid data! Please check your inputs.', 'error');
        return;
    }

    showLoading();

    setTimeout(() => {
        try {
            columnTable('av', 'Available Resources', 'availableTable', 'allTables');
            calculateAvailable();

            const allTables = document.getElementById('allTables');
            
            // Preserving original detailed output logic
            for (let j = 1; j <= resource; j++) {
                const data = document.createElement('div');
                data.className = 'result-item';
                data.id = 'availData' + j;

                let str = `Available (Resource ${String.fromCharCode("A".charCodeAt(0) + (j - 1))}) = Total (`;
                str += document.getElementById('r' + j).value + ") - Total allocated (";

                for (let i = 1; i <= process; i++) {
                    str += document.getElementById('a' + i + j).value;
                    if (i != process)
                        str += " + "
                    else
                        str += ") = ";
                }

                str += document.getElementById('av' + j).value;
                data.innerHTML = `<h4>Resource ${String.fromCharCode("A".charCodeAt(0) + (j - 1))} Available Calculation</h4><p>${str}</p>`;
                allTables.appendChild(data);
            }

            document.getElementById("findAvailable").disabled = true;
            document.getElementById("safeSequence").disabled = false;
            updateProgress(3);
            showToast('Available resources calculated successfully!', 'success');
        } catch (error) {
            showToast('Error calculating available resources.', 'error');
        } finally {
            hideLoading();
        }
    }, 500);
}

function reset() {
    if (isProcessing) return;

    showLoading();

    setTimeout(() => {
        try {
            cleanChilds('allTables');
            document.getElementById("createTables").disabled = false;
            document.getElementById("findNeed").disabled = true;
            document.getElementById("findAvailable").disabled = true;
            document.getElementById("safeSequence").disabled = true;
            document.getElementById("actionButtons").style.display = "none";
            document.getElementById("progressContainer").style.display = "none";
            document.getElementById("resultsPanel").style.display = "none";
            
            document.getElementById("numProcess").value = "";
            document.getElementById("numResource").value = "";
            
            currentStep = 1;
            updateProgress(1);
            showToast('Simulator reset successfully!', 'info');
        } catch (error) {
            showToast('Error resetting simulator.', 'error');
        } finally {
            hideLoading();
        }
    }, 300);
}

// Preserving original safetyAlgorithm logic exactly
function safetyAlgorithm(ch, tableName, tableId, divId) {
    const process = Number(document.getElementById("numProcess").value);
    const resource = Number(document.getElementById("numResource").value);

    // Read all data into local arrays
    let allocation = Array.from({ length: process }, () => Array(resource).fill(0));
    let max = Array.from({ length: process }, () => Array(resource).fill(0));
    let need = Array.from({ length: process }, () => Array(resource).fill(0));
    let available = Array(resource).fill(0);
    let finish = Array(process).fill(false);
    let safeSequence = [];

    for (let i = 0; i < process; i++) {
        for (let j = 0; j < resource; j++) {
            allocation[i][j] = Number(document.getElementById('a' + (i + 1) + (j + 1)).value);
            max[i][j] = Number(document.getElementById('m' + (i + 1) + (j + 1)).value);
            need[i][j] = Number(document.getElementById('n' + (i + 1) + (j + 1)).value);
        }
    }
    for (let j = 0; j < resource; j++) {
        available[j] = Number(document.getElementById('av' + (j + 1)).value);
    }

    // Banker's Algorithm simulation
    let count = 0;
    while (count < process) {
        let found = false;
        for (let i = 0; i < process; i++) {
            if (!finish[i]) {
                let canProceed = true;
                for (let j = 0; j < resource; j++) {
                    if (need[i][j] > available[j]) {
                        canProceed = false;
                        break;
                    }
                }
                if (canProceed) {
                    for (let j = 0; j < resource; j++) {
                        available[j] += allocation[i][j];
                    }
                    safeSequence.push(i + 1); // 1-based process index
                    finish[i] = true;
                    found = true;
                    count++;
                }
            }
        }
        if (!found) {
            return false;
        }
    }

    // Display the safe sequence in the DOM
    safeSequenceTable(ch, tableName, tableId, divId);
    for (let i = 1; i <= process; i++) {
        document.getElementById(ch + i).value = safeSequence[i - 1];
        document.getElementById(ch + i).disabled = true;
    }

    // Optionally, display the step-by-step explanation (optional, can be enhanced)
    const allTables = document.getElementById('allTables');
    for (let idx = 0; idx < safeSequence.length; idx++) {
        const i = safeSequence[idx] - 1;
        const data = document.createElement('div');
        data.className = 'result-item';
        let str = `Process ${i + 1} : Need (`;
        str += need[i].join(',') + ") <= Available (";
        // Calculate available before this process
        let availableBefore = Array.from({ length: resource }, (_, j) =>
            available[j] - allocation[i][j]
        );
        str += availableBefore.join(',') + ") -> New Available (";
        let availableAfter = Array.from({ length: resource }, (_, j) =>
            availableBefore[j] + allocation[i][j]
        );
        str += availableAfter.join(',') + ")";
        data.innerHTML = `<h4>Process ${i + 1} Safety Check</h4><p>${str}</p>`;
        allTables.appendChild(data);
    }
    return true;
}

function generateSafeSeq() {
    if (isProcessing) return;
    const process = document.getElementById("numProcess").value;
    const resource = document.getElementById("numResource").value;
    if (!isValid()) {
        showToast('Invalid data! Please check your inputs.', 'error');
        return;
    }
    showLoading();
    setTimeout(() => {
        try {
            // Remove previous need and available data displays
            for (let i = 1; i <= process; i++) {
                const data = document.getElementById('needData' + i);
                if (data) data.remove();
            }
            for (let i = 1; i <= resource; i++) {
                const data = document.getElementById('availData' + i);
                if (data) data.remove();
            }
            const resultsPanel = document.getElementById("resultsPanel");
            const resultsContent = document.getElementById("resultsContent");
            resultsContent.innerHTML = '';
            // Use the corrected safetyAlgorithm
            const isSafe = safetyAlgorithm('safe', 'Safe Sequence', 'safeSequence', 'allTables');
            if (!isSafe) {
                const unsafeDiv = document.createElement('div');
                unsafeDiv.className = 'unsafe-system';
                unsafeDiv.innerHTML = `
                    <h4><i class="fas fa-exclamation-triangle"></i> System is Unsafe!</h4>
                    <p>No safe sequence exists. Deadlock may occur.</p>
                `;
                resultsContent.appendChild(unsafeDiv);
                showToast('The system is not in safe state!', 'error');
                reset();
                return;
            } else {
                const safeDiv = document.createElement('div');
                safeDiv.className = 'safe-sequence';
                // Get the safe sequence from the table
                let seq = [];
                for (let i = 1; i <= process; i++) {
                    seq.push(document.getElementById('safe' + i).value);
                }
                safeDiv.innerHTML = `
                    <h4><i class="fas fa-check-circle"></i> System is Safe!</h4>
                    <p>Safe Sequence: ${seq.join(' → ')}</p>
                `;
                resultsContent.appendChild(safeDiv);
                resultsPanel.style.display = "block";
                updateProgress(4);
                showToast('Safety analysis completed! System is safe.', 'success');
            }
        } catch (error) {
            showToast('Error performing safety analysis.', 'error');
        } finally {
            hideLoading();
        }
    }, 1000);
}

function cleanChilds(elementId) {
    const element = document.getElementById(elementId);
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS for slideOut animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Show welcome message
    setTimeout(() => {
        showToast('Welcome to Banker\'s Algorithm Simulator!', 'info');
    }, 1000);
}); 