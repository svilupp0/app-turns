// Configurazione dell'applicazione
let configurazione = {
    tipoAttivita: '',
    settori: 0,
    dipendenti: 0,
    tipoTurni: '',
    giorniSettimana: '',
    fasciaOraria: '',
    turniSpezzati: '',
    oreGiornaliere: ''
};

// Array dei dipendenti
let dipendenti = [];
let dipendentiFiltrati = [];
let dipendenteInModifica = null;

// Utente corrente
let utenteCorrente = null;

// Dati dashboard
let periodoProgrammazione = null;
let richiestePersonale = '';

// Array delle domande
const domande = [
    {
        id: 'settori',
        titolo: 'Quanti settori/mansioni/macchinari devono essere coperti nei turni?',
        descrizione: 'Es: cucina, sala, banco bar, cassa, magazzino...',
        tipo: 'numero',
        placeholder: 'Inserisci il numero di settori'
    },
    {
        id: 'dipendenti',
        titolo: 'Quanti dipendenti hai in totale?',
        descrizione: 'Inserisci il numero totale di dipendenti',
        tipo: 'numero',
        placeholder: 'Inserisci il numero di dipendenti'
    },
    {
        id: 'tipoTurni',
        titolo: 'Che tipo di turni vuoi gestire?',
        descrizione: 'Seleziona il tipo di turni che utilizzi',
        tipo: 'scelta',
        opzioni: [
            { valore: 'singoli', testo: 'Singoli (1 solo dipendente per turno)' },
            { valore: 'plurimi', testo: 'Plurimi (più dipendenti insieme per turno)' },
            { valore: 'entrambi', testo: 'Entrambi (alcuni turni singoli, altri con più persone)' }
        ]
    },
    {
        id: 'giorniSettimana',
        titolo: 'Quanti giorni alla settimana vuoi coprire con i turni?',
        descrizione: 'Seleziona i giorni di attività',
        tipo: 'scelta',
        opzioni: [
            { valore: '7', testo: '7 giorni (lun-dom)' },
            { valore: '6', testo: '6 giorni (lun-sab)' },
            { valore: '5', testo: '5 giorni' },
            { valore: 'altro', testo: 'Altro...' }
        ]
    },
    {
        id: 'fasciaOraria',
        titolo: 'Qual è l\'orario di apertura/lavoro ogni giorno?',
        descrizione: 'Inserisci l\'orario di inizio del primo turno e fine dell\'ultimo turno (es: 07:00 - 23:00)',
        tipo: 'orario',
        placeholder: 'Inserisci orario inizio e fine'
    },
    {
        id: 'turniSpezzati',
        titolo: 'I turni sono:',
        descrizione: 'Seleziona il tipo di turni che utilizzi',
        tipo: 'scelta',
        opzioni: [
            { valore: 'unici', testo: 'Unici (1 solo turno continuo)' },
            { valore: 'spezzati', testo: 'Spezzati (es: mattina + sera)' },
            { valore: 'entrambi', testo: 'Entrambi' }
        ]
    },
    {
        id: 'oreGiornaliere',
        titolo: 'Tutti i dipendenti lavorano lo stesso numero di ore giornaliere?',
        descrizione: 'Seleziona se tutti lavorano le stesse ore al giorno',
        tipo: 'scelta',
        opzioni: [
            { valore: 'si', testo: 'Sì' },
            { valore: 'no', testo: 'No (es: alcuni 4h, altri 6h, altri 8h)' }
        ]
    }
];

let domandaCorrente = 0;

// Inizializzazione
document.addEventListener('DOMContentLoaded', function() {
    // Controlla se l'utente è già loggato
    const utenteSalvato = localStorage.getItem('utenteCorrente');
    if (utenteSalvato) {
        utenteCorrente = JSON.parse(utenteSalvato);
        
        // Controlla se è la prima volta o un avvio successivo
        const configCompleta = localStorage.getItem(`configurazione_completa_${utenteCorrente.id}`);
        if (configCompleta) {
            // Avvio successivo - mostra dashboard
            mostraDashboard();
        } else {
            // Prima volta - mostra home per configurazione
            mostraHome();
        }
    } else {
        mostraLogin();
    }
});

// Funzione per attivare la modalità test
function attivaModalitaTest() {
    // Crea un utente di test
    utenteCorrente = {
        id: 'test-user',
        nome: 'Test',
        cognome: 'User',
        email: 'test@example.com',
        password: 'test123',
        dataRegistrazione: new Date().toISOString()
    };
    
    // Salva l'utente di test
    localStorage.setItem('utenteCorrente', JSON.stringify(utenteCorrente));
    
    // Controlla se esiste già una configurazione di test
    const configCompleta = localStorage.getItem(`configurazione_completa_${utenteCorrente.id}`);
    if (configCompleta) {
        // Configurazione già esistente, vai alla dashboard
        mostraDashboard();
    } else {
        // Prima volta, vai alla home per configurazione
        mostraHome();
    }
    
    console.log('Modalità test attivata');
}

// Funzioni di login
function mostraLogin() {
    document.getElementById('pagina-login').style.display = 'block';
    document.getElementById('pagina-registrazione').style.display = 'none';
    document.getElementById('pagina-home').style.display = 'none';
    document.getElementById('pagina-domande').style.display = 'none';
    document.getElementById('pagina-dipendenti').style.display = 'none';
    document.getElementById('pagina-dashboard').style.display = 'none';
}

function mostraRegistrazione() {
    document.getElementById('pagina-login').style.display = 'none';
    document.getElementById('pagina-registrazione').style.display = 'block';
    document.getElementById('pagina-home').style.display = 'none';
    document.getElementById('pagina-domande').style.display = 'none';
    document.getElementById('pagina-dipendenti').style.display = 'none';
    document.getElementById('pagina-dashboard').style.display = 'none';
}

function effettuaLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Controlla se l'utente esiste
    const utenti = JSON.parse(localStorage.getItem('utenti') || '[]');
    const utente = utenti.find(u => u.email === email && u.password === password);
    
    if (utente) {
        utenteCorrente = utente;
        localStorage.setItem('utenteCorrente', JSON.stringify(utente));
        
        // Controlla se è la prima volta o un avvio successivo
        const configCompleta = localStorage.getItem(`configurazione_completa_${utente.id}`);
        if (configCompleta) {
            // Avvio successivo - mostra dashboard
            mostraDashboard();
        } else {
            // Prima volta - mostra home per configurazione
            mostraHome();
        }
    } else {
        alert('Email o password non corretti.');
    }
}

