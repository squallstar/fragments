readFile = function (file, onLoadCallback) {
  let reader = new FileReader();

  reader.onload = function (event) {
    var contents=event.target.result;
    onLoadCallback(contents);
  };

  reader.readAsText(file);
};