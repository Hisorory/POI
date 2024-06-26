"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
document.addEventListener('DOMContentLoaded', function () {
    var _a, _b, _c;
    var statusFilter = document.getElementById('status-filter');
    var artFilter = document.getElementById('art-filter');
    var searchInput = document.querySelector('.search-wrapper input');
    var tags = document.querySelectorAll('.tags a');
    var topicsTable = document.getElementById('topics-table');
    var filterButton = document.querySelector('.filter-btn');
    var filterModal = document.getElementById('filter-modal');
    var saveButton = document.querySelector('.save-btn');
    var addButton = document.querySelector('.add-btn');
    var modal = document.querySelector('.modal');
    var titleInput = document.getElementById('title');
    var authorInput = document.getElementById('author');
    var statusInput = document.getElementById('status-filter-modal');
    var typeInput = document.getElementById('art-filter-modal');
    var sectionsContainer = document.querySelector('.sections-container');
    var tagContainer = document.querySelector('.tag-container');
    var closeButton = document.querySelector('.close-btn');
    var fileInput = document.getElementById('file-input');
    var placeholderImg = document.getElementById('placeholder-img');
    var editingRow = null;
    var uploadedImageUrl = '';
    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);
    searchInput.addEventListener('input', filterTopics);
    tags.forEach(function (tag) { return tag.addEventListener('click', filterByTag); });
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
    addButton.addEventListener('click', function () {
        modal.style.display = 'block';
        editingRow = null;
        resetForm();
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
        if (!statusInput.value.trim()) {
            isValid = false;
            errorMessage += 'Bitte wählen Sie einen Status aus.\n';
        }
        if (!typeInput.value.trim()) {
            isValid = false;
            errorMessage += 'Bitte wählen Sie eine Art aus.\n';
        }
        var statusValue = statusInput.value || 'Entwurf';
        var typeValue = typeInput.value || 'Bachelor';
        var sections = Array.from(sectionsContainer.querySelectorAll('.section')).map(function (section) {
            var title = section.querySelector('.modal-input').value.trim();
            var content = section.querySelector('.modal-textarea').value.trim();
            return { title: title, content: content };
        }).filter(function (section) { return section.title || section.content; });
        var tags = Array.from(tagContainer.querySelectorAll('.tag-item')).map(function (tagItem) {
            var tag = tagItem.querySelector('.tag-input').value.trim();
            return tag;
        }).filter(function (tag) { return tag; });
        if (isValid) {
            var title = titleInput.value.trim();
            var author = authorInput.value.trim();
            var imageUrl = uploadedImageUrl || '../Bilder/placeholder.png'; // Use placeholder image if no image uploaded
            var topic = { id: '', title: title, status: statusValue, type: typeValue, author: author, imageUrl: imageUrl, sections: sections, tags: tags };
            if (editingRow) {
                // Update existing topic
                topic.id = editingRow.dataset.id;
                updateTopicInTable(editingRow, topic);
                updateTopicInLocalStorage(topic.id, topic);
            }
            else {
                // Add new topic
                topic.id = new Date().getTime().toString();
                addTopicToTable(topic);
                saveToLocalStorage(topic);
            }
            modal.style.display = 'none';
            resetForm();
        }
        else {
            alert(errorMessage);
        }
    });
    // Close button event listener for the modal
    closeButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
    // Add event listener for the add-section button
    (_b = document.querySelector('.add-section-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', addSection);
    // Add event listener for the add-tag button
    (_c = document.querySelector('.add-tag-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', addTag);
    // Event listener for the image upload
    placeholderImg.addEventListener('click', function () {
        fileInput.click();
    });
    fileInput.addEventListener('change', handleFileUpload);
    loadTopicsFromLocalStorage();
    function filterTopics() {
        var statusValue = statusFilter.value.toLowerCase();
        var artValue = artFilter.value.toLowerCase();
        var searchValue = searchInput.value.toLowerCase();
        var rows = topicsTable.querySelectorAll('tbody tr');
        rows.forEach(function (row) {
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
    function deleteRow(event) {
        var button = event.target;
        var row = button.closest('tr');
        if (row) {
            var id = row.dataset.id;
            row.remove();
            removeFromLocalStorage(id);
        }
        event.stopPropagation();
    }
    function editRow(event) {
        var _a;
        var button = event.target;
        var row = button.closest('tr');
        if (row) {
            var title = row.cells[1].textContent;
            var status_1 = (_a = row.querySelector('.status')) === null || _a === void 0 ? void 0 : _a.textContent;
            var type = row.cells[3].textContent;
            var author = row.dataset.author;
            var imageUrl = row.dataset.imageUrl || '../Bilder/placeholder.png'; // Use placeholder if no imageUrl
            var sections = JSON.parse(row.dataset.sections || '[]');
            var tags_1 = JSON.parse(row.dataset.tags || '[]');
            titleInput.value = title;
            authorInput.value = author;
            statusInput.value = status_1;
            typeInput.value = type;
            placeholderImg.src = imageUrl;
            uploadedImageUrl = imageUrl;
            sectionsContainer.innerHTML = '';
            sections.forEach(function (section) { return addSection(section.title, section.content); });
            if (sections.length === 0) {
                addSection();
            }
            tagContainer.innerHTML = '';
            tags_1.forEach(function (tag) { return addTag(tag); });
            if (tags_1.length === 0) {
                addTag();
            }
            modal.style.display = 'block';
            editingRow = row;
        }
        event.stopPropagation();
    }
    function showDetailModal(row) {
        var _a;
        var title = row.cells[1].textContent;
        var author = row.dataset.author;
        var status = (_a = row.querySelector('.status')) === null || _a === void 0 ? void 0 : _a.textContent;
        var type = row.cells[3].textContent;
        var description = "Lorem ipsum dolor sit amet...";
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
        var author = row.dataset.author;
        var status = (_a = row.querySelector('.status')) === null || _a === void 0 ? void 0 : _a.textContent;
        var type = row.cells[3].textContent;
        var description = "Lorem ipsum dolor sit amet...";
        var jsPDF = window.jspdf.jsPDF;
        var doc = new jsPDF();
        doc.text("Titel: ".concat(title), 10, 10);
        doc.text("Autor: ".concat(author), 10, 20);
        doc.text("Status: ".concat(status), 10, 30);
        doc.text("Typ: ".concat(type), 10, 40);
        doc.text("Beschreibung: ".concat(description), 10, 50);
        doc.save("".concat(title, ".pdf"));
    }
    function addTopicToTable(topic) {
        var _a, _b, _c;
        var statusClass = topic.status.toLowerCase() === 'vollständig' ? 'complete' : topic.status.toLowerCase() === 'vergeben' ? 'assigned' : 'draft';
        var newRow = document.createElement('tr');
        newRow.dataset.id = topic.id;
        newRow.dataset.author = topic.author;
        newRow.dataset.imageUrl = topic.imageUrl;
        newRow.dataset.sections = JSON.stringify(topic.sections);
        newRow.dataset.tags = JSON.stringify(topic.tags);
        newRow.innerHTML = "\n            <td><input type=\"checkbox\"></td>\n            <td>".concat(topic.title, "</td>\n            <td><span class=\"status ").concat(statusClass, "\">").concat(topic.status, "</span></td>\n            <td>").concat(topic.type, "</td>\n            <td>\n                <button class=\"edit-btn\"><img src=\"../Bilder/edit-icon.png\" alt=\"Edit\"></button>\n                <button class=\"delete-btn\"><img src=\"../Bilder/delete-icon.png\" alt=\"Delete\"></button>\n            </td>\n        ");
        (_a = topicsTable.querySelector('tbody')) === null || _a === void 0 ? void 0 : _a.appendChild(newRow);
        (_b = newRow.querySelector('.delete-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', deleteRow);
        (_c = newRow.querySelector('.edit-btn')) === null || _c === void 0 ? void 0 : _c.addEventListener('click', editRow);
        newRow.addEventListener('click', function () { return showDetailModal(newRow); });
    }
    function updateTopicInTable(row, topic) {
        row.cells[1].textContent = topic.title;
        var statusElement = row.querySelector('.status');
        statusElement.textContent = topic.status;
        statusElement.className = "status ".concat(getStatusClass(topic.status));
        row.cells[3].textContent = topic.type;
        row.dataset.author = topic.author;
        row.dataset.imageUrl = topic.imageUrl;
        row.dataset.sections = JSON.stringify(topic.sections);
        row.dataset.tags = JSON.stringify(topic.tags);
    }
    function saveToLocalStorage(topic) {
        var topics = JSON.parse(localStorage.getItem('topics') || '[]');
        topics.push(topic);
        localStorage.setItem('topics', JSON.stringify(topics));
    }
    function updateTopicInLocalStorage(id, updatedTopic) {
        var topics = JSON.parse(localStorage.getItem('topics') || '[]');
        var index = topics.findIndex(function (topic) { return topic.id === id; });
        if (index !== -1) {
            topics[index] = __assign({ id: id }, updatedTopic);
            localStorage.setItem('topics', JSON.stringify(topics));
        }
    }
    function removeFromLocalStorage(id) {
        var topics = JSON.parse(localStorage.getItem('topics') || '[]');
        var updatedTopics = topics.filter(function (topic) { return topic.id !== id; });
        localStorage.setItem('topics', JSON.stringify(updatedTopics));
    }
    function loadTopicsFromLocalStorage() {
        var topics = JSON.parse(localStorage.getItem('topics') || '[]');
        topics.forEach(function (topic) {
            addTopicToTable(topic);
        });
    }
    function resetForm() {
        resetImagePlaceholder();
        titleInput.value = ''; // Clear the title input
        authorInput.value = ''; // Clear the author input
        statusInput.value = ''; // Clear the status input
        typeInput.value = ''; // Clear the type input
        sectionsContainer.innerHTML = ''; // Clear all sections
        addSection(); // Add initial section
        tagContainer.innerHTML = ''; // Clear all tags
        addTag(); // Add initial tag
        uploadedImageUrl = ''; // Reset uploaded image URL
    }
    function resetImagePlaceholder() {
        var placeholderSrc = '../Bilder/placeholder.png'; // Original placeholder image source
        placeholderImg.src = placeholderSrc; // Reset the image to the placeholder
        fileInput.value = ''; // Clear the file input
    }
    function addSection(title, content) {
        var _a;
        if (title === void 0) { title = ''; }
        if (content === void 0) { content = ''; }
        var section = document.createElement('div');
        section.classList.add('section');
        section.innerHTML = "\n            <div class=\"section-header\">\n                <button class=\"add-section-btn\">+</button>\n                <input type=\"text\" class=\"modal-input\" placeholder=\"Abschnitt Titel hinzuf\u00FCgen\" value=\"".concat(title, "\">\n            </div>\n            <textarea class=\"modal-textarea large-textarea\" placeholder=\"Abschnitt hinzuf\u00FCgen\">").concat(content, "</textarea>\n        ");
        (_a = section.querySelector('.add-section-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addSection);
        sectionsContainer.appendChild(section);
    }
    function addTag(tag) {
        var _a;
        if (tag === void 0) { tag = ''; }
        var tagItem = document.createElement('div');
        tagItem.classList.add('tag-item');
        tagItem.innerHTML = "\n            <button class=\"add-tag-btn\">+</button>\n            <input type=\"text\" class=\"tag-input\" placeholder=\"Tag hinzuf\u00FCgen\" value=\"".concat(tag, "\">\n        ");
        (_a = tagItem.querySelector('.add-tag-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', addTag);
        tagContainer.appendChild(tagItem);
    }
    function getStatusClass(status) {
        switch (status.toLowerCase()) {
            case 'vollständig':
                return 'complete';
            case 'vergeben':
                return 'assigned';
            default:
                return 'draft';
        }
    }
    function handleFileUpload() {
        var _a;
        var file = (_a = fileInput.files) === null || _a === void 0 ? void 0 : _a[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var _a;
                uploadedImageUrl = (_a = e.target) === null || _a === void 0 ? void 0 : _a.result;
                placeholderImg.src = uploadedImageUrl;
            };
            reader.readAsDataURL(file);
        }
        else {
            resetImagePlaceholder();
        }
    }
});
