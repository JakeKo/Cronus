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
        $("#architecture-upload-file").val(null);
    });
})();

function addArchitecture(architecture) {
    const json = parser.parse(architecture);
    renderNewArchitectureListItem(architecture, json);
	createApplicationBox(json);
	json.application.components.Component.forEach(function(element) {
		createComponentBox(element);
	});
	json.application.newIntents.Intent.forEach(function(element){
		createIntentBox(element);
	});
    console.log(json);
}

function renderNewArchitectureListItem(xml, json) {
    $("#architecture-list").append(architectureListItemTemplate({ plaintext: xml, object: JSON.stringify(json) }));
}

function createApplicationBox(thing){
	console.log("this is the beginning of the app box");
	console.log(thing.application.packageName);
	console.log("this is the end of the app box");
}

function createComponentBox(thing){
	console.log("this is a component");
	console.log(thing.type);
	console.log(thing.name);
	console.log(thing.IntentFilter.filter);
	console.log("this is the end of a component");
}

function createIntentBox(thing){
	console.log("this is an intent");
	console.log(thing.calledAt);
	console.log(thing.sender);
	console.log(thing.consumerMethod);
	console.log("this is the end of an intent")
}