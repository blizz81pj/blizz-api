create table beer_net.beer_recipe_adjunct
(
    beer_recipe_adjunct_id  int unsigned auto_increment
        primary key,
    beer_recipe_id  int unsigned                       not null,
    beer_adjunct_id int unsigned                       not null,
    amount          decimal(10,2)                      not null,
    amount_unit     varchar(20)                        not null,
    notes           varchar(255)                       null,
    row_created     datetime default CURRENT_TIMESTAMP null,
    row_modified    datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    FOREIGN KEY (beer_recipe_id) REFERENCES beer_recipe(beer_recipe_id),
    FOREIGN KEY (beer_adjunct_id) REFERENCES beer_adjunct(beer_adjunct_id)
);