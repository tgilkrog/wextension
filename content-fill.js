chrome.storage.local.get('checkoutData', ({ checkoutData = {} }) => {
  const fieldMapping = {
    Email: ['email'],
    Firstname: ['Firstname', 'firstName'],
    Lastname: ['Lastname', 'lastName'],
    Company: ['Company', 'billingAddress[company]'],
    CVR: ['CVR', 'vatIds[]'],
    Zipcode: ['Zipcode', 'billingAddress[zipcode]'],
    Address: ['Address', 'billingAddress[street]'],
    Phone: ['Phone', 'billingAddress[phoneNumber]'],
    City: ['City', 'billingAddress[city]'],
  };

  for (const [key, selectors] of Object.entries(fieldMapping)) {
    const value = checkoutData[key];
    if (!value) continue;

    const selector = selectors
      .map(name => `input[name="${name}"]`)
      .map(sel => document.querySelector(sel))
      .find(el => el);

    if (selector) {
      const setValue = () => {
        selector.value = value;
        selector.dispatchEvent(new Event('input', { bubbles: true }));
      };

      if (key === 'City') {
        setTimeout(setValue, 500);
      } else {
        setValue();
      }
    }
  }
});
