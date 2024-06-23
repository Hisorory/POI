document.addEventListener('DOMContentLoaded', function () {
    var statusFilter = document.getElementById('status-filter');
    var artFilter = document.getElementById('art-filter');
    var searchInput = document.querySelector('.search-wrapper input');
    var tags = document.querySelectorAll('.tags a');
    var tableRows = document.querySelectorAll('.topics-table tbody tr');
    var deleteButtons = document.querySelectorAll('.delete-btn');
    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);
    searchInput.addEventListener('input', filterTopics);
    tags.forEach(function (tag) { return tag.addEventListener('click', filterByTag); });
    deleteButtons.forEach(function (button) { return button.addEventListener('click', deleteRow); });
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
    function deleteRow(event) {
        var button = event.target;
        var row = button.closest('tr');
        if (row) {
            row.remove();
        }
    }
});
