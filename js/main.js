import { letters } from "./data.js";

document.addEventListener("DOMContentLoaded", ()=> {
	const noteContainer = document.querySelector(".notes-container");
	const newNoteButton = document.getElementById("add-note");
	const resetBtn = document.getElementById("reset-btn");
	const info = document.getElementById("info");
	
	const btnSave = document.getElementById("btn-save");
	const dnlButton = document.getElementById("dnl-button");
	let unsavedChanges = false; // flag for changes

	const btnLoad = document.getElementById('btn-load');
	const fileInput = document.getElementById("fileLoadContainer");
	
	// btn erase all notes
	const btnClearAllNotes = document.getElementById("clear-notes-btn");
	const percentValue	= document.getElementById("percent");


	const btnArtTitle = document.getElementById("btn-art-title");
	const artTitleContainer = document.querySelector(".art-titleContainer");
	const btnDrawTitle = document.getElementById("btn-draw-title");
	const btnCopyClipboard = document.getElementById("btn-copy-clipboard");
	
	const inputParola = document.getElementById("parola");
	const areaTitle = document.getElementById("art-titleArea");

	let notes = [];
	let zIndexCount = 1;

	// per i linking
	let linkingMode = false;
	let firstNote = null;
	let lines = [];
	
  // -------------------------------------------------- //
	// inizio della classe Nota per creare istanze note	
	class Nota {
		constructor(content, position, size, fontsize, id ) {
			this.id = id || 'note-'+ new Date().getTime(); 
			this.content = content || "";
			this.position = position || { top : 500, left : 10};
			this.size = size || { width : 400, height : 300 };
			this.fontSize = fontsize || 16 ;
			this.createElement();
		}
		// il costruttore richiama la nota
		createElement() {
			// div cancella contenente l'immagine cestino 
			this.cancella = document.createElement("button");
			this.cancella.id = "cancella";
			this.cancella.innerHTML = "X";
			this.cancella.title = "remove this note"

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
			this.note.setAttribute("tabindex", "0");
			this.note.setAttribute('spellcheck', 'false');
			this.note.style.fontSize = this.fontSize + "px";
			this.note.value = this.content;

			// gestione size testo
			this.containerBtn = document.createElement("div");
			this.containerBtn.id = "containerBtn";
			this.containerBtn.style.display = "none";
			this.containerBtn.style.opacity = "0";
			this.containerBtn.style.transition = "opacity 0.5s";
		
			this.increaseFont = document.createElement("button");
			this.increaseFont.id = "btnIncreaseFont";
			this.increaseFont.innerText = "+";

			this.decreaseFont = document.createElement("button");
			this.decreaseFont.id = "btnDecreaseFont";
			this.decreaseFont.innerText = "-";

			// btn add link 
			this.linkButton = document.createElement("button");
			this.linkButton.id = 'btnLink';
			this.linkButton.innerHTML = "<i class='bx bx-link'></i>";
			this.linkButton.title = "link";

			// btn remove link 
			this.unlinkButton = document.createElement("button");
			this.unlinkButton.id = "btnUnlink";
			this.unlinkButton.innerHTML = "<i class='bx bx-unlink'></i>";
			this.unlinkButton.title = "unlink";
			
			// segno muovi nota 
			this.moveNote = document.createElement("p");
			this.moveNote.id = "moveNote";
			this.moveNote.innerHTML = "<i class='bx bx-move'></i>"
		
			// colleghiamo il tutto 
			//this.cancella.appendChild(img);
			this.containerBtn.appendChild(this.increaseFont);
			this.containerBtn.appendChild(this.decreaseFont);
			this.containerBtn.appendChild(this.linkButton);
			this.containerBtn.appendChild(this.unlinkButton);
			this.containerBtn.appendChild(this.cancella);
		
			this.inputBox.appendChild(this.note);
			this.inputBox.appendChild(this.containerBtn);
			this.inputBox.appendChild(this.moveNote);

			noteContainer.appendChild(this.inputBox);
			
			// ascoltatore
			this.addEventListener();
			// ascoltatore ridimensionamento e trascinamento 
			this.makeResizableAndDraggable();
		}

		// create function
		addEventListener() {

			// ascolta il pulsante collegamenti
			this.linkButton.addEventListener("click", ()=>{
				startLinking(this);
			});
			// add listener for unlinkButton
			this.unlinkButton.addEventListener("click", ()=>{
				startUnlinking(this);
			});

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
					this.removeLinks();
					this.setUnsavedChange(true);
					saveNotes();
				} 
			});
			
			this.inputBox.addEventListener("click", ()=>{
				this.inputBox.focus();
				this.inputBox.style.zIndex = ++zIndexCount;
			});

			this.note.addEventListener('click', ()=>{
				// aggiungo il focus sulla nota(textarea) 
				// altrimenti su dis mobile non fa scrivere 
				notes.forEach(note => note.inputBox.style.boxShadow = "0 0 10px #000")
				this.note.focus();
				this.inputBox.style.boxShadow = "0 0 10px #00fafa"
			});
			

			// hidden button when focus lost 
			let isFocused = false;
			const showButtons = ()=>{
				this.containerBtn.style.display = 'flex';
				setTimeout( ()=>{
					this.containerBtn.style.opacity = 1;
				});
			}
			const hiddenButtons = ()=> {
				this.containerBtn.style.display = 'none';
				setTimeout( ()=>{
					this.containerBtn.style.opacity = 0;
				}, 500);
			}

			this.note.addEventListener("focus", ()=>{
				isFocused = true;
				showButtons();
			});
			this.note.addEventListener("blur", ()=>{
				isFocused = false;
				setTimeout(()=>{
					if(!isFocused) hiddenButtons();
				}, 300);
			});
			this.inputBox.addEventListener("focus", ()=>{
				isFocused = true;
				showButtons();
			}, true);
			this.inputBox.addEventListener("blur", ()=>{
				isFocused = false;
				setTimeout( ()=>{
					if(!isFocused) hiddenButtons();
				}, 300)
			}, true);
	
			// listener input
			this.note.addEventListener("input", ()=>{
				this.content = this.note.value;	
				this.setUnsavedChange(true);
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
					this.note.selectionStart = 
						this.note.selectionEnd = 
							start + 1 + leadingTabs.length;
					
					// controla se il cursore e alla fine della pagina per non farlo scomparire
					const isAtBottom = this.note.scrollHeight - 
							this.note.scrollTop === this.note.clientHeight;
					setTimeout(() => {
						if (isAtBottom) {
							const lineHeight = parseInt(window.getComputedStyle(this.note).lineHeight, 10);
							this.note.scrollTop += lineHeight * 5;
						} else {
							// Assicurati che il cursore sia visibile
							const cursorPosition = this.note.selectionEnd;
							const lineHeight = parseInt(window.getComputedStyle(this.note).lineHeight, 10);
							const cursorY = Math.floor(cursorPosition / this.note.cols) * lineHeight;
							if (cursorY > this.note.scrollTop + this.note.clientHeight - lineHeight) {
								this.note.scrollTop = cursorY - this.note.clientHeight + lineHeight;
							}
						}
					}, 0);
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
					if (lines) updateLines();
					this.note.focus();
				},
				stop : ()=> {
					this.position = {
						top : this.inputBox.offsetTop,
						left : this.inputBox.offsetLeft
					};
					this.setUnsavedChange(true);
					saveNotes();
				}
			});

			$(this.inputBox).resizable({
				resize : (event, ui) => {
					if (lines) updateLines();
				},
				stop: (event, ui) => {
					this.note.style.width = "100%";
					this.note.style.height = "100%";
						this.size = { width : ui.size.width , height : ui.size.height };
					this.setUnsavedChange(true);
					saveNotes();
					if (lines) updateLines();
				},
			});
		}

		// fonts management
		updateFontSize(size) {
			this.fontSize = size;
			this.note.style.fontSize = size + "px";
			this.setUnsavedChange(true);
			saveNotes();
		}

		// reset size and position 
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
			this.setUnsavedChange(true);
			saveNotes();
		}

		removeLinks() {
			lines = lines.filter(lineObj => {
                if (lineObj.start === this.id || lineObj.end === this.id) {
                    lineObj.line.remove();
                    return false;
                }
                return true;
            });
			this.setUnsavedChange(true);
            saveLinks();
		}

		bringToFront() {
			// ripristina lo sfondo delle altre note
			notes.forEach(note => note.inputBox.style.boxShadow ="0 0 10px #000")	
			this.inputBox.style.boxShadow = "0 0 10px #00fafa";
			this.inputBox.style.zIndex = ++zIndexCount;

		}
		// controlla se ci sono stati cambiamenti	
		setUnsavedChange(hasChanges) {
			unsavedChanges = hasChanges;
			updateSaveButtonVisual();
		}


	}
	// -----------end class---------------------------------------------




	// function update btn-save visual (change color) 
	const updateSaveButtonVisual = ()=>{
		if (unsavedChanges) {
			btnSave.style.background = '#ff8000';
		} else {
			btnSave.style.background = '#333'
		}
	}
	// create new note
	newNoteButton.addEventListener("click", (event)=> {
		// recupera la posizione dell'ultima nota e aggiunge 10
		let nota;
		if (notes.length > 0) {
			const position = {
				top : notes[notes.length-1].position.top + 10,
				left : notes[notes.length-1].position.left + 10
			};
					// crea la nuova nota passando la position
			nota = new Nota("", position, 
				{	
					width : 400, 
					height : 300 
				});

		} else {
			// nel caso di prima nota viene 
			nota = new Nota("", {
				top : 100 + notes.length*5,
				left : 10 + notes.length*5
			}, 
			{
				width : 400,
				height : 300
			},

			);

		}
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
		// load notes in localStorage 
		const noteData = JSON.parse(localStorage.getItem('notes'));
		console.log('Loding Note ... ', noteData);
		if (noteData) {
			notes = noteData.map(data => new Nota(
				data.content, 
				data.position, 
				data.size, 
				data.fontSize,
				data.id ));
			loadLinks();
		}
	}
	// reset notes position 
	const resetResizePos = ()=>{
		notes.forEach( (nota, index)=> {
			nota.resetPositionResize(index);
		});
	}
	resetBtn.addEventListener("click", ()=>{
		resetResizePos();
		updateLines();
	})

	
	// links management
	const startLinking = (note)=>{
		const load_all_notes = JSON.parse(localStorage.getItem('notes'));

		if (!linkingMode) {
			linkingMode = true;
			firstNote = note;
			note.inputBox.style.border = "1px solid red";
		} else {
			linkingMode = false;
			if (firstNote !== note) {

				createLink(firstNote, note);
			}
			firstNote.inputBox.style.border = "";
			firstNote = null;
		}
	}

	const startUnlinking = (note) => {
		if (!linkingMode) {
			linkingMode = true;
			firstNote = note;
			note.inputBox.style.border = "1px solid red";
		} else {
			linkingMode = false;
			if (firstNote !== note) {
				removeLinks(firstNote, note);
			}
			firstNote.inputBox.style.border = "";
			firstNote = null;
		}
	}

	const createLink = (note1, note2)=>{
		if (!note1 || !note2) return; // aggiungi questa linea
		let line = new LeaderLine(
			note1.inputBox,
			note2.inputBox,
			{ startPlug : 'square'}
		);
		lines.push({ line: line, start: note1.id, end: note2.id });
		saveLinks();
	}

	const removeLinks = (note1, note2)=> {
		lines = lines.filter(lineObj => { 
		if ((lineObj.start === note1.id && lineObj.end === note2.id) || 
            (lineObj.start === note2.id && lineObj.end === note1.id)) {
            lineObj.line.remove();
            return false;
        }
        return true;
		});
		saveLinks();
	} 

	const saveLinks = ()=> {
		const linkData = lines.map(line => ({
			startId: line.start,
			endId: line.end
		}));
		localStorage.setItem("links", JSON.stringify(linkData));
	};

	const loadLinks = ()=> {
		const linkData = JSON.parse(localStorage.getItem('links'));
		if (linkData) {
			linkData.forEach(link => {
				const startNote = notes.find(note => note.id === link.startId);
				const endNote = notes.find(note => note.id === link.endId);
				if (startNote && endNote) {
					const line = new LeaderLine(
						startNote.inputBox,
						endNote.inputBox
					);
					lines.push({ start: link.startId, end: link.endId, line: line });
				} else {
					console.warn(`Unable to find start or end note for link: ${link.startId} - ${link.endId}`)
				}
			});
		}
	};

	function updateLines() {
		lines.forEach(lineObj => {
            const startEl = document.getElementById(lineObj.start).parentElement;
            const endEl = document.getElementById(lineObj.end).parentElement;
            if (startEl && endEl) {
                lineObj.line.position();
            }
        });
    }
	

	document.addEventListener("keydown", (event)=>{
		// listener for ctrl  + left arrow or right arrow
		if (event.ctrlKey && 
				(event.key === "ArrowLeft" || 
				event.key === "ArrowRight")) 
		{
			event.preventDefault();
			navigateNotes(event.key);
		}
	});

	const navigateNotes = (direction)=>{
		if (notes.lenght === 0) return;
		const focusNotes = document.activeElement;
		let currentIndex = notes.findIndex(note => note.note === focusNotes);

		if (currentIndex === -1) {
			currentIndex = 0;
		} else {
			// move
			if( direction === "ArrowLeft") {
				currentIndex = (currentIndex === 0) ? notes.length - 1 : currentIndex - 1;
			} else if (direction === "ArrowRight") {
				currentIndex = (currentIndex === notes.length - 1) ? 0 : currentIndex + 1;
			}
		}
		notes[currentIndex].bringToFront();
		notes[currentIndex].note.focus();
	}


	// create note for info 
	const createInfoNote = ()=>{
		let defaultNoteContent = '';

		fetch('info.txt')
			.then(response => response.text())
			.then(data => {
				defaultNoteContent = data;
				const defaultPosition = { top: 100, left: 10 };
				const defaultSize = { width: 600, height: 400 };
				const defaultFontSize = 13;
				const nota = new Nota(defaultNoteContent, defaultPosition, defaultSize, defaultFontSize);
				notes.push(nota);
			})
			.catch(error => console.error("info.txt not load !!! " + error));
	}

	info.addEventListener("click", ()=>{
		createInfoNote();
	});



	// ------------------ save notes in download folder -----------
	let togglefileNameContainer = false; 
	const showFileNameInput = ()=> {
		if (!togglefileNameContainer) {
			togglefileNameContainer = true;
			document.getElementById("fileNameContainer").style.display = "flex";

		} else {
			togglefileNameContainer = false
			document.getElementById("fileNameContainer").style.display = "none";
		} 
	}
	btnSave.addEventListener("click", ()=>{ 
		showFileNameInput();
	})

	const downloadNotes = ()=> {
		const fileName = document.getElementById("fileNameInput").value || "notes";
		
		const notes = JSON.parse(localStorage.getItem('notes')) || [];
		const links = JSON.parse(localStorage.getItem('links')) || [];

		const notesData = notes.map(note => ({
			id : note.id,
			content: note.content,
			position: note.position,
			size: note.size,
			fontSize: note.fontSize
		}));

		const data = {
			notes : notesData,
			links : links
		}

		const blob = new Blob(
			[JSON.stringify(data, null, 2)], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = `${fileName}.json`;
		a.click();
		URL.revokeObjectURL(url);
		console.log('Salvato : ' + fileName);
		// Nascondi il contenitore dell'input dopo il download
		document.getElementById('fileNameContainer').style.display = 'none';
		togglefileNameContainer = false;


	}
	dnlButton.addEventListener("click", ()=>{
		unsavedChanges = false; 
		downloadNotes();
		updateSaveButtonVisual();
	});
	//------------------ end save notes in download folder ----------
	//
	//
	let toggleFileLoadContainer	 = false;
	const showFileLoadContainer = ()=> {
		if(!toggleFileLoadContainer) {
			fileInput.style.display = "flex";
			toggleFileLoadContainer = true;
		} else {
			fileInput.style.display = "none";
			toggleFileLoadContainer = false;
		}
	}
	btnLoad.addEventListener("click", ()=>{
		showFileLoadContainer();
	});
	

	const loadNotesFromFile = (data)=> {
		        // Cancella tutte le note e i collegamenti esistenti
        noteContainer.innerHTML = '';
        notes = [];
        lines.forEach(lineObj => lineObj.line.remove());
        lines = [];

        // Crea nuove note
        data.notes.forEach(noteData => {
            const nota = new Nota(
                noteData.content,
                noteData.position,
                noteData.size,
                noteData.fontSize,
                noteData.id
            );
            notes.push(nota);
        });

        // Crea nuovi collegamenti
        data.links.forEach(linkData => {
            const startNote = notes.find(note => note.id === linkData.startId);
            const endNote = notes.find(note => note.id === linkData.endId);
            if (startNote && endNote) {
                const line = new LeaderLine(
                    startNote.inputBox,
                    endNote.inputBox
                );
                lines.push({ start: linkData.startId, end: linkData.endId, line: line });
            } else {
                console.warn(`Unable to find start or end note for link: ${linkData.startId} - ${linkData.endId}`);
            }
        });

        saveNotes();
        saveLinks();
	}

	const handleFileSelect = (event)=> {
		console.log("Selezionato " + event.target.files);
		const files = event.target.files;
		if (files.length > 0) {
			const file = files[0];
			const reader = new FileReader();
			reader.onload = function (e) {
				try {
					let data = JSON.parse(e.target.result);
					console.log(data);
					loadNotesFromFile(data);
					data = '';
				} catch (error) {
					console.error("Error parsing JSON file: ", error);
                }
            };
            reader.readAsText(file);
        }
		toggleFileLoadContainer = true;
		showFileLoadContainer();
	}

	fileInput.addEventListener("change", handleFileSelect );

	
	// ---------------- end load notes and links from json file ---- 
	
	// erase all notes 
	btnClearAllNotes.addEventListener("click", ()=>{
		const noteContainer = document.querySelector(".notes-container");
		
		if ( noteContainer.children.length > 0 ) {
			
			if (confirm( "Are you sure, you want to delete all notes ?" )) {
				while (noteContainer.firstChild) {
					noteContainer.removeChild(noteContainer.firstChild);
				}
				lines.forEach(oggettoLinea => {oggettoLinea.line.remove()});
				notes.forEach(oggettoNota => {oggettoNota.note.remove()});
				lines = [];
				notes = [];
				saveLinks();
				saveNotes();
			}
		} else {

			alert("No notes to delete !");
		}
	});



	// manage zoom InputBox anl line link
	let scale = 1;
	let perZoom = 1;
	document.addEventListener("wheel", (event)=>{
		if (event.ctrlKey && event.shiftKey) {
			event.preventDefault();
			if (event.deltaY > 0) {
				scale += 0.1;
			} else {
				scale -= 0.1;
			}
			scale = Math.min(Math.max(0.5, scale), 3);
			
			scale = Math.round(scale * 10) / 10;
			console.log(scale);
			perZoom = Math.round(scale * 100);
			console.log("Per Zoom : " + perZoom + "%")
			percentValue.innerHTML = perZoom;

			notes.forEach(note => {
				note.inputBox.style.transform = `scale(${scale})`;
			});
			updateLines();
		}
	},{ passive : false });


// -- --- --- -- -- -code for title create
	let toggleArtTitleContainer = true;

	const funcToggleArtTitleContainer = ()=>{
		if (toggleArtTitleContainer) {
			toggleArtTitleContainer = false;
			artTitleContainer.style.display = "flex";
			artTitleContainer.style.top = 30+event.clientY+'px';
			artTitleContainer.style.left = event.clientX+'px';
			artTitleContainer.style.zIndex = '9999';
		} else {
			toggleArtTitleContainer = true;
			artTitleContainer.style.display = 'none';
		}
	}

	btnArtTitle.addEventListener("click", (event)=>{
		funcToggleArtTitleContainer()
	});

// listener
	btnDrawTitle.addEventListener("click", ()=>{
		// click sul pulsante della Draw
		drawParola(inputParola)
	});

	btnCopyClipboard.addEventListener("click", ()=>{
		copyClipboard();
	})
	
	// funzione che disegna il titolo 
	const drawParola = (inputparola)=> {
		const text = inputparola.value.toUpperCase();
		console.log(text);
		const block = '█';
		const empty = " ";

		let numRows = 5;
		let numCols = 5;

		// crea matrix bidimensional 
		const liness = Array(numRows).fill("").map(
			()=> Array(text.length * (numCols + 1)).fill(empty)
		);

		console.log(liness);
		console.log(letters);

	text.split('').forEach((char, charIndex) => {
		const matrix = letters[char] || ["00000", "00000", "00000", "00000", "00000"];
		for (let i = 0; i < numRows; i++) {
			for (let j = 0; j < numCols; j++) {
				if (matrix[i][j] === '1') {
					liness[i][charIndex * (numCols + 1) + j] = block;
				}
			}
		}
	});
		areaTitle.value = liness.map(line => line.join('')).join('\n');
	}

	// funzione che seleziona il titolo e lo inserisce 
	// nella clipboard
	const copyClipboard = ()=>{
		toggleArtTitleContainer = false;
		areaTitle.select();
		areaTitle.setSelectionRange(0, 9999);// for mobile
		try {
			document.execCommand("copy")
			alert("Testo copiato negli appunti");
		} catch(err) {
			alert ("Errore nella copia : ", err);
		}
		inputParola.value = '';
		funcToggleArtTitleContainer(); // chiude la window
	}
	


	loadNotes();

});

