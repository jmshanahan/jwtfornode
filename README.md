# JWT example for node

## Introduction
This is a sample code taken from the Udemy course Learn NodeJS Authentication by IO LEARN


It is a good simple example of how to set up jwt


## Gotha

        const token = jwt.sign(user.toJSON(), app.get('superSecret'), { expiresIn: 604800 });

To get it to work I had to add 'toJSON() to the sign operation as shown here.
I think it is caused by changes to the jwt library after the course was created.

## Config
It was setup using the free service from mongocloud. I used MongoDB Compass Community edition to do this.
You will need to edit the config.js file and enter your username and password.
