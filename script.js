/*
========================================
  Habit Tracker App
  Version: v1.2
  Author: Athanasios Papaioannou
  Description: Simple habit tracker with streaks
========================================
*/

// ==========================================
// 1. ΣΥΝΔΕΣΗ ΜΕ ΤΟ HTML (DOM ELEMENTS)
// ==========================================

// Παίρνουμε το logo του app
const logo = document.getElementById("appLogo");

// Παίρνουμε το input όπου γράφουμε νέο habit
const input = document.getElementById("habitInput");

// Παίρνουμε το κουμπί "Add"
const addBtn = document.getElementById("addBtn");

// Παίρνουμε το container που θα εμφανίζονται όλα τα habits
const habitsList = document.getElementById("habitsList");

// Παίρνουμε το element που θα εμφανίζει την πρόοδο (π.χ. "3/5 habits completed")
const progressText = document.getElementById("progressText");

// Παίρνουμε το κουμπί "Clear All"
const clearBtn = document.getElementById("clearBtn");

// Παίρνουμε το κουμπί για dark mode toggle
const toggleBtn = document.getElementById("darkModeToggle");

// ==========================================
// 2. STATE (Η "ΜΝΗΜΗ" ΤΟΥ APP)
// ==========================================

// Εδώ αποθηκεύουμε ΟΛΑ τα habits σε μορφή array
// Αυτό είναι το "single source of truth SSOT"
let habits = [];


// ==========================================
// 3. LOCAL STORAGE (ΑΠΟΘΗΚΕΥΣΗ ΔΕΔΟΜΕΝΩΝ)
// ==========================================

// Αποθηκεύει τα habits στον browser
function saveHabits() {
  // Για debugging: βλέπουμε τι ακριβώς αποθηκεύουμε
    console.log("Saving:", habits);
  // Μετατρέπουμε το array σε string (JSON)
  localStorage.setItem("habits", JSON.stringify(habits));
}

// Φορτώνει τα habits από τον browser όταν ανοίγει η σελίδα
function loadHabits() {
  const data = localStorage.getItem("habits");

  // Αν υπάρχουν δεδομένα στο localStorage
  if (data) {
    // Τα μετατρέπουμε πίσω σε array
    habits = JSON.parse(data);
  }
}


// ==========================================
// 4. RENDER FUNCTION (ΧΤΙΖΟΥΜΕ ΤΟ UI)
// ==========================================

// Αυτή η function επιστρέφει την τρέχουσα ημερομηνία σε μορφή "YYYY-MM-DD"
function getTodayDate() {
    return new Date().toISOString().split("T")[0];
}

