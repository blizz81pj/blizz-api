create table beer_net.beer_recipe_grain
(
    beer_recipe_grain_id int unsigned auto_increment
        primary key,
    beer_recipe_id       int unsigned                       not null,
    beer_grain_id        int unsigned                       not null,
    amount               decimal(10, 2)                     not null,
    row_created          datetime default CURRENT_TIMESTAMP null,
    row_modified         datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    FOREIGN KEY (beer_recipe_id) REFERENCES beer_recipe(beer_recipe_id),
    FOREIGN KEY (beer_grain_id) REFERENCES beer_grain(beer_grain_id)
);