function effettuaRegistrazione(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome-reg').value;
    const cognome = document.getElementById('cognome-reg').value;
    const email = document.getElementById('email-reg').value;
    const password = document.getElementById('password-reg').value;
    const confermaPassword = document.getElementById('conferma-password').value;
    
    if (password !== confermaPassword) {
        alert('Le password non coincidono.');
        return;
    }
    
    // Controlla se l'email è già registrata
    const utenti = JSON.parse(localStorage.getItem('utenti') || '[]');
    if (utenti.find(u => u.email === email)) {
        alert('Email già registrata.');
        return;
    }
    
    // Crea nuovo utente
    const nuovoUtente = {
        id: Date.now(),
        nome: nome,
        cognome: cognome,
        email: email,
        password: password,
        dataRegistrazione: new Date().toISOString()
    };
    
    utenti.push(nuovoUtente);
    localStorage.setItem('utenti', JSON.stringify(utenti));
    
    utenteCorrente = nuovoUtente;
    localStorage.setItem('utenteCorrente', JSON.stringify(nuovoUtente));
    
    alert('Registrazione completata con successo!');
    mostraHome();
}

function logout() {
    localStorage.removeItem('utenteCorrente');
    utenteCorrente = null;
    mostraLogin();
}

// Funzione per resettare la modalità test
function resetModalitaTest() {
    if (confirm('Vuoi resettare tutti i dati di test? Questo rimuoverà configurazione, dipendenti e altri dati salvati.')) {
        // Rimuovi tutti i dati dell'utente di test
        localStorage.removeItem(`configurazione_${utenteCorrente.id}`);
        localStorage.removeItem(`configurazione_completa_${utenteCorrente.id}`);
        localStorage.removeItem(`dipendenti_${utenteCorrente.id}`);
        localStorage.removeItem(`periodo_${utenteCorrente.id}`);
        localStorage.removeItem(`richieste_${utenteCorrente.id}`);
        
        // Reset delle variabili globali
        configurazione = {
            tipoAttivita: '',
            settori: 0,
            dipendenti: 0,
            tipoTurni: '',
            giorniSettimana: '',
            fasciaOraria: '',
            turniSpezzati: '',
            oreGiornaliere: ''
        };
        dipendenti = [];
        dipendentiFiltrati = [];
        periodoProgrammazione = null;
        richiestePersonale = '';
        
        alert('Dati di test resettati! Ora puoi ricominciare la configurazione.');
        
        // Torna alla home per ricominciare
        mostraHome();
    }
}

// Funzioni di navigazione
function mostraHome() {
    document.getElementById('pagina-login').style.display = 'none';
    document.getElementById('pagina-registrazione').style.display = 'none';
    document.getElementById('pagina-home').style.display = 'block';
    document.getElementById('pagina-domande').style.display = 'none';
    document.getElementById('pagina-dipendenti').style.display = 'none';
    document.getElementById('pagina-dashboard').style.display = 'none';
    
    // Carica configurazione salvata
    const configSalvata = localStorage.getItem(`configurazione_${utenteCorrente.id}`);
    if (configSalvata) {
        configurazione = JSON.parse(configSalvata);
        // Mostra sezione attività multiple se configurato
        if (configurazione.tipoAttivita) {
            document.getElementById('sezione-attivita-multiple').style.display = 'block';
        }
    }
}

function mostraDashboard() {
    document.getElementById('pagina-login').style.display = 'none';
    document.getElementById('pagina-registrazione').style.display = 'none';
    document.getElementById('pagina-home').style.display = 'none';
    document.getElementById('pagina-domande').style.display = 'none';
    document.getElementById('pagina-dipendenti').style.display = 'none';
    document.getElementById('pagina-dashboard').style.display = 'block';
    
    // Carica dati utente
    document.getElementById('nome-utente').textContent = `${utenteCorrente.nome} ${utenteCorrente.cognome}`;
    
    // Mostra indicatore modalità test se necessario
    if (utenteCorrente.id === 'test-user') {
        document.getElementById('test-indicator').style.display = 'inline-block';
    } else {
        document.getElementById('test-indicator').style.display = 'none';
    }
    
    // Carica configurazione
    const configSalvata = localStorage.getItem(`configurazione_${utenteCorrente.id}`);
    if (configSalvata) {
        configurazione = JSON.parse(configSalvata);
        document.getElementById('dashboard-tipo').textContent = configurazione.tipoAttivita;
    }
    
    // Carica dipendenti
    caricaDipendenti();
    document.getElementById('dashboard-dipendenti').textContent = dipendenti.length;
    
    // Carica periodo salvato
    const periodoSalvato = localStorage.getItem(`periodo_${utenteCorrente.id}`);
    if (periodoSalvato) {
        periodoProgrammazione = JSON.parse(periodoSalvato);
        document.getElementById('data-inizio').value = periodoProgrammazione.dataInizio;
        document.getElementById('data-fine').value = periodoProgrammazione.dataFine;
        aggiornaPeriodo();
    }
    
    // Carica richieste salvate
    const richiesteSalvate = localStorage.getItem(`richieste_${utenteCorrente.id}`);
    if (richiesteSalvate) {
        document.getElementById('richieste-personale').value = richiesteSalvate;
        richiestePersonale = richiesteSalvate;
    }
    
    // Aggiorna statistiche
    aggiornaStatisticheDashboard();
}

function selezionaAttivita(tipo) {
    configurazione.tipoAttivita = tipo;
    
    // Salva configurazione
    localStorage.setItem(`configurazione_${utenteCorrente.id}`, JSON.stringify(configurazione));
    
    // Mostra sezione attività multiple
    document.getElementById('sezione-attivita-multiple').style.display = 'block';
    
    // Controlla se la configurazione è già completa
    const configSalvata = localStorage.getItem(`configurazione_completa_${utenteCorrente.id}`);
    if (configSalvata) {
        // Configurazione già completata, vai ai dipendenti
        mostraGestioneDipendenti();
    } else {
        // Inizia le domande di configurazione
        iniziaDomande();
    }
}

