const helloTextElem = document.getElementById("hello_text");

const updateName = () => {
  chrome.storage.sync.get("settings", result => {
    helloTextElem.innerHTML = `hi ${result.settings.name}.`;
  });
};
