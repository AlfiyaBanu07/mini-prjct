document.querySelectorAll(".file-input").forEach(input => {
  input.addEventListener("change", function (event) {
      const preview = this.nextElementSibling;
      preview.innerHTML = ""; // Clear previous preview
      const file = event.target.files[0];

      if (file) {
          const fileName = document.createElement("p");
          fileName.textContent = `Uploaded file: ${file.name}`;
          preview.appendChild(fileName);

          const fileURL = URL.createObjectURL(file);
          if (file.type.startsWith("image/")) {
              const img = document.createElement("img");
              img.src = fileURL;
              preview.appendChild(img);
          } else if (file.type === "application/pdf") {
              const iframe = document.createElement("iframe");
              iframe.src = fileURL;
              iframe.width = "100%";
              iframe.height = "200px";
              preview.appendChild(iframe);
          } else {
              const link = document.createElement("a");
              link.href = fileURL;
              link.target = "_blank";
              link.textContent = "Click to view uploaded file";
              preview.appendChild(link);
          }
      }
  });
});
document.addEventListener('DOMContentLoaded', function() {
  const facultyForm = document.getElementById('faculty-details');

  facultyForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const facultyName = document.getElementById('faculty-name').value;
    const designation = document.getElementById('designation').value;
    const department = document.getElementById('department').value;

    console.log('Faculty Name:', facultyName);
    console.log('Designation:', designation);
    console.log('Department:', department);

    alert('Faculty details submitted successfully!');
  });

  function calculateTotal() {
    let totalGradePoints1 = 0;
    let totalGradePoints2 = 0;

    // Function to calculate total for a specific table
    function calculateTableTotal(tableId, totalGradePointId) {
      let table = document.querySelector(tableId);
      let rows = table.querySelectorAll('tbody tr');
      let sectionTotal = 0;

      rows.forEach(row => {
        let gradingInput = row.querySelector('.grading-input');
        let gradePointCell = row.querySelector('.grade-point');

        // Ensure grading input exists and calculate the grade point
        if (gradingInput && gradePointCell) {
          let grade = parseFloat(gradingInput.value) || 0;
          let weight = parseFloat(gradingInput.getAttribute('data-weight')) || 0;
          let gradePoint = grade * weight;
          gradePointCell.textContent = gradePoint.toFixed(2); // Update grade point
          sectionTotal += gradePoint;
        }
      });

      document.getElementById(totalGradePointId).textContent = sectionTotal.toFixed(2); // Update section total
      return sectionTotal;
    }

    // Calculate total for Section 1: Student Performance
    totalGradePoints1 = calculateTableTotal('#evaluation-table', 'total-grade-point1');

    // Calculate total for Section 2: Research and Innovation
    totalGradePoints2 = calculateTableTotal('#research-table', 'total-grade-point2');

    // Update the grand total (sum of all section totals)
    let grandTotal = totalGradePoints1 + totalGradePoints2;
    document.getElementById('grand-total').textContent = grandTotal.toFixed(2); // Update grand total
  }

  // Attach event listeners to the inputs to recalculate when values change
  document.querySelectorAll('.grading-input').forEach(input => {
    input.addEventListener('input', calculateTotal);
  });

  // Initial calculation
  window.addEventListener('load', calculateTotal);

  // Function to calculate allowance based on performance
  function calculateAllowance() {
    // Get the values from the inputs
    const academics = parseInt(document.getElementById('academics').value) || 0;
    const research = parseInt(document.getElementById('research').value) || 0;
    const administrative = parseInt(document.getElementById('administrative').value) || 0;
    const hod = parseInt(document.getElementById('hod').value) || 0;

    // Calculate total score
    const totalScore = academics + research + administrative + hod;

    // Define allowance and grade based on the total score
    let allowance = "No allowance";
    let grade = "A";

    if (totalScore >= 200) {
      allowance = "\u20B95,000"; // INR 5,000
      grade = "A+++";
    } else if (totalScore >= 160) {
      allowance = "\u20B93,500"; // INR 3,500
      grade = "A++";
    } else if (totalScore >= 120) {
      allowance = "\u20B92,000"; // INR 2,000
      grade = "A+";
    }

    // Update the result area with the total score, grade, and allowance
    document.getElementById('result').innerHTML = `
      <p><strong>Total Score:</strong> ${totalScore}</p>
      <p><strong>Grade:</strong> ${grade}</p>
      <p><strong>Performance Allowance:</strong> ${allowance}</p>
    `;

    return {
      totalScore,
      grade,
      allowance
    };
  }
  // Event listener for the "submit-form" button
  document.getElementById("submit-form").addEventListener("click", function() {
    // Calculate allowance before generating the PDF
    calculateAllowance();
    const content = document.querySelector(".container");

    // Explicitly set the width of the content for better control
    const contentWidth = 1200; // A4 width in mm
    const contentStyle = content.style;
    contentStyle.width = contentWidth + 'mm'; // Set width to match A4 width

    // Define the options for html2pdf
    const options = {
      margin: 2,
      filename: 'Performance_Evaluation_Form.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 3 }, // Increased scale for higher resolution
      jsPDF: { unit: 'mm', format: 'a2', orientation: 'portrait' }
    };

    // Generate and download the PDF
    html2pdf()
      .from(content)
      .set(options)
      .save()
      .then(() => {
        // Close the form after downloading the PDF
        alert('PDF downloaded successfully! The form will now close.');
        facultyForm.reset(); // Reset the form to clear inputs
      });
  });
});
