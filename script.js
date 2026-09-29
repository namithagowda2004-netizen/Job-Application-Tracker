let applications = [];
let editingId = null;

const savedApplications = localStorage.getItem("applications");

if (savedApplications) {
    applications = JSON.parse(savedApplications);
}

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

function saveApplications() {

    localStorage.setItem(
        "applications",
        JSON.stringify(applications)
    );
}

applicationForm.addEventListener("submit", function(event) {
    event.preventDefault();
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

    if (editingId === null) {
        applications.push(application);
    }

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
    saveApplications();

    displayApplications();

    updateDashboard();

    applicationForm.reset();

    applicationForm.querySelector(
        "button[type='submit']"
    ).textContent = "Add Application";
});

function displayApplications() {
    applicationList.innerHTML = "";
    const searchText =
        searchInput.value.trim().toLowerCase();

    const selectedStatus =
        statusFilter.value;

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

function editApplication(id) {
    const application =
        applications.find(function(item) {
            return item.id === id;
        });
    if (!application) {
        alert("Application not found.");
        return;
    }

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

    EditingId = id;

    applicationForm.querySelector(
        "button[type='submit']"
    ).textContent = "Update Application";
}

function deleteApplication(id) {

    const application =
        applications.find(function(item) {
            return item.id === id;
        });

        if (!application) {
        alert("Application not found.");
        return;
    }
    const confirmDelete =
        confirm(
            "Are you sure you want to delete this application?"
        );

    if (!confirmDelete) {
        return;
    }

    applications =
        applications.filter(function(item) {
            return item.id !== id;
        });

    saveApplications();

    displayApplications();

    updateDashboard();
}

searchInput.addEventListener(
    "input",
    function() {
        displayApplications();
    }
);

statusFilter.addEventListener(
    "change",
    function() {
        displayApplications();
    }
);

function updateDashboard() {

    totalApplications.textContent =
        applications.length;

    appliedCount.textContent =
        applications.filter(function(application) {
            return application.status === "Applied";
        }).length;

    interviewCount.textContent =
        applications.filter(function(application) {
            return application.status === "Interview";
        }).length;

    selectedCount.textContent =
        applications.filter(function(application) {
            return application.status === "Selected";
        }).length;

    rejectedCount.textContent =
        applications.filter(function(application) {
            return application.status === "Rejected";
        }).length;

    offerCount.textContent =
        applications.filter(function(application) {
            return application.status === "Offer";
        }).length;
}
displayApplications();
updateDashboard();