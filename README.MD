# System rezerwujący wizyty u lekarzy w placówce przez rejestratorów medycznych

## Stack technologiczny

- **MongoDB**
- **Node.js**
- **Express.js**
- **React.js**

## Funkcjonalności

- **Dodanie lekarza**

- **Usunięcie lekarza**

- **Edytcja lekarza**

- **Aktualizacja lekarza**

- **Dodanie wizyty**

- **Aktualizacja wizyty**

- **Usunięcie wizyty**

- **Zmiana terminu umówinej wizyty**

### Walidacje backendowe

#### Lekarze
- **Dodawany lekarz musi mieć wprowadzone Imię, Nazwisko i specjalizację**
- **Nie może zostać dodany drugi taki sam lekarz (Takie same Imię, Naziwsko i specjalizacja)**
- **Specjalizacja może być wybrana jako jedna z wymienionych**

#### Wizyty
- **Dodawana wizyta musi mieć wprowadzone: Datę i godzinę wizyty, cel, lekarza i pacjenta**
- **Walidacja, która pozwoli dodać wizytę, tylko jeśli lekarz istnieje**
- **Walidacja, która nie pozwoli dodać drugiej takiej samej wizyty**



