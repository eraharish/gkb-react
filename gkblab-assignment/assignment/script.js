document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('data-form');
    const tableBody = document.getElementById('data-body');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        if (validateForm()) {
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                age: formData.get('age'),
                dob: formData.get('dob')
            };

            try {
                const response = await fetch('/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const newData = await response.json();
                    displayData(newData);
                    form.reset(); // Reset the form after successful submission
                } else {
                    console.error('Failed to submit data');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    });

    function validateForm() {
        const name = form.elements['name'].value;
        const email = form.elements['email'].value;
        const age = form.elements['age'].value;
        const dob = form.elements['dob'].value;

        if (!name || !email || !age || !dob) {
            alert('All fields are required');
            return false;
        }

        if (isNaN(age) || age <= 0) {
            alert('Age must be a positive integer');
            return false;
        }

        return true;
    }

    async function fetchAndDisplayData() {
        try {
            const response = await fetch('/data');
            const data = await response.json();
            data.forEach(item => displayData(item));
        } catch (error) {
            console.error('Error:', error);
        }
    }

    function displayData(data) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${data.id}</td>
            <td>${data.name}</td>
            <td>${data.email}</td>
            <td>${data.age}</td>
            <td>${data.dob}</td>
        `;
        tableBody.appendChild(row);
    }

    fetchAndDisplayData();
});