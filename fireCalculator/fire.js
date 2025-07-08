document.getElementById('fire-calculator').addEventListener('submit', function(event){
     event.preventDefault();

     const currentSavings = parseFloat(document.getElementById('current-savings').value);
     const annualIncome = parseFloat(document.getElementById('annual-income').value);
     const yearsUntilRetirement = parseFloat(document.getElementById('years-until-retirement').value);
     const annualReturn = parseFloat(document.getElementById('annual-return').value) / 100;
     const annualInflation = parseFloat(document.getElementById('annual-inflation').value) / 100;
     const safeWithdrawalRate = parseFloat(document.getElementById('desired-safe-withdrawal').value) / 100;

// FIRE number accounting for inflation
     const fireNumber = annualIncome / safeWithdrawalRate
     const inflationFireNumber = fireNumber * Math.pow(1 + annualInflation, yearsUntilRetirement);

// Determine the future value of savings
     const futureSavings = currentSavings * Math.pow(1 + annualReturn, yearsUntilRetirement);

     const gap = inflationFireNumber - futureSavings;

    const resultText = `
        <h3>Results:</h3>
        <p>🔥 Your FIRE number is <strong>${inflationFireNumber.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></p>
        <p>📈 Projected savings: <strong>${futureSavings.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></p>
        ${
            gap > 0 
            ? `<p>❌ You're short by <strong>${gap.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></p>` 
            : `<p>✅ You’ve exceeded your FIRE goal by <strong>${Math.abs(gap).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</strong></p>`
        }
    `;
    
          document.getElementById('result').innerHTML = resultText;
     });