document.getElementById('run-simulation').addEventListener('click', (event) => {
     event.preventDefault(); // Prevent form submission
     const initialInvestment = parseFloat(document.getElementById('current-investment').value);
     const yearsToRetirement = parseInt(document.getElementById('years-to-retirement').value);
     const annualContribution = parseFloat(document.getElementById('annual-contribution').value);
     const expectedReturn = parseFloat(document.getElementById('expected-return').value) / 100;
     const volatility = parseFloat(document.getElementById('expected-volatility').value) / 100;
     const numSimulations = parseInt(document.getElementById('simulation-count').value);
     const annualWithdrawal = parseFloat(document.getElementById('annual-withdrawal').value);
     const yearsInRetirement = parseInt(document.getElementById('years-in-retirement').value);
     const inflationRate = parseFloat(document.getElementById('inflation-rate').value) / 100;

     let endingBalances = [];
     let successCount = 0;

     for (let sim = 0; sim < numSimulations; sim++){
          let portfolio = initialInvestment;
          let inflationAdjustedWithdrawal = annualWithdrawal

          for (let year=0; year < yearsToRetirement; year++){
               const annualReturn =Math.max(-0.5, Math.min(0.5, randomNormal(expectedReturn, volatility)));
               portfolio += annualContribution;
               portfolio *= (1 + annualReturn);
               portfolio /= (1 + inflationRate);
          }

          let success = true;
          for (let year = 0; year < yearsInRetirement; year++) {
               const annualReturn = Math.max(-0.5, Math.min(0.5, randomNormal(expectedReturn, volatility)));
               portfolio *= (1 + annualReturn);
               portfolio -= inflationAdjustedWithdrawal;
               if (portfolio < 0) {
                    portfolio = 0;
                    success = false;
                    break;
               }
          portfolio /= (1 + inflationRate);
          inflationAdjustedWithdrawal *= (1 + inflationRate);
          }
          
          if (success) successCount++;
          endingBalances.push(portfolio);
          }

          function getPercentile(sortedData, percentile){
               const index = Math.floor(percentile * (sortedData.length - 1));
               return sortedData[index];
          }

          endingBalances.sort((a, b) => a - b);

          const p10 = getPercentile(endingBalances, 0.1);
          const p20 = getPercentile(endingBalances, 0.2);
          const p30 = getPercentile(endingBalances, 0.3);
          const p40 = getPercentile(endingBalances, 0.4);
          const p50 = getPercentile(endingBalances, 0.5);
          const p60 = getPercentile(endingBalances, 0.6);
          const p70 = getPercentile(endingBalances, 0.7);
          const p80 = getPercentile(endingBalances, 0.8);
          const p90 = getPercentile(endingBalances, 0.9);

          const successRate = (successCount / numSimulations) * 100;

          document.getElementById('results').innerHTML = `
               <h3>Simulation Results</h3>
               <p>Success Rate: ${successRate.toFixed(2)}%</p>
               <p>Ending Balances by Percentile:</p>
               <ul>
                    <li>10th Percentile (90% likelihood): ${p10.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                    <li>20th Percentile (80% likelihood): ${p20.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                    <li>30th Percentile (70% likelihood): ${p30.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                    <li>40th Percentile (60% likelihood): ${p40.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                    <li>50th Percentile (Median, 50% likelihood): ${p50.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                    <li>60th Percentile (40% likelihood): ${p60.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                    <li>70th Percentile (30% likelihood): ${p70.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                    <li>80th Percentile (20% likelihood): ${p80.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
                    <li>90th Percentile (10% likelihood): ${p90.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</li>
               </ul>`;
     });

     function randomNormal(mean, stdDev) {
          let u = 0, v = 0;
          while (u === 0) u = Math.random();
          while (v === 0) v = Math.random();
          let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
          return z * stdDev + mean;
     }