function aggiungiAttivita() {
    // Funzione per aggiungere attività multiple (da implementare)
    alert('Funzionalità per aggiungere attività multiple in sviluppo.');
}

// Funzioni per le domande di configurazione
function iniziaDomande() {
    domandaCorrente = 0;
    document.getElementById('pagina-home').style.display = 'none';
    document.getElementById('pagina-domande').style.display = 'block';
    mostraDomanda();
}

function mostraDomanda() {
    const domanda = domande[domandaCorrente];
    const container = document.getElementById('domanda-container');
    
    // Aggiorna progress bar
    const percentuale = Math.round(((domandaCorrente + 1) / domande.length) * 100);
    document.getElementById('progress-text').textContent = `Domanda ${domandaCorrente + 1} di ${domande.length}`;
    document.getElementById('progress-percentage').textContent = `${percentuale}%`;
    document.getElementById('progress-bar').style.width = `${percentuale}%`;
    
    // Mostra/nascondi bottoni
    document.getElementById('btn-indietro').style.display = domandaCorrente > 0 ? 'block' : 'none';
    document.getElementById('btn-avanti').textContent = domandaCorrente === domande.length - 1 ? 'Completa' : 'Avanti';
    
    // Genera contenuto domanda
    let html = `
        <h3 class="mb-3">${domanda.titolo}</h3>
        <p class="text-muted mb-4">${domanda.descrizione}</p>
    `;
    
    if (domanda.tipo === 'numero') {
        html += `
            <div class="mb-3">
                <input type="number" class="form-control form-control-lg" id="risposta-${domanda.id}" 
                       placeholder="${domanda.placeholder}" min="1" max="100">
            </div>
        `;
    } else if (domanda.tipo === 'orario') {
        html += `
            <div class="row">
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="orario-inizio-${domanda.id}" class="form-label">Orario Inizio</label>
                        <input type="time" class="form-control form-control-lg" id="orario-inizio-${domanda.id}" 
                               placeholder="07:00">
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="mb-3">
                        <label for="orario-fine-${domanda.id}" class="form-label">Orario Fine</label>
                        <input type="time" class="form-control form-control-lg" id="orario-fine-${domanda.id}" 
                               placeholder="23:00">
                    </div>
                </div>
            </div>
            <div class="mt-3">
                <div class="alert alert-info">
                    <i class="bi bi-info-circle"></i>
                    <strong>Esempio:</strong> Se il primo turno inizia alle 7:00 e l'ultimo finisce alle 23:00, 
                    inserisci 07:00 - 23:00
                </div>
            </div>
        `;
    } else if (domanda.tipo === 'scelta') {
        html += '<div class="d-grid gap-3">';
        domanda.opzioni.forEach(opzione => {
            html += `
                <button class="btn btn-outline-primary btn-lg text-start" onclick="selezionaOpzione('${opzione.valore}')">
                    <i class="bi bi-check-circle-fill me-2" style="display: none;"></i>
                    ${opzione.testo}
                </button>
            `;
        });
        html += '</div>';
    }
    
    container.innerHTML = html;
    
    // Popola risposta se già salvata
    if (configurazione[domanda.id]) {
        if (domanda.tipo === 'numero') {
            document.getElementById(`risposta-${domanda.id}`).value = configurazione[domanda.id];
        } else if (domanda.tipo === 'orario') {
            const orarioSalvato = configurazione[domanda.id];
            if (orarioSalvato && orarioSalvato.includes('-')) {
                const [inizio, fine] = orarioSalvato.split('-').map(t => t.trim());
                document.getElementById(`orario-inizio-${domanda.id}`).value = inizio;
                document.getElementById(`orario-fine-${domanda.id}`).value = fine;
            }
        }
    }
}

function selezionaOpzione(valore) {
    const domanda = domande[domandaCorrente];
    configurazione[domanda.id] = valore;
    
    // Rimuovi selezione precedente - CORREZIONE: controlla se l'elemento esiste
    document.querySelectorAll('.btn').forEach(btn => {
        btn.classList.remove('btn-primary');
        btn.classList.add('btn-outline-primary');
        const icon = btn.querySelector('.bi-check-circle-fill');
        if (icon) {
            icon.style.display = 'none';
        }
    });
    
    // Evidenzia selezione corrente
    event.target.classList.remove('btn-outline-primary');
    event.target.classList.add('btn-primary');
    const icon = event.target.querySelector('.bi-check-circle-fill');
    if (icon) {
        icon.style.display = 'inline';
    }
}

function domandaSuccessiva() {
    const domanda = domande[domandaCorrente];
    
    // Valida risposta
    if (domanda.tipo === 'numero') {
        const valore = document.getElementById(`risposta-${domanda.id}`).value;
        if (!valore || valore < 1) {
            alert('Inserisci un valore valido.');
            return;
        }
        configurazione[domanda.id] = parseInt(valore);
    } else if (domanda.tipo === 'orario') {
        const orarioInizio = document.getElementById(`orario-inizio-${domanda.id}`).value;
        const orarioFine = document.getElementById(`orario-fine-${domanda.id}`).value;
        
        if (!orarioInizio || !orarioFine) {
            alert('Inserisci sia l\'orario di inizio che quello di fine.');
            return;
        }
        
        if (orarioInizio >= orarioFine) {
            alert('L\'orario di inizio deve essere precedente a quello di fine.');
            return;
        }
        
        configurazione[domanda.id] = `${orarioInizio} - ${orarioFine}`;
    } else if (domanda.tipo === 'scelta') {
        if (!configurazione[domanda.id]) {
            alert('Seleziona un\'opzione.');
            return;
        }
    }
    
    // Salva configurazione
    localStorage.setItem(`configurazione_${utenteCorrente.id}`, JSON.stringify(configurazione));
    
    if (domandaCorrente === domande.length - 1) {
        // Ultima domanda, completa configurazione
        completaConfigurazione();
    } else {
        // Prossima domanda
        domandaCorrente++;
        mostraDomanda();
    }
}

function domandaPrecedente() {
    if (domandaCorrente > 0) {
        domandaCorrente--;
        mostraDomanda();
    }
}

