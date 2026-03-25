# Opis

### Umfragen to serwis internetowy do publikacji ankiet, które dzięki możliwości zakładania kont są dostępne do głosowania dla innych osób.

# Instalacja

1. Sklonuj repozytorium do katalogu ``` git clone https://github.com/ententapl2/nodeproject.git ```
2. Wejdź w katalog project04 ``` cd nodeproject/project04/```
3. Zainstaluj zależności ``` npm i ```
4. Przed uruchomieniem pierwszy raz serwera w pliku ```src/.env``` można ustawić następujące właściwości:
  -  PORT | port na którym aplikacja nasłuchuje, domyślnie 8000
  -  SECRET | kluczowy złożony token do weryfikacji haseł kont użytkowników, lepiej nie zmieniać
  -  DB | nazwa pliku bazy danych, gdzie będą zapisywane dane
  -  ADMIN_NAME | nazwa konta administratora utworzonego przy pierwszym uruchomieniu aplikacji
  -  ADMIN_PASSWORD | hasło konta administratora utworzonego przy pierwszym uruchomieniu aplikacji
5. Uruchom serwer poprzez ``` npm run start ``` lub ```npm start```
6. W celu całkowitego zresetowania bazy danych aplikacji najbezpieczniej usunąć plik bazy znajdujący się w katalogu ```src/data/db```