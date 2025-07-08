const yesRadio = document.getElementById("rental-property-yes");
const noRadio = document.getElementById("rental-property-no");
const rentalFields = document.getElementById("rental-fields");
const homeFields = document.getElementById("home-fields");
const resultDiv = document.getElementById("result");


// Initialize the display based on the default radio selection
yesRadio.addEventListener("click", () => {
  rentalFields.style.display = "block";
  homeFields.style.display = "none";
});


noRadio.addEventListener("click", () => {
  rentalFields.style.display = "none";
  homeFields.style.display = "block";
});

function initializeDisplay() {
  if (yesRadio.checked) {
    rentalFields.style.display = "block";
    homeFields.style.display = "none";
  } else if (noRadio.checked) {
    rentalFields.style.display = "none";
    homeFields.style.display = "block";
  } else {
    // If neither checked (optional), hide both
    rentalFields.style.display = "none";
    homeFields.style.display = "none";
  }
}

initializeDisplay();

const form = document.getElementById("downpayment-form");
form.addEventListener("submit", (e) => {
  e.preventDefault();


// Adding input variables using parseFloat to ensure they are treated as numbers
const targetRent = parseFloat(document.getElementById("target-rent").value) || 0;
const expectedCashFlow = parseFloat(document.getElementById("expected-cash-flow").value) || 0;
const homePrice = parseFloat(document.getElementById("home-price").value) || 0;
const annualInsurance = parseFloat(document.getElementById("annual-insurance").value) || 0;
const lengthOfLoan = parseFloat(document.getElementById("length-of-loan").value) || 0;
const interestRate = parseFloat(document.getElementById("interest-rate").value) || 0;
const taxRate = parseFloat(document.getElementById("tax-rate").value) || 0;
const targetMonthlyPayment = parseFloat(document.getElementById("target-monthly-payment").value) || 0;
const propertyManagementFee = parseFloat(document.getElementById("property-management-fee").value) || 0;
const monthlyExpenses = parseFloat(document.getElementById("monthly-expenses").value) || 0;


// Extra validation for interest rates
if(interestRate <= 0 || interestRate > 100 || isNaN(interestRate)) {
  resultDiv.innerHTML = `<p style="color: red;">Interest rate must be between 0.01% and 100%</p>`;
  return;
}

let closingCosts = homePrice * 0.05; // Assuming 5% closing costs
let monthlyInterestRate = ((interestRate / 100)/ 12);
let numberOfPayments = lengthOfLoan * 12;



 // Rental property calculations
if(yesRadio.checked){
  let mortgagePayment = targetRent - expectedCashFlow - monthlyExpenses - (annualInsurance / 12) - (((taxRate / 100) * homePrice) / 12) - ((propertyManagementFee / 100) * targetRent);
  let calcOne = mortgagePayment * ((((1 + monthlyInterestRate))** numberOfPayments) - 1);
  let calcTwo = monthlyInterestRate * ((1 + monthlyInterestRate)** numberOfPayments);
  let loanAmount = calcOne / calcTwo;
  let downPayment = homePrice - loanAmount;

  resultDiv.innerHTML = 
`<h3>Results</h3>
  <p>Down Payment: $${downPayment.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
  <p>Closing Costs (based on 5% estimate): $${closingCosts.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>`;
}

// Home purchase calculations
if(noRadio.checked){
  let monthlyInsurance = annualInsurance / 12;
  let monthlyTax = ((taxRate / 100) * homePrice) / 12;
  let monthlyPI = targetMonthlyPayment - monthlyInsurance - monthlyTax;
  
  let factor = Math.pow(1 + monthlyInterestRate, numberOfPayments);
  let loanAmount = monthlyPI * (factor - 1) / (monthlyInterestRate * factor);
  let downPayment = homePrice - loanAmount;


  resultDiv.innerHTML = `<h3>Results</h3>
  <p>Down Payment: $${downPayment.toLocaleString(
    "en-US",{minimumFractionDigits: 2, maximumFractionDigits: 2})}
  </p>
  <p>Closing Costs (based on 5% estimate): $${closingCosts.toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>`;
  }
});
