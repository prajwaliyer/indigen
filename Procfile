release: python backend/manage.py migrate && python backend/manage.py collectstatic --noinput
web: cd backend && gunicorn indigen_backend.wsgi:application --log-file -
