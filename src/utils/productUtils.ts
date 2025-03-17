
export const downloadCSV = (data: any[], filename: string) => {
  // Convert object to CSV
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(obj => Object.values(obj).map(value => 
    typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
  ).join(','));
  const csv = [headers, ...rows].join('\n');
  
  // Create and download the file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.json`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
