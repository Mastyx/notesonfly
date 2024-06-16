// js code
const noteContainer = document.querySelector(".notes-container");

const newNote = document.getElementById("add-note");

const btnGroup = document.getElementById("group");


const showNotes = ()=> {
	noteContainer.innerHTML = localStorage.getItem("notes");
}

const updateStorage = ()=>{
	localStorage.setItem("notes", noteContainer.innerHTML);
}


newNote.addEventListener("click", ()=>{
	console.log("crea nuova nota");
	let inputBox = document.createElement("div");
	inputBox.className = "input-box";
	let note = document.createElement("textarea");
	note.id = "note";
	let cancella = document.createElement("div");
	cancella.id = "cancella";
	let img = document.createElement("img");
	img.src = "../trash.png";


	// note.setAttribute('contentEditable', "true");
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
		const end = note.selectionEnd;
		const tabSpace = "    ";
		// gestisce il tab
		if (event.key === "Tab" || event.code === "Tab") {
			event.preventDefault();
			console.log("tab press...");
			note.value = note.value.substring(0, start) + tabSpace + note.value.substring(end);
			note.selectionStart = note.selectionEnd = start + 4;
		}
		// gestisce l'identazione
		if ( event.key === 'Enter' || event.code === 'Enter' ) {
			event.preventDefault();
			const lineStart = note.value.lastIndexOf('\n', start - 1) + 1;
			const lineText = note.value.substring(lineStart, start);
			const leadingTabs = lineText.match(/^\s*/)[0];

			note.value = note.value.substring(0, start) + '\n' +
				leadingTabs + note.value.substring(end);
			note.selectionStart = note.selectionEnd = start + 1 + leadingTabs.length;
		}
		
	});

	$(inputBox).draggable({});
	
	const originalWidth = $(inputBox).width();
	const originalHeight = $(inputBox).height();
	
	$(inputBox).resizable({
		// durante il resize 
		resize : (event, ui)=>{
			let scaleW = ui.size.width / originalWidth;
			let scaleH = ui.size.height / originalHeight;
			$(note).css("transform", "scale(" + scaleW + "," + scaleH + ")");
		},
		// alla fine 
		stop : (event, ui)=>{
			$(note).css("transform","scale(1 ,1)");
			$(note).width(ui.size.widht);
			$(note).height(ui.size.height);
			$(note).css("height", "90%");
			$(note).css("width", "100%");


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


document.addEventListener("keydown", (event)=>{
	if (event.ctrlKey && event.key === 's') {
		event.preventDefault();
		console.log('Salvato');
		const notes = document.querySelectorAll(".input-box");
		notes.forEach( nota => {
			nota.onkeyup = ()=>{
				console.log("salvato");
				updateStorage();
			}				
		});
	}
});

window.onload = ()=>{
	showNotes();
}




