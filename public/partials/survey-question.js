
const addModal = new bootstrap.Modal(document.getElementById("addSurveyModal"));
const editModal = new bootstrap.Modal(document.getElementById("editSurveyModal"));

// Add Survey Question
async function addSurveyQuestion() {
    const surveyQuestion = document.getElementById('surveyQuestion').value.trim();

    if (surveyQuestion === "") {
        alert("Please enter a question.");
        return;
    }

    const response = await fetch('/api-store-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey_question: surveyQuestion })
    });

    const data = await response.json();
    console.log(data);

    document.getElementById('surveyQuestion').value = '';
    addModal.hide();
    getSurvey();
}

// Load Survey List
async function getSurvey() {
    const survey_list = document.getElementById('survey-list-table');

    // Loading spinner
    survey_list.innerHTML = `
        <div class="text-center my-4">
            <div class="spinner-border text-primary" role="status"></div>
        </div>
    `;

    const response = await fetch('/api-get-survey-question');
    const data = await response.json();

    if (data.length === 0) {
        survey_list.innerHTML = `
            <div class="alert alert-info text-center my-3">
                No survey questions found.
            </div>
        `;
        return;
    }

    let html = `
        <div class="card shadow-sm border-0 mt-4">
            <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 class="mb-0 fw-bold">Survey Questions</h5>
                 
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover table-bordered mb-0 align-middle">
	                        <thead class="table-primary">
                            <tr>
                                <th style="width: 50px">No.</th>
                                <th>Survey Question</th>
                                <th style="width: 160px" class="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
    `;

    data.forEach((survey, index) => {
        html += `
            <tr>
                <td class="fw-bold">${index + 1}</td>
                <td>${survey.survey_question}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm me-1"
                        onclick="showEditForm('${survey.survey_question_id}', 
                            '${survey.survey_question.replace(/'/g, "\\'")}')">
                        Edit
                    </button>
                </td>
            </tr>
        `;
    });

    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    survey_list.innerHTML = html;
}


// Show Edit Modal
function showEditForm(id, question) {
    document.getElementById('update_surveyId').value = id;
    document.getElementById('update_surveyQuestion').value = question;

    editModal.show();
}

// Update Survey Question
async function updateSurveyQuestion() {
    const survey_question = document.getElementById('update_surveyQuestion').value.trim();
    const survey_id = document.getElementById('update_surveyId').value;

    if (survey_question === "") {
        alert("Please enter a question.");
        return;
    }

    const response = await fetch('/api-update-survey', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ survey_question, survey_id })
    });

    editModal.hide();
    getSurvey();
}

document.addEventListener('DOMContentLoaded', getSurvey);

