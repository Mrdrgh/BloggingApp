# Blogging App
![Blogging](https://github.com/Mrdrgh/Django_Pjs/blob/main/Blogging/frontend/public/b(2)-vmake.png)<br>
this is a blogging app built using the Django Rest Framework to make the API, JWTs, Axios Interceptor, and React js, users can register, login, make blogs, update or delete them, users can also follow friends to see their blogs on the Featured page, they can also manage their Follows in the Profile, as well as updating the Bio and the Profile Picture.

## Requirements
- Backend: run ```pip install -r requirements.txt```, the requirements file is [here](https://github.com/Mrdrgh/Django_Pjs/blob/main/NotesApp/backend/backend/requirements.txt)
  - It is recommended to have a Venv (vitual Environment) running when installing these dependencies
  ---
- Frontend:
  - in the `frontend` folder, run this command:
    - ```npm install react-router-dom axios jwt-decode```

---
## Usage
- in the `backend` folder run this command: ```python manage.py runserver```
- in the `frontend` folder run this command: ```npm run dev```
- now you can navigate to `https://localhost:5173/` .
---
- you can also visit the Django admin page, to view all the instances of Users, as well as any related data, just run ```python manage.py createsuperuser```, and connect with the superuser into the Admin page, which usually is `localhost:8000/admin`.
- you can also Host the website locally (use this at your own risk)
  - in the `frontend/.env` file change the address to your local IPaddress and the Port that you want to run your Django server in (by default it is port 8000)
  - and in the `backend` folder run ```python manage.py runserver [your Local IpAdr]:your port```

## Contributions
any one is welcome to contribute.
## For Roadmaps.sh
this is the url: https://roadmap.sh/projects/blogging-platform-api
## Authors:
- Mohammed Darghal <mohammed.darghal.23@ump.ac.ma>.
