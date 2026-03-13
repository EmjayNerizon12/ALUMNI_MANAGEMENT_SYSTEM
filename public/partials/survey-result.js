async function getAlumniList() {
    const container = document.getElementById('alumni-answer-table');
    container.innerHTML = '';

    const response = await fetch('/api-get-all-alumni');
    const data = await response.json();

    // Card container for table
    const card = document.createElement('div');
    card.classList.add('card', 'shadow-sm', 'border-0', 'mt-4');

    // Card header
    const cardHeader = document.createElement('div');
    cardHeader.classList.add('card-header', 'bg-primary', 'text-white', 'fw-bold');
    cardHeader.innerText = "Alumni Survey Responses";
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
            <th style="width:50px">No.</th>
            <th>Alumni Name</th>
            <th>Survey Response</th>
        </tr>
    `;
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center">No alumni found.</td></tr>`;
    } else {
        for (let i = 0; i < data.length; i++) {
            const alumni = data[i];
            const tr = document.createElement('tr');

            tr.innerHTML = `
                <th class="text-center">${i + 1}</th>
                <td>${alumni.fname} ${alumni.lname}</td>
            `;

            // Fetch survey answers asynchronously
            const surveyCell = document.createElement('td');
            const answersDiv = await fetchAnswers(alumni.alumni_id);
            surveyCell.appendChild(answersDiv);
            tr.appendChild(surveyCell);

            tbody.appendChild(tr);
        }
    }

    table.appendChild(tbody);
    tableWrapper.appendChild(table);
    cardBody.appendChild(tableWrapper);
    card.appendChild(cardBody);
    container.appendChild(card);
}

// Fetch survey answers
async function fetchAnswers(alumni_id) {
    const response = await fetch(`/api-get-all-survey_answers_by_alumni/${alumni_id}`);
    const data = await response.json();

    const container = document.createElement('div');
    container.classList.add('text-muted', 'small'); // Optional: smaller, gray text

    if (data.length === 0) {
        container.innerHTML = '<em>No answers submitted.</em>';
    } else {
        data.forEach((answer, index) => {
            container.innerHTML += `<strong>${index + 1}. ${answer.survey_question}:</strong> ${answer.answer}<br>`;
        });
    }

    return container;
}

// Load on page ready
document.addEventListener('DOMContentLoaded', getAlumniList);
