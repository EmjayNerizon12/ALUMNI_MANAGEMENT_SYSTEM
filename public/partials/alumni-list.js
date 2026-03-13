// Initialize Bootstrap modal
const jobHistoryModal = new bootstrap.Modal(document.getElementById('jobHistoryModal'));

// Load Alumni List
async function getAlumniList() {
    const response = await fetch('/api-get-all-alumni');
    const data = await response.json();
    const container = document.getElementById('alumni-list-table');
    container.innerHTML = '';

    // Card container for table
    const card = document.createElement('div');
    card.classList.add('card', 'shadow-sm', 'border-0', 'mt-4');

    // Card header
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'bg-primary', 'text-white', 'd-flex', 'justify-content-between', 'align-items-center');
    cardHeader.innerHTML = `
        <h5 class="mb-0 fw-bold">Alumni List</h5>
    `;
    card.appendChild(cardHeader);

    // Card body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body', 'p-0');

    // Responsive table wrapper
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('table-responsive');

    // Table element
    const table = document.createElement('table');
    table.classList.add('table', 'table-hover', 'table-bordered', 'align-middle', 'mb-0');

    // Table header
    const thead = document.createElement('thead');
    thead.classList.add('table-primary');
    thead.innerHTML = `
        <tr>
            <th style="width: 50px">No.</th>
            <th>Alumni Name</th>
            <th>Contact Number</th>
            <th>Date Registered</th>
            <th style="width: 160px" class="text-center">Action</th>
        </tr>
    `;
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center">No alumni found.</td>
            </tr>
        `;
    } else {
        data.forEach((alumni, index) => {
            tbody.innerHTML += `
                <tr>
                    <th class="text-center">${index + 1}</th>
                    <td>${alumni.fname} ${alumni.lname}</td>
                    <td>${alumni.contact_no}</td>
                    <td>${getDate(alumni.created_at)}</td>
                    <td class="text-center">
                        <button class="btn btn-primary btn-sm" onclick="showJobHistoryModal(${alumni.alumni_id}, '${alumni.fname + ' ' + alumni.lname}')">
                            Alumni's Job
                        </button>
                    </td>
                </tr>
            `;
        });
    }

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    cardBody.appendChild(tableWrapper);
    card.appendChild(cardBody);

    container.appendChild(card);
}


// Show Job History in Modal
async function showJobHistoryModal(alumni_id, alumni_name) {
    const modalTitle = document.getElementById('jobHistoryTitle');
    const modalBody = document.getElementById('jobHistoryContent');

    modalTitle.textContent = `${alumni_name} - Job History`;
    modalBody.innerHTML = `<div class="text-center my-3"><div class="spinner-border text-primary" role="status"></div></div>`;

    const response = await fetch(`/api-get-all-job-history/${alumni_id}`);
    const data = await response.json();

    if (data.length === 0) {
        modalBody.innerHTML = `<div class="alert alert-info text-center">No job history found.</div>`;
    } else {
        let html = `
        <div class="table-responsive">
            <table class="table table-bordered table-striped table-hover align-middle">
                <thead class="table-primary">
                    <tr>
                        <th style="width: 50px">No.</th>
                        <th>Company Name</th>
                        <th>Position/Job Title</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                    </tr>
                </thead>
                <tbody>
        `;

        data.forEach((job, index) => {
            html += `
                <tr>
                    <th class="text-center">${index + 1}</th>
                    <td>${job.company_name}</td>
                    <td>${job.position}</td>
                    <td>${getDate(job.start_date)}</td>
                    <td>${job.end_date && job.end_date !== "0000-00-00" ? getDate(job.end_date) : "Present"}</td>
                </tr>
            `;
        });

        html += `</tbody></table></div>`;
        modalBody.innerHTML = html;
    }

    jobHistoryModal.show();
}

// Helper to format date
function getDate(dateValue) {
    const date = new Date(dateValue);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Load Alumni list on page load
document.addEventListener('DOMContentLoaded', getAlumniList);
