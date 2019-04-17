const settingsIcon = document.getElementById("settings-icon");

M.Dropdown.init(settingsIcon, {
  constrainWidth: false,
  closeOnClick: false
});

const settingsDropdownInstance = M.Dropdown.getInstance(settingsIcon);

document.getElementById("settings-form").onsubmit = event => {
  if (event) {
    event.preventDefault();
  }
  settingsDropdownInstance.close();
};

document.getElementById("settings-save-btn").onclick = () => {
  const nameValue = document.getElementById("name_input").value;
  const locationValue = document.getElementById("location_input").value;

  chrome.storage.sync.set(
    {
      settings: { name: nameValue, location: locationValue }
    },
    updateName
  );
};
