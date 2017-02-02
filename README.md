# Maps4All for Juvenile Law Center &amp; Penn School of Social Policy and Practice
 [![Circle CI](https://circleci.com/gh/hack4impact/maps4all-jlc-sp2.svg?style=svg)](https://circleci.com/gh/hack4impact/maps4all-jlc-sp2)
[![Code Climate](https://codeclimate.com/github/hack4impact/maps4all-jlc-sp2/badges/gpa.svg)](https://codeclimate.com/github/hack4impact/maps4all-jlc-sp2) [![Test Coverage](https://codeclimate.com/github/hack4impact/maps4all-jlc-sp2/badges/coverage.svg)](https://codeclimate.com/github/hack4impact/maps4all-jlc-sp2/coverage) [![Issue Count](https://codeclimate.com/github/hack4impact/maps4all-jlc-sp2/badges/issue_count.svg)](https://codeclimate.com/github/hack4impact/maps4all-jlc-sp2)

## Team Members
- Rani Iyer
- Annie Meng
- Stephanie Shi
- Sanjay Subramanian
- Ben Sandler
- Brandon Obas
- Kyle Rosenbluth

## Setting up

##### Clone the repo

    ```
    $ git clone https://github.com/hack4impact/maps4all-jlc-sp2.git
    $ cd maps4all-jlc-sp2
    ```

##### Initialize a virtualenv

```
$ pip install virtualenv
$ virtualenv env
$ source env/bin/activate
```
(If you're on a mac) Make sure xcode tools are installed
```
$ xcode-select --install
```

##### Install the dependencies

```
$ pip install -r requirements/common.txt
$ pip install -r requirements/dev.txt
```

##### Other dependencies for running locally

You need to install [Foreman](https://ddollar.github.io/foreman/) and [Redis](http://redis.io/). Chances are, these commands will work:

```
$ gem install foreman
```

Mac (using [homebrew](http://brew.sh/)):

```
$ brew install redis
```

Linux:

```
$ sudo apt-get install redis-server
```

##### Create the database

```
$ python manage.py recreate_db
```

##### Other setup (e.g. creating roles in database)

```
$ python manage.py setup_dev
```

##### [Optional] Add fake data to the database

```
$ python manage.py add_fake_data
```

## Running the app

```
$ source env/bin/activate
$ foreman start -f Local
```

## License
[MIT License](LICENSE.md)
