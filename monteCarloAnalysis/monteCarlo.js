//Add an event listener to the run simulation button
document.getElementById('run-simulation').addEventListener('click', (event) => {
     event.preventDefault(); // Prevent form submission

     //Obtain elements from the input using parseFloat to transform the value from a String
     //to a decimal. .value obtains the String.
     const initialInvestment = parseFloat(document.getElementById('current-investment').value);
     const yearsToRetirement = parseInt(document.getElementById('years-to-retirement').value);
     const annualContribution = parseFloat(document.getElementById('annual-contribution').value);
     const expectedReturn = parseFloat(document.getElementById('expected-return').value) / 100;
     const volatility = parseFloat(document.getElementById('expected-volatility').value) / 100;
     const numSimulations = parseInt(document.getElementById('simulation-count').value);
     const annualWithdrawal = parseFloat(document.getElementById('annual-withdrawal').value);
     const yearsInRetirement = parseInt(document.getElementById('years-in-retirement').value);
     const inflationRate = parseFloat(document.getElementById('inflation-rate').value) / 100;

     //Initialize the variances and turn ending balances into an array
     let endingBalances = [];
     let successCount = 0;

     //Use a for-loop to run the simulation as long as it is less than the user's requested number
     for (let sim = 0; sim < numSimulations; sim++){

          //Set up variables for simulation
          let portfolio = initialInvestment;
          let inflationAdjustedWithdrawal = annualWithdrawal

          //As long as year is less than years to retirement, run this simulation
          for (let year=0; year < yearsToRetirement; year++){

               //Generates a yearly investment return using a normal distribution
               //The return is capped between –50% and +50% to prevent unrealistic extreme values
               const annualReturn =Math.max(-0.5, Math.min(0.5, randomNormal(expectedReturn, volatility)));

               //The user invests a set amount each year before retirement.
               portfolio += annualContribution;

               //The portfolio increases (or decreases) based on the randomly generated annual return.
               portfolio *= (1 + annualReturn);

               //This converts the portfolio into “today’s dollars,” keeping the simulation consistent 
               //when comparing future values.
               portfolio /= (1 + inflationRate);
          }

          //We begin by assuming the portfolio will last through retirement unless proven otherwise.
          let success = true;

          //As long as the year is less than years in retirement, proceed with the simulation
          for (let year = 0; year < yearsInRetirement; year++) {

               //Creates a random market return using a normal distribution, capped at ±50% to avoid unrealistic values.
               const annualReturn = Math.max(-0.5, Math.min(0.5, randomNormal(expectedReturn, volatility)));

               //Applies market performance to the current portfolio.
               portfolio *= (1 + annualReturn);

               //Withdraws the (inflation-adjusted) amount the retiree spends each year.
               portfolio -= inflationAdjustedWithdrawal;

               //If the portfolio is depleted, mark the simulation as a failure and stop early.
               if (portfolio < 0) {
                    portfolio = 0;
                    success = false;
                    break;
               }

          //Converts the remaining portfolio into inflation-adjusted dollars for consistency.
          portfolio /= (1 + inflationRate);

          //Each year, retirement spending increases with inflation — so next year’s withdrawal is bigger.
          inflationAdjustedWithdrawal *= (1 + inflationRate);
          }
          
          //If the portfolio survived all retirement years, mark this simulation as a success.
          //Regardless of success/failure, store the final portfolio value in an array so we can 
          //analyze all outcomes.
          if (success) successCount++;
          endingBalances.push(portfolio);
          }

          //Percentile helper method:
               //- Assumes the data is already sorted.
               //- Converts a percentile (like 0.1 or 0.5) into an index.
               //- Returns the value at that position.
          function getPercentile(sortedData, percentile){

               //We use math floor to ensure we get whole numbers to work with the array. Flooring gives the 
               // lowest index representing that percentile. We multiply by the percentile to convert 
               // a 0–1 scale (percent) into an array index that matches the sorted data. This gives us the
               //position of the corresponding value in the array
               const index = Math.floor(percentile * (sortedData.length - 1));
               return sortedData[index];
          }

          //Sorting ensures percentiles are accurate — lowest balances first, highest last.
          endingBalances.sort((a, b) => a - b);

          //Each percentile represents how likely the user is to end retirement with at least that amount
          const p10 = getPercentile(endingBalances, 0.1);
          const p20 = getPercentile(endingBalances, 0.2);
          const p30 = getPercentile(endingBalances, 0.3);
          const p40 = getPercentile(endingBalances, 0.4);
          const p50 = getPercentile(endingBalances, 0.5);
          const p60 = getPercentile(endingBalances, 0.6);
          const p70 = getPercentile(endingBalances, 0.7);
          const p80 = getPercentile(endingBalances, 0.8);
          const p90 = getPercentile(endingBalances, 0.9);

          //Determines what percentage of simulations ended without running out of money.
          const successRate = (successCount / numSimulations) * 100;

          //Present the results to the user in the "results" section
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

     //Generate a helper method that generates random numbers that follow a normal (Gaussian) 
     // distribution, rather than just uniform randomness.
     function randomNormal(mean, stdDev) {
          //This is a standard technique called the Box-Muller transform, which converts two 
          // uniform random numbers (u and v) into a normally distributed random number (z).
          let u = 0, v = 0;
          while (u === 0) u = Math.random();
          while (v === 0) v = Math.random();
          let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
          return z * stdDev + mean;
     }
