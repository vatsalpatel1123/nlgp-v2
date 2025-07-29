document.addEventListener('DOMContentLoaded', function () {
  const newsletterForms = document.querySelectorAll('form.elementor-form');

  newsletterForms.forEach(form => {
    const emailInput = form.querySelector('input[name="form_fields[email]"]');
    const submitBtn = form.querySelector('button[type="submit"]');

    if (emailInput && submitBtn) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        handleNewsletterFormSubmission(form, submitBtn);
      });
    }
  });
});

function handleNewsletterFormSubmission(form, submitBtn) {
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Submitting...';
  submitBtn.disabled = true;

  const formData = new FormData(form);

  const data = {
    form_type: 'newsletter_signup',
    source: 'newsletter_section',
    timestamp: new Date().toISOString(),
    page_url: window.location.href,
    user_agent: navigator.userAgent,
    email: formData.get('form_fields[email]')
  };

  const webhookUrl = 'https://automate.axonflash.com/webhook/newsletter';

  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(() => {
      submitBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Subscribed!';
      setTimeout(() => {
        alert('Thank you for subscribing!');
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 1500);
    })
    .catch(error => {
      console.error('Error:', error);
      submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle mr-2"></i> Error';
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 3000);
      alert('Submission failed. Please try again later.');
    });
}
