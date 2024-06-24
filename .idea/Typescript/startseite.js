"use strict";
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    var statusFilter = document.getElementById('status-filter');
    var artFilter = document.getElementById('art-filter');
    var searchInput = document.querySelector('.search-wrapper input');
    var tags = document.querySelectorAll('.tags a');
    var tableRows = document.querySelectorAll('.topics-table tbody tr');
    var deleteButtons = document.querySelectorAll('.delete-btn');
    var detailModal = document.getElementById('detail-modal');
    var closeButton = detailModal.querySelector('.close-btn');
    var downloadButtons = document.querySelectorAll('.download-icon');
    var filterButton = document.querySelector('.filter-btn');
    var filterModal = document.getElementById('filter-modal');
    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);
    searchInput.addEventListener('input', filterTopics);
    tags.forEach(function (tag) { return tag.addEventListener('click', filterByTag); });
    deleteButtons.forEach(function (button) { return button.addEventListener('click', deleteRow); });
    downloadButtons.forEach(function (button) { return button.addEventListener('click', downloadPDF); });
    filterButton.addEventListener('click', function () {
        filterModal.style.display = 'block';
    });
    (_a = document.getElementById('filter-close-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        filterModal.style.display = 'none';
    });
    window.addEventListener('click', function (event) {
        if (event.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });
    tableRows.forEach(function (row) {
        row.addEventListener('click', function (event) {
            showDetailModal(row);
        });
    });
    closeButton.addEventListener('click', function () {
        detailModal.style.display = 'none';
    });
    window.addEventListener('click', function (event) {
        if (event.target === detailModal) {
            detailModal.style.display = 'none';
        }
    });
    function filterTopics() {
        var statusValue = statusFilter.value.toLowerCase();
        var artValue = artFilter.value.toLowerCase();
        var searchValue = searchInput.value.toLowerCase();
        tableRows.forEach(function (row) {
            var _a, _b, _c, _d, _e, _f;
            var status = ((_b = (_a = row.querySelector('.status')) === null || _a === void 0 ? void 0 : _a.textContent) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || '';
            var art = ((_d = (_c = row.cells[3]) === null || _c === void 0 ? void 0 : _c.textContent) === null || _d === void 0 ? void 0 : _d.toLowerCase()) || '';
            var title = ((_f = (_e = row.cells[1]) === null || _e === void 0 ? void 0 : _e.textContent) === null || _f === void 0 ? void 0 : _f.toLowerCase()) || '';
            var matchesStatus = !statusValue || status.includes(statusValue);
            var matchesArt = !artValue || art.includes(artValue);
            var matchesSearch = !searchValue || title.includes(searchValue);
            if (matchesStatus && matchesArt && matchesSearch) {
                row.style.display = '';
            }
            else {
                row.style.display = 'none';
            }
        });
    }
    function filterByTag(event) {
        var _a;
        var tag = ((_a = event.target.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase()) || '';
        searchInput.value = tag;
        filterTopics();
    }
});
function deleteRow(event) {
    var button = event.target;
    var row = button.closest('tr');
    if (row) {
        row.remove();
    }
    event.stopPropagation();
}
function showDetailModal(row) {
    var _a;
    var title = row.cells[1].textContent;
    var author = "max.mustermann@gmail.com"; // Replace with actual author data
    var status = (_a = row.querySelector('.status')) === null || _a === void 0 ? void 0 : _a.textContent;
    var type = row.cells[3].textContent;
    var description = "Lorem ipsum dolor sit amet..."; // Replace with actual description
    var modalTitle = document.getElementById('modal-title');
    var modalAuthor = document.getElementById('modal-author');
    var modalStatus = document.getElementById('modal-status');
    var modalType = document.getElementById('modal-type');
    var modalDescription = document.getElementById('modal-description');
    modalTitle.textContent = title;
    modalAuthor.textContent = "Autor: ".concat(author);
    modalStatus.textContent = "Status: ".concat(status);
    modalType.textContent = "Typ: ".concat(type);
    modalDescription.textContent = "Beschreibung: ".concat(description);
    var modal = document.getElementById('detail-modal');
    modal.style.display = 'block';
}
function downloadPDF(event) {
    var _a;
    var row = event.target.closest('tr');
    if (!row)
        return;
    var title = row.cells[1].textContent;
    var author = "max.mustermann@gmail.com"; // Replace with actual author data
    var status = (_a = row.querySelector('.status')) === null || _a === void 0 ? void 0 : _a.textContent;
    var type = row.cells[3].textContent;
    var description = "Lorem ipsum dolor sit amet..."; // Replace with actual description
    var jsPDF = window.jspdf.jsPDF;
    var doc = new jsPDF();
    doc.text("Titel: ".concat(title), 10, 10);
    doc.text("Autor: ".concat(author), 10, 20);
    doc.text("Status: ".concat(status), 10, 30);
    doc.text("Typ: ".concat(type), 10, 40);
    doc.text("Beschreibung: ".concat(description), 10, 50);
    doc.save("".concat(title, ".pdf"));
}
document.addEventListener('DOMContentLoaded', function () {
    var _a;
    var addButton = document.querySelector('.add-btn');
    var closeButton = document.querySelector('.close-btn');
    var modal = document.querySelector('.modal');
    var sectionsContainer = document.querySelector('.sections-container');
    var tagContainer = document.querySelector('.tag-container');
    var placeholderImg = document.getElementById('placeholder-img');
    var fileInput = document.getElementById('file-input');
    var saveButton = document.querySelector('.save-btn');
    var titleInput = document.getElementById('title');
    var authorInput = document.getElementById('author');
    var topicsTable = document.getElementById('topics-table');
    var filterButton = document.querySelector('.filter-btn');
    var filterModal = document.getElementById('filter-modal');
    var placeholderSrc = placeholderImg.src; // Store the original placeholder image source
    addButton.addEventListener('click', function () {
        modal.style.display = 'block';
    });
    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
        resetForm();
    });
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            resetForm();
        }
    });
    placeholderImg.addEventListener('click', function () {
        fileInput.click();
    });
    fileInput.addEventListener('change', function (event) {
        var file = event.target.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                placeholderImg.src = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
            };
            reader.readAsDataURL(file);
        }
    });
    saveButton.addEventListener('click', function () {
        var isValid = true;
        var errorMessage = '';
        if (!titleInput.value.trim()) {
            isValid = false;
            errorMessage += 'Bitte füllen Sie den Titel aus.\n';
        }
        if (!authorInput.value.trim()) {
            isValid = false;
            errorMessage += 'Bitte füllen Sie den Autor aus.\n';
        }
        var tagInputs = document.querySelectorAll('.tag-input');
        var statusValue = '';
        var typeValue = '';
        tagInputs.forEach(function (input) {
            var value = input.value.trim();
            if (value === 'Entwurf' || value === 'Vollständig' || value === 'Vergeben') {
                statusValue = value;
            }
            if (value === 'Bachelor' || value === 'Master') {
                typeValue = value;
            }
        });
        if (isValid) {
            addTopicToTable(titleInput.value.trim(), statusValue, typeValue);
            modal.style.display = 'none';
            resetForm();
        }
        else {
            alert(errorMessage);
        }
    });
    filterButton.addEventListener('click', function () {
        filterModal.style.display = 'block';
    });
    (_a = document.getElementById('filter-close-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
        filterModal.style.display = 'none';
    });
    window.addEventListener('click', function (event) {
        if (event.target === filterModal) {
            filterModal.style.display = 'none';
        }
    });
    function addTopicToTable(title, status, type) {
        var _a, _b;
        var statusClass = status.toLowerCase() === 'vollständig' ? 'complete' : status.toLowerCase() === 'vergeben' ? 'assigned' : 'draft';
        var displayStatus = status || '';
        var displayType = type || '';
        var newRow = document.createElement('tr');
        newRow.innerHTML = "\n            <td><input type=\"checkbox\"></td>\n            <td>".concat(title, "</td>\n            <td><span class=\"status ").concat(statusClass, "\">").concat(displayStatus, "</span></td>\n            <td>").concat(displayType, "</td>\n            <td>\n                <button class=\"edit-btn\"><img src=\"../Bilder/edit-icon.png\" alt=\"Edit\"></button>\n                <button class=\"delete-btn\"><img src=\"../Bilder/delete-icon.png\" alt=\"Delete\"></button>\n            </td>\n        ");
        (_a = topicsTable.querySelector('tbody')) === null || _a === void 0 ? void 0 : _a.appendChild(newRow);
        (_b = newRow.querySelector('.delete-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteRow);
        newRow.addEventListener('click', function () { return showDetailModal(newRow); });
    }
    function resetForm() {
        placeholderImg.src = placeholderSrc; // Reset the image to the placeholder
        fileInput.value = ''; // Clear the file input
        titleInput.value = ''; // Clear the title input
        authorInput.value = ''; // Clear the author input
        document.querySelectorAll('.tag-input').forEach(function (input) { return input.value = ''; }); // Clear all tag inputs
    }
    function addSection() {
        var section = document.createElement('div');
        section.className = 'section';
        var sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        var addSectionButton = document.createElement('button');
        addSectionButton.className = 'add-section-btn';
        addSectionButton.textContent = '+';
        addSectionButton.addEventListener('click', addSection);
        var sectionTitleInput = document.createElement('input');
        sectionTitleInput.type = 'text';
        sectionTitleInput.className = 'modal-input';
        sectionTitleInput.placeholder = 'Abschnitt Titel hinzufügen';
        sectionHeader.appendChild(addSectionButton);
        sectionHeader.appendChild(sectionTitleInput);
        var textArea = document.createElement('textarea');
        textArea.className = 'modal-textarea large-textarea';
        textArea.placeholder = 'Abschnitt hinzufügen';
        section.appendChild(sectionHeader);
        section.appendChild(textArea);
        sectionsContainer.appendChild(section);
    }
    function addTag() {
        var tagItem = document.createElement('div');
        tagItem.className = 'tag-item';
        var addTagButton = document.createElement('button');
        addTagButton.className = 'add-tag-btn';
        addTagButton.textContent = '+';
        addTagButton.addEventListener('click', addTag);
        var tagInput = document.createElement('input');
        tagInput.type = 'text';
        tagInput.className = 'tag-input';
        tagInput.placeholder = 'Tag hinzufügen';
        tagItem.appendChild(addTagButton);
        tagItem.appendChild(tagInput);
        tagContainer.appendChild(tagItem);
    }
    // Add initial section and tag
    addSection();
    addTag();
});
