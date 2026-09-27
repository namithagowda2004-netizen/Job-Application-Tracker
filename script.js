let applications = [];
let editingId = null;


// ===============================
// LOAD DATA FROM LOCAL STORAGE
// ===============================

const savedApplications = localStorage.getItem("applications");

if (savedApplications) {
    applications = JSON.parse(savedApplications);
}


// ===============================
// GET HTML ELEMENTS
// ===============================

const applicationForm =
    document.getElementById("applicationForm");

const companyInput =
    document.getElementById("company");

const roleInput =
    document.getElementById("role");

const statusInput =
    document.getElementById("status");

const applicationDateInput =
    document.getElementById("applicationDate");

const followUpDateInput =
    document.getElementById("followUpDate");

const applicationList =
    document.getElementById("applicationList");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");


// Dashboard elements

const totalApplications =
    document.getElementById("totalApplications");

const appliedCount =
    document.getElementById("appliedCount");

const interviewCount =
    document.getElementById("interviewCount");

const selectedCount =
    document.getElementById("selectedCount");

const rejectedCount =
    document.getElementById("rejectedCount");

const offerCount =
    document.getElementById("offerCount");


// ===============================
// SAVE DATA
// ===============================

function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}


// ===============================
// ADD / UPDATE APPLICATION
// ===============================

applicationForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // Validation

    if (companyInput.value.trim() === "") {

        alert("Please enter company name.");

        companyInput.focus();

        return;
    }


    if (roleInput.value.trim() === "") {

        alert("Please enter job role.");

        roleInput.focus();

        return;
    }


    if (statusInput.value === "") {

        alert("Please select status.");

        statusInput.focus();

        return;
    }


    if (applicationDateInput.value === "") {

        alert("Please select application date.");

        applicationDateInput.focus();

        return;
    }


    // Create application object

    const application = {

        id: editingId !== null
            ? editingId
            : Date.now(),

        company: companyInput.value.trim(),

        role: roleInput.value.trim(),

        status: statusInput.value,

        applicationDate:
            applicationDateInput.value,

        followUpDate:
            followUpDateInput.value
    };


    // Add new application

    if (editingId === null) {

        applications.push(application);

    }


    // Update existing application

    else {

        const index =
            applications.findIndex(function(item) {

                return item.id === editingId;

            });


        if (index !== -1) {

            applications[index] = application;

        }


        editingId = null;
    }


    // Save

    saveApplications();


    // Update table

    displayApplications();


    // Update dashboard

    updateDashboard();


    // Clear form

    applicationForm.reset();


    // Reset button

    applicationForm.querySelector(
        "button[type='submit']"
    ).textContent = "Add Application";

});


// ===============================
// DISPLAY APPLICATIONS
// ===============================

function displayApplications() {

    applicationList.innerHTML = "";


    const searchText =
        searchInput.value.trim().toLowerCase();


    const selectedStatus =
        statusFilter.value;


    // Search and Filter

    const filteredApplications =
        applications.filter(function(application) {

            const company =
                application.company.toLowerCase();

            const role =
                application.role.toLowerCase();


            const matchesSearch =
                company.includes(searchText) ||
                role.includes(searchText);


            const matchesStatus =
                selectedStatus === "All" ||
                application.status === selectedStatus;


            return matchesSearch && matchesStatus;

        });


    // No applications found

    if (filteredApplications.length === 0) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td colspan="6" class="empty-message">
                No applications found.
            </td>
        `;


        applicationList.appendChild(row);

        return;
    }


    // Display applications

    filteredApplications.forEach(
        function(application) {

            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>
                    ${application.company}
                </td>

                <td>
                    ${application.role}
                </td>

                <td>

                    <span class="status ${application.status.toLowerCase()}">

                        ${application.status}

                    </span>

                </td>

                <td>
                    ${application.applicationDate}
                </td>

                <td>
                    ${application.followUpDate}
                </td>

                <td>

                    <button
                        onclick="editApplication(${application.id})">
                        Edit
                    </button>

                    <button
                        onclick="deleteApplication(${application.id})">
                        Delete
                    </button>

                </td>
            `;


            applicationList.appendChild(row);

        }
    );
}


// ===============================
// EDIT APPLICATION
// ===============================

function editApplication(id) {

    const application =
        applications.find(function(item) {

            return item.id === id;

        });


    if (!application) {

        alert("Application not found.");

        return;
    }


    // Put existing data into form

    companyInput.value =
        application.company;

    roleInput.value =
        application.role;

    statusInput.value =
        application.status;

    applicationDateInput.value =
        application.applicationDate;

    followUpDateInput.value =
        application.followUpDate;


    // Store ID

    editingId = id;


    // Change button text

    applicationForm.querySelector(
        "button[type='submit']"
    ).textContent = "Update Application";

}


// ===============================
// DELETE APPLICATION
// ===============================

function deleteApplication(id) {

    const application =
        applications.find(function(item) {

            return item.id === id;

        });


    if (!application) {

        alert("Application not found.");

        return;
    }


    // Confirmation

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmDelete) {

        return;
    }


    // Delete

    applications =
        applications.filter(function(item) {

            return item.id !== id;

        });


    // Save

    saveApplications();


    // Update table

    displayApplications();


    // Update dashboard

    updateDashboard();

}


// ===============================
// SEARCH
// ===============================

searchInput.addEventListener(
    "input",
    function() {

        displayApplications();

    }
);


// ===============================
// FILTER
// ===============================

statusFilter.addEventListener(
    "change",
    function() {

        displayApplications();

    }
);


// ===============================
// UPDATE DASHBOARD
// ===============================

function updateDashboard() {


    // Total Applications

    totalApplications.textContent =
        applications.length;


    // Applied

    appliedCount.textContent =
        applications.filter(function(application) {

            return application.status === "Applied";

        }).length;


    // Interview

    interviewCount.textContent =
        applications.filter(function(application) {

            return application.status === "Interview";

        }).length;


    // Selected

    selectedCount.textContent =
        applications.filter(function(application) {

            return application.status === "Selected";

        }).length;


    // Rejected

    rejectedCount.textContent =
        applications.filter(function(application) {

            return application.status === "Rejected";

        }).length;


    // Offer

    offerCount.textContent =
        applications.filter(function(application) {

            return application.status === "Offer";

        }).length;

}


// ===============================
// INITIAL DISPLAY
// ===============================

displayApplications();

updateDashboard();