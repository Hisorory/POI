document.addEventListener('DOMContentLoaded', function () {
    var statusFilter = document.getElementById('status-filter');
    var artFilter = document.getElementById('art-filter');
    var tableRows = document.querySelectorAll('.topics-table tbody tr');
    statusFilter.addEventListener('change', filterTopics);
    artFilter.addEventListener('change', filterTopics);
    function filterTopics() {
        var statusValue = statusFilter.value.toLowerCase();
        var artValue = artFilter.value.toLowerCase();
        tableRows.forEach(function (row) {
            var _a, _b, _c;
            if (row instanceof HTMLTableRowElement) {
                var statusElement = row.querySelector('.status');
                var statusText = statusElement ? (_a = statusElement.textContent) === null || _a === void 0 ? void 0 : _a.toLowerCase() : '';
                var artText = ((_c = (_b = row.cells[3]) === null || _b === void 0 ? void 0 : _b.textContent) === null || _c === void 0 ? void 0 : _c.toLowerCase()) || '';
                // @ts-ignore
                var statusMatches = statusValue === '' || (statusText && statusText.includes(statusValue));
                // @ts-ignore
                var artMatches = artValue === '' || artText.includes(artValue);
                if (statusMatches && artMatches) {
                    row.style.display = '';
                }
                else {
                    row.style.display = 'none';
                }
            }
        });
    }
});