function completaConfigurazione() {
    // Marca configurazione come completa
    localStorage.setItem(`configurazione_completa_${utenteCorrente.id}`, 'true');
    
    const riepilogo = `
Configurazione completata!

Tipo attività: ${configurazione.tipoAttivita}
Settori: ${configurazione.settori}
Dipendenti: ${configurazione.dipendenti}
Tipo turni: ${configurazione.tipoTurni}
Giorni settimana: ${configurazione.giorniSettimana}
Fascia oraria: ${configurazione.fasciaOraria}
Turni spezzati: ${configurazione.turniSpezzati}
Ore giornaliere: ${configurazione.oreGiornaliere}

La configurazione è stata salvata. Clicca OK per continuare.
    `;
    
    alert(riepilogo);
    console.log('Configurazione salvata:', configurazione);
    
    // Passa alla gestione dipendenti
    mostraGestioneDipendenti();
}

// Funzioni per la dashboard
function aggiornaPeriodo() {
    const dataInizio = document.getElementById('data-inizio').value;
    const dataFine = document.getElementById('data-fine').value;
    
    if (dataInizio && dataFine) {
        const inizio = new Date(dataInizio);
        const fine = new Date(dataFine);
        const diffGiorni = Math.ceil((fine - inizio) / (1000 * 60 * 60 * 24)) + 1;
        
        document.getElementById('periodo-info').textContent = 
            `Periodo: ${inizio.toLocaleDateString('it-IT')} - ${fine.toLocaleDateString('it-IT')} (${diffGiorni} giorni)`;
        
        document.getElementById('totale-giorni').textContent = diffGiorni;
        
        // Salva automaticamente il periodo
        salvaPeriodoAutomatico(dataInizio, dataFine);
    } else {
        document.getElementById('periodo-info').textContent = 'Seleziona le date per vedere il periodo';
        document.getElementById('totale-giorni').textContent = '0';
    }
}

function salvaPeriodoAutomatico(dataInizio, dataFine) {
    if (new Date(dataInizio) > new Date(dataFine)) {
        return; // Non salvare se le date non sono valide
    }
    
    periodoProgrammazione = {
        dataInizio: dataInizio,
        dataFine: dataFine,
        dataSalvataggio: new Date().toISOString()
    };
    
    localStorage.setItem(`periodo_${utenteCorrente.id}`, JSON.stringify(periodoProgrammazione));
    aggiornaStatisticheDashboard();
}

function salvaPeriodo() {
    const dataInizio = document.getElementById('data-inizio').value;
    const dataFine = document.getElementById('data-fine').value;
    
    if (!dataInizio || !dataFine) {
        alert('Seleziona le date di inizio e fine.');
        return;
    }
    
    if (new Date(dataInizio) > new Date(dataFine)) {
        alert('La data di inizio non può essere successiva alla data di fine.');
        return;
    }
    
    periodoProgrammazione = {
        dataInizio: dataInizio,
        dataFine: dataFine,
        dataSalvataggio: new Date().toISOString()
    };
    
    localStorage.setItem(`periodo_${utenteCorrente.id}`, JSON.stringify(periodoProgrammazione));
    alert('Periodo salvato con successo!');
    aggiornaStatisticheDashboard();
}

function salvaRichiesteAutomatico() {
    const richieste = document.getElementById('richieste-personale').value.trim();
    
    richiestePersonale = richieste;
    localStorage.setItem(`richieste_${utenteCorrente.id}`, richieste);
    
    // Conta le richieste (righe non vuote)
    const righe = richieste.split('\n').filter(riga => riga.trim() !== '').length;
    document.getElementById('richieste-pendenti').textContent = righe;
    
    aggiornaStatisticheDashboard();
}

function salvaRichieste() {
    const richieste = document.getElementById('richieste-personale').value.trim();
    
    if (!richieste) {
        alert('Inserisci le richieste del personale.');
        return;
    }
    
    richiestePersonale = richieste;
    localStorage.setItem(`richieste_${utenteCorrente.id}`, richieste);
    
    // Conta le richieste (righe non vuote)
    const righe = richieste.split('\n').filter(riga => riga.trim() !== '').length;
    document.getElementById('richieste-pendenti').textContent = righe;
    
    alert('Richieste salvate con successo!');
    aggiornaStatisticheDashboard();
}

function caricaRichieste() {
    const richiesteSalvate = localStorage.getItem(`richieste_${utenteCorrente.id}`);
    if (richiesteSalvate) {
        document.getElementById('richieste-personale').value = richiesteSalvate;
        richiestePersonale = richiesteSalvate;
        
        const righe = richiesteSalvate.split('\n').filter(riga => riga.trim() !== '').length;
        document.getElementById('richieste-pendenti').textContent = righe;
        
        alert('Richieste caricate!');
    } else {
        alert('Nessuna richiesta salvata trovata.');
    }
}

function aggiornaStatisticheDashboard() {
    // Aggiorna statistiche rapide
    if (periodoProgrammazione) {
        const inizio = new Date(periodoProgrammazione.dataInizio);
        const fine = new Date(periodoProgrammazione.dataFine);
        const diffGiorni = Math.ceil((fine - inizio) / (1000 * 60 * 60 * 24)) + 1;
        document.getElementById('totale-giorni').textContent = diffGiorni;
    }
    
    if (richiestePersonale) {
        const righe = richiestePersonale.split('\n').filter(riga => riga.trim() !== '').length;
        document.getElementById('richieste-pendenti').textContent = righe;
    }
    
    // Per ora, turni generati = 0 (da implementare)
    document.getElementById('turni-generati').textContent = '0';
}

// Funzioni azioni rapide
function generaTurniAutomatici() {
    if (!periodoProgrammazione) {
        alert('Prima imposta il periodo di programmazione.');
        return;
    }
    
    if (dipendenti.length === 0) {
        alert('Prima aggiungi dei dipendenti.');
        return;
    }
    
    // Genera i turni
    const turniGenerati = generaTurni();
    
    if (turniGenerati) {
        // Salva i turni generati
        localStorage.setItem(`turni_${utenteCorrente.id}`, JSON.stringify(turniGenerati));
        
        // Aggiorna statistiche
        document.getElementById('turni-generati').textContent = turniGenerati.length;
        
        alert(`Generazione completata! Creati ${turniGenerati.length} turni.`);
        
        // Mostra riepilogo turni
        mostraRiepilogoTurni(turniGenerati);
    } else {
        alert('Impossibile generare turni con i dati attuali. Verifica configurazione e dipendenti.');
    }
}