// Αυτή η function "ζωγραφίζει" όλα τα habits στην οθόνη
function renderHabits() {
  
  // Παίρνουμε την τρέχουσα ημερομηνία 
  const today = getTodayDate();

  // Υπολογίζουμε πόσα habits είναι ολοκληρωμένα σήμερα
  const completed = habits.filter(habit =>
    habit.dates.includes(today)).length;
  const total = habits.length;

  // Ενημερώνουμε το progress text
  progressText.textContent = `${completed} / ${total} habits completed today`;

  // Καθαρίζουμε την οθόνη πριν ξαναφτιάξουμε τη λίστα
  habitsList.innerHTML = "";

  // Περνάμε από κάθε habit στο array
  habits.forEach((habit, index) => {
    // Δημιουργούμε το βασικό container για κάθε habit και βάζουμε την κλάση "habit" για styling
    const habitDiv = document.createElement("div");
    habitDiv.classList.add("habit");    
    habitDiv.addEventListener("click", function (e) {

      // Αν πατήθηκε το delete button → μην κάνεις toggle
      if (e.target.tagName === "BUTTON") return;

      // Αν πατήθηκε ήδη το checkbox → μην διπλοτρέξει
      if (e.target.tagName === "INPUT") return;

      // Toggle στο checkbox
      checkbox.checked = !checkbox.checked;

      // Trigger change event για να ενημερωθεί το state και το UI
      checkbox.dispatchEvent(new Event("change"));
    });

    // ==========================================
    // CHECKBOX (DONE / NOT DONE)
    // ==========================================
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    // Αν είναι ολοκληρωμένο το habit τότε το checkbox είναι checked
    checkbox.checked = habit.dates.includes(today);

    // Αν το habit είναι done σήμερα, προσθέτουμε την κλάση "done" για styling
    const isDoneToday = habit.dates.includes(today);
      if (isDoneToday) {
        habitDiv.classList.add("done");
      }

    // ==========================================
    // TEXT (ΤΟ ΟΝΟΜΑ ΤΟΥ HABIT)
    // ==========================================
    const text = document.createElement("span");
    text.textContent = habit.text;

    // ==========================================
    // DELETE BUTTON
    // ==========================================
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "X";

    // Όταν πατάμε delete:
    deleteBtn.addEventListener("click", function () {

      // αφαιρούμε το habit από το array
      habits.splice(index, 1);

      // αποθηκεύουμε αλλαγές
      saveHabits();

      // ξαναφτιάχνουμε το UI
      renderHabits();
    });

    
    // ==========================================
    // CHECKBOX EVENT (MARK AS DONE) & STREAK SYSTEM (δηλαδή πόσες συνεχόμενες μέρες έχω ολοκληρώσει το habit μου)
    // ==========================================

    checkbox.addEventListener("change", function () {

      // ενημερώνουμε την κατάσταση του habit
      if (checkbox.checked) {
            // Αν δεν υπάρχει ήδη η σημερινή ημερομηνία, την προσθέτουμε
            if (!habit.dates.includes(today)) {
            habit.dates.push(today);
            }
        } else {
            // Αν ξε-τικάρεις, αφαιρούμε τη σημερινή ημερομηνία
            habit.dates = habit.dates.filter(date => date !== today);
        }

      // αποθηκεύουμε
      saveHabits();

      // ξανακάνουμε render
      renderHabits();
    });

        function calculateStreak(dates) { //επεξήγηση με τη βοήθεια του ChatGPT: 

            // 🟢 Μετρητής streak (πόσες συνεχόμενες μέρες)
            let streak = 0;

            // 🟢 Παίρνουμε το array με dates και το επεξεργαζόμαστε:
            const sortedDates = dates

                // 🔵 .map() = built-in JS function
                // Μετατρέπει κάθε string ημερομηνίας σε Date object
                .map(d => new Date(d))

                // 🔵 .sort() = built-in JS function
                // Ταξινομεί από πιο πρόσφατη → πιο παλιά ημερομηνία
                .sort((a, b) => b - a);

            // 🟢 Ξεκινάμε τη σύγκριση από ΣΗΜΕΡΑ
            let currentDate = new Date();

            // 🔵 for...of = built-in loop της JS
            // Περνάμε κάθε ημερομηνία από το πιο πρόσφατο προς τα πίσω
            for (let date of sortedDates) {

                // 🟢 Υπολογίζουμε τη διαφορά σε ημέρες
                // Η JS δουλεύει με milliseconds
                const diff = (currentDate - date) / (1000 * 60 * 60 * 24);

                // 🔵 Math.floor = built-in function
                // Ελέγχουμε αν η διαφορά είναι:
                // 0 → ίδια μέρα
                // 1 → προηγούμενη μέρα
                if (Math.floor(diff) === 0 || Math.floor(diff) === 1) {

                    // 🟢 Αν είναι συνεχόμενο → αυξάνουμε το streak
                    streak++;

                    // 🟢 Μετακινούμε το "currentDate" προς τα πίσω
                    // ώστε να συνεχίσουμε να ελέγχουμε αλυσιδωτά
                    currentDate = date;

                } else {

                    // 🔴 Αν βρούμε κενό στη συνέχεια → σταματάμε εντελώς
                    break;
                }
            }

            // 🟢 Επιστρέφουμε το τελικό streak
            return streak;
        }

    // ==========================================
    // ΕΜΦΑΝΙΣΗ STREAK CALCULATION (ΠΟΣΕΣ ΣΥΝΕΧΟΜΕΝΕΣ ΜΕΡΕΣ ΕΧΩ ΟΛΟΚΛΗΡΩΣΕΙ ΤΟ HABIT)
    // ==========================================
    const streak = calculateStreak(habit.dates || []);
    
    // wrapper (tooltip container)
    const streakWrapper = document.createElement("span");
    streakWrapper.classList.add("tooltip");

    // main streak text
    const streakText = document.createElement("span");
    streakText.classList.add("streak");
    streakText.textContent = `🔥 ${streak}`;

    // tooltip text
    const tooltipText = document.createElement("span");
    tooltipText.classList.add("tooltip-text");
    tooltipText.textContent = "Consecutive days you completed this habit";

    // build structure
    streakWrapper.appendChild(streakText);
    streakWrapper.appendChild(tooltipText);

    // ==========================================
    // ΧΤΙΖΟΥΜΕ ΤΟ HABIT ΣΤΟ DOM
    // ==========================================
    habitDiv.appendChild(checkbox);
    habitDiv.appendChild(text);
    habitDiv.appendChild(streakWrapper);
    habitDiv.appendChild(deleteBtn);

    // το προσθέτουμε στη λίστα
    habitsList.appendChild(habitDiv);
  }); //τέλος του forEach
}


