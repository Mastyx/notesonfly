

document.addEventListener("DOMContentLoaded", ()=> {
	
	const noteContainer = document.querySelector(".notes-container");
	const newNoteButton = document.getElementById("add-note");
	const resetBtn = document.getElementById("reset-btn");	
	let notes = [];
	let zIndexCount = 1;

	
	class Nota {
		constructor(content, position, size, fontsize) {
			this.id = 'note-'+ new Date().getTime(); 
			this.content = content || "";
			this.position = position || { top : 100, left : 10};
			this.size = size || { width : 400, height : 300 };
			this.fontSize = fontsize || 16 ;
			this.createElement();
		}
		// il costruttore richiama la nota
		createElement() {
			// div cancella contenente l'immagine cestino 
			this.cancella = document.createElement("div");
			this.cancella.id = "cancella";
			let img = document.createElement("img");
			img.src = "../trash.png";

			this.inputBox = document.createElement("div");
			this.inputBox.className = "input-box";
			this.inputBox.style.top = this.position.top + "px";
			this.inputBox.style.left = this.position.left + "px";
			this.inputBox.style.width = this.size.width + "px";
			this.inputBox.style.height = this.size.height + "px";
			this.inputBox.style.zIndex = ++zIndexCount;
			// elemento nota 
			this.note = document.createElement("textarea");
			this.note.id = this.id; 
			this.note.style.fontSize = this.fontSize + "px";
			this.note.value = this.content;

			// gestione size testo
			this.containerBtn = document.createElement("div");
			this.containerBtn.id = "containerBtn";
		
			this.increaseFont = document.createElement("button");
			this.increaseFont.id = "btnIncreaseFont";
			this.increaseFont.innerText = "+";

			this.decreaseFont = document.createElement("button");
			this.decreaseFont.id = "btnDecreaseFont";
			this.decreaseFont.innerText = "-";

		
			// colleghiamo il tutto 
			this.cancella.appendChild(img);
			this.containerBtn.appendChild(this.increaseFont);
			this.containerBtn.appendChild(this.decreaseFont);
			this.containerBtn.appendChild(this.cancella);
		
			this.inputBox.appendChild(this.note);
			this.inputBox.appendChild(this.containerBtn);
			noteContainer.appendChild(this.inputBox);
			
			// ascoltatore
			this.addEventListener();
			// ascoltatore ridimensionamento e trascinamento 
			this.makeResizableAndDraggable();
		}

		// create function
		addEventListener() {
			this.increaseFont.addEventListener("click", ()=>{
				++this.fontSize;
				this.updateFontSize(this.fontSize);	
			});
			this.decreaseFont.addEventListener("click", ()=>{
				--this.fontSize;
				this.updateFontSize(this.fontSize);	
			});

			this.cancella.addEventListener("click", (event)=> {
				event.stopPropagation();
				console.log("Cancella");
				let confirmed = confirm("Are you sure ?");
				if (confirmed) {
					this.inputBox.remove();
					notes = notes.filter( n => n !== this);
					saveNotes();
				} 
			});
			
			this.inputBox.addEventListener("click", ()=>{
				this.inputBox.focus();
				console.log('click focus');
				this.inputBox.style.zIndex = ++zIndexCount;
			});

			this.note.addEventListener('click', ()=>{
				// aggiungio il focus sulla nota(textarea) 
				// altrimenti su dis mobile non fa scrivere 
				this.note.focus();
			});
	
			// ascoltatore input
			this.note.addEventListener("input", ()=>{
				this.content = this.note.value;	
				saveNotes();
			});
			// disable drag quando tocco la textarea (note)
			this.note.addEventListener("touchstart", (event)=>{
				this.inputBox.draggable("disable");
			});

			// riabilito il drag 
			this.note.addEventListener("touchend", (event)=>{
				this.inputBox.draggable("enable");
			});

			// gestione del Tab e identazione
			this.note.addEventListener("keydown", (event)=>{
				const start = this.note.selectionStart;
				const end = this.note.selectionEnd;
				const tabspace = "   ";
				if (event.key === 'Tab' || event.code === 'Tab') {
					event.preventDefault();
					console.log('tab');
					this.note.value = 
						this.note.value.substring(0, start) + 
							tabspace + this.note.value.substring(end);
					this.note.selectionStart = this.note.selectionEnd = start + 3;
				}
				// gestire identazione quando press enter
				if (event.key === "Enter" || event.code === "Enter") {
					event.preventDefault();
					const lineStart = this.note.value.lastIndexOf('\n', start - 1)+1;
					const lineText = this.note.value.substring(lineStart, start);
					const leadingTabs = lineText.match(/^\s*/)[0];
					this.note.value = this.note.value.substring(0, start) + '\n' +
						leadingTabs + this.note.value.substring(end);
					this.note.selectionStart = this.note.selectionEnd = start + 1 + leadingTabs.length;
					setTimeout(()=>{
						this.note.scrollTop = this.note.scrollHeight;
					}, 0 );
				}
			});	
		}

		// gestisce il trascinamento
		makeResizableAndDraggable() {
			const originalWidth = $(this.inputBox).width();
			const originalHeight = $(this.inputBox).height();
			
			$(this.inputBox).draggable({
				containment : '.note-container',
				drag : ()=>{
				},
				stop : ()=> {
					this.position = {
						top : this.inputBox.offsetTop,
						left : this.inputBox.offsetLeft
					};
					saveNotes();
				}
			});

			$(this.inputBox).resizable({
				resize : (event, ui) => {
				},
				stop: (event, ui) => {
					this.note.style.width = "100%";
					this.note.style.height = "100%";
					this.size = { width : ui.size.width , height : ui.size.height };
					saveNotes();
				},
			});
		}

		// gestire il font size 
		updateFontSize(size) {
			this.fontSize = size;
			this.note.style.fontSize = size + "px";
			saveNotes();
		}

		//reset position e resize all notes
		resetPositionResize(index) {
			const originalWidth = 400;
			const originalHeight = 300;
			const margin = 10;
			const top = 100 + (originalHeight + margin) * index;

			this.inputBox.style.width = originalWidth + 'px';
			this.inputBox.style.height = originalHeight + 'px';
			this.inputBox.style.top = top + 'px';
			this.inputBox.style.left = "10px";

			this.note.style.width = "100%";
			this.note.style.height = `100%`;

			this.size = {width: originalWidth, height : originalHeight };
			this.position = {top: top, left: 10};
			saveNotes();
		}
		 
	}
	// -----------end class---------------------------------------------
	
	newNoteButton.addEventListener("click", ()=> {

		let nota = new Nota("", {top: 100 + notes.length*5 , left: 10+ notes.length*5}, {width : 400, height : 300} );
		notes.push(nota);
		saveNotes();
	});

	const saveNotes = ()=> {
		const noteData = notes.map(nota => ({
			id : nota.id, 
			content : nota.note.value,	
			position : nota.position,
			size: nota.size,
			fontSize: nota.fontSize
		}));
		localStorage.setItem("notes", JSON.stringify(noteData));
	}

	const loadNotes = ()=> {
		// carica le note di localStorage
		const noteData = JSON.parse(localStorage.getItem('notes'));
		console.log('Loding Note ... ');
		if (noteData) {
			notes = noteData.map(data => new Nota(data.content, data.position, data.size, data.fontSize));
		}
	}

	const resetResizePos = ()=>{
		notes.forEach( (nota, index)=> {
			nota.resetPositionResize(index);
		});
	}
	resetBtn.addEventListener("click", ()=>{
		resetResizePos();
	})


	loadNotes();
	// richiama la funzione per caricare le note


});