function visualizzaCalendario() {
    if (!periodoProgrammazione) {
        alert('Prima imposta il periodo di programmazione.');
        return;
    }
    
    alert('Funzionalità di visualizzazione calendario in sviluppo.');
}

function gestisciDipendenti() {
    document.getElementById('pagina-dashboard').style.display = 'none';
    document.getElementById('pagina-dipendenti').style.display = 'block';
    
    // Aggiorna riepilogo
    aggiornaRiepilogo();
    
    // Aggiorna lista dipendenti
    aggiornaListaDipendenti();
    
    // Aggiorna statistiche
    aggiornaStatistiche();
}

// Funzione principale per generare turni
function generaTurni() {
    try {
        // 1. Calcola parametri base
        const parametri = calcolaParametriBase();
        if (!parametri) return null;
        
        // 2. Parsing richieste personale
        const richiesteParsate = parseRichiestePersonale();
        
        // 3. Genera turni per ogni giorno del periodo
        const turni = [];
        const dataInizio = new Date(periodoProgrammazione.dataInizio);
        const dataFine = new Date(periodoProgrammazione.dataFine);
        
        for (let data = new Date(dataInizio); data <= dataFine; data.setDate(data.getDate() + 1)) {
            const turniGiorno = generaTurniGiorno(data, parametri, richiesteParsate);
            turni.push(...turniGiorno);
        }
        
        return turni;
        
    } catch (error) {
        console.error('Errore nella generazione turni:', error);
        return null;
    }
}

function esportaTurni() {
    if (!periodoProgrammazione) {
        alert('Prima imposta il periodo di programmazione.');
        return;
    }
    
    alert('Funzionalità di esportazione turni in sviluppo.');
}

// Funzione per tornare alla home
function tornaHome() {
    document.getElementById('pagina-dipendenti').style.display = 'none';
    document.getElementById('pagina-dashboard').style.display = 'block';
}

// Funzione per tornare alla dashboard
function tornaDashboard() {
    document.getElementById('pagina-dipendenti').style.display = 'none';
    document.getElementById('pagina-dashboard').style.display = 'block';
}

// Funzione per mostrare gestione dipendenti
function mostraGestioneDipendenti() {
    document.getElementById('pagina-domande').style.display = 'none';
    document.getElementById('pagina-dipendenti').style.display = 'block';
    
    // Carica dipendenti salvati
    caricaDipendenti();
    
    // Aggiorna riepilogo
    aggiornaRiepilogo();
    
    // Aggiorna lista dipendenti
    aggiornaListaDipendenti();
    
    // Aggiorna statistiche
    aggiornaStatistiche();
}

// Funzione per caricare dipendenti
function caricaDipendenti() {
    const dipendentiSalvati = localStorage.getItem(`dipendenti_${utenteCorrente.id}`);
    if (dipendentiSalvati) {
        dipendenti = JSON.parse(dipendentiSalvati);
    }
    dipendentiFiltrati = [...dipendenti];
}

// Funzione per salvare dipendenti
function salvaDipendenti() {
    localStorage.setItem(`dipendenti_${utenteCorrente.id}`, JSON.stringify(dipendenti));
}

// Funzione per aggiornare riepilogo
function aggiornaRiepilogo() {
    document.getElementById('riepilogo-tipo').textContent = configurazione.tipoAttivita;
    document.getElementById('riepilogo-dipendenti').textContent = configurazione.dipendenti;
    document.getElementById('riepilogo-turni').textContent = configurazione.tipoTurni;
}

// Funzione per aggiornare statistiche
function aggiornaStatistiche() {
    const totale = dipendenti.length;
    const mediaOre = totale > 0 ? Math.round(dipendenti.reduce((sum, d) => sum + d.oreSettimanali, 0) / totale) : 0;
    const totaleOre = dipendenti.reduce((sum, d) => sum + d.oreSettimanali, 0);
    
    // Calcola scadenze prossime (entro 30 giorni)
    const oggi = new Date();
    const scadenzeProssime = dipendenti.filter(d => {
        if (!d.scadenzaContratto) return false;
        const scadenza = new Date(d.scadenzaContratto);
        const diffGiorni = Math.ceil((scadenza - oggi) / (1000 * 60 * 60 * 24));
        return diffGiorni >= 0 && diffGiorni <= 30;
    }).length;
    
    document.getElementById('totale-dipendenti').textContent = totale;
    document.getElementById('media-ore').textContent = mediaOre;
    document.getElementById('totale-ore').textContent = totaleOre;
    document.getElementById('scadenze-prossime').textContent = scadenzeProssime;
}

