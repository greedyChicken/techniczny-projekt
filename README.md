uruchamianie frontend, wewnątrz folderu frontend komendy:
- npm install
- npm run dev
poza tym utworzyć plik .env w folderze frontend i dodać adres url do api w ten sposób:
VITE_API_URL=http://localhost:8080/api

uruchamianie backend, wewnątrz folderu backend komendy:
- docker-compose up -d
- mvn clean package
- java -jar target/*SNAPSHOT.jar

ewentualnie trzeba zainstalować zależności: npm, docker-compose, docker, mvn
