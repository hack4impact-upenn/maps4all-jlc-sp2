
# Maps4All for Juvenile Law Center &amp; Penn School of Social Policy and Practice
 [![Circle CI](https://circleci.com/gh/hack4impact/flask-base.svg?style=svg)](https://circleci.com/gh/hack4impact/flask-base) [![Stories in Ready](https://badge.waffle.io/hack4impact/flask-base.png?label=ready&title=Ready)](https://waffle.io/hack4impact/flask-base)

## Team Members

## Setting up

1. Clone the repo

    ```
    $ git clone https://github.com/hack4impact/maps4all-jlc-sp2.git
    $ cd maps4all-jlc-sp2
    ```

2. Initialize a virtualenv

    ```
    $ pip install virtualenv
    $ virtualenv env
    $ source env/bin/activate
    ```

3. Install the dependencies

    ```
    $ pip install -r requirements/common.txt
    $ pip install -r requirements/dev.txt
    ```

4. Create the database

    ```
    $ python manage.py recreate_db
    ```

5. Other setup (e.g. creating roles in database)

    ```
    $ python manage.py setup_dev
    ```

6. [Optional] Add fake data to the database

    ```
    $ python manage.py add_fake_data
    ```

## Running the app

```
$ source env/bin/activate
$ python manage.py runserver
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
```

## License
[MIT License](LICENSE.md)
