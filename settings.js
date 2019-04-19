const settingsIcon = document.getElementById("settings-icon");

M.Dropdown.init(settingsIcon, {
  constrainWidth: false,
  closeOnClick: false
});

const settingsDropdownInstance = M.Dropdown.getInstance(settingsIcon);

const saveAndUpdateValues = () => {
  const nameValue = document.getElementById("name_input").value;
  const locationValue = document.getElementById("location_input").value;

  chrome.storage.sync.set(
    {
      settings: { name: nameValue, location: locationValue }
    },
    () => {
      updateName();
      updateWeather();
    }
  );
};

const initSettings = () => {
  chrome.storage.sync.get("settings", result => {
    document.getElementById("name_input").value = result.settings.name;
    document.getElementById("location_input").value = result.settings.location;
    M.updateTextFields();
  });
};

document.getElementById("settings-form").onsubmit = event => {
  if (event) {
    event.preventDefault();
  }
  settingsDropdownInstance.close();
  saveAndUpdateValues();
};
