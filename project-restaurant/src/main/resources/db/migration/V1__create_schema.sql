-- Categories (cuisine types from Wolt KZ)
CREATE TABLE categories (
    id          VARCHAR(100) PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    city        VARCHAR(100)
);

-- Restaurants scraped from Wolt Almaty
CREATE TABLE restaurants (
    id                  VARCHAR(50)     PRIMARY KEY,
    name                VARCHAR(255)    NOT NULL,
    city                VARCHAR(100),
    address             TEXT,
    cuisine_tags        TEXT,
    rating_score        DOUBLE PRECISION,
    rating_count        INTEGER,
    delivery_time_min   INTEGER,
    longitude           DOUBLE PRECISION,
    latitude            DOUBLE PRECISION,
    slug                VARCHAR(255)    UNIQUE,
    wolt_url            TEXT
);

-- Menu items belonging to restaurants
CREATE TABLE menu_items (
    id              BIGSERIAL       PRIMARY KEY,
    restaurant_id   VARCHAR(50)     NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
    menu_category   VARCHAR(255),
    item_name       VARCHAR(500)    NOT NULL,
    description     TEXT,
    price_kzt       INTEGER
);

CREATE INDEX idx_menu_items_restaurant_id ON menu_items(restaurant_id);
CREATE INDEX idx_restaurants_city        ON restaurants(city);
CREATE INDEX idx_restaurants_slug        ON restaurants(slug);
