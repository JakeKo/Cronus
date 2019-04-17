const aliTemplate = Handlebars.compile($("#ali-template").html());
let index = -1;
let manifestUploaded = false;
let vulnerabilitiesUploaded = false;

// Run this function on page load
(function () {
    createArchitectureListItem();
})();

// This function is responsible for instantiating a new architecture list item and yea
function createArchitectureListItem() {
    index++;

    // Render a new architecture list item using the template
    $("#architecture-list").append(aliTemplate({ index: index }));

    // Since new input elements were created, we need to bind event handlers
    $(`#ali-manifest-upload-${index}`).on("input", handleManifestUpload(index));
    $(`#ali-vulnerabilities-upload-${index}`).on("input", handleVulnerabilitiesUpload(index));
}

// Since everything is index-based, we need to pass in an index parameter
// So we return an event handler (which can only accept a single event parameter) with the index
function handleManifestUpload(index) {
    return function handler(event) {
        const fileReader = new FileReader();

        fileReader.addEventListener("loadend", function (event) {
            $(`#ali-manifest-raw-${index}`).val(event.target.result);
            console.log(parser.parse(event.target.result));
        });

        fileReader.readAsText(event.target.files[0]);
        $(`#ali-manifest-upload-label-${index}`).hide();
        $(`#ali-manifest-upload-${index}`).hide();
        
        // If the vulnerabilies have also been already uploaded, then create a new ALI and reset the flag
        if (vulnerabilitiesUploaded) {
            createArchitectureListItem();
            vulnerabilitiesUploaded = false;
        } else {
            manifestUploaded = true;
        }
    }
}

// Since everything is index-based, we need to pass in an index parameter
// So we return an event handler (which can only accept a single event parameter) with the index
function handleVulnerabilitiesUpload(index) {
    return function handler(event) {
        const fileReader = new FileReader();

        fileReader.addEventListener("loadend", function (event) {
            $(`#ali-vulnerabilities-raw-${index}`).val(event.target.result);
            console.log(parser.parse(event.target.result));
        });

        fileReader.readAsText(event.target.files[0]);
        $(`#ali-vulnerabilities-upload-label-${index}`).hide();
        $(`#ali-vulnerabilities-upload-${index}`).hide();
        
        // If the manifest has also been already uploaded, then create a new ALI and reset the flag
        if (manifestUploaded) {
            createArchitectureListItem();
            manifestUploaded = false;
        } else {
            vulnerabilitiesUploaded = true;
        }
    }
}