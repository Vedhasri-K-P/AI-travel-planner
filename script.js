document.getElementById('travelForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const destination = document.getElementById('destination').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    const interests = document.getElementById('interests').value;

    // Show loading spinner
    document.getElementById('loading').classList.remove('hidden');
    document.getElementById('result').classList.add('hidden');

    try {
        const response = await fetch('/generate-itinerary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                destination,
                startDate,
                endDate,
                interests
            })
        });

        const data = await response.json();
        
        // Hide loading spinner
        document.getElementById('loading').classList.add('hidden');
        
        if (data.error) {
            alert(data.error);
            return;
        }

        // Show result
        document.getElementById('result').classList.remove('hidden');
        document.getElementById('itinerary').textContent = data.itinerary;

    } catch (error) {
        console.error('Error:', error);
        alert('Error generating itinerary. Please try again.');
        document.getElementById('loading').classList.add('hidden');
    }
});

// Set minimum date for date inputs
const today = new Date().toISOString().split('T')[0];
document.getElementById('start-date').min = today;
document.getElementById('end-date').min = today;

// Update end-date minimum when start-date changes
document.getElementById('start-date').addEventListener('change', function() {
    document.getElementById('end-date').min = this.value;
}); 