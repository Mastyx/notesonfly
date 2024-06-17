//// js code
//const noteContainer = document.querySelector(".notes-container");
//const newNote = document.getElementById("add-note");
//const btnGroup = document.getElementById("group");
//
//const showNotes = ()=> {
//	noteContainer.innerHTML = localStorage.getItem("notes");
//}
//
//const updateStorage = ()=>{
//	localStorage.setItem("notes", noteContainer.innerHTML);
//}
//
//newNote.addEventListener("click", ()=>{
//	console.log("crea nuova nota");
//	let inputBox = document.createElement("div");
//	inputBox.className = "input-box";
//	let note = document.createElement("textarea");
//	note.id = "note";
//	let cancella = document.createElement("div");
//	cancella.id = "cancella";
//	let img = document.createElement("img");
//	img.src = "../trash.png";
//	// note.setAttribute('contentEditable', "true");
//	noteContainer.appendChild(inputBox);
//	inputBox.appendChild(note);
//	inputBox.appendChild(cancella);
//	cancella.appendChild(img);
//	note.addEventListener("click", ()=>{
//		note.focus();
//	});
//	// gestisci tab
//	note.addEventListener("keydown", (event)=>{
//		const start = note.selectionStart;
//		const end = note.selectionEnd;
//		const tabSpace = "    ";
//		// gestisce il tab
//		if (event.key === "Tab" || event.code === "Tab") {
//			event.preventDefault();
//			console.log("tab press...");
//			note.value = note.value.substring(0, start) + tabSpace + note.value.substring(end);
//			note.selectionStart = note.selectionEnd = start + 4;
//		}
//		// gestisce l'identazione
//		if ( event.key === 'Enter' || event.code === 'Enter' ) {
//			event.preventDefault();
//			const lineStart = note.value.lastIndexOf('\n', start - 1) + 1;
//			const lineText = note.value.substring(lineStart, start);
//			const leadingTabs = lineText.match(/^\s*/)[0];
//
//			note.value = note.value.substring(0, start) + '\n' +
//				leadingTabs + note.value.substring(end);
//			note.selectionStart = note.selectionEnd = start + 1 + leadingTabs.length;
//		}
//		
//	});
//
//	$(inputBox).draggable({});
//	
//	const originalWidth = $(inputBox).width();
//	const originalHeight = $(inputBox).height();
//	
//	$(inputBox).resizable({
//		// durante il resize 
//		resize : (event, ui)=>{
//			let scaleW = ui.size.width / originalWidth;
//			let scaleH = ui.size.height / originalHeight;
//			$(note).css("transform", "scale(" + scaleW + "," + scaleH + ")");
//		},
//		// alla fine 
//		stop : (event, ui)=>{
//			$(note).css("transform","scale(1 ,1)");
//			$(note).width(ui.size.widht);
//			$(note).height(ui.size.height);
//			$(note).css("height", "90%");
//			$(note).css("width", "100%");
//
//
//		},
//	});
//
//	console.log(originalWidth);
//
//	
//	// elimina nota 
//	cancella.addEventListener("click", (event)=>{
//		event.stopPropagation();
//		let confirmed = confirm("Are you sure ? ");
//		if (confirmed) {
//			event.target.parentElement.parentElement.remove();}
//	});
//});
//
//
//// raggruppa note
//const groupNote = ()=> {
//	const notes = document.querySelectorAll(".input-box");
//	let topPosition = 100;
//	notes.forEach( nota => {
//		nota.style.position = 'relative';
//		nota.style.left = '50px';=
//		nota.style.top = topPosition + "px";
//	});
//}
//
//group.addEventListener('click', ()=>{
//	groupNote();
//});

// proviamo l'approccio con le classi
document.addEventListener("DOMContentLoaded", ()=> {
	const noteContainer = document.querySelector(".notes-container");
	const newNoteBotton = document.getElementById("add-note");
	let currentFontSize = 16 ;
	let notes = [];

	class Nota {
		constructor(content, position, size, fontsize) {
			this.content = content || "";
			this.position = position || { top : 10, left : 10};
			this.size = size || { width : 200, height : 200 };
			this.fontSize = fontsize || 16;

			this.createElement();
		}

		createElement() {
			this.inputBox = document.createElement("div");
			this.inputBox.className = "input-box";
			this.inputBox.style.top = this.position.top + "px";
			this.inputBox.style.left = this.position.left + "px";
			this.inputBox.style.width = this.width + "px";
			this.inputBox.style.height = this.height + "px";

			this.note = document.createElement("textarea");
			this.note.id = "note";
			this.note.style.fontSize = this.fontSize + "px";
			this.note.value = this.content;
			
			this.cancella = document.createElement("div");
			this.cancella.id = "cancella";
			let img = document.createElement("img");
			img.src = "../trash.png";
			

			// colleghiamo il tutto 
			this.cancella.appendChild(img);
			this.inputBox.appendChild(this.note);
			this.inputBox.appendChild(this.cancella);
			noteContainer.appendChild(this.inputBox);
			
			// richiama la funzione addEventListener
			this.addEventListener();
			// richiama la funzione per il ridimensionamento e 
			// trascinamento rendere ridimensionabile e trascinabile 
			this.makeResizableAndDraggable();
		}

		// creo le funzioni 





	}
});




