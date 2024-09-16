console.log("script.js loaded properly");
const weight = 1200;
const wp = 120; // const weight of plastic
const plastic = 10; // const % of plastic
var comb_agg, bitumen, coar_agg;
var total_percentage, total_weight;
let wb, wcomb, wcoar, i;
let filler = [2, 4, 6, 8, 10, 12];
let wfiller = new Array(filler.length);
let wfine = new Array(filler.length);
let fine_agg = new Array(filler.length);

// Initialize all variables
comb_agg = coar_agg = bitumen = total_percentage = total_weight = wb = wcomb = wcoar = 0;

// Select the table body element
const tableBody = document.querySelector(".table tbody");

// Buttons function declared using a separate variable
const calculate = document.querySelector(".calculate");
const download = document.querySelector(".download");

// Calculation
calculate.onclick = () => {
    // Get the values entered by the user
    bitumen = parseFloat(document.getElementById('bitumen').value);

    // Calculate bitumen
    wb = (bitumen / 100) * weight;

    // Calculate combined aggregate
    comb_agg = 100 - bitumen - plastic;

    // Calculate coarse aggregate
    coar_agg = (50 / 100) * comb_agg;

    // Weight of coarse aggregate
    wcoar = (coar_agg / 100) * weight;

    for (i = 0; i < filler.length; i++) {
        // Weight of filler
        wfiller[i] = (filler[i] / 100) * weight;

        // Calculate fine aggregate
        fine_agg[i] = comb_agg - filler[i];

        // Weight of fine aggregate
        wfine[i] = (fine_agg[i] / 100) * weight;

        console.log(filler[i], wfiller[i], fine_agg[i], wfine[i]);
    }

    // Total check
    total_weight = 1200; // total weight
    total_percentage = 100; // total %

    // Display the result
    var resultText = 'Total weight of the mixture is ' + total_weight + ' grams\n' + 'The total percentage of the mixture ' + total_percentage + '%\n';

    // Set the inner text of the element to the concatenated string
    document.getElementById('result').innerText = resultText;

    // Show download button
    download.style.display = "block";

    // Show the table after calculation
    document.querySelector('.table').style.display = 'block';

    // After calculation, update the table
    updateTable();

    console.log("mixture of materials calculated");
}

// To update table with new values
function updateTable() {
    console.log("Table updated");
    // Clear existing rows
    tableBody.innerHTML = "";

    // Create an array of objects representing each row
    const rows = [
        { material: "Bitumen", percentage: bitumen.toFixed(2) + "%", weight: wb.toFixed(2) },
        { material: "Plastic", percentage: plastic.toFixed(2) + "%", weight: wp.toFixed(2) },
        { material: "Coarse Aggregate", percentage: coar_agg.toFixed(2) + "%", weight: wcoar.toFixed(2) },
    ];

    // Iterate over the filler array to create rows for filler and fine aggregate
    for (let i = 0; i < filler.length; i++) {
        if (wfiller[i] !== undefined && wfine[i] !== undefined) {
            rows.push({ material: "Filler (" + filler[i] + "%)", percentage: filler[i] + "%", weight: wfiller[i].toFixed(2) });
            rows.push({ material: "Fine Aggregate (" + fine_agg[i] + "%)", percentage: fine_agg[i] + "%", weight: wfine[i].toFixed(2) });
        }
    }

    // Iterate over the rows array and create table rows
    rows.forEach(rowData => {
        const row = document.createElement("tr");
        Object.values(rowData).forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });
        tableBody.appendChild(row);
    });
}

//to download the workbook
download.onclick = () => {
  console.log("worksheet downloaded");

  // Create a new workbook
  const wb2 = XLSX.utils.book_new();

  // Data to be inserted into the worksheet
  const materials = [
    { name: "Bitumen", percentage: bitumen, weight: wb },
    { name: "Plastic", percentage: plastic, weight: wp },
    { name: "Coarse Aggregate", percentage: coar_agg, weight: wcoar },
    { name: "Filler (2%)", percentage: filler[0], weight: wfiller[0] },
    { name: "Fine Aggregate (2%)", percentage: fine_agg[0], weight: wfine[0] },
    { name: "Filler (4%)", percentage: filler[1], weight: wfiller[1] },
    { name: "Fine Aggregate (4%)", percentage: fine_agg[1], weight: wfine[1] },
    { name: "Filler (6%)", percentage: filler[2], weight: wfiller[2] },
    { name: "Fine Aggregate (6%)", percentage: fine_agg[2], weight: wfine[2] },
    { name: "Filler (8%)", percentage: filler[3], weight: wfiller[3] },
    { name: "Fine Aggregate (8%)", percentage: fine_agg[3], weight: wfine[3] },
    { name: "Filler (10%)", percentage: filler[4], weight: wfiller[4] },
    { name: "Fine Aggregate (10%)", percentage: fine_agg[4], weight: wfine[4] },
    { name: "Filler (12%)", percentage: filler[5], weight: wfiller[5] },
    { name: "Fine Aggregate (12%)", percentage: fine_agg[5], weight: wfine[5] },
  ];

  // Prepare data array for the worksheet
  const data = [
    ["MATERIAL", , "PERCENTAGE", , "WEIGHT"],
    []
  ];

  materials.forEach(material => {
    data.push(
      [material.name, , 
      { v: material.percentage.toFixed(2), s: { alignment: { horizontal: "right" }, font: { bold: true } } }, , 
      { v: material.weight.toFixed(2), s: { alignment: { horizontal: "right" }, font: { bold: true } } }]
    );
    if (material.name.startsWith("Filler")) {
      data.push([]);
    }
  });

  data.push(
    [],
    ["TOTAL"],
    ["Total Weight", , { v: total_weight, s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Total Percentage", , { v: total_percentage, s: { alignment: { horizontal: "right" }, font: { bold: true } } }]
  );

  // Create a new worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column width
  ws['!cols'] = [
    { width: 20 },
    { width: 10 },
    { width: 10 }
  ];

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb2, ws, "Sheet1");

  // Write the workbook to an Excel file
  const wbout = XLSX.write(wb2, { type: "array", bookType: "xlsx" });

  // Save the file on the local disk
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "result.xlsx");
};


// Call updateTable initially to display the default values in the table
updateTable();