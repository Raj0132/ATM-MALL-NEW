/**
 * Exports an array of objects to a CSV file and triggers browser download.
 * @param {string} filename - The desired download file name.
 * @param {Array<object>} data - The dataset to export.
 * @param {Array<{ key: string, label: string }>} columns - Column definitions.
 */
export function exportToCsv(filename, data, columns) {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  // 1. Header row
  const header = columns.map((col) => `"${col.label.replace(/"/g, '""')}"`).join(',');

  // 2. Data rows
  const rows = data.map((row) => {
    return columns
      .map((col) => {
        let val = row[col.key];
        if (val === null || val === undefined) {
          val = '';
        } else if (typeof val === 'object') {
          val = JSON.stringify(val);
        } else {
          val = String(val);
        }
        // Escape quotes
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const csvContent = [header, ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