// sto modificando tutto per utilizzare un approccio object oriented
// creando la classe Nota questo e il codice di chat groupNote
//
//				-- -- -- -- -- -- -- -- -- -- -- -- 
//
//document.addEventListener("DOMContentLoaded", () => {
//  const noteContainer = document.querySelector(".notes-container");
//  const newNoteButton = document.getElementById("add-note");
//  let currentFontSize = 16;
//  let notes = []; // Array per tracciare le note create
//
//  class Nota {
//    constructor(content, position, size, fontSize) {
//      this.content = content || ""; // Assicura che this.content sia sempre una stringa
//      this.position = position || { top: 10, left: 10 };
//      this.size = size || { width: 200, height: 200 };
//      this.fontSize = fontSize || 16;
//
//      this.createElement();
//    }
//
//    createElement() {
//      this.inputBox = document.createElement("div");
//      this.inputBox.className = "input-box";
//      this.inputBox.style.top = this.position.top + "px";
//      this.inputBox.style.left = this.position.left + "px";
//      this.inputBox.style.width = this.size.width + "px";
//      this.inputBox.style.height = this.size.height + "px";
//
//      this.note = document.createElement("textarea");
//      this.note.id = "note";
//      this.note.style.fontSize = this.fontSize + "px";
//      this.note.value = this.content;
//
//      this.cancella = document.createElement("div");
//      this.cancella.id = "cancella";
//      let img = document.createElement("img");
//      img.src = "../trash.png";
//
//      this.cancella.appendChild(img);
//      this.inputBox.appendChild(this.note);
//      this.inputBox.appendChild(this.cancella);
//      noteContainer.appendChild(this.inputBox);
//
//      this.addEventListeners();
//      this.makeResizableAndDraggable();
//    }
//
//    addEventListeners() {
//      this.cancella.addEventListener("click", (event) => {
//        event.stopPropagation();
//        let confirmed = confirm("Sei sicuro di voler cancellare questa nota?");
//        if (confirmed) {
//          this.inputBox.remove();
//          notes = notes.filter(n => n !== this);
//          saveNotes();
//        }
//      });
//
//      this.note.addEventListener("click", () => {
//        this.note.focus();
//      });
//    }
//
//    makeResizableAndDraggable() {
//      const originalWidth = $(this.inputBox).width();
//      const originalHeight = $(this.inputBox).height();
//
//      $(this.inputBox).draggable({
//        containment: ".notes-container",
//        stop: () => {
//          this.position = {
//            top: this.inputBox.offsetTop,
//            left: this.inputBox.offsetLeft
//          };
//          saveNotes();
//        }
//      });
//
//      $(this.inputBox).resizable({
//        resize: (event, ui) => {
//          let scaleW = ui.size.width / originalWidth;
//          let scaleH = ui.size.height / originalHeight;
//
//          $(this.note).css("transform", "scale(" + scaleW + "," + scaleH + ")");
//        },
//        stop: (event, ui) => {
//          $(this.note).css("transform", "scale(1, 1)");
//          this.note.style.width = ui.size.width + "px";
//          this.note.style.height = ui.size.height + "px";
//          this.size = { width: ui.size.width, height: ui.size.height };
//          saveNotes();
//        }
//      });
//    }
//
//    updateFontSize(size) {
//      this.fontSize = size;
//      this.note.style.fontSize = size + "px";
//    }
//  }
//
//  newNoteButton.addEventListener("click", () => {
//    let nota = new Nota("", { top: 10, left: 10 }, { width: 200, height: 200 }, currentFontSize);
//    notes.push(nota);
//    saveNotes();
//  });
//
//  document.getElementById("increase-font").addEventListener("click", () => {
//    currentFontSize += 2;
//    notes.forEach(nota => {
//      nota.updateFontSize(currentFontSize);
//    });
//    saveNotes();
//  });
//
//  document.getElementById("decrease-font").addEventListener("click", () => {
//    currentFontSize -= 2;
//    notes.forEach(nota => {
//      nota.updateFontSize(currentFontSize);
//    });
//    saveNotes();
//  });
//
//  function saveNotes() {
//    const noteData = notes.map(nota => ({
//      content: nota.note.value,
//      position: nota.position,
//      size: nota.size,
//      fontSize: nota.fontSize
//    }));
//    localStorage.setItem("notes", JSON.stringify(noteData));
//  }
//
//  function loadNotes() {
//    const noteData = JSON.parse(localStorage.getItem("notes"));
//    if (noteData) {
//      notes = noteData.map(data => new Nota(data.content, data.position, data.size, data.fontSize));
//    }
//  }
//
//  loadNotes();
//});
//
//
