console.log("sctipt.js loaded properly");
var diameter,height,volume,density,mass;
const 𝜋 = 22/7;
const weight = 1200;
const wp=120;//const weight of plastic
const plastic = 10;//const %of plastic
var comb_agg,bitumen,filler,fine_agg,coar_agg;
var total_percentage,total_weight;
let wb,wcomb,wcoar,wfiller,wfine;

//initialize all variables
comb_agg=coar_agg=filler=fine_agg=bitumen=total_percentage=total_weight=wb=wcomb=wcoar=wfiller=wfine=0;

// Select the table body element
const tableBody = document.querySelector(".table tbody");

//buttons function declared using a seperate variable
const calculate1 = document.querySelector(".calculate1");
const calculate = document.querySelector(".calculate");
const download = document.querySelector(".download");

//mass calculation
calculate1.onclick = ()=>{
  console.log(𝜋);
  diameter = ((parseFloat(document.getElementById('diameter').value))/1000).toFixed(4);
  height = ((parseFloat(document.getElementById('height').value))/1000).toFixed(4);
  density = parseFloat(document.getElementById('density').value);
  volume = (( 𝜋/4 ) * ((diameter**2).toFixed(4)) * height).toFixed(7);
  mass = density * volume;
  console.log(volume);
  var dispresult = 'volume of the mould :'+ volume +'  cubic meters\n'+'mass of the mould: '+ mass+' kg';
  
  // Displaying the result in HTML paragraph
  document.getElementById('result').innerHTML = dispresult ;

  console.log("mass calculation successfully completed");
}

//calculation
calculate.onclick = ()=>{

    // Get the values entered by the user
    bitumen = parseFloat(document.getElementById('bitumen').value);
    filler = parseFloat(document.getElementById('filler').value);
    
    //calculate bitumen
    wb = (bitumen/100)*weight;//formula : (%of bitumen / 100) * total weight

    //const plastic

    //calculate combined aggrigate
    comb_agg = 100 - bitumen - plastic;//formula : 100 - %ofbitumen - %of plastic

    //calculate coarse aggrigate
    coar_agg = (50/100)*comb_agg;//formula : 50% of the combined aggrigate
    //weight of coarse aggrigate
    wcoar = (coar_agg/100)*weight;//formula : (%of coarse aggrigate / 100) * total weight
    
    //weight of filler
    wfiller = (filler/100)*weight;//formula : (%of filler in comb_agg / 100) * total weight
    
    //calculate fine aggrigate
    fine_agg = coar_agg - filler;//formula : (%of coarse aggrigate - %of filler in comb_agg)
    //weight of fine aggrigate
    wfine = (fine_agg/100)*weight;//formula : (%of fine aggrigate/100) * total weight

    //total check
    total_weight = wb + wp + wcoar + wfiller + wfine;//formula : weight of(bitumen + plastic + coarse aggrigate + filler + fine aggrigate)
    total_percentage = bitumen + plastic + coar_agg + filler + fine_agg;// total %

    //condition to check for correct composition
    if(total_weight==1200 && total_percentage==100){
    
      // Display the result
      var resultText = 'Total weight of the mixture is' + total_weight + ' grams\n' + 'The total percentage of the mixture ' + total_percentage + '%\n';
    
      // Set the inner text of the element to the concatenated string
      document.getElementById('result').innerText = resultText ;

      //hide download button
      download.style.display="block";    

    }
    else{
      console.log("error in calculation");
    }

    
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
    { material: "Fine Aggregate", percentage: fine_agg.toFixed(2) + "%", weight: wfine.toFixed(2) },
    { material: "Filler", percentage: filler.toFixed(2) + "%", weight: wfiller.toFixed(2) }
    //,{ material: "Total", percentage: total_percentage + "%", weight: total_weight }
  ];

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