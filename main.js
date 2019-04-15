const architectureListItemTemplate = Handlebars.compile($("#ali-template").html());

// Run this function on page load
(function () {
    // Listen for the input event when a file is uploaded by the user
    $("#architecture-upload-file").on("input", function (event) {
        const fileReader = new FileReader();
        fileReader.addEventListener("loadend", function (event) {
            addArchitecture(event.target.result);
        });

        fileReader.readAsText(event.target.files[0]);
    });
})();

function addArchitecture(architecture) {
    const json = parser.parse(architecture);
    renderNewArchitectureListItem(architecture, json);

    // Do other things for adding architectures
    console.log(json);
}

function renderNewArchitectureListItem(xml, json) {
    $("#architecture-list").append(architectureListItemTemplate({ plaintext: xml, object: JSON.stringify(json) }));
}