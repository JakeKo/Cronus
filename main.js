// Run this function on page load
(function () {
    // Listen for the input event when a file is uploaded by the user
    $("#architecture-upload-file").on("input", function (event) {
        const fileReader = new FileReader();
        fileReader.addEventListener("loadend", function(event) {
            addArchitecture(event.target.result);
        });

        fileReader.readAsText(event.target.files[0]);
    });
})();

function addArchitecture(architecture) {
    renderNewArchitectureListItem(architecture);

    // Do other things for adding architectures
}

function renderNewArchitectureListItem(architecture) {
    const architectureListItem = $("<textarea></textarea>");
    architectureListItem.addClass("architecture-list-item");
    architectureListItem.val(architecture);

    $("#architecture-list").append(architectureListItem);
}