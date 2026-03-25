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

# Notatka w celu odtworzenia historii

#### Prace nad projektem były realizowane w osobnym prywatnym repozytorium. W celu odtworzenia historii projektu należy wykonać następujące kroki:

1. Zmienić nazwę folderu znajdującego się w katalogu **project04**  ```.gitty``` na ```.git``` (np. za pomocą komendy ```mv .gitty .git```)
2. Dodatkowo w celu łatwiejszego przeglądania historii można **jednorazowo** oczyścić drzewo zmian za pomocą ```git reset --hard```

#### Jeśli wystąpią błędy podczas wykonywania omówionego wyżej procesu w wyniku czego odtworzenie historii nie powiedzie się, proszę o zgłoszenie tego problemu w zakładce ISSUES [na stronie repozytorium](https://github.com/ententapl2/nodeproject/issues) - udostępnię wtedy w ostateczności bezpośredni dostęp do oryginalnego, prywatnego repozytorium - ewentualnie można to wyjaśnić na lekcji
