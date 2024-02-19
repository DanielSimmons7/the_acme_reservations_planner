const db = require('./db');
const client = db.client;
const createTables = db.createTables;
const createCustomer = db.createCustomer;
const createRestaurant = db.createRestaurant;
const fetchCustomers = db.fetchCustomers;
const fetchRestaurants = db.fetchRestaurants;
const createReservation = db.createReservation;
const fetchReservations = db.fetchReservations;
const destroyReservation = db.destroyReservation;


const init = async()=> {
    console.log('connecting to database');
    await client.connect();
    console.log('connected to database');
    await createTables();
    console.log('tables created');
    const [moe, lucy, ethyl, fogo, greenhouse, chilis] = await Promise.all([
            createCustomer({ name: 'moe'}),
            createCustomer({ name: 'lucy'}),
            createCustomer({ name: 'ethyl'}),
            createRestaurant({ name: 'fogo'}),
            createRestaurant({ name: 'greenhouse'}),
            createRestaurant({ name: 'chilis'})

        ]);
        console.log(await fetchCustomers());
        console.log(await fetchRestaurants());
        const reservation = await createReservation({
            reserved_date: '03/15/2024',
            restaurant_id: fogo.id,
            customer_id: lucy.id
            
        });
        console.log(await fetchReservations(lucy.id));
        await destroyReservation(reservation);
        console.log(await fetchReservations(lucy.id));

        

};


init();