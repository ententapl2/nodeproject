# Opis

### Umfragen to serwis internetowy do publikacji ankiet, które dzięki możliwości zakładania kont są dostępne do głosowania dla innych osób.

# Instalacja

1. Sklonuj repozytorium do katalogu ``` git clone https://github.com/ententapl2/nodeproject.git ```
2. Wejdź w katalog project04 ``` cd nodeproject/project04/```
3. Zainstaluj zależności ``` npm i ```
4. **Przed uruchomieniem** możesz dostosować plik konfiguracyjny tworząc takowy o nazwie `.env` w katalogu `src` i ustawiajac każdą z tych wartości: 

* `PORT`, domyślnie 8000, wskazuje na port na którym aplikacja będzie nasłuchiwała, można zmienić również po uruchomieniu 
* `SECRET`, domyślnie losowy ciąg znaków, używany do zabezpieczenia sesji, lepiej nie zmieniać
* `PEPPER`, domyślnie losowy ciąg znaków, używany do zabezpieczania haseł, nie zmieniać przy istniejących już kontach 
* `ADMIN_NAME`, domyślnie `Administrator`, nazwa konta będąca administratorem
* `DB`, domyślnie `Umfragen.db`, wskazuje nazwę pliku bazy danych, lepiej nie zmieniać chyba że w celu resetu bazy danych

5. W przypadku braku dostosowanie pliku konfiguracyjnego jak opisano wyżej aplikacja stworzy domyślną 
konfigurację 

6. Uruchom serwer poprzez ``` npm run start ``` lub ```npm start```
7. W celu całkowitego zresetowania bazy danych aplikacji najbezpieczniej usunąć plik bazy znajdujący się w katalogu ```src/data/db```

# Notatka w celu odtworzenia historii

#### Prace nad projektem były realizowane w osobnym prywatnym repozytorium. W celu odtworzenia historii projektu należy zgłosić taką chęć w zakładce ISSUES [na stronie repozytorium](https://github.com/ententapl2/nodeproject/issues)