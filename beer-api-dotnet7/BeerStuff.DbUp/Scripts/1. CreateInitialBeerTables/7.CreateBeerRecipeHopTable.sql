create table beer_net.beer_recipe_hop
(
    beer_recipe_hop_id int unsigned auto_increment
        primary key,
    beer_recipe_id     int unsigned                       not null,
    beer_hop_id        int unsigned                       not null,
    amount             decimal(10, 2)                     not null,
    boil_minute        int                                null,
    is_dry_hop         tinyint(1)                         null,
    row_created        datetime default CURRENT_TIMESTAMP null,
    row_modified       datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    FOREIGN KEY (beer_recipe_id) REFERENCES beer_recipe(beer_recipe_id),
    FOREIGN KEY (beer_hop_id) REFERENCES beer_hop(beer_hop_id)
);