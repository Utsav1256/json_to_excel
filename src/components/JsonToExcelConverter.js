import React, { useState } from 'react';
import * as XLSX from 'xlsx';

function JsonToExcelConverter() {
    const [downloadUrl, setDownloadUrl] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                try {
                    // Parse the JSON data
                    const json = JSON.parse(content);
                    convertJsonToExcel(json);
                } catch (error) {
                    console.error('Error parsing JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    const convertJsonToExcel = (jsonData) => {
        try {
            // Flatten the JSON data for Excel
            const flatData = jsonData.map(item => ({
                tokenID: item.edition,
                file_name: item.name,
                description: item.description,
                external_url: item.image,
                ...item.attributes.reduce((acc, attr) => ({
                    ...acc,
                    [`attributes[${attr.trait_type}]`]: attr.value
                }), {})
            }));
            
            // Create a new workbook
            const workbook = XLSX.utils.book_new();
            // Convert JSON to worksheet
            const worksheet = XLSX.utils.json_to_sheet(flatData);
            // Append worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
            // Write workbook to binary array
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            // Create a Blob object
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });
            // Create download URL
            const url = window.URL.createObjectURL(blob);
            setDownloadUrl(url);
        } catch (error) {
            console.error('Error generating Excel file:', error);
        }
    };

    return (
        <div>
            <input type="file" accept=".json" onChange={handleFileChange} />
            <br />
            {downloadUrl && <a href={downloadUrl} download="data.xlsx">Download Excel file</a>}
        </div>
    );
}

export default JsonToExcelConverter;
