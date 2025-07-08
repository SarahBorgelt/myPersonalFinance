document.getElementById('creditScore').addEventListener('submit', function (event){
     event.preventDefault()

// Sourcing the variables from the html file
     const paymentRate = parseFloat(document.getElementById("on-time-payment").value) / 100;
     const utilization = parseFloat(document.getElementById("credit-utilization").value) / 100;
     const age = parseFloat(document.getElementById("credit-age").value);
     const newAccounts = parseInt(document.getElementById("new-accounts").value);
     const mix = parseInt(document.getElementById("credit-mix").value);

// Validating the inputs
     if(
          isNaN(paymentRate) || isNaN(utilization) || isNaN(age) || isNaN(newAccounts) || isNaN(mix)){
               document.getElementById("score-output").innerHTML = `
                    <p style="color:red;">Please fill out all fields correctly before calculating your score</p>`
                    return;
          }
     
// Weighting based on common credit score models
     const paymentScore = paymentRate * 100;
     const utilizationScore = (1 - utilization) * 100;
     const ageScore = Math.min(age/10, 1) * 100;
     const newAccountScore = Math.max(1-newAccounts / 5,0) * 100;
     const mixScore = Math.min(mix / 3,1) * 100;

     const weightedScore =
     (paymentScore * 0.35) + (utilizationScore * 0.30) + (ageScore * 0.15) + (newAccountScore * 0.10) + (mixScore * 0.10);
     const creditScore = Math.round(300 + (weightedScore / 100) * 550);

// Credit score labels
     let quality = '';
     if (creditScore >= 800) quality = "Excellent";
     else if (creditScore >= 740) quality ="Very Good";
     else if (creditScore >= 670) quality = "Good";
     else if (creditScore >= 580) quality = "Fair";
     else quality = "Poor";

// Output
     const output = document.getElementById("score-output");
     output.innerHTML = `
          <h2>Estimated Credit Score: <span style="color: green">${creditScore}</span></h2>
          <h3>Rating: ${quality}</h3>
          <p>This score is a simulation based on the inputs. Actual credit scores may vary depending on the model used by lenders.</p>`;
});