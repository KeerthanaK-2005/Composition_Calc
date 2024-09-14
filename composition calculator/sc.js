console.log("sctipt.js loaded properly");
var diameter,height,volume,density,mass;
const weight = 1200;
const wp=120;//const weight of plastic
const plastic = 10;//const %of plastic
var comb_agg,bitumen,coar_agg;
var total_percentage,total_weight;
let wb,wcomb,wcoar,i;
let filler=[2,4,6,8,10,12];
let wfiller = new Array(filler.length); // Initialize wfiller with the same length as filler
let wfine = new Array(filler.length);
let fine_agg = new Array(filler.length);

//initialize all variables
comb_agg=coar_agg=bitumen=total_percentage=total_weight=wb=wcomb=wcoar=0;

// Select the table body element
const tableBody = document.querySelector(".table tbody");

//buttons function declared using a seperate variable
const calculate1 = document.querySelector(".calculate1");
const calculate = document.querySelector(".calculate");
const download = document.querySelector(".download");


//calculation
calculate.onclick = ()=>{

    // Get the values entered by the user
    bitumen = parseFloat(document.getElementById('bitumen').value);
    
    //calculate bitumen
    wb = (bitumen/100)*weight;//formula : (%of bitumen / 100) * total weight

    //const plastic

    //calculate combined aggrigate
    comb_agg = 100 - bitumen - plastic;//formula : 100 - %ofbitumen - %of plastic

    //calculate coarse aggrigate
    coar_agg = (50/100)*comb_agg;//formula : 50% of the combined aggrigate
    //weight of coarse aggrigate
    wcoar = (coar_agg/100)*weight;//formula : (%of coarse aggrigate / 100) * total weight
    
    for (i = 0; i < 6; i++) {
        // Weight of filler
        wfiller[i] = (filler[i] /100)*weight;
    
        // Calculate fine aggregate
        fine_agg[i] = coar_agg - filler[i];
    
        // Weight of fine aggregate
        wfine[i] = (fine_agg[i]/100)*weight;
    
        console.log(filler[i], wfiller[i], fine_agg[i], wfine[i]);
    }
    
    

    //total check
    total_weight = 1200;// total weight
    total_percentage = 100// total %

    
      // Display the result
      var resultText = 'Total weight of the mixture is  ' + total_weight + ' grams\n' + 'The total percentage of the mixture ' + total_percentage + '%\n';
    
      // Set the inner text of the element to the concatenated string
      document.getElementById('result').innerText = resultText ;

      //hide download button
      download.style.display="block";    

    
    // Show the table after calculation
    document.querySelector('.table').style.display = 'block';
    // After calculation, update the table
    updateTable();
  
    console.log("mixture of materials calculated");
 
}


//to update table  with new values
function updateTable() {
    console.log("Table updated");
    // Get the table body element
    const tableBody = document.querySelector(".table tbody");
    
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
  // create a new workbook
  const wb2 = XLSX.utils.book_new();

  // create a new worksheet
  const ws = XLSX.utils.aoa_to_sheet([

    // Example: { v: "Text", s: { alignment: { horizontal: "right" }, font: { bold: true } } }
    ["MATERIAL", , "WEIGHT"],
    ["Weight of Bitumen", , { v: wb.toFixed(2), s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Weight of Plastic", , { v: wp.toFixed(2), s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Weight of Coarse Aggregate", , { v: wcoar.toFixed(2), s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Weight of Fine Aggregate", , { v: wfine.toFixed(2), s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Weight of Filler", , { v: wfiller.toFixed(2), s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    [],
    ["MATERIAL", , "PERCENTAGE"],
    ["Percentage of Bitumen", , { v: bitumen.toFixed(2)+"%", s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Percentage of Plastic", , { v: plastic.toFixed(2)+"%", s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Percentage of Coarse Aggregate", , { v: coar_agg.toFixed(2)+"%", s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Percentage of Fine Aggregate", , { v: fine_agg.toFixed(2)+"%", s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Percentage of Filler", , { v: filler.toFixed(2)+"%", s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    [],
    ["TOTAL"],
    ["Total Weight", , { v: total_weight, s: { alignment: { horizontal: "right" }, font: { bold: true } } }],
    ["Total Percentage", , { v: total_percentage, s: { alignment: { horizontal: "right" }, font: { bold: true } } }]
  ]);

   // Set column width
   ws['!cols'] = [
    // First column width is set to 20
    { width: 20 },
    // Second column width is set to auto(which is 15)
    { width: 10 },
    // Third column width is set to auto(which is 15)
    { width: 10 }
  ];

  // add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb2, ws, "Sheet1");

  // write the workbook to an Excel file
  const wbout = XLSX.write(wb2, { type: "array", bookType: "xlsx" });

  // saves the file on the local disk
  saveAs(new Blob([wbout], { type: "application/octet-stream" }), "result.xlsx");
}

// Call updateTable initially to display the default values in the table
updateTable();