const aliTemplate = Handlebars.compile($("#ali-template").html());
const architectureList = [];
let manifestUploaded = false;
let vulnerabilitiesUploaded = false;

// Run this function on page load
(function () {
    createArchitectureListItem();
})();

// This function is responsible for instantiating a new architecture list item and yea
function createArchitectureListItem() {
    // Push an empty object to the list so we can update it later with the manifest and vulnerabilities files
    architectureList.push({});
    const index = architectureList.length - 1;

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
            const manifest = event.target.result;
            $(`#ali-manifest-raw-${index}`).val(manifest);

            // Update the architecture list with the newly uploaded content
            architectureList[index].manifest = parser.parse(manifest);
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
            const vulnerabilities = event.target.result;
            $(`#ali-vulnerabilities-raw-${index}`).val(vulnerabilities);

            architectureList[index].vulnerabilities = parser.parse(vulnerabilities);
            // console.log(architectureList[index].vulnerabilities);
            displayDiff(calculateDiff(index - 1, index));
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

function calculateDiff(firstIndex, secondIndex) {
    const first = architectureList[firstIndex];
    const second = architectureList[secondIndex];
    return DeepDiff.diff(
        first === undefined ? {} : first.vulnerabilities.analysisReport.vulnerabilities.vulnerability,
        second.vulnerabilities.analysisReport.vulnerabilities.vulnerability
    );
}

function displayDiff(diff) {
    console.log(diff);
    const vulnerabilitiesAdded = [];
    const vulnerabilitiesRemoved = [];
    
    diff.forEach(diffInstance => {
        if (diffInstance.kind === "E") {
            vulnerabilitiesAdded.push(...diffInstance.rhs.map(item => item.type));
        } else if (diffInstance.item.kind === "D") {
            vulnerabilitiesRemoved.push(diffInstance.item.lhs.type);
        } else if (diffInstance.item.kind === "N") {
            vulnerabilitiesAdded.push(diffInstance.item.rhs.type);
        }
    });

    console.log({ vulnerabilitiesAdded, vulnerabilitiesRemoved });
}