// ==========================================
// 5. ADD NEW HABIT (BUTTON CLICK)
// ==========================================

addBtn.addEventListener("click", function () {

  // Παίρνουμε το κείμενο από το input
  const habitText = input.value;

  // Αν είναι κενό → δεν κάνουμε τίποτα
  if (habitText === "") return;

  // Προσθέτουμε νέο habit στο state
    habits.push({
    text: habitText,
    dates: []
  });

  // Αποθήκευση + render
  saveHabits();
  renderHabits();

  // Καθαρίζουμε το input
  input.value = "";
});

// Όταν πατάμε πλήκτρο ENTER μέσα στο input
input.addEventListener("keydown", function (event) {

  // Ελέγχουμε αν το πλήκτρο που πατήθηκε είναι το Enter
  if (event.key === "Enter") {

    // Ακυρώνουμε default συμπεριφορά (προαιρετικό αλλά καλό practice)
    event.preventDefault();

    // Χρησιμοποιούμε το ίδιο event handler για όλα τα inputs (button + Enter key) 
    // ώστε να διατηρούμε "single source of truth" για τη λογική προσθήκης habit
    addBtn.click();
  }
});

// ==========================================
// 6. CLEAR ALL HABITS (BUTTON CLICK)
// ==========================================
function clearAllHabits() {
  habits = [];        // καθαρίζουμε το array
  saveHabits();       // αποθηκεύουμε (άδειο πλέον)
  renderHabits();     // κάνουμε re-render UI
}
clearBtn.addEventListener("click", function () {
  const confirmDelete = confirm("Are you sure you want to delete all habits?");
  if (!confirmDelete) return;
  clearAllHabits();
});

// ==========================================
// 7. DARK MODE TOGGLE
// ==========================================

function updateLogo() {

    if (document.body.classList.contains("dark-mode")) {

        logo.src = "images/habit-tracker-logo-dark.png";

    } else {

        logo.src = "images/habit-tracker-logo.png";

    }

}

// load saved mode
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark-mode");
}

updateLogo();

toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  updateLogo();
  
  localStorage.setItem(
    "darkMode",
    document.body.classList.contains("dark-mode")
  );
});

// ==========================================
// 8. INITIAL LOAD (ΟΤΑΝ ΑΝΟΙΓΕΙ Η ΣΕΛΙΔΑ)
// ==========================================

// Φορτώνουμε δεδομένα από localStorage
loadHabits();

// Ζωγραφίζουμε το UI
renderHabits();

//Καθαρίζουμε το localStorage (για testing)
//localStorage.clear();