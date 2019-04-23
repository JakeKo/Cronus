const aliTemplate = Handlebars.compile($("#ali-template").html());
const diffItemTemplate = Handlebars.compile($("#diff-item-template").html());

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
            addArchitecture(manifest, index);
        });

        fileReader.readAsText(event.target.files[0]);
        $(`#ali-manifest-upload-form-${index}`).hide();
        $(`#ali-manifest-raw-${index}`).show();

        // If the vulnerabilies have also been already uploaded, then create a new ALI and reset the flag
        if (vulnerabilitiesUploaded) {
            createArchitectureListItem();
            vulnerabilitiesUploaded = false;
        } else {
            manifestUploaded = true;
        }
    }
}

function addArchitecture(architecture, index) {
    var id = `ali-manifest-raw-${index}`;
    const json = parser.parse(architecture);
    createApplication(json, id);
    document.getElementById(id).value += "\n";
    x = 1;
    json.application.components.Component.forEach(function (element) {
        createComponent(element, x++, id);
    });
    document.getElementById(id).value += "\n";
    y = 1;
    json.application.newIntents.Intent.forEach(function (element) {
        createIntent(element, y++, id);
    });
    console.log(json);
}


function createApplication(app, id) {
    document.getElementById(id).value = "Application name: " + app.application.packageName + "\n";
}

function createComponent(comp, x, id) {
    document.getElementById(id).value += "Component " + `${x}` + ":\nType: " + comp.type + "\nName: " + comp.name + "\nFilter: " + comp.IntentFilter.filter + "\n\n";
}

function createIntent(intent, x, id) {
    document.getElementById(id).value += "Intent " + `${x}` + ":\nCalled at " + intent.calledAt + "\nSent by: " + intent.sender + "\nConsumed by: " + intent.consumerMethod + "\n\n";
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
            const rawDiff = calculateRawDiff(index - 1, index);
            const diff = calculateVulnerabilityDiff(rawDiff);
            displayDiff(diff, index);
        });

        fileReader.readAsText(event.target.files[0]);
        $(`#ali-vulnerabilities-upload-form-${index}`).hide();
        $(`#ali-vulnerabilities-diff-${index}`).show();

        // If the manifest has also been already uploaded, then create a new ALI and reset the flag
        if (manifestUploaded) {
            createArchitectureListItem();
            manifestUploaded = false;
        } else {
            vulnerabilitiesUploaded = true;
        }
    }
}

function calculateRawDiff(firstIndex, secondIndex) {
    const first = architectureList[firstIndex];
    const second = architectureList[secondIndex];

    return DeepDiff.diff(
        first === undefined ? {} : first.vulnerabilities.analysisReport.vulnerabilities.vulnerability,
        second.vulnerabilities.analysisReport.vulnerabilities.vulnerability
    );
}

function calculateVulnerabilityDiff(diff = []) {
    const vulnerabilities = { added: [], removed: [] };

    diff.forEach(diffInstance => {
        if (diffInstance.kind === "E") {
            vulnerabilities.added.push(...diffInstance.rhs.map(item => item.type));
        } else if (diffInstance.item.kind === "D") {
            vulnerabilities.removed.push(diffInstance.item.lhs.type);
        } else if (diffInstance.item.kind === "N") {
            vulnerabilities.added.push(diffInstance.item.rhs.type);
        }
    });
    
    return vulnerabilities;
}

function displayDiff(diff, index) {
    const diffElement = $(`#ali-vulnerabilities-diff-${index}`);

    if (diff.added.length === 0 && diff.removed.length === 0) {
        diffElement.html("<i>No vulnerabilities added or removed</i>")
    }

    diff.added.forEach(diffItem => diffElement.append(diffItemTemplate({ operation: "added", operationName: "Added", name: diffItem })));
    diff.removed.forEach(diffItem => diffElement.append(diffItemTemplate({ operation: "removed", operationName: "Removed", name: diffItem })));
}
