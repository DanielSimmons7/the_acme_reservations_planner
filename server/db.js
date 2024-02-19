const pg = require('pg');
const uuid = require('uuid');

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
        reserved_date DATE NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
        customer_id UUID REFERENCES customer(id) NOT NULL
    
    );
    `;
    await client.query(SQL);
    
};

const createCustomer = async({ name })=> {
    const SQL = `
        INSERT INTO customer(id, name)
        VALUES ($1, $2)
        RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const createRestaurant = async({ name })=> {
    const SQL = `
        INSERT INTO restaurant(id, name)
        VALUES ($1, $2)
        RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
};

const fetchCustomers = async()=> {
    const SQL = `
        SELECT *
        FROM customer
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchRestaurants = async()=> {
    const SQL = `
        SELECT *
        FROM restaurant
    `;
    const response = await client.query(SQL);
    return response.rows;
};

const fetchReservations = async(customer_id)=> {
    const SQL = `
        SELECT *
        FROM reservation
        WHERE customer_id = $1
    `;
    const response = await client.query(SQL, [customer_id]);
    return response.rows;
};

const destroyReservation = async(reservation)=> {
    const SQL = `
    DELETE FROM reservation
    WHERE id=$1 AND customer_id=$2
    `;
    await client.query(SQL, [reservation.id, reservation.customer_id]);
};

const createReservation = async({ reserved_date, customer_id, restaurant_id })=> {
    const SQL = `
        INSERT INTO reservation(id, reserved_date, customer_id, restaurant_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), reserved_date, customer_id, restaurant_id]);
    return response.rows[0];
};

module.exports = {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomers,
    fetchRestaurants,
    createReservation,
    fetchReservations,
    destroyReservation
};