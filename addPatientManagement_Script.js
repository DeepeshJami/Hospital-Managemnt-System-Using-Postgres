document.getElementById('addPatientForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const patientid = document.getElementById('patientid').value;
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const gender = document.getElementById('gender').value;
    const address = document.getElementById('address').value;
    const dob = document.getElementById('dob').value;
    const ssn = document.getElementById('ssn').value;
    const bloodtype = document.getElementById('bloodtype').value;
    const primaryphysicianid = document.getElementById('primaryphysicianid').value;


    fetch('/api/add-patient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientid, name, age, gender, address, dob, ssn, bloodtype, primaryphysicianid })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert('Patient added successfully');
    })
    .catch(error => console.error('Error:', error));
});
