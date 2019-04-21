const aliTemplate = Handlebars.compile($("#ali-template").html());
let index = 0;
let manifestUploaded = false;
let vulnerabilitiesUploaded = false;
let row=0;

// Run this function on page load
(function () {
    createArchitectureListItem();
})();

// This function is responsible for instantiating a new architecture list item and yea
function createArchitectureListItem() {
    

    // Render a new architecture list item using the template
    $("#architecture-list").append(aliTemplate({ index: index }));

    // Since new input elements were created, we need to bind event handlers
    $(`#ali-manifest-upload-${index}`).on("input", handleManifestUpload(index));
    $(`#ali-vulnerabilities-upload-${index}`).on("input", handleVulnerabilitiesUpload(index));
	index++;
}

// Since everything is index-based, we need to pass in an index parameter
// So we return an event handler (which can only accept a single event parameter) with the index
function handleManifestUpload(index) {
    return function handler(event) {
        const fileReader = new FileReader();

		fileReader.addEventListener("loadend", function (event) {
            addArchitecture(event.target.result, index);
        });
		
        // fileReader.addEventListener("loadend", function (event) {
            // $(`#ali-manifest-raw-${index}`).val(event.target.result);
            // console.log(parser.parse(event.target.result));
        // });

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

function addArchitecture(architecture,index) {
	var id = `ali-manifest-raw-${index}`;
    const json = parser.parse(architecture);
	createApplication(json, id);
	document.getElementById(id).value+="\n";
	x=1;
	json.application.components.Component.forEach(function(element) {
		createComponent(element,x++,id);
	});
	document.getElementById(id).value+="\n";
	y=1;
	row=0;
	json.application.newIntents.Intent.forEach(function(element){
		createIntent(element,y++,id);
	});
    console.log(json);
}


function createApplication(app, id){
	document.getElementById(id).value = "Application name: " + app.application.packageName + "\n";
}

function createComponent(comp,x, id){
	document.getElementById(id).value+= "Component " +`${x}`+":\nType: " + comp.type + "\nName: " + comp.name + "\nFilter: " + comp.IntentFilter.filter + "\n\n";
}

function createIntent(intent,x,id){
	document.getElementById(id).value+= "Intent " + `${x}` +":\nCalled at " + intent.calledAt + "\nSent by: " + intent.sender + "\nConsumed by: "+ intent.consumerMethod + "\n\n";
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
