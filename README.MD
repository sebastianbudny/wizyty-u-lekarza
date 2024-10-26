# System rezerwujący wizyty u lekarzy przez pacjentów

## Stack technologiczny

- **MongoDB**
- **Node.js**
- **Express.js**
- **React.js**

## Funkcjonalności

- **Dodawanie rezerwacji wizyty przez pacjenta**
    - Wymagane pola po stronie formularza:
        - _Data wizyty (wybór z kalendarza) i godzina_
        - _E-mail pacjenta_
        - _Wybór lekarza z listy rozwijanej_
        - _Wybór przychodni z listy rozwijanej_
        - _Uwagi dla lekarza_
    - Po wybraniu daty i godziny na liście pokażą się tylko lekarze którzy nie mają umówionej wizyty

- **Na podstronie ze sztuczną bramką e-mail będą pojawiały się "wysłane" e-maile do klientów (pacjentów) kilka godzin przed wizytą**
    - Mechanizm wysyłania e-maili na podstronę po stronie backendu

- **Anulowanie umówionej wizyty**

- **Zmiana terminu umówinej wizyty**

- **Pacjent nie będzie mógł być umówiony na dwóch wizytach jednocześnie**


## Harmonogram pracy

1. _2023-11-18_ - ***Stworzenie formularza i mechanizmu zapisącego do bazy danych i początek tworzenia mechanizmu wysyłania maili***
1. _2023-11-19_ - ***Kontynuacja tworzenia mechanizmu wysyłania maili***
1. _2023-12-03_ - ***Anulowanie umówionych wizyt***
