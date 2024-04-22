import React, { useState } from "react";
import * as XLSX from "xlsx";

function JsonToExcelConverter() {
  const [downloadUrl, setDownloadUrl] = useState("");

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
          console.error("Error parsing JSON:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const convertJsonToExcel = (jsonData) => {
    try {
      // Flatten the JSON data for Excel
      const flatData = jsonData.map((item, index) => ({
        tokenID: item.edition,
        name: item.name,
        description: item.description,
        file_name: `${index + 1}.png`,
        external_url: "https://example.com",
        ...item.attributes.reduce(
          (acc, attr) => ({
            ...acc,
            [`attributes[${attr.trait_type}]`]: attr.value,
          }),
          {}
        ),
      }));

      // Create a new workbook
      const workbook = XLSX.utils.book_new();
      // Convert JSON to worksheet
      const worksheet = XLSX.utils.json_to_sheet(flatData);
      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
      // Write workbook to binary array
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      // Create a Blob object
      const blob = new Blob([excelBuffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
      });
      // Create download URL
      const url = window.URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  return (
    <div className="w-full h-full bg-slate-700 flex flex-col items-center justify-center text-xl ">
      <h2 className="text-white text-3xl font-bold mb-6">
        convert .json to .xlsx(excel)
      </h2>
      <div className="w-[500px] h-[200px] bg-orange-400 rounded-lg overflow-hidden flex items-center justify-center pl-24 ">
        <input
          type="file"
          className=""
          accept=".json"
          onChange={handleFileChange}
        />
      </div>{" "}
      <br />
      {downloadUrl && (
        <div className="w-[500px] h-[100px] bg-slate-500 rounded-lg flex items-center justify-center text-lime-300 font-bold">
          <a href={downloadUrl} download="data.xlsx">
            Download Excel file
          </a>
        </div>
      )}
    </div>
  );
}

export default JsonToExcelConverter;