// Funzione per aggiornare lista dipendenti
function aggiornaListaDipendenti() {
    const tabella = document.getElementById('tabella-dipendenti');
    const nessunDipendente = document.getElementById('nessun-dipendente');
    
    if (dipendentiFiltrati.length === 0) {
        tabella.innerHTML = '';
        nessunDipendente.style.display = 'block';
        return;
    }
    
    nessunDipendente.style.display = 'none';
    
    let html = '';
    dipendentiFiltrati.forEach((dipendente, index) => {
        const dataAssunzione = new Date(dipendente.dataAssunzione).toLocaleDateString('it-IT');
        const scadenzaContratto = dipendente.scadenzaContratto ? 
            new Date(dipendente.scadenzaContratto).toLocaleDateString('it-IT') : 'Indeterminato';
        
        // Calcola stato contratto
        let stato = '';
        let statoClass = '';
        
        if (dipendente.scadenzaContratto) {
            const oggi = new Date();
            const scadenza = new Date(dipendente.scadenzaContratto);
            const diffGiorni = Math.ceil((scadenza - oggi) / (1000 * 60 * 60 * 24));
            
            if (diffGiorni < 0) {
                stato = 'Scaduto';
                statoClass = 'text-danger';
            } else if (diffGiorni <= 30) {
                stato = `Scade tra ${diffGiorni} giorni`;
                statoClass = 'text-warning';
            } else {
                stato = 'Valido';
                statoClass = 'text-success';
            }
        } else {
            stato = 'Indeterminato';
            statoClass = 'text-info';
        }
        
        html += `
            <tr>
                <td><strong>${dipendente.nome} ${dipendente.cognome}</strong></td>
                <td>${dataAssunzione}</td>
                <td>${scadenzaContratto}</td>
                <td><span class="badge bg-primary">${dipendente.oreSettimanali}h</span></td>
                <td><span class="badge bg-secondary">${dipendente.oreGiornaliere}h</span></td>
                <td><span class="${statoClass}">${stato}</span></td>
                <td>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="modificaDipendente(${dipendente.id})" title="Modifica">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-danger" onclick="eliminaDipendente(${dipendente.id})" title="Elimina">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tabella.innerHTML = html;
}

// Funzione per ordinare dipendenti
function ordinaDipendenti() {
    const ordinamento = document.getElementById('ordinamento').value;
    
    dipendentiFiltrati.sort((a, b) => {
        switch(ordinamento) {
            case 'alfabetico':
                return (a.nome + ' ' + a.cognome).localeCompare(b.nome + ' ' + b.cognome);
            case 'alfabetico-desc':
                return (b.nome + ' ' + b.cognome).localeCompare(a.nome + ' ' + a.cognome);
            case 'data-assunzione':
                return new Date(b.dataAssunzione) - new Date(a.dataAssunzione);
            case 'data-assunzione-desc':
                return new Date(a.dataAssunzione) - new Date(b.dataAssunzione);
            case 'scadenza-contratto':
                if (!a.scadenzaContratto && !b.scadenzaContratto) return 0;
                if (!a.scadenzaContratto) return 1;
                if (!b.scadenzaContratto) return -1;
                return new Date(a.scadenzaContratto) - new Date(b.scadenzaContratto);
            case 'scadenza-contratto-desc':
                if (!a.scadenzaContratto && !b.scadenzaContratto) return 0;
                if (!a.scadenzaContratto) return 1;
                if (!b.scadenzaContratto) return -1;
                return new Date(b.scadenzaContratto) - new Date(a.scadenzaContratto);
            case 'ore-settimanali':
                return a.oreSettimanali - b.oreSettimanali;
            case 'ore-settimanali-desc':
                return b.oreSettimanali - a.oreSettimanali;
            default:
                return 0;
        }
    });
    
    aggiornaListaDipendenti();
}

// Funzione per filtrare dipendenti
function filtraDipendenti() {
    const ricerca = document.getElementById('ricerca').value.toLowerCase();
    
    if (ricerca === '') {
        dipendentiFiltrati = [...dipendenti];
    } else {
        dipendentiFiltrati = dipendenti.filter(dipendente => 
            dipendente.nome.toLowerCase().includes(ricerca) ||
            dipendente.cognome.toLowerCase().includes(ricerca)
        );
    }
    
    aggiornaListaDipendenti();
}

// Funzione per mostrare form dipendente
function mostraFormDipendente() {
    dipendenteInModifica = null;
    document.getElementById('form-titolo').textContent = 'Inserisci Nuovo Dipendente';
    document.getElementById('dipendente-form').reset();
    document.getElementById('form-dipendente').style.display = 'block';
    
    // Gestisci domande condizionali
    gestisciDomandeCondizionali();
}

// Funzione per nascondere form dipendente
function nascondiFormDipendente() {
    document.getElementById('form-dipendente').style.display = 'none';
    dipendenteInModifica = null;
}

// Funzione per gestire domande condizionali
function gestisciDomandeCondizionali() {
    const domandeCondizionali = document.getElementById('domande-condizionali');
    const domandaSolo = document.getElementById('domanda-solo');
    const domandaPreferenza = document.getElementById('domanda-preferenza');
    
    // Mostra domande solo se necessario
    if (configurazione.tipoTurni === 'entrambi') {
        domandeCondizionali.style.display = 'block';
        domandaSolo.style.display = 'block';
    } else {
        domandeCondizionali.style.display = 'none';
        domandaSolo.style.display = 'none';
    }
    
    if (configurazione.turniSpezzati === 'entrambi') {
        domandeCondizionali.style.display = 'block';
        domandaPreferenza.style.display = 'block';
    } else {
        domandaPreferenza.style.display = 'none';
        if (configurazione.tipoTurni !== 'entrambi') {
            domandeCondizionali.style.display = 'none';
        }
    }
}

// Funzione per salvare dipendente
function salvaDipendente(event) {
    event.preventDefault();
    
    const nome = document.getElementById('nome-dipendente').value.trim();
    const cognome = document.getElementById('cognome-dipendente').value.trim();
    const dataAssunzione = document.getElementById('data-assunzione').value;
    const scadenzaContratto = document.getElementById('scadenza-contratto').value || null;
    const oreSettimanali = parseInt(document.getElementById('ore-settimanali').value);
    const oreGiornaliere = parseInt(document.getElementById('ore-giornaliere').value);
    
    // Validazione
    if (!nome || !cognome) {
        alert('Inserisci nome e cognome del dipendente.');
        return;
    }
    
    if (!dataAssunzione) {
        alert('Inserisci la data di assunzione.');
        return;
    }
    
    if (oreSettimanali < 1 || oreSettimanali > 60) {
        alert('Le ore settimanali devono essere tra 1 e 60.');
        return;
    }
    
    if (oreGiornaliere < 1 || oreGiornaliere > 12) {
        alert('Le ore giornaliere devono essere tra 1 e 12.');
        return;
    }
    
    // Raccogli risposte condizionali
    let lavoroSolo = null;
    let preferenzaTurno = null;
    
    if (configurazione.tipoTurni === 'entrambi') {
        const radioSolo = document.querySelector('input[name="lavoro-solo"]:checked');
        if (!radioSolo) {
            alert('Seleziona se il dipendente può lavorare da solo.');
            return;
        }
        lavoroSolo = radioSolo.value;
    }
    
    if (configurazione.turniSpezzati === 'entrambi') {
        const radioPreferenza = document.querySelector('input[name="preferenza-turno"]:checked');
        if (!radioPreferenza) {
            alert('Seleziona la preferenza di turno del dipendente.');
            return;
        }
        preferenzaTurno = radioPreferenza.value;
    }
    
    // Crea oggetto dipendente
    const nuovoDipendente = {
        id: dipendenteInModifica ? dipendenteInModifica.id : Date.now(),
        nome: nome,
        cognome: cognome,
        dataAssunzione: dataAssunzione,
        scadenzaContratto: scadenzaContratto,
        oreSettimanali: oreSettimanali,
        oreGiornaliere: oreGiornaliere,
        lavoroSolo: lavoroSolo,
        preferenzaTurno: preferenzaTurno,
        dataInserimento: dipendenteInModifica ? dipendenteInModifica.dataInserimento : new Date().toISOString()
    };
    
    if (dipendenteInModifica) {
        // Aggiorna dipendente esistente
        const index = dipendenti.findIndex(d => d.id === dipendenteInModifica.id);
        dipendenti[index] = nuovoDipendente;
        alert(`Dipendente ${nome} ${cognome} aggiornato con successo!`);
    } else {
        // Aggiungi nuovo dipendente
        dipendenti.push(nuovoDipendente);
        alert(`Dipendente ${nome} ${cognome} aggiunto con successo!`);
    }
    
    salvaDipendenti();
    dipendentiFiltrati = [...dipendenti];
    aggiornaListaDipendenti();
    aggiornaStatistiche();
    nascondiFormDipendente();
}

// Funzione per modificare dipendente
function modificaDipendente(id) {
    const dipendente = dipendenti.find(d => d.id === id);
    if (!dipendente) return;
    
    dipendenteInModifica = dipendente;
    document.getElementById('form-titolo').textContent = 'Modifica Dipendente';
    
    // Popola form
    document.getElementById('nome-dipendente').value = dipendente.nome;
    document.getElementById('cognome-dipendente').value = dipendente.cognome;
    document.getElementById('data-assunzione').value = dipendente.dataAssunzione;
    document.getElementById('scadenza-contratto').value = dipendente.scadenzaContratto || '';
    document.getElementById('ore-settimanali').value = dipendente.oreSettimanali;
    document.getElementById('ore-giornaliere').value = dipendente.oreGiornaliere;
    
    // Gestisci radio buttons
    if (dipendente.lavoroSolo) {
        document.getElementById(`solo-${dipendente.lavoroSolo}`).checked = true;
    }
    if (dipendente.preferenzaTurno) {
        document.getElementById(`pref-${dipendente.preferenzaTurno}`).checked = true;
    }
    
    // Mostra form
    document.getElementById('form-dipendente').style.display = 'block';
    gestisciDomandeCondizionali();
}

// Funzione per eliminare dipendente
function eliminaDipendente(id) {
    const dipendente = dipendenti.find(d => d.id === id);
    if (!dipendente) return;
    
    if (confirm(`Sei sicuro di voler eliminare ${dipendente.nome} ${dipendente.cognome}?`)) {
        dipendenti = dipendenti.filter(d => d.id !== id);
        dipendentiFiltrati = dipendentiFiltrati.filter(d => d.id !== id);
        
        salvaDipendenti();
        aggiornaListaDipendenti();
        aggiornaStatistiche();
        
        alert('Dipendente eliminato con successo.');
    }
}

// Funzione per esportare dipendenti
// Funzioni di supporto per la generazione turni
function calcolaParametriBase() {
    if (!configurazione.fasciaOraria) {
        alert('Configurazione incompleta. Completa la configurazione prima di generare turni.');
        return null;
    }
    
    // Parsing fascia oraria (accetta sia '08:00-18:00' che '08:00 - 18:00')
    let oraInizio, oraFine;
    if (configurazione.fasciaOraria.includes('-')) {
        const parts = configurazione.fasciaOraria.split('-').map(s => s.trim());
        if (parts.length === 2) {
            [oraInizio, oraFine] = parts;
        } else {
            alert('Formato orario non valido. Usa ad esempio: 08:00 - 18:00');
            return null;
        }
    } else {
        alert('Formato orario non valido. Usa ad esempio: 08:00 - 18:00');
        return null;
    }
    const oreGiornaliere = calcolaOreGiornaliere(oraInizio, oraFine);
    
    // Calcola giorni del periodo
    const dataInizio = new Date(periodoProgrammazione.dataInizio);
    const dataFine = new Date(periodoProgrammazione.dataFine);
    const giorniPeriodo = Math.ceil((dataFine - dataInizio) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calcola ore totali necessarie
    const oreTotaliPeriodo = oreGiornaliere * giorniPeriodo;
    
    // Calcola ore disponibili dei dipendenti
    const oreDisponibili = dipendenti.reduce((totale, dip) => {
        const oreSettimanali = dip.oreSettimanali;
        const settimane = Math.ceil(giorniPeriodo / 7);
        return totale + (oreSettimanali * settimane);
    }, 0);
    
    return {
        oraInizio: oraInizio,
        oraFine: oraFine,
        oreGiornaliere: oreGiornaliere,
        giorniPeriodo: giorniPeriodo,
        oreTotaliPeriodo: oreTotaliPeriodo,
        oreDisponibili: oreDisponibili,
        dipendentiDisponibili: dipendenti.length
    };
}

function calcolaOreGiornaliere(oraInizio, oraFine) {
    const [hInizio, mInizio] = oraInizio.split(':').map(Number);
    const [hFine, mFine] = oraFine.split(':').map(Number);
    
    let ore = hFine - hInizio;
    let minuti = mFine - mInizio;
    
    if (minuti < 0) {
        ore -= 1;
        minuti += 60;
    }
    
    return ore + (minuti / 60);
}

function parseRichiestePersonale() {
    if (!richiestePersonale) return [];
    
    const richieste = [];
    const righe = richiestePersonale.split('\n');
    
    righe.forEach(riga => {
        const match = riga.match(/^-\s*(\w+):\s*(.+)$/i);
        if (match) {
            richieste.push({
                dipendente: match[1].toLowerCase(),
                richiesta: match[2].trim()
            });
        }
    });
    
    return richieste;
}

function generaTurniGiorno(data, parametri, richiesteParsate) {
    const giornoSettimana = data.getDay(); // 0=dom, 1=lun
    const giorniLavorativi = parseInt(configurazione.giorniSettimana);
    let turni = [];

    // Se non è un giorno lavorativo -> tutti OFF
    if ((giorniLavorativi === 5 && (giornoSettimana === 0 || giornoSettimana === 6)) ||
        (giorniLavorativi === 6 && giornoSettimana === 0)) {
        dipendenti.forEach(d => {
            turni.push({
                data: data.toISOString().split('T')[0],
                dipendente: { id: d.id, nome: d.nome, cognome: d.cognome },
                oraInizio: null,
                oraFine: null,
                ore: 0,
                settore: 'Generale',
                note: 'OFF'
            });
        });
        return turni;
    }

    let oraApertura = parametri.oraInizio; // es. "07:00"
    let oraChiusura = parametri.oraFine;   // es. "23:00"

    function aggiungiOre(orario, ore) {
        const [h, m] = orario.split(":").map(Number);
        const date = new Date(2000, 0, 1, h, m);
        date.setHours(date.getHours() + ore);
        return date.toTimeString().slice(0, 5);
    }

    // Filtra dipendenti disponibili (no richieste)
    const dipendentiDisponibili = dipendenti.filter(d => {
        const richiesteDipendente = richiesteParsate.filter(r =>
            r.dipendente === d.nome.toLowerCase() || r.dipendente === d.cognome.toLowerCase()
        );
        return richiesteDipendente.length === 0;
    });

    dipendentiDisponibili.forEach(dip => {
        const oreDip = Number(dip.oreGiornaliere) || 0;

        // Strategia: metà lavorano mattina, metà pomeriggio/sera
        const randomShift = Math.random() < 0.5 ? 'mattina' : 'pomeriggio';

        if (randomShift === 'mattina') {
            // Primo turno mattina
            let oraInizio = oraApertura;
            let oraFine = aggiungiOre(oraInizio, oreDip);
            if (oraFine > oraChiusura) oraFine = oraChiusura;

            turni.push({
                id: Date.now() + turni.length,
                data: data.toISOString().split('T')[0],
                dipendente: { id: dip.id, nome: dip.nome, cognome: dip.cognome },
                oraInizio: oraInizio,
                oraFine: oraFine,
                ore: oreDip,
                settore: 'Generale',
                note: 'Mattina'
            });

            // Se ha ore ≥8 → secondo turno sera
            if (oreDip >= 8) {
                let oraInizio2 = aggiungiOre(oraChiusura, -4);
                turni.push({
                    id: Date.now() + turni.length,
                    data: data.toISOString().split('T')[0],
                    dipendente: { id: dip.id, nome: dip.nome, cognome: dip.cognome },
                    oraInizio: oraInizio2,
                    oraFine: oraChiusura,
                    ore: 4,
                    settore: 'Generale',
                    note: 'Chiusura'
                });
            }

        } else {
            // Primo turno pomeriggio
            let oraInizio = aggiungiOre(oraChiusura, -oreDip);
            let oraFine = oraChiusura;

            turni.push({
                id: Date.now() + turni.length,
                data: data.toISOString().split('T')[0],
                dipendente: { id: dip.id, nome: dip.nome, cognome: dip.cognome },
                oraInizio: oraInizio,
                oraFine: oraFine,
                ore: oreDip,
                settore: 'Generale',
                note: 'Pomeriggio'
            });

            // Eventuale turno mattina breve
            if (oreDip >= 8) {
                let oraFine2 = aggiungiOre(oraApertura, 4);
                turni.push({
                    id: Date.now() + turni.length,
                    data: data.toISOString().split('T')[0],
                    dipendente: { id: dip.id, nome: dip.nome, cognome: dip.cognome },
                    oraInizio: oraApertura,
                    oraFine: oraFine2,
                    ore: 4,
                    settore: 'Generale',
                    note: 'Apertura'
                });
            }
        }
    });

    return turni;
    }

function mostraRiepilogoTurni(turni) {
    // Raccogli giorni unici e dipendenti unici
    const giorni = Array.from(new Set(turni.map(t => t.data))).sort();
    const dipendentiUnici = Array.from(new Set(turni.map(t => t.dipendente.id)))
        .map(id => turni.find(t => t.dipendente.id === id).dipendente);

    // Costruisci tabella
    let html = '<div class="table-responsive"><table class="table table-bordered"><thead><tr><th>Giorno</th>';
    dipendentiUnici.forEach(d => {
        html += `<th>${d.nome} ${d.cognome}</th>`;
    });
    html += '</tr></thead><tbody>';
    giorni.forEach(giorno => {
        html += `<tr><td>${giorno}</td>`;
        dipendentiUnici.forEach(d => {
            const turno = turni.find(t => t.data === giorno && t.dipendente.id === d.id);
            if (turno) {
                html += `<td>${turno.oraInizio} - ${turno.oraFine} <br><small>${turno.ore}h</small></td>`;
            } else {
                html += '<td>-</td>';
            }
        });
        html += '</tr>';
    });
    html += '</tbody></table></div>';

    document.getElementById('tabella-turni').innerHTML = html;
    document.getElementById('tabella-turni-container').style.display = 'block';
    document.getElementById('tabella-turni-container').scrollIntoView({behavior: 'smooth'});
}

function esportaDipendenti() {
    if (dipendenti.length === 0) {
        alert('Non ci sono dipendenti da esportare.');
        return;
    }
    
    const csv = [
        ['Nome', 'Cognome', 'Data Assunzione', 'Scadenza Contratto', 'Ore Settimanali', 'Ore Giornaliere', 'Lavoro Solo', 'Preferenza Turno'],
        ...dipendenti.map(d => [
            d.nome,
            d.cognome,
            new Date(d.dataAssunzione).toLocaleDateString('it-IT'),
            d.scadenzaContratto ? new Date(d.scadenzaContratto).toLocaleDateString('it-IT') : 'Indeterminato',
            d.oreSettimanali,
            d.oreGiornaliere,
            d.lavoroSolo || 'N/A',
            d.preferenzaTurno || 'N/A'
        ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dipendenti_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    alert('Esportazione completata!');
}
