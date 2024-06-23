document.addEventListener('DOMContentLoaded', function () {
    var statusFilter = document.getElementById('status-filter');
    var artFilter = document.getElementById('art-filter');
    var searchInput = document.querySelector('.search-wrapper input');
    var tags = document.querySelectorAll('.tags a');
    var tableRows = document.querySelectorAll('.topics-table tbody tr');
    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);
    searchInput.addEventListener('input', filterTopics);
    tags.forEach(function (tag) { return tag.addEventListener('click', filterByTag); });
    function filterTopics() {
        var statusValue = statusFilter.value.toLowerCase();
        var artValue = artFilter.value.toLowerCase();
        var searchValue = searchInput.value.toLowerCase();
        tableRows.forEach(function (row) {
            var _a, _b, _c, _d, _e;
            if (row instanceof HTMLTableRowElement) {
                var statusElement = row.querySelector('.status');
                var statusText = statusElement ? (_a = statusElement.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase() : '';
                var artText = ((_c = (_b = row.cells[3]) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
                var topicText = ((_e = (_d = row.cells[1]) === null || _d === void 0 ? void 0 : _d.textContent) === null || _e === void 0 ? void 0 : _e.toLowerCase()) || '';
                // @ts-ignore
                var statusMatches = statusValue === '' || (statusText && statusText.includes(statusValue));
                // @ts-ignore
                var artMatches = artValue === '' || artText.includes(artValue);
                // @ts-ignore
                var searchMatches = searchValue === '' || topicText.includes(searchValue);
                if (statusMatches && artMatches && searchMatches) {
                    row.style.display = '';
                }
                else {
                    row.style.display = 'none';
                }
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
document.addEventListener('DOMContentLoaded', function () {
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
                placeholderImg.src = e.target.result;
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
            // @ts-ignore
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
    function addTopicToTable(title, status, type) {
        var statusClass = status.toLowerCase() === 'vollständig' ? 'complete' : status.toLowerCase() === 'vergeben' ? 'assigned' : 'draft';
        // Use default empty values if no valid status or type provided
        var displayStatus = status || '';
        var displayType = type || '';
        var newRow = document.createElement('tr');
        newRow.innerHTML = "\n            <td><input type=\"checkbox\"></td>\n            <td>".concat(title, "</td>\n            <td><span class=\"status ").concat(statusClass, "\">").concat(displayStatus, "</span></td>\n            <td>").concat(displayType, "</td>\n            <td>\n                <button class=\"edit-btn\"><img src=\"../Bilder/edit-icon.png\" alt=\"Edit\"></button>\n                <button class=\"delete-btn\"><img src=\"../Bilder/delete-icon.png\" alt=\"Delete\"></button>\n            </td>\n        ");
        topicsTable.querySelector('tbody').appendChild(newRow);
    }
    function resetForm() {
        placeholderImg.src = placeholderSrc; // Reset the image to the placeholder
        fileInput.value = ''; // Clear the file input
        titleInput.value = ''; // Clear the title input
        authorInput.value = ''; // Clear the author input
        // @ts-ignore
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
