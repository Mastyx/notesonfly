# notesonfly

Questo progetto è rilasciato sotto la Licenza MIT. Vedi il file LICENSE per ulteriori dettagli.

Questa app è una gestione di note interattiva che consente agli utenti di creare, modificare, collegare e navigare tra diverse note. 
Il suo utilizzo prevede l'uso di schermi ampi è quindi consigliato l'utilizzo su pc.

![Schermata del 2024-07-02 11-07-18](https://github.com/Mastyx/notesonfly/assets/37514712/04c960ed-d999-4c42-8046-cdbe76f6df55)



Ecco le principali funzionalità fornite dall'app:

Funzionalità principali:
	

	Creazione e modifica delle note:

		Creazione di nuove note: Un pulsante consente di creare nuove note che appaiono in un'area definita.
		Modifica del contenuto: Ogni nota ha una area dove gli utenti possono inserire e modificare il testo.
	
	Gestione della formattazione del testo:

		Dimensione del testo: Pulsanti per aumentare e diminuire la dimensione del testo nelle note.
		Gestione della tabulazione: Supporto per l'inserimento di tabulazioni (spazi) 
			quando si preme il tasto Tab, e per la gestione delle rientranze quando si preme il tasto Enter.
	
	Posizionamento e dimensionamento:
	
		Trascinamento: Le note possono essere spostate in diverse posizioni trascinandole.
		Ridimensionamento: Le note possono essere ridimensionate trascinando gli angoli.
	
	Gestione dei collegamenti tra note:

		Creazione di collegamenti: Le note possono essere collegate tra loro visivamente con linee.
		Rimozione di collegamenti: È possibile rimuovere i collegamenti tra le note.
	
	Navigazione tra le note:

		Shortcut da tastiera: Utilizzando Ctrl + Freccia Sinistra e Ctrl + Freccia Destra, 
			gli utenti possono navigare tra le note. 
			La nota selezionata viene portata in primo piano e messa a fuoco.

	Salvataggio e caricamento:

		Local Storage: Le note, le loro posizioni, dimensioni, contenuti e collegamenti 
			sono salvati nel localStorage del browser, permettendo di mantenere lo stato 
			anche dopo un refresh della pagina.

	Reset delle note:

		Reset delle dimensioni e posizioni: Un pulsante consente di ripristinare le note alle loro dimensioni 
			e posizioni originali.



Come funziona l'app:

	Inizializzazione: Quando il DOM è pronto, l'app carica le note e i collegamenti salvati dal localStorage.
	
	Creazione di nuove note: Quando viene cliccato il pulsante "add-note", 
		viene creata una nuova nota con posizione e dimensioni predefinite.
	
	Modifica e aggiornamento: Ogni volta che viene modificato il contenuto di una nota 
		o cambiata la sua posizione/dimensione, l'app salva lo stato corrente nel localStorage.
	
	Gestione dei collegamenti: Quando viene cliccato il pulsante di collegamento su una nota, 
		l'app entra in modalità "linking" e collega due note selezionate in sequenza.
	
	Navigazione e focus: Gli utenti possono navigare tra le note utilizzando le shortcut da tastiera, 
		portando in primo piano la nota selezionata.
	
	Reset: Cliccando il pulsante di reset, tutte le note vengono riportate alle loro dimensioni e posizioni 
		iniziali.

	Limitazioni:
		RIMOZIONE DELLA CRONOLOGIA : Eliminare la cronologia del browser cancellerà i dati nel localStorage, 
			perdendo così tutte le note e collegamenti salvati.

Questa applicazione è utile per prendere appunti, organizzare idee e mantenere traccia delle relazioni tra diverse note, tutto direttamente nel browser.


Shortcut :

    Ctrl + s : scarica tutto lo schema delle note salvandolo in un file 'notes.json' all'
                interno della cartella download del browser.
                
                Se vogliamo salvare in una cartella differente dobbiamo cambiare le impostazioni del browser 
                in modo che apra una finestra di dialogo dove spacificare la cartella per il salvataggio.

                    Di solito nelle impostazioni del browser, sezione DOWNLOAD, 
                        spuntare "Chiedi dove salvare il file.."

    Ctrl + '+' : crea una nuova nota senza la pressione del pulsante in basso a destra.


