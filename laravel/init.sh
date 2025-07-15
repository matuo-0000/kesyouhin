docker-compose up -d --build
sleep 3
docker-compose exec backend php artisan migrate
docker-compose exec backend php artisan db:seed