const pg = require('pg');

const client = new pg.Client(process.env.DATABSE_URL || 'postgres://localhost/acme_travel_db');

const createTables = async()=> {
    const SQL = `
    DROP TABLE IF EXISTS reservation;
    DROP TABLE IF EXISTS customer;
    DROP TABLE IF EXISTS restaurant;
    CREATE TABLE customer(
        id UUID PRIMARY KEY,
        name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE restaurant(
     id UUID PRIMARY KEY,
     name VARCHAR(50) NOT NULL UNIQUE
    );
    CREATE TABLE reservation(
        id UUID PRIMARY KEY,
        reservation_date DATE NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
        customer_id UUID REFERENCES customer(id) NOT NULL
    
    );
    `;
    await client.query(SQL);
    
};


module.exports = {
    client,
    createTables
};