create table beer_net.beer_recipe_mash_step
(
    beer_recipe_mash_step_id int unsigned auto_increment
        primary key,
    beer_recipe_id           int unsigned                       not null,
    temperature              int                                not null,
    minutes                  int                                not null,
    row_created              datetime default CURRENT_TIMESTAMP null,
    row_modified             datetime default CURRENT_TIMESTAMP null on update CURRENT_TIMESTAMP,
    FOREIGN KEY (beer_recipe_id) REFERENCES beer_recipe(beer_recipe_id)
);