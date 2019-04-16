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
	var c = document.getElementById("myCanvas");
	var ctx = c.getContext("2d");
	ctx.canvas.width  = window.innerWidth*.5;
	ctx.canvas.height = window.innerHeight*.5;
    const json = parser.parse(architecture);
    renderNewArchitectureListItem(architecture, json);
	createApplicationBox(json,ctx);
	x=-1;
	json.application.components.Component.forEach(function(element) {
		createComponentBox(element,x++,ctx);
	});
	y=-1;
	json.application.newIntents.Intent.forEach(function(element){
		createIntentBox(element,y++,ctx);
	});
    console.log(json);
}

function renderNewArchitectureListItem(xml, json) {
    $("#architecture-list").append(architectureListItemTemplate({ plaintext: xml, object: JSON.stringify(json) }));
}

function createApplicationBox(thing,ctx){

	// Red rectangle
	ctx.beginPath();
	ctx.lineWidth = "6";
	ctx.strokeStyle = "red";
	ctx.rect(5, 5, ctx.canvas.width-10, ctx.canvas.height-10); 
	ctx.stroke();
	
	ctx.fillStyle = "red";
    ctx.font = "10pt sans-serif";
    ctx.fillText(thing.application.packageName, 10, 30);
}

function createComponentBox(thing,x,ctx){
	// Green rectangle
	ctx.beginPath();
	ctx.lineWidth = "4";
	ctx.strokeStyle = "green";
	if(x<ctx.canvas.width){
		ctx.rect(50+x*110, 100, 100, 40);
		ctx.stroke();
	}else{
		y=ctx%x;
		z=ctx/x;
		ctx.rect(50+y*110, 100+z*50, 100, 40);
		ctx.stroke();
	}
	console.log("this is a component");
	console.log(thing.type);
	console.log(thing.name);
	console.log(thing.IntentFilter.filter);
	console.log("this is the end of a component");
}

function createIntentBox(thing,x,ctx){
	ctx.beginPath();
	ctx.lineWidth = "4";
	ctx.strokeStyle = "blue";
	if(x<ctx.canvas.width){
		ctx.rect(70+x*110, .5*ctx.canvas.height, 100, 40);
		ctx.stroke();
	}else{
		y=ctx%x;
		z=ctx/x;
		ctx.rect(70+y*110, z*50+.5*ctx.canvas.height, 100, 40);
		ctx.stroke();
	}
	console.log("this is an intent");
	console.log(thing.calledAt);
	console.log(thing.sender);
	console.log(thing.consumerMethod);
	console.log("this is the end of an intent");
}