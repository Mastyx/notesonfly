// js code
const noteContainer = document.querySelector(".notes-container");

const newNote = document.getElementById("add-note");

const btnGroup = document.getElementById("group");

newNote.addEventListener("click", ()=>{
	console.log("crea nuova nota");
	let inputBox = document.createElement("div");
	inputBox.className = "input-box"
	let note = document.createElement("div");
	note.id = "note";
	let cancella = document.createElement("div");
	cancella.id = "cancella";
	let img = document.createElement("img");
	img.src = "../trash.png";

	note.setAttribute('contentEditable', "true");
	noteContainer.appendChild(inputBox);
	inputBox.appendChild(note);
	inputBox.appendChild(cancella);
	cancella.appendChild(img);

	note.addEventListener("click", ()=>{
		note.focus();
	});
	// gestisci tab
	note.addEventListener("keydown", (event)=>{
		const start = note.selectionStart;
		event.preventDefault();
// sto qua !!!!
	});

	$(inputBox).draggable();

	const originalWidth = $(inputBox).width();
	const originalHeight = $(inputBox).height();
	
	$(inputBox).resizable({
		resize : (event, ui)=>{
			let scaleW = ui.size.width / originalWidth;
			let scaleH = ui.size.height / originalHeight;
			$(note).css("transform", "scale(" + scaleW + "," + scaleH + ")");
		},
		stop : (event, ui)=>{
			$(note).css("transform","scale(1 ,1)");
			$(note).width(ui.size.widht);
			$(note).height(ui.size.height);
		},
	});

	console.log(originalWidth);

	
	// elimina nota 
	cancella.addEventListener("click", (event)=>{
		event.stopPropagation();
		let confirmed = confirm("Are you sure ? ");
		if (confirmed) {
			event.target.parentElement.parentElement.remove();}
	});
});


// raggruppa note
const groupNote = ()=> {
	const notes = document.querySelectorAll(".input-box");
	let topPosition = 100;
	notes.forEach( nota => {
		nota.style.position = 'relative';
		nota.style.left = '50px';
		nota.style.top = topPosition + "px";
	});
}

group.addEventListener('click', ()=>{
	groupNote();
